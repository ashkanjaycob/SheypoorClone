import { getCookie, delCookie } from "../Utils/cookie";
import api from "../configs/Api";
import { PostApi, getAds } from "../configs/PostApi";
import { getNewTokens } from "./Token";

const getProfile = async () => {
  const accessToken = getCookie("accessToken");
  const refreshToken = getCookie("refreshToken");

  // If user has no tokens at all, they are a guest
  if (!accessToken && !refreshToken) {
    return null;
  }

  let token = accessToken;
  if (!token && refreshToken) {
    try {
      token = await getNewTokens();
    } catch {
      delCookie("accessToken");
      delCookie("refreshToken");
      return null;
    }
  }

  if (!token) {
    return null;
  }

  try {
    const response = await api.get("user/whoami", {
      headers: { Authorization: `bearer ${token}` },
    });

    const userData = response.data;

    // Check if the user's mobile number is the admin number
    if (userData && userData.mobile === "09189990099") {
      userData.role = "ADMIN";
    }

    return userData;
  } catch (error) {
    // If request fails (e.g. 401 or invalid session), return null so UI handles unauthenticated state gracefully
    return null;
  }
};


const getmyAds = async () => {
  try {
    const response = await getAds.get("post/my");
    return response.data;
  } catch (error) {
    console.error("Error while fetching my ads:", error);
    throw error;
  }
};

const getmySpecificAd = async (id) => {
  try {
    const response = await getAds.get(`post/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error while fetching specific ad:", error);
    throw error;
  }
};

const delmySpecificAd = async (id) => {
  try {
    const response = await PostApi.delete(`post/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error while deleting ad:", error);
    throw error;
  }
};

/**
 * Fetches all ads across all categories or for a specific category.
 * If categorySlug is empty, calls root "/" or "post?limit=50" to fetch all items.
 */
const getAllAds = async (categorySlug = "") => {
  try {
    let endpoint = "";
    if (categorySlug) {
      endpoint = `post?category=${encodeURIComponent(categorySlug)}&limit=50`;
    } else {
      // Root endpoint returns all ads across all categories
      endpoint = "";
    }
    const response = await getAds.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error while fetching ads:", error);
    throw error;
  }
};

const updateMyAd = async (id, formData) => {
  try {
    const response = await PostApi.put(`post/update/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error("Error while updating ad:", error);
    throw error;
  }
};

export { getProfile, getmyAds, getmySpecificAd, delmySpecificAd, getAllAds, updateMyAd };
