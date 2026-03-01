import os
from pathlib import Path

# Get the absolute path to the backend directory
BACKEND_DIR = Path(__file__).parent.parent.parent

# Model Configuration
MODEL_PATH = os.getenv("MODEL_PATH", str(BACKEND_DIR / "tomato_modelV2.h5"))
MODEL_VERSION = "1.1.0"
IMAGE_SIZE = (224, 224)

# CORS Configuration
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

# API Configuration
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", "8000"))

# Frontend Configuration
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")   


