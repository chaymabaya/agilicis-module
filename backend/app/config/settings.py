import os
from pathlib import Path
from dotenv import load_dotenv

# Resolve important paths relative to this file so it works
# both locally and on Railway, regardless of root directory.
CURRENT_FILE_PATH = Path(__file__).resolve()

# This is the "backend" folder (the one that contains app/, Procfile, models, ...)
BACKEND_DIR = CURRENT_FILE_PATH.parents[2]

# Load local environment variables (pour le développement uniquement).
# Sur Railway, le code tourne sous /app, on évite donc de charger
# le fichier .env.local du repo qui forcerait MODEL_PATH.
if not str(BACKEND_DIR).startswith("/app"):
	load_dotenv(BACKEND_DIR / ".env.local")

# Determine model path
_env_model_path = os.getenv("MODEL_PATH")
if _env_model_path:
	candidate = Path(_env_model_path)
	if not candidate.is_absolute():
		candidate = BACKEND_DIR / candidate
else:
	# Par défaut, on utilise le modèle V2 en .h5
	candidate = BACKEND_DIR / "tomato_modelV2.h5"

MODEL_PATH = str(candidate)

# Debug de chemin pour aider au déploiement (visible dans les logs)
try:
	print("[PATH] CURRENT_FILE_PATH:", CURRENT_FILE_PATH)
	print("[PATH] BACKEND_DIR:", BACKEND_DIR)
	print("[PATH] MODEL_PATH:", MODEL_PATH)
	print("[PATH] BACKEND_DIR contents:", [p.name for p in BACKEND_DIR.iterdir()])
except Exception as _e:
	print("[PATH] Debug path listing failed:", _e)

MODEL_VERSION = "1.1.0"

IMAGE_SIZE = (224, 224)

# CORS Configuration
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

# API Configuration
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", "8000"))

# Frontend Configuration
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")   


