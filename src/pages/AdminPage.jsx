import { useState, useEffect } from "react";
import CategoryForm from "../Components/Templates/CategoryForm";
import CategoryDeletionForm from "../Components/Templates/CategoryDeletionForm";
import ScraperForm from "../Components/Templates/ScraperForm";
import AllAds from "../Components/Templates/AllAds";
import CategoryList from "../Components/Templates/CategoryList";
import { Link } from "react-router-dom";
import { t, getSavedLanguage } from "../Utils/i18n";

function AdminPage() {
  const [currentLang, setCurrentLang] = useState(getSavedLanguage());

  useEffect(() => {
    const handleLangChange = (e) => setCurrentLang(e.detail || getSavedLanguage());
    window.addEventListener("sheypoor_lang_changed", handleLangChange);
    return () => window.removeEventListener("sheypoor_lang_changed", handleLangChange);
  }, []);

  return (
    <div className="min-h-screen bg-light-3 dark:bg-night-bg text-dark-0 dark:text-white py-6 transition-colors">
      <div className="max-w-container mx-auto px-4">
        {/* Header Title */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-light-0 dark:border-night-border">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-heading-3 text-dark-0 dark:text-white font-bold">
                {t("adminPanel", {}, currentLang)}
              </h1>
              <span className="badge-promoted">Super Admin</span>
            </div>
            <p className="text-body-3 text-dark-3 dark:text-gray-400 mt-1">
              {currentLang === "fa" ? "مدیریت دسته‌بندی‌ها، اسکرپر و نظارت بر کلیه آگهی‌ها" : "Manage categories, web scraper, and all classified listings"}
            </p>
          </div>
          <Link to="/" className="btn-outline text-body-3 !h-10 !px-4">
            {currentLang === "fa" ? "← بازگشت به سایت" : "← Back to Website"}
          </Link>
        </div>

        {/* Current Categories Preview */}
        <div className="mb-8">
          <h2 className="text-heading-4 text-dark-0 dark:text-white font-bold mb-4">
            {currentLang === "fa" ? "دسته‌بندی‌های فعلی سیستم" : "System Categories"}
          </h2>
          <CategoryList />
        </div>

        {/* Category Forms Grid */}
        <div className="grid grid-cols-1 laptop:grid-cols-2 gap-6 mb-10">
          <CategoryForm />
          <CategoryDeletionForm />
        </div>

        {/* Scraper Tool */}
        <div className="mb-12">
          <ScraperForm />
        </div>

        {/* All Ads Admin Management */}
        <section className="pt-6 border-t border-light-0 dark:border-night-border">
          <div className="flex items-center gap-3 mb-6">
            <img src="/sheypoorBlack.svg" alt="" className="w-6 h-6 dark:invert" />
            <h2 className="text-heading-4 text-dark-0 dark:text-white font-bold">
              {currentLang === "fa" ? "مدیریت و نظارت بر کلیه آگهی‌ها" : "Ad Listings Management"}
            </h2>
          </div>
          <AllAds isAdmin={true} />
        </section>
      </div>
    </div>
  );
}

export default AdminPage;