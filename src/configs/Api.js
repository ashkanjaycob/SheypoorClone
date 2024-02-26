import axios from "axios";
import { getCookie } from "../Utils/cookie";
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
      const originalRequest = error.config; // Use error.config to access the original request configuration
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const accessToken = await getNewTokens(); // Get new access token
          if (accessToken) {
            // Retry the original request with the new access token
            originalRequest.headers['Authorization'] = `bearer ${accessToken}`;
            return api(originalRequest);
          } else {
            // Failed to obtain new access token, handle error
            console.error("Failed to obtain new access token");
            // Throw an error or handle it accordingly
          }
        } catch (error) {
          console.error("Error while refreshing token:", error);
          // Throw an error or handle it accordingly
        }
      }
      return Promise.reject(error); // Reject the promise to propagate the error further
    }
  );

  
export default api;
