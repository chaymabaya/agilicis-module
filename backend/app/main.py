from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.predict_routes import router as predict_router
import os

app = FastAPI(title="AGILICIS API", version="1.0.0")

# Configure CORS
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000"
).split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router, prefix="/api")

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "AGILICIS API is running"}


