# SafeViewShield FastAPI Deployment Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   cd fastapi-version
   pip install -r requirements.txt
   ```

2. **Run the Server**
   ```bash
   python run_server.py
   ```
   Or directly with uvicorn:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8001 --reload
   ```

3. **Access the Application**
   - Open your browser to `http://localhost:8001`
   - The application will be ready to use immediately

## Features Available

### ✅ Core Functionality
- **User Authentication** - Register/Login with JWT tokens
- **Real-time Dashboard** - Device management and threat monitoring
- **AI Content Detection** - Mock service simulating real AI detection
- **Multi-tier Subscriptions** - Family, School Basic, School Enterprise
- **Device Management** - Add/remove devices, toggle protection
- **Threat Analytics** - View detected threats and risk levels

### 🎨 User Interface
- **Responsive Design** - Bootstrap CSS framework
- **Interactive Dashboard** - jQuery-powered dynamic updates
- **Real-time Updates** - Automatic data refresh
- **Mobile-friendly** - Works on all device sizes

### 🔧 Technical Features
- **RESTful API** - Well-structured FastAPI endpoints
- **SQLite Database** - Lightweight local storage
- **JWT Authentication** - Secure token-based auth
- **Data Validation** - Pydantic schemas for type safety
- **Error Handling** - Comprehensive error responses

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - User login

### Dashboard & Data
- `GET /api/dashboard` - Dashboard statistics
- `GET /api/devices` - List user devices
- `POST /api/devices` - Add new device
- `PUT /api/devices/{id}/protection` - Toggle device protection

### Content Analysis
- `POST /api/content/analyze` - Analyze content for threats
- `GET /api/analytics/threats` - Threat analytics data

### Subscription Management
- `GET /api/subscription` - Current subscription details

## Database Schema

The application uses SQLite with these main tables:
- **users** - User accounts and subscription tiers
- **devices** - User devices and protection status
- **content_analyses** - Content analysis results and threat data
- **subscriptions** - Subscription management and billing

## Deployment Options

### Local Development
- Use the provided `run_server.py` script
- Database will be created automatically as `safeviewshield.db`

### Production Deployment
1. Set environment variables:
   ```bash
   export DATABASE_URL="your-production-database-url"
   export SECRET_KEY="your-secure-secret-key"
   ```

2. Use a production WSGI server:
   ```bash
   gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
   ```

### Replit Deployment
1. Click the "Deploy" button in Replit
2. The app will automatically be deployed with the correct configuration
3. Access your deployed app at the provided `.repl.app` URL

## Security Features

- **JWT Token Authentication** - Secure API access
- **Password Hashing** - BCrypt for secure password storage
- **Session Management** - Stateless JWT-based sessions
- **Input Validation** - Pydantic schemas prevent invalid data
- **CORS Protection** - Configurable cross-origin requests

## Monitoring & Analytics

The application includes built-in analytics for:
- Device protection status
- Threat detection rates
- User engagement metrics
- Content analysis results

## Support

For issues or questions:
1. Check the server logs for error details
2. Verify all dependencies are installed correctly
3. Ensure the database is accessible and writable
4. Check that no other services are using the same port