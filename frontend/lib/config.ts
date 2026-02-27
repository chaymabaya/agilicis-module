// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export const API_TIMEOUT = 30000; // 30 seconds

export const API_ENDPOINTS = {
  health: `${API_BASE_URL}/health`,
  predict: `${API_BASE_URL}/api/predict`,
};
