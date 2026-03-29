import tensorflow as tf
import keras
from keras.saving import load_model as keras_load_model
import numpy as np
import time
from app.config.settings import MODEL_PATH, MODEL_VERSION
from app.utils.image_preprocessing import preprocess_image
from app.utils.thresholds import get_status
from app.utils.response_formatter import format_response




# Load model lazily on first use instead of at import time
model = None


def load_model():
    """Load the model using Keras 3 loader (works with your file format).

    We first try MODEL_PATH, then fall back to tomato_modelV2.h5
    (in case MODEL_PATH pointe vers un autre fichier).
    """

    global model
    if model is not None:
        return model

    from pathlib import Path
    primary_path = Path(MODEL_PATH)
    print(f"[MODEL] Attempting to load primary model from: {primary_path}")
    try:
        model = keras_load_model(str(primary_path), compile=False, safe_mode=False)
        print(f"[MODEL] Successfully loaded model from {primary_path}")
        return model
    except Exception as e:
        print(f"[MODEL] Warning: could not load primary model from {primary_path}. Error: {e}")

    # Fallback: try tomato_modelV2.h5 in the same directory
    fallback_h5 = primary_path.with_name("tomato_modelV2.h5")
    print(f"[MODEL] Attempting to load fallback model from: {fallback_h5}")
    try:
        model = keras_load_model(str(fallback_h5), compile=False, safe_mode=False)
        print(f"[MODEL] Successfully loaded fallback model from {fallback_h5}")
        return model
    except Exception as fallback_e:
        print(f"[MODEL] Fallback model also failed: {fallback_e}")
        model = None
        return None

class_names = [
    "Bacterial_spot",
    "Early_blight",
    "Healthy",
    "Late_blight",
    "Leaf_Mold",
    "powdery_mildew",
    "Septoria_leaf_spot",
    "Spider_mites Two-spotted_spider_mite",
    "Target_Spot",
    "Tomato_mosaic_virus",
    "Tomato_Yellow_Leaf_Curl_Virus",
]

# Treatment recommendations
treatments = {
    "Bacterial_spot": "Appliquer des fongicides cupriques et améliorer la circulation de l'air. Éviter la surhydratation.",
    "Early_blight": "Retirer les feuilles atteintes. Appliquer des fongicides protectants régulièrement.",
    "Healthy": "Continuer les pratiques de culture saine. Surveiller régulièrement la plante.",
    "Late_blight": "Appliquer immédiatement des fongicides. Améliorer la ventilation et réduire l'humidité.",
    "Leaf_Mold": "Améliorer la circulation de l'air. Utiliser des fongicides si nécessaire.",
    "powdery_mildew": "Appliquer du soufre ou des fongicides spécifiques. Augmenter l'aération.",
    "Septoria_leaf_spot": "Retirer les feuilles affectées. Appliquer des fongicides régulièrement.",
    "Spider_mites Two-spotted_spider_mite": "Augmenter l'humidité. Utiliser des acaricides si nécessaire.",
    "Target_Spot": "Retirer les parties atteintes. Appliquer des fongicides protectants.",
    "Tomato_mosaic_virus": "Pas de traitement chimique. Isoler la plante et retirer celles atteintes graves.",
    "Tomato_Yellow_Leaf_Curl_Virus": "Éliminer les vecteurs (aleurodes). Retirer les plantes gravement atteintes.",
}

async def make_prediction(file):
    model = load_model()
    if model is None:
        raise RuntimeError(f"Model could not be loaded from {MODEL_PATH}. Please check the model file exists and is valid.")
    
    start_time = time.time()
    contents = await file.read()
    image = preprocess_image(contents)

    prediction = model.predict(image, verbose=0)
    inference_time = time.time() - start_time
    
    confidence = float(np.max(prediction))
    class_index = np.argmax(prediction)
    predicted_class = class_names[class_index]

    # Get top 3 predictions
    top_k_indices = np.argsort(prediction[0])[-3:][::-1]
    top_k = [
        {
            "class_name": class_names[int(idx)],
            "score": float(prediction[0][int(idx)])
        }
        for idx in top_k_indices
    ]

    status = get_status(confidence)
    
    # Generate summary and treatment
    summary = f"Détection de {predicted_class} avec une confiance de {confidence*100:.1f}%. "
    if status == "OK":
        summary += "La maladie est clairement détectée."
    elif status == "UNCERTAIN":
        summary += "La détection est incertaine, une vérification manuelle est recommandée."
    else:
        summary += "La détection a échoué, veuillez réessayer avec une image de meilleure qualité."
    
    treatment = treatments.get(predicted_class, "Consultez un expert en agronomie pour un traitement spécifique.")

    return format_response(
        predicted_class,
        confidence,
        status,
        top_k,
        summary,
        treatment,
        MODEL_VERSION,
        f"{inference_time:.2f}s"
    )