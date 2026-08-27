import axios from "axios";
import { getCookie } from "../Utils/cookie";

const PostApi = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Dynamic token injection — fixes stale-token bug
PostApi.interceptors.request.use((config) => {
  const accessToken = getCookie("accessToken");
  if (accessToken) {
    config.headers["Authorization"] = `bearer ${accessToken}`;
  }
  return config;
});

const getAds = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

getAds.interceptors.request.use((config) => {
  const accessToken = getCookie("accessToken");
  if (accessToken) {
    config.headers["Authorization"] = `bearer ${accessToken}`;
  }
  return config;
});

export { PostApi, getAds };