import numpy as np
from PIL import Image
import io

IMAGENET_MEAN = np.array([103.939, 116.779, 123.68])

def preprocess_image(file_bytes, target_size=(224, 224)):
    """Preprocess image for model prediction with ImageNet normalization."""
    try:
        image = Image.open(io.BytesIO(file_bytes)).convert("RGB")
        
        image = image.resize(target_size)
        
        image = np.array(image, dtype=np.float32)
        
        image = image[..., ::-1]
        
        image -= IMAGENET_MEAN
        
        image = np.expand_dims(image, axis=0)
        
        return image
    except Exception as e:
        raise ValueError(f"Error preprocessing image: {str(e)}")