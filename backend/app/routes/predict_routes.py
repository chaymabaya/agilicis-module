from fastapi import APIRouter, UploadFile, File
from app.controllers.predict_controller import predict_image

router = APIRouter()

@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    return await predict_image(file)