import axios from "axios";
import { getCookie } from "../Utils/cookie";

const accessToken = getCookie("accessToken");

const PostApi = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `bearer ${accessToken}`
    },
  });

  const getAds = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
    "Content-Type": "application/json",
      Authorization: `bearer ${accessToken}`
    },
  });
  

  export {PostApi , getAds} ;