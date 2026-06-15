"use client";

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

async function refreshAuthToken(): Promise<void> {
  await apiClient.post("/api/auth/refresh");
}

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      try {
        await refreshAuthToken();
        console.log("access token refreshed")
        return apiClient(originalRequest);
      } catch {
        if (typeof window !== "undefined") {
          window.location.href = "/auth";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;