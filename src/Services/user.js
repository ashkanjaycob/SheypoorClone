import { getCookie } from "../Utils/cookie";
import api from "../configs/Api";
import {  getAds } from "../configs/PostApi";
import { getNewTokens } from "./Token";


const getProfile = async () => {
  let token = getCookie("accessToken");
  if (!token) {
    token = await getNewTokens(); // Get new access token if current one is missing
  }
  // console.log(token);

  try {
    const response = await api.get("user/whoami", {
      headers: { Authorization: `bearer ${token}` }
    });
    return response.data;
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




export { getProfile , getmyAds , getmySpecificAd , delmySpecificAd};
