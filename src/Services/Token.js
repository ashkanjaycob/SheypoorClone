import axios from "axios";
import { getCookie, setCookie, delCookie } from "../Utils/cookie";

// Singleton promise to prevent parallel refresh requests race condition
let refreshPromise = null;

const getNewTokens = async () => {
  const refreshToken = getCookie("refreshToken");
  if (!refreshToken) {
    delCookie("accessToken");
    delCookie("refreshToken");
    return null;
  }

  // If a refresh request is already running, await that same request
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      // Use direct axios call without interceptors to prevent circular 401 loops
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}auth/check-refresh-token`,
        { refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response && response.data) {
        const { accessToken, newRefreshToken, refreshToken: directRt } = response.data;
        const finalRefreshToken = newRefreshToken || directRt || refreshToken;

        if (accessToken) {
          setCookie({
            accessToken,
            refreshToken: finalRefreshToken,
          });
          return accessToken;
        }
      }

      throw new Error("Invalid refresh token response");
    } catch (error) {
      console.warn("Session expired or refresh token invalid:", error?.response?.status || error?.message);
      delCookie("accessToken");
      delCookie("refreshToken");
      throw error;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

export { getNewTokens };

