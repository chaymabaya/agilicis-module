# Backend-Frontend Connection Summary

## ✅ Completed Setup

This document summarizes all changes made to connect your FastAPI backend with your React/Next.js frontend.

## Changes Made

### Backend (`backend/`)

#### 1. **app/main.py** - Enhanced with CORS Support
- Added `CORSMiddleware` for cross-origin requests
- Added health check endpoint `/health`
- Configured allowed origins from environment variables
- Set up FastAPI with title and version

#### 2. **app/config/settings.py** - Extended Configuration
- Added `ALLOWED_ORIGINS` for CORS configuration
- Added `API_HOST` and `API_PORT` settings
- Added `FRONTEND_URL` configuration
- All configurable via environment variables

#### 3. **requirements.txt** - Added Dependency
- Added `python-dotenv==1.0.0` for environment variable support

#### 4. **.env.local** - New Environment Configuration
```
API_HOST=0.0.0.0
API_PORT=8000
MODEL_PATH=tomato_model.h5
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001
FRONTEND_URL=http://localhost:3000
```

#### 5. **SETUP.md** - Backend Setup Instructions
Complete documentation for running the backend server

### Frontend (`frontend/`)

#### 1. **lib/config.ts** - New API Configuration
- Centralized API endpoint configuration
- Environment-based API URL (defaults to `http://localhost:8000`)
- Request timeout configuration
- API endpoints definition

#### 2. **lib/api-client.ts** - New API Client Service
- Typed API client for backend communication
- `Prediction` interface for type safety
- `ApiResponse<T>` wrapper for consistent responses
- Image prediction method with proper form-data encoding
- Backend health check method
- Request timeout and error handling

#### 3. **components/detection-demo.tsx** - Updated Detection Component
- Removed mock data (previous static results)
- Integrated real API client for image analysis
- Added backend health check on component mount
- Improved error handling with error messages display
- Added loading states for "uploading" and "analyzing"
- Real-time API communication instead of simulated delays

#### 4. **.env.local** - New Frontend Environment Configuration
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=AGILICIS
```

#### 5. **SETUP.md** - Frontend Setup Instructions
Complete documentation for running the frontend application

### Root Documentation

#### **CONNECTION_GUIDE.md** - Complete Integration Guide
- Quick start instructions
- Architecture diagram
- API endpoint documentation
- Troubleshooting guide
- Deployment notes

## How It Works

### Request Flow
1. User selects image in frontend
2. Image is read and displayed as preview
3. Frontend sends POST request to `http://localhost:8000/api/predict`
4. Backend receives image via multipart form data
5. Model processes image and returns predictions
6. Frontend displays results with confidence scores

### CORS Protection
- Backend validates requests from allowed origins
- Frontend respects CORS headers
- Secure cross-origin communication

## Running the Application

### Terminal 1: Backend
```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Terminal 2: Frontend
```bash
cd frontend
pnpm dev
```

### Access Application
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- Health Check: `http://localhost:8000/health`

## Environment Variables

### Backend (.env.local or system environment)
| Variable | Default | Purpose |
|----------|---------|---------|
| API_HOST | 0.0.0.0 | Server binding address |
| API_PORT | 8000 | Server port |
| MODEL_PATH | tomato_model.h5 | Path to ML model |
| ALLOWED_ORIGINS | http://localhost:3000 | Allowed CORS origins |
| FRONTEND_URL | http://localhost:3000 | Frontend URL |

### Frontend (.env.local)
| Variable | Default | Purpose |
|----------|---------|---------|
| NEXT_PUBLIC_API_URL | http://localhost:8000 | Backend API URL |
| NEXT_PUBLIC_APP_NAME | AGILICIS | Application name |

## Testing the Connection

### 1. Test Backend Health
```bash
curl http://localhost:8000/health
```
Expected: `{"status": "ok", "message": "AGILICIS API is running"}`

### 2. Test Image Upload
```bash
curl -X POST -F "file=@test_image.jpg" http://localhost:8000/api/predict
```
Expected: JSON with prediction results

### 3. Test Frontend
- Navigate to `http://localhost:3000`
- Upload an image in the detection demo
- Verify results appear

## Features Implemented

✅ CORS support for secure cross-origin requests
✅ Health check endpoint for connectivity verification
✅ Type-safe API client with TypeScript
✅ Error handling and user-friendly error messages
✅ Request timeout handling (30 seconds)
✅ Form-data encoding for file uploads
✅ Environment-based configuration
✅ Backend availability checking
✅ Progress tracking during upload/analysis
✅ Fallback to mock data (commented out) for development

## Next Steps

1. **Test the Connection**: Run both servers and test image upload
2. **Deploy**: Follow the deployment notes in CONNECTION_GUIDE.md
3. **Monitor**: Check logs for any issues
4. **Customize**: Adjust ALLOWED_ORIGINS for your deployment environment
5. **Secure**: Use HTTPS in production and secure environment variables

## Important Notes

- The `.env.local` files are local development only
- For production, use proper environment variable management
- Keep `ALLOWED_ORIGINS` restricted to your domain
- Use HTTPS in production with proper SSL certificates
- Monitor API request logs for issues
- Test with various image sizes and formats

## Support & Troubleshooting

### Common Issues

**CORS Error**: 
- Ensure frontend URL is in ALLOWED_ORIGINS
- Check browser console for actual error message

**Connection Refused**:
- Verify backend is running on correct port
- Check firewall settings
- Verify API_URL in frontend matches backend

**404 Not Found**:
- Check API endpoint path (`/api/predict`)
- Verify routes are properly included in main.py

**Timeout**:
- Check image size (large images take longer)
- Verify backend is processing correctly
- Check network connectivity

Refer to detailed setup guides for more information:
- Backend: `backend/SETUP.md`
- Frontend: `frontend/SETUP.md`
- Full Guide: `CONNECTION_GUIDE.md`
