# SafeViewShield - FastAPI + jQuery Version

A FastAPI backend with jQuery frontend implementation of the AI Content Protection Platform.

## Features
- AI content detection and blocking
- Real-time dashboard with device management
- Multi-tier subscription system (Family, School Basic, School Enterprise)
- User authentication and session management
- Device protection status monitoring
- Content analysis reporting

## Tech Stack
- **Backend**: FastAPI with Python
- **Frontend**: jQuery with Bootstrap CSS
- **Database**: SQLite with SQLAlchemy ORM
- **Authentication**: JWT tokens with secure sessions

## Setup
1. Install dependencies: `pip install -r requirements.txt`
2. Run the server: `uvicorn main:app --reload --host 0.0.0.0 --port 8000`
3. Access the application at `http://localhost:8000`

## API Endpoints
- `GET /` - Main application
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/dashboard` - Dashboard data
- `GET /api/devices` - Device management
- `POST /api/content/analyze` - Content analysis
- `GET /api/subscription` - Subscription management