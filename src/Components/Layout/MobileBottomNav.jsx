import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

function MobileBottomNav({ profileData }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      label: "خانه",
      path: "/",
      icon: (active) => (
        <svg className={`w-6 h-6 ${active ? "text-main" : "text-dark-3"}`} fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: "دسته‌ها",
      path: "/#categories",
      icon: (active) => (
        <svg className={`w-6 h-6 ${active ? "text-main" : "text-dark-3"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      label: "ثبت آگهی",
      path: "/dashboard",
      isCenter: true,
      icon: () => (
        <div className="w-12 h-12 -mt-5 bg-main rounded-full flex items-center justify-center shadow-lg border-4 border-white">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      ),
    },
    {
      label: "پیام‌ها",
      path: "/dashboard",
      icon: (active) => (
        <svg className={`w-6 h-6 ${active ? "text-main" : "text-dark-3"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      label: "حساب من",
      path: profileData ? "/dashboard" : "/auth",
      icon: (active) => (
        <svg className={`w-6 h-6 ${active ? "text-main" : "text-dark-3"}`} fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white z-50 shadow-bottom-nav border-t border-light-0">
      <div className="flex items-center justify-around h-mobile-navbar px-1">
        {navItems.map((item, index) => {
          const isActive =
            item.path === "/"
              ? currentPath === "/"
              : currentPath.startsWith(item.path) && item.path !== "/";
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full ${
                item.isCenter ? "relative" : ""
              }`}
            >
              {item.icon(isActive)}
              <span
                className={`text-[10px] mt-1 font-medium ${
                  item.isCenter
                    ? "text-main mt-0"
                    : isActive
                    ? "text-main"
                    : "text-dark-3"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

MobileBottomNav.propTypes = {
  profileData: PropTypes.object,
};

export default MobileBottomNav;
