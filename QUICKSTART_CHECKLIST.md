# Quick Start Checklist

Use this checklist to verify that your backend-frontend connection is set up correctly.

## Pre-Setup

- [ ] Python 3.8+ installed
- [ ] Node.js 18+ installed
- [ ] pnpm installed (or npm/yarn)
- [ ] Visual Studio Code or preferred editor open

## Backend Setup

- [ ] Navigated to `backend/` directory
- [ ] Created or updated `backend/.env.local` with configuration
- [ ] Ran `pip install -r requirements.txt` successfully
- [ ] Verified `tomato_model.h5` exists in backend directory

## Backend Verification

- [ ] Backend runs: `python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload`
- [ ] No errors in terminal output
- [ ] Terminal shows: `Uvicorn running on http://0.0.0.0:8000`
- [ ] Health check works: `curl http://localhost:8000/health`
- [ ] Response shows: `{"status": "ok", "message": "AGILICIS API is running"}`

## Frontend Setup

- [ ] Navigated to `frontend/` directory
- [ ] Created or updated `frontend/.env.local` with configuration
- [ ] Ran `pnpm install` successfully
- [ ] No dependency errors

## Frontend Verification

- [ ] Frontend runs: `pnpm dev`
- [ ] No errors in terminal output
- [ ] Terminal shows: `ready - started server on 0.0.0.0:3000`
- [ ] Browser opens to `http://localhost:3000`
- [ ] Page loads without errors

## Connection Testing

- [ ] Open `http://localhost:3000` in browser
- [ ] No CORS errors in browser console (F12)
- [ ] Detection demo section is visible
- [ ] Image upload area is clickable
- [ ] No errors in browser console about API connection

## Image Upload Test

- [ ] Prepare a test image (JPG, PNG, or WEBP)
- [ ] Drag and drop image into upload area (or click to select)
- [ ] Progress bar appears showing upload status
- [ ] Progress bar shows analyzing status
- [ ] Results appear with:
  - [ ] Disease name
  - [ ] Confidence score (%)
  - [ ] Status badge (OK/UNCERTAIN/FAILED)
  - [ ] Summary text
  - [ ] Treatment recommendations
  - [ ] Model version
  - [ ] Inference time

## Troubleshooting Checklist

If something isn't working:

- [ ] Backend terminal shows no errors
- [ ] Frontend terminal shows no errors
- [ ] `http://localhost:8000/health` returns OK
- [ ] Environment variables are set correctly
- [ ] CORS error? -> Check ALLOWED_ORIGINS in backend .env.local
- [ ] Connection refused? -> Verify backend is running on port 8000
- [ ] Image not uploading? -> Check file format and size
- [ ] Slow response? -> Check image size and backend processing
- [ ] API timeout? -> Verify backend is responding, check model loading

## File Structure Verification

- [ ] Backend files created/updated:
  - [ ] `app/main.py` - Has CORS middleware
  - [ ] `app/config/settings.py` - Has API settings
  - [ ] `.env.local` - Configuration file
  - [ ] `requirements.txt` - Has python-dotenv

- [ ] Frontend files created/updated:
  - [ ] `lib/config.ts` - API config
  - [ ] `lib/api-client.ts` - API client
  - [ ] `.env.local` - Configuration file
  - [ ] `components/detection-demo.tsx` - Updated component

## Documentation Review

- [ ] Read `CONNECTION_GUIDE.md` for overview
- [ ] Read `backend/SETUP.md` for backend details
- [ ] Read `frontend/SETUP.md` for frontend details
- [ ] Read `IMPLEMENTATION_SUMMARY.md` for changes made

## Next Steps After Verification

1. ✅ If everything works:
   - [ ] Celebrate! The connection is working
   - [ ] Read deployment guides for production setup
   - [ ] Consider adding more features

2. ❌ If something doesn't work:
   - [ ] Check browser console (F12) for errors
   - [ ] Check backend terminal output for errors
   - [ ] Check frontend terminal output for errors
   - [ ] Review troubleshooting section in CONNECTION_GUIDE.md
   - [ ] Verify all .env files are correctly configured
   - [ ] Ensure ports 3000 and 8000 are not blocked/in use

## Common Commands Reference

```bash
# Backend
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Frontend
cd frontend
pnpm install
pnpm dev

# Test health
curl http://localhost:8000/health

# Test image upload
curl -X POST -F "file=@image.jpg" http://localhost:8000/api/predict
```

## Environment Variables Quick Reference

**Backend .env.local:**
```
API_HOST=0.0.0.0
API_PORT=8000
MODEL_PATH=tomato_model.h5
ALLOWED_ORIGINS=http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

**Frontend .env.local:**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=AGILICIS
```

---

**Last Updated**: February 22, 2026  
**Status**: ✅ Connection Guide Complete  
**Version**: 1.0
