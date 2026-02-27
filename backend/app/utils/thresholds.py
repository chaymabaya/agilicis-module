CONFIDENCE_THRESHOLD = 0.60

def get_status(confidence):
    if confidence < CONFIDENCE_THRESHOLD:
        return "UNCERTAIN"
    return "OK"