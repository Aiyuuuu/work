// src/lib/axios/apiClient.ts
"use client";

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { API_ENDPOINTS } from "@/constants/apiConstants";
import { AUTH_ROUTE } from "@/constants/routeConstants";

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

async function refreshAuthToken(): Promise<void> {
  await refreshClient.post(API_ENDPOINTS.AUTH.refresh.ENDPOINT);
}

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Safely extract the custom JSON body error details inside the browser [2]
    const responseData = error.response?.data as any;
    const errorCode = responseData?.error?.code;

    // Only trigger refresh for missing or expired access tokens
    const isAuthTokenFailure =
      errorCode === "ACCESS_TOKEN_MISSING" ||
      errorCode === "ACCESS_TOKEN_INVALID";

    const isRefreshRequest = originalRequest?.url?.includes(
      API_ENDPOINTS.AUTH.refresh.ENDPOINT
    );

    if (
      isAuthTokenFailure &&
      !originalRequest?._retry &&
      !isRefreshRequest
    ) {
      originalRequest._retry = true;

      try {
        await refreshAuthToken();
        return apiClient(originalRequest); // Retry the original failed request
      } catch (refreshErr) {
        // If the refresh token itself is expired or revoked,
        // force-redirect them to the login screen cleanly.
        console.error(refreshErr)
        if (typeof window !== "undefined") {
          window.location.href = AUTH_ROUTE;
        }
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;