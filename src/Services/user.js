import { getCookie } from "../Utils/cookie.js";
import api from "../configs/Api";

console.log(getCookie("accessToken"));
const token = getCookie("accessToken");

const getProfile = () => {
  api.get("/user/whoami", { headers: { Authorization: `bearer ${token}` } });
};

export { getProfile };
