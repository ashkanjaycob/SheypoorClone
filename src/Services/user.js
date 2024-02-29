import { getCookie } from "../Utils/cookie";
import api from "../configs/Api";
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

export { getProfile };
