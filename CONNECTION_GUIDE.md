# AGILICIS - Backend & Frontend Connection Guide

This document provides complete instructions for running the AGILICIS application with the connected FastAPI backend and React/Next.js frontend.

## Quick Start

### Prerequisites
- Python 3.8+ (for backend)
- Node.js 18+ (for frontend)
- pnpm (for frontend package management)

### Step 1: Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Install Frontend Dependencies
```bash
cd frontend
pnpm install
```

### Step 3: Configure Environment Variables

**Backend** - Create/update `backend/.env.local`:
```
API_HOST=0.0.0.0
API_PORT=8000
MODEL_PATH=tomato_model.h5
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001
FRONTEND_URL=http://localhost:3000
```

**Frontend** - Create/update `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=AGILICIS
```

### Step 4: Run Backend
```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

### Step 5: Run Frontend (in a new terminal)
```bash
cd frontend
pnpm dev
```

**Expected output:**
```
▲ Next.js 16.1.6
- Event: compiled successfully
- ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Step 6: Test the Connection
1. Open `http://localhost:3000` in your browser
2. Navigate to the detection demo section
3. Upload an image to test the backend connection
4. You should see AI analysis results

## Architecture

```
┌─────────────────────────────────────────────┐
│         React/Next.js Frontend              │
│        (http://localhost:3000)              │
│  - Detection Demo Component                 │
│  - API Client (lib/api-client.ts)          │
│  - UI Components (shadcn/ui)               │
└──────────────────┬──────────────────────────┘
                   │ HTTP/CORS
         ┌─────────▼─────────┐
         │   API Requests    │
         │  POST /api/predict│
         │  GET /health      │
         └─────────┬─────────┘
                   │
┌──────────────────▼──────────────────────────┐
│         FastAPI Backend                     │
│        (http://localhost:8000)              │
│  - Routes (predict_routes.py)              │
│  - Controllers (predict_controller.py)     │
│  - Services (model_service.py)             │
│  - ML Model (tomato_model.h5)              │
└─────────────────────────────────────────────┘
```

## File Changes & Additions

### Backend
- ✅ `app/main.py` - Added CORS middleware and health check endpoint
- ✅ `app/config/settings.py` - Added API and CORS configuration
- ✅ `requirements.txt` - Added python-dotenv
- ✅ `.env.local` - New environment configuration file
- ✅ `SETUP.md` - New setup instructions

### Frontend
- ✅ `lib/config.ts` - New API configuration file
- ✅ `lib/api-client.ts` - New API client with request handling
- ✅ `components/detection-demo.tsx` - Updated to use real API instead of mock data
- ✅ `.env.local` - New environment configuration file
- ✅ `SETUP.md` - New setup instructions

## API Endpoints

### GET /health
Health check endpoint
```bash
curl http://localhost:8000/health
```
Response:
```json
{"status": "ok", "message": "AGILICIS API is running"}
```

### POST /api/predict
Image analysis endpoint
```bash
curl -X POST -F "file=@image.jpg" http://localhost:8000/api/predict
```
Response:
```json
{
  "predicted_class": "Disease name",
  "confidence_score": 0.95,
  "status": "OK",
  "top_k": [{"class_name": "Disease", "score": 0.95}],
  "summary": "Detailed analysis",
  "treatment": "Treatment recommendation",
  "model_version": "1.0.0",
  "inference_time": "1.2s"
}
```

## Features

✅ **Drag & Drop Upload** - Easy image upload
✅ **Real-time Analysis** - Immediate AI processing
✅ **CORS Enabled** - Secure cross-origin requests
✅ **Error Handling** - User-friendly error messages
✅ **Backend Health Check** - Automatic connectivity verification
✅ **TypeScript Support** - Type-safe API client
✅ **Environment Configuration** - Easy setup with .env files
✅ **Progress Tracking** - Visual upload/analysis progress

## Troubleshooting

### Backend Connection Errors
1. **Check backend is running**: `http://localhost:8000/health`
2. **Verify CORS configuration**: Check `ALLOWED_ORIGINS` in backend `.env.local`
3. **Check frontend API URL**: Ensure `NEXT_PUBLIC_API_URL` matches backend URL

### Image Upload Fails
1. Check browser console for errors
2. Verify image file is valid (JPG, PNG, WEBP)
3. Ensure backend API is accessible
4. Check file size (should be reasonable for ML processing)

### Port Already in Use
- Backend: Change `API_PORT` in `.env.local`
- Frontend: `pnpm dev -- -p 3001` (different port)

### CORS Issues
- Add your frontend URL to `ALLOWED_ORIGINS` in backend `.env.local`
- Restart the backend
- Clear browser cache

## Development

### Frontend Development
- Components use React hooks (`useState`, `useCallback`, `useEffect`)
- API client uses native Fetch API with timeout handling
- Tailwind CSS for styling
- shadcn/ui components for UI elements

### Backend Development
- FastAPI with uvicorn
- CORS middleware for cross-origin requests
- TensorFlow for ML model inference
- Pydantic for request validation

## Deployment Notes

For production deployment:
1. Update `ALLOWED_ORIGINS` with your production domain
2. Use environment variables instead of `.env` files
3. Set `reload=False` in uvicorn for FastAPI
4. Use proper HTTPS/SSL certificates
5. Configure a reverse proxy (nginx/Apache)
6. Use a process manager (pm2, systemd, etc.)

## Support

For issues or questions:
1. Check the detailed setup guides: `backend/SETUP.md` and `frontend/SETUP.md`
2. Verify all dependencies are installed
3. Check environment variables are correctly set
4. Review browser console for frontend errors
5. Check terminal output for backend errors
