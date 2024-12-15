/* eslint-disable react/jsx-no-duplicate-props */
import { LogoutIcon, UserAddIcon, UserIcon } from "@heroicons/react/solid";
import { Link } from "react-router-dom";
import { delCookie } from "../../Utils/cookie";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../../Services/user";

function NavIcons() {
  const { data } = useQuery(["profile"], getProfile);

  const handleLogout = () => {
    // Delete access and refresh tokens from cookies
    delCookie("accessToken");
    delCookie("refreshToken");
    window.location.reload(); // Reload the application
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-row-reverse items-center text-start justify-center gap-2 mr-2">
      {data ? (
        <Link to="/admin">
          <span
            onClick={handleLogout}
            className="text-gray-400  cursor-pointer flex flex-col items-center  pl-3"
          >
            <LogoutIcon className="h-5 w-5 mr-2 inline-block" />
            <span className="text-gray-400 mr-1">خروج</span>
          </span>
        </Link>
      ) : (
        <span></span>
      )}

      <Link to="/dashboard">
        <span
          className="text-gray-400 text-sm cursor-pointer flex flex-col items-center pl-3"
          onClick={scrollToTop}
        >
          <UserIcon className="h-5 w-5 mr-2 inline-block" />
          <span className="text-gray-400 mr-1">حساب من</span>
        </span>
      </Link>

      {data && data.role === "ADMIN" ? (
        <Link to="/admin">
          <span
            className="text-gray-400  cursor-pointer flex flex-col items-center pl-3"
            onClick={scrollToTop}
          >
            <UserAddIcon className="h-5 w-5 mr-2 inline-block" />
            <span className="text-gray-400 mr-1">ادمین پنل</span>
          </span>
        </Link>
      ) : (
        <span></span>
      )}
    </div>
  );
}

export default NavIcons;
