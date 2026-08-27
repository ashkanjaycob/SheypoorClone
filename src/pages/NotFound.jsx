import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { t, getSavedLanguage } from "../Utils/i18n";

function NotFound() {
  const [currentLang, setCurrentLang] = useState(getSavedLanguage());

  useEffect(() => {
    const handleLangChange = (e) => setCurrentLang(e.detail || getSavedLanguage());
    window.addEventListener("sheypoor_lang_changed", handleLangChange);
    return () => window.removeEventListener("sheypoor_lang_changed", handleLangChange);
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-light-3 dark:bg-night-bg text-dark-0 dark:text-white px-4 py-16 text-center transition-colors">
      <div className="w-24 h-24 rounded-full bg-light-special dark:bg-night-surface flex items-center justify-center text-main dark:text-white mb-6 shadow-sm">
        <span className="text-4xl font-black">404</span>
      </div>
      <h1 className="text-heading-2 font-bold mb-3">
        {currentLang === "fa" ? "صفحه مورد نظر پیدا نشد!" : "Page Not Found!"}
      </h1>
      <p className="text-body-2 text-dark-3 dark:text-gray-400 mb-8 max-w-md">
        {currentLang === "fa"
          ? "متاسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا به آدرس دیگری منتقل شده است."
          : "Sorry, the page you are looking for does not exist or has been moved."}
      </p>
      <Link to="/" className="btn-primary">
        {t("home", {}, currentLang)}
      </Link>
    </div>
  );
}

export default NotFound;