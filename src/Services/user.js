import { getCookie } from "../Utils/cookie.js";
import api from "../configs/Api";

const getProfile = async () => {
  try {
    const token = getCookie("accessToken");
    console.log(token);
    
    if (!token) {
      throw new Error("Access token not found");
    }
    
    const response = await api.get("/user/whoami");
    
    return response.data; // Assuming api.get returns a promise that resolves to response object
  } catch (error) {
    console.error("Error while fetching profile:", error);
    throw error;
  }
};

export { getProfile };
