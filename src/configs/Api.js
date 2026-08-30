import axios from "axios";
import { getCookie, delCookie } from "../Utils/cookie";
import { getNewTokens } from "../Services/Token";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (request) => {
    const accessToken = getCookie("accessToken");
    if (accessToken) {
      request.headers["Authorization"] = `bearer ${accessToken}`;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    // Never retry auth endpoints or requests that have already been retried once
    const isAuthEndpoint =
      originalRequest.url?.includes("auth/check-refresh-token") ||
      originalRequest.url?.includes("auth/check-otp") ||
      originalRequest.url?.includes("auth/send-otp");

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;

      const refreshToken = getCookie("refreshToken");
      if (!refreshToken) {
        delCookie("accessToken");
        delCookie("refreshToken");
        return Promise.reject(error);
      }

      try {
        const accessToken = await getNewTokens();
        if (accessToken) {
          originalRequest.headers["Authorization"] = `bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshErr) {
        delCookie("accessToken");
        delCookie("refreshToken");
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

