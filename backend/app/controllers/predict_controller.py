from fastapi import HTTPException
from app.services.model_service import make_prediction

async def predict_image(file):
    try:
        if not file.filename or not file.filename.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp')):
            raise HTTPException(status_code=400, detail="Invalid file type. Supported: jpg, png, gif, webp")
        
        result = await make_prediction(file)
        return result
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in predict_image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")