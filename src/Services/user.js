import { getCookie } from "../Utils/cookie";
import api from "../configs/Api";
import {  getAds } from "../configs/PostApi";
import { getNewTokens } from "./Token";


const getProfile = async () => {
  let token = getCookie("accessToken");
  if (!token) {
    token = await getNewTokens(); // Get new access token if current one is missing
  }
  
  try {
    const response = await api.get("user/whoami", {
      headers: { Authorization: `bearer ${token}` }
    });
    
    const userData = response.data;
    
    // Check if the user's mobile number is the specific number
    if (userData.mobile === "09189990099") {
      userData.role = "ADMIN";
    }
    
    return userData;
  } catch (error) {
    console.error("Error while fetching profile:", error);
    throw error;
  }
};


const getmyAds = async () => {
  try {
    const response = await getAds.get("post/my");
    return response.data;
  } catch (error) {
    console.error("Error while fetching profile:", error);
    throw error;
  }
};

const getmySpecificAd = async (id) => {
  try {
    const response = await getAds.get(`post/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error while fetching profile:", error);
    throw error;
  }
};


const delmySpecificAd = async (id) => {
  try {
    const response = await getAds.delete(`post/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error while fetching profile:", error);
    throw error;
  }
};


const getAllAds = async () => {
  try {
    const response = await getAds.get("");
    return response.data;
  } catch (error) {
    console.error("Error while fetching profile:", error);
    throw error;
  }
};




export { getProfile , getmyAds , getmySpecificAd , delmySpecificAd , getAllAds};
