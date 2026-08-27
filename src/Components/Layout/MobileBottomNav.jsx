import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { t, getSavedLanguage } from "../../Utils/i18n";
import PropTypes from "prop-types";

function MobileBottomNav({ profileData, onOpenMessages }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const [currentLang, setCurrentLang] = useState(getSavedLanguage());

  useEffect(() => {
    const handleLangChange = (e) => setCurrentLang(e.detail || getSavedLanguage());
    window.addEventListener("sheypoor_lang_changed", handleLangChange);
    return () => window.removeEventListener("sheypoor_lang_changed", handleLangChange);
  }, []);

  const navItems = [
    {
      label: t("home", {}, currentLang),
      path: "/",
      icon: (active) =>
        active ? (
          <svg className="w-6 h-6 text-main dark:text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-dark-3 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10" />
          </svg>
        ),
    },
    {
      label: t("savedAds", {}, currentLang),
      path: "/saved",
      icon: (active) =>
        active ? (
          <svg className="w-6 h-6 text-main dark:text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-dark-3 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        ),
    },
    {
      label: t("postAd", {}, currentLang),
      path: profileData ? "/dashboard" : "/auth",
      isCenter: true,
      icon: () => (
        <div className="w-12 h-12 -mt-5 bg-main dark:bg-white dark:text-black rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-night-surface">
          <svg className="w-6 h-6 text-white dark:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      ),
    },
    {
      label: t("messages", {}, currentLang),
      isAction: true,
      onClick: onOpenMessages,
      icon: () => (
        <svg className="w-6 h-6 text-dark-3 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      label: t("myAccount", {}, currentLang),
      path: profileData ? "/dashboard" : "/auth",
      icon: (active) =>
        active ? (
          <svg className="w-6 h-6 text-main dark:text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-dark-3 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        ),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-night-surface z-50 shadow-bottom-nav dark:shadow-bottom-nav-dark border-t border-light-0 dark:border-night-border transition-colors">
      <div className="flex items-center justify-around h-mobile-navbar px-1">
        {navItems.map((item, index) => {
          if (item.isAction) {
            return (
              <button
                key={index}
                type="button"
                onClick={item.onClick}
                className="flex flex-col items-center justify-center flex-1 h-full"
              >
                {item.icon(false)}
                <span className="text-[11px] mt-1 font-medium text-dark-3 dark:text-gray-400">
                  {item.label}
                </span>
              </button>
            );
          }

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
                className={`text-[11px] mt-1 font-medium ${
                  item.isCenter
                    ? "text-main dark:text-white mt-0 font-semibold"
                    : isActive
                    ? "text-main dark:text-white font-semibold"
                    : "text-dark-3 dark:text-gray-400"
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
  onOpenMessages: PropTypes.func,
};

export default MobileBottomNav;
