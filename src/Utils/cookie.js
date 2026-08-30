const setCookie = (nameOrTokens, value) => {
  if (typeof document === "undefined" || !nameOrTokens) return;

  // Signature 1: setCookie("accessToken", "token_value")
  if (typeof nameOrTokens === "string") {
    const cookieName = nameOrTokens.trim();
    if (!value || value === "undefined" || value === "null") return;
    const maxAge = cookieName === "refreshToken" ? 30 * 24 * 60 * 60 : 24 * 60 * 60;
    document.cookie = `${cookieName}=${value}; max-age=${maxAge}; path=/; SameSite=Lax;`;
    return;
  }

  // Signature 2: setCookie({ accessToken, refreshToken, newRefreshToken })
  if (typeof nameOrTokens === "object") {
    const accessToken = nameOrTokens.accessToken;
    const refreshToken = nameOrTokens.refreshToken || nameOrTokens.newRefreshToken;

    if (accessToken && accessToken !== "undefined" && accessToken !== "null") {
      document.cookie = `accessToken=${accessToken}; max-age=${24 * 60 * 60}; path=/; SameSite=Lax;`;
    }
    if (refreshToken && refreshToken !== "undefined" && refreshToken !== "null") {
      document.cookie = `refreshToken=${refreshToken}; max-age=${30 * 24 * 60 * 60}; path=/; SameSite=Lax;`;
    }
  }
};

const getCookie = (cookieName) => {
  if (typeof document === "undefined" || !document.cookie) return undefined;
  const cookieArr = document.cookie.split(";");
  for (let i = 0; i < cookieArr.length; i++) {
    const item = cookieArr[i].trim();
    if (item.startsWith(`${cookieName}=`)) {
      const val = item.substring(cookieName.length + 1).trim();
      if (!val || val === "undefined" || val === "null") {
        return undefined;
      }
      return val;
    }
  }
  return undefined;
};

const delCookie = (cookieName) => {
  if (typeof document === "undefined") return;
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; max-age=0; path=/; SameSite=Lax;`;
};

const clearAuthCookies = () => {
  delCookie("accessToken");
  delCookie("refreshToken");
};

export { setCookie, getCookie, delCookie, clearAuthCookies };
