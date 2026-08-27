import { useState, useEffect } from "react";
import AddAdvertising from "../Components/Templates/AddAdvertising";
import AdsList from "../Components/Templates/AdsList";
import { Link } from "react-router-dom";
import { t, getSavedLanguage } from "../Utils/i18n";

function Dashboard() {
  const [currentLang, setCurrentLang] = useState(getSavedLanguage());

  useEffect(() => {
    const handleLangChange = (e) => setCurrentLang(e.detail || getSavedLanguage());
    window.addEventListener("sheypoor_lang_changed", handleLangChange);
    return () => window.removeEventListener("sheypoor_lang_changed", handleLangChange);
  }, []);

  return (
    <div className="min-h-screen bg-light-3 dark:bg-night-bg text-dark-0 dark:text-white py-6 transition-colors">
      <div className="max-w-container mx-auto px-4">
        {/* Header Breadcrumb & Title */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-light-0 dark:border-night-border">
          <div>
            <h1 className="text-heading-3 text-dark-0 dark:text-white font-bold">
              {currentLang === "fa" ? "داشبورد کاربری" : currentLang === "de" ? "Benutzer-Dashboard" : "User Dashboard"}
            </h1>
            <p className="text-body-3 text-dark-3 dark:text-gray-400 mt-1">
              {currentLang === "fa" ? "مدیریت و ثبت آگهی‌های شما در شیپور" : "Manage and publish your classified listings"}
            </p>
          </div>
          <Link to="/saved" className="btn-outline text-body-3 !h-10 !px-4 hidden tablet:inline-flex">
            {t("savedAds", {}, currentLang)}
          </Link>
        </div>

        <div className="space-y-12">
          {/* Post New Ad Section */}
          <section>
            <AddAdvertising />
          </section>

          {/* User Ads Section */}
          <section className="pt-6">
            <div className="flex items-center gap-3 mb-6">
              <img src="/sheypoorBlack.svg" alt="" className="w-6 h-6 dark:invert" />
              <h2 className="text-heading-4 text-dark-0 dark:text-white font-bold">
                {t("myAds", {}, currentLang)}
              </h2>
            </div>
            <AdsList />
          </section>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
