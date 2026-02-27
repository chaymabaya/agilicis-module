def format_response(predicted_class, confidence, status, top_k, summary, treatment, version, inference_time):
    return {
        "predicted_class": predicted_class,
        "confidence_score": round(float(confidence), 4),
        "status": status,
        "top_k": top_k,
        "summary": summary,
        "treatment": treatment,
        "model_version": version,
        "inference_time": inference_time
    }