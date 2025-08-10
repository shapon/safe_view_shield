from pydantic import BaseModel, EmailStr, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime

# User schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    subscription_tier: str = "family"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    email: str
    subscription_tier: str
    created_at: datetime

# Device schemas
class DeviceCreate(BaseModel):
    name: str
    device_type: str
    protection_enabled: bool = True

class DeviceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    name: str
    device_type: str
    protection_enabled: bool
    last_seen: datetime
    created_at: datetime

# Content Analysis schemas
class ContentAnalysisCreate(BaseModel):
    content_url: str
    content_type: str

class ContentAnalysisResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    content_url: str
    content_type: str
    risk_level: str
    confidence_score: float
    threat_types: Optional[List[str]]
    is_blocked: bool
    analyzed_at: datetime

# Subscription schemas
class SubscriptionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    tier: str
    is_active: bool
    expires_at: datetime
    created_at: datetime

# Dashboard schemas
class DashboardData(BaseModel):
    total_devices: int
    protected_devices: int
    threats_blocked_today: int
    subscription_tier: str
    recent_devices: List[DeviceResponse]
    recent_threats: List[ContentAnalysisResponse]