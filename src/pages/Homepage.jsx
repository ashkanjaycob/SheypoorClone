import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import CategoryList from "../Components/Templates/CategoryList";
import SpecialtyHubs from "../Components/Templates/SpecialtyHubs";
import AllAds from "../Components/Templates/AllAds";
import { t, getSavedLanguage } from "../Utils/i18n";

function Homepage() {
  const [currentLang, setCurrentLang] = useState(getSavedLanguage());

  useEffect(() => {
    const handleLangChange = (e) => setCurrentLang(e.detail || getSavedLanguage());
    window.addEventListener("sheypoor_lang_changed", handleLangChange);
    return () => window.removeEventListener("sheypoor_lang_changed", handleLangChange);
  }, []);

  return (
    <div className="min-h-screen bg-light-3 dark:bg-night-bg text-dark-0 dark:text-white transition-colors">
      {/* 1. Categories Section */}
      <CategoryList />

      {/* 2. Specialty Hubs (Cars & Real Estate) */}
      <SpecialtyHubs />

      {/* Divider */}
      <div className="max-w-container mx-auto px-4">
        <div className="border-b border-light-0 dark:border-night-border my-2" />
      </div>

      {/* 3. Main Feed Section: 2 rows of ads -> Showcase Section -> All remaining ads with Load More */}
      <section id="all-ads-section" className="max-w-container mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <img
            className="w-7 laptop:w-8 dark:invert"
            src="/sheypoorBlack.svg"
            alt="Sheypoor"
          />
          <div>
            <h2 className="text-heading-4 laptop:text-heading-3 text-dark-0 dark:text-white font-bold">
              {t("recentAds", {}, currentLang)}
            </h2>
            <p className="text-body-3 text-dark-3 dark:text-gray-400 mt-0.5">
              {t("recentAdsSubtitle", {}, currentLang)}
            </p>
          </div>
        </div>

        {/* All Ads with Showcase in between 2 rows and remaining ads */}
        <AllAds withShowcase={true} />
      </section>

      <Toaster />
    </div>
  );
}

export default Homepage;