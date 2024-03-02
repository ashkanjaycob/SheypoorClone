import { LogoutIcon, UserAddIcon, UserIcon } from "@heroicons/react/solid";
import { Link } from "react-router-dom";
import { delCookie } from "../../Utils/cookie";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../../Services/user";

function NavIcons() {
  const { data } = useQuery(["profile"], getProfile);
  console.log({ data });

  const handleLogout = () => {
    // Delete access and refresh tokens from cookies
    delCookie("accessToken");
    delCookie("refreshToken");
    window.location.reload(); // Reload the application
  };

  //   const handleNavigate = (path) => {
  //     navigate(path);
  //   };

  return (
    <div>
      <div className="flex items-center justify-between space-x-2 mr-2">
        <span onClick={handleLogout} className="text-gray-400 cursor-pointer">
          <LogoutIcon className="h-5 w-5 mr-7 inline-block" />
          <span className="text-gray-400 mr-1">خروج</span>
        </span>

        {data && data.role === "ADMIN" ? (
          <Link to="/admin">
            <span className="text-gray-400 cursor-pointer">
              <UserAddIcon className="h-5 w-5 mr-7 inline-block" />
              <span className="text-gray-400 mr-1">ادمین پنل</span>
            </span>
          </Link>
        ) : (
          <span></span>
        )}

        <Link to="/dashboard">
          <span className="text-gray-400 cursor-pointer">
            <UserIcon className="h-5 w-5 mr-7 inline-block" />
            <span className="text-gray-400 mr-1">حساب من</span>
          </span>
        </Link>
      </div>
    </div>
  );
}

export default NavIcons;
