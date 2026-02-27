import { API_ENDPOINTS, API_TIMEOUT } from "./config";

export interface Prediction {
  predicted_class: string;
  confidence_score: number;
  status: "OK" | "UNCERTAIN" | "FAILED";
  top_k: { class_name: string; score: number }[];
  summary: string;
  treatment: string;
  model_version: string;
  inference_time: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string = API_ENDPOINTS.predict, timeout: number = API_TIMEOUT) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    options?: RequestInit & { data?: unknown }
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method,
        ...options,
        signal: controller.signal,
        headers: {
          ...options?.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        return {
          success: false,
          error: error.detail || `HTTP ${response.status}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data as T,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === "AbortError") {
        return {
          success: false,
          error: "Request timeout",
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async predictImage(file: File): Promise<ApiResponse<Prediction>> {
    const formData = new FormData();
    formData.append("file", file);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(API_ENDPOINTS.predict, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        return {
          success: false,
          error: error.detail || `HTTP ${response.status}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data as Prediction,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === "AbortError") {
        return {
          success: false,
          error: "Request timeout",
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(API_ENDPOINTS.health, { method: "GET" });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const apiClient = new ApiClient();
