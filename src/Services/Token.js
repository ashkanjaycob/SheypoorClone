import { getCookie ,setCookie } from "../Utils/cookie";
import api from "../configs/Api";

const getNewTokens = async () => {
    const refreshToken = getCookie("refreshToken");
    if (!refreshToken) {
      throw new Error("Refresh token not found");
    }
    try {
      const response = await api.post("auth/check-refresh-token", {
        refreshToken,
      });
      if (response.data) {
        const { accessToken, newRefreshToken } = response.data;
        setCookie("accessToken", accessToken);
        setCookie("refreshToken", newRefreshToken);
        return accessToken;
      } else {
        throw new Error("Failed to refresh tokens");
      }
    } catch (error) {
      console.error("Error refreshing tokens:", error);
      throw error;
    }
  };
export { getNewTokens };
