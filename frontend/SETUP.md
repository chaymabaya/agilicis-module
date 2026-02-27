# Frontend Setup Instructions

## Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)

## Installation & Running

### 1. Install Dependencies
```bash
cd frontend
pnpm install
```

### 2. Configuration
Create or update `.env.local` in the frontend folder with:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=AGILICIS
```

**Note**: Environment variables starting with `NEXT_PUBLIC_` are exposed to the browser.

### 3. Run the Frontend (Development)
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### 4. Build for Production
```bash
pnpm build
pnpm start
```

## API Integration

The frontend communicates with the backend using the API client located at `lib/api-client.ts`.

### Key Files
- `lib/config.ts` - API configuration
- `lib/api-client.ts` - API client with request handling
- `components/detection-demo.tsx` - Detection component using the API

### Environment Variables
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: `http://localhost:8000`)

## Features

1. **Image Upload** - Drag & drop or click to upload
2. **Real-time Analysis** - Sends image to backend for AI analysis
3. **Results Display** - Shows prediction, confidence, and recommendations
4. **Error Handling** - Displays user-friendly error messages
5. **Backend Health Check** - Verifies backend availability on component mount

## Troubleshooting

1. **API not accessible**: Ensure backend is running on `http://localhost:8000` or update `NEXT_PUBLIC_API_URL`
2. **CORS Error**: The backend has CORS enabled, ensure it's configured correctly
3. **Image upload fails**: Check browser console for specific error messages
4. **Slow performance**: Large images take longer to analyze, please wait for completion

## Development

The detection component automatically checks backend health on mount and displays an error if the API is unavailable. File uploads are sent directly to `/api/predict` endpoint with proper form-data encoding.
