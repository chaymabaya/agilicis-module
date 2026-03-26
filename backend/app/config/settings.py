import os
from pathlib import Path
# Get the absolute path to the backend directory
BACKEND_DIR = Path(__file__).parent.parent.parent

# Model Configuration
# By défaut, on pointe vers le modèle Keras natif, qui évite l'erreur
# "Unknown layer: 'TrueDivide'" liée à l'ancien fichier .h5.
MODEL_PATH = os.getenv("MODEL_PATH", str(BACKEND_DIR / "tomato_leaf_disease_model.keras"))
MODEL_VERSION = "1.1.0"
IMAGE_SIZE = (224, 224)
CURRENT_FILE_PATH = Path(__file__).resolve()
BACKEND_DIR = CURRENT_FILE_PATH.parent.parent.parent

# Force le chemin absolu pour Railway
MODEL_FILENAME = "tomato_leaf_disease_model.keras"
MODEL_PATH_DEFAULT = str(BACKEND_DIR / MODEL_FILENAME)

MODEL_PATH = os.getenv("MODEL_PATH", MODEL_PATH_DEFAULT)

# LOG DE DÉBOGAGE (Utile pour voir dans les logs Railway où il cherche)
print(f"--- DEBUG: Looking for model at: {MODEL_PATH} ---")
print(f"--- DEBUG: Does file exist? {os.path.exists(MODEL_PATH)} ---")


# CORS Configuration
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

# API Configuration
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", "8000"))

# Frontend Configuration
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")   


