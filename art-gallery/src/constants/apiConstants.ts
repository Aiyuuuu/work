// src/constants/apiConstants


export const SUCCESS_STATUS = {
  GET: 200,
  POST: 201,
  PUT: 200,
  PATCH: 200,
  DELETE: 204, // 204 No Content
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    login: { METHOD: "POST", ENDPOINT: "/api/auth/login" },
    signup: { METHOD: "POST", ENDPOINT: "/api/auth/signup" },
    refresh: { METHOD: "POST", ENDPOINT: "/api/auth/refresh" },
    logout: { METHOD: "POST", ENDPOINT: "/api/auth/logout" },
  },
  MEDIA: {
    getMediaByMediaId: { METHOD: "GET", ENDPOINT: "/api/media/:MediaId" },
    getPaginatedMedia: { METHOD: "GET", ENDPOINT: "/api/media" }
  },
};
