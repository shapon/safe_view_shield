from fastapi import FastAPI, Request, Depends, HTTPException, status
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import uvicorn
from datetime import datetime, timedelta
from typing import Optional, List
import os

from database import get_db, engine, Base
from models import User, Device, ContentAnalysis, Subscription
from schemas import (
    UserCreate, UserLogin, UserResponse,
    DeviceCreate, DeviceResponse,
    ContentAnalysisCreate, ContentAnalysisResponse,
    SubscriptionResponse, DashboardData
)
from auth import create_access_token, verify_token, hash_password, verify_password
from ai_detection import AIDetectionService

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SafeViewShield API", description="AI Content Protection Platform")

# Security
security = HTTPBearer()

# Templates and static files
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

# AI Detection Service
ai_service = AIDetectionService()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    """Get current authenticated user"""
    try:
        payload = verify_token(credentials.credentials)
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user = db.query(User).filter(User.id == user_id).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    """Serve the main application"""
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/api/auth/register")
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = hash_password(user_data.password)
    user = User(
        email=user_data.email,
        password_hash=hashed_password,
        subscription_tier=user_data.subscription_tier
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create default subscription
    subscription = Subscription(
        user_id=user.id,
        tier=user_data.subscription_tier,
        is_active=True,
        expires_at=datetime.utcnow() + timedelta(days=30)
    )
    db.add(subscription)
    db.commit()
    
    # Generate access token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.from_orm(user)
    }

@app.post("/api/auth/login")
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user and return access token"""
    user = db.query(User).filter(User.email == credentials.email).first()
    
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.from_orm(user)
    }

@app.get("/api/dashboard", response_model=DashboardData)
async def get_dashboard_data(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get dashboard data for the current user"""
    # Get user's devices
    devices = db.query(Device).filter(Device.user_id == current_user.id).all()
    
    # Get recent content analysis
    recent_analysis = db.query(ContentAnalysis).filter(
        ContentAnalysis.user_id == current_user.id
    ).order_by(ContentAnalysis.analyzed_at.desc()).limit(10).all()
    
    # Calculate statistics
    total_devices = len(devices)
    protected_devices = len([d for d in devices if d.protection_enabled])
    total_threats_blocked = sum(a.risk_level == "high" for a in recent_analysis)
    
    # Get current subscription
    subscription = db.query(Subscription).filter(
        Subscription.user_id == current_user.id,
        Subscription.is_active == True
    ).first()
    
    return DashboardData(
        total_devices=total_devices,
        protected_devices=protected_devices,
        threats_blocked_today=total_threats_blocked,
        subscription_tier=subscription.tier if subscription else "family",
        recent_devices=[DeviceResponse.from_orm(d) for d in devices[:5]],
        recent_threats=[ContentAnalysisResponse.from_orm(a) for a in recent_analysis[:5]]
    )

@app.get("/api/devices", response_model=List[DeviceResponse])
async def get_devices(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get all devices for the current user"""
    devices = db.query(Device).filter(Device.user_id == current_user.id).all()
    return [DeviceResponse.from_orm(device) for device in devices]

@app.post("/api/devices", response_model=DeviceResponse)
async def add_device(device_data: DeviceCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Add a new device"""
    device = Device(
        user_id=current_user.id,
        name=device_data.name,
        device_type=device_data.device_type,
        protection_enabled=device_data.protection_enabled
    )
    db.add(device)
    db.commit()
    db.refresh(device)
    return DeviceResponse.from_orm(device)

@app.put("/api/devices/{device_id}/protection")
async def toggle_device_protection(
    device_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Toggle device protection"""
    device = db.query(Device).filter(
        Device.id == device_id,
        Device.user_id == current_user.id
    ).first()
    
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    
    device.protection_enabled = not device.protection_enabled
    device.last_seen = datetime.utcnow()
    db.commit()
    
    return {"success": True, "protection_enabled": device.protection_enabled}

@app.post("/api/content/analyze", response_model=ContentAnalysisResponse)
async def analyze_content(
    analysis_data: ContentAnalysisCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Analyze content for AI-generated threats"""
    # Perform AI detection
    detection_result = ai_service.analyze_content(
        analysis_data.content_url,
        analysis_data.content_type
    )
    
    # Store analysis result
    analysis = ContentAnalysis(
        user_id=current_user.id,
        content_url=analysis_data.content_url,
        content_type=analysis_data.content_type,
        risk_level=detection_result["risk_level"],
        confidence_score=detection_result["confidence"],
        threat_types=detection_result["threat_types"],
        is_blocked=detection_result["risk_level"] == "high"
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    
    return ContentAnalysisResponse.from_orm(analysis)

@app.get("/api/subscription", response_model=SubscriptionResponse)
async def get_subscription(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get current user's subscription details"""
    subscription = db.query(Subscription).filter(
        Subscription.user_id == current_user.id,
        Subscription.is_active == True
    ).first()
    
    if not subscription:
        raise HTTPException(status_code=404, detail="No active subscription found")
    
    return SubscriptionResponse.from_orm(subscription)

@app.get("/api/analytics/threats")
async def get_threat_analytics(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get threat analytics data"""
    # Get threat data for the last 30 days
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    
    threats = db.query(ContentAnalysis).filter(
        ContentAnalysis.user_id == current_user.id,
        ContentAnalysis.analyzed_at >= thirty_days_ago
    ).all()
    
    # Group by date
    daily_threats = {}
    for threat in threats:
        date_key = threat.analyzed_at.date().isoformat()
        if date_key not in daily_threats:
            daily_threats[date_key] = {"safe": 0, "medium": 0, "high": 0}
        daily_threats[date_key][threat.risk_level] += 1
    
    return {"daily_threats": daily_threats}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)