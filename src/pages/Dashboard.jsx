import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import AddAdvertising from "../Components/Templates/AddAdvertising";
import AdsList from "../Components/Templates/AdsList";
import { t, getSavedLanguage } from "../Utils/i18n";
import { delCookie } from "../Utils/cookie";
import { e2p } from "../Utils/Numbers";
import { getProfile } from "../Services/user";

function Dashboard() {
  const [currentLang, setCurrentLang] = useState(getSavedLanguage());
  const navigate = useNavigate();

  const { data: userData } = useQuery(["profile"], getProfile, {
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const handleLangChange = (e) => setCurrentLang(e.detail || getSavedLanguage());
    window.addEventListener("sheypoor_lang_changed", handleLangChange);
    return () => window.removeEventListener("sheypoor_lang_changed", handleLangChange);
  }, []);

  const handleLogout = () => {
    delCookie("accessToken");
    delCookie("refreshToken");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-light-3 dark:bg-night-bg text-dark-0 dark:text-white py-6 pb-24 tablet:pb-12 transition-colors">
      <div className="max-w-container mx-auto px-4">
        {/* User Account Profile & Control Header Card */}
        <div className="bg-white dark:bg-night-surface rounded-2xl p-4 tablet:p-6 border border-light-0 dark:border-night-border shadow-xs mb-8">
          <div className="flex flex-col tablet:flex-row tablet:items-center justify-between gap-4">
            {/* User Info */}
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-main to-blue-500 text-white flex items-center justify-center text-2xl font-bold shadow-md flex-shrink-0">
                👤
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-body-1 tablet:text-heading-4 font-bold text-dark-0 dark:text-white">
                    {userData?.mobile ? e2p(userData.mobile) : (currentLang === "fa" ? "حساب کاربری شیپور" : "Sheypoor Account")}
                  </h1>
                  {userData?.role === "ADMIN" ? (
                    <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                      {currentLang === "fa" ? "مدیر کل" : "Admin"}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-green-500/15 text-green-600 dark:text-green-400 border border-green-500/30">
                      {currentLang === "fa" ? "کاربر تایید شده" : "Verified User"}
                    </span>
                  )}
                </div>
                <p className="text-body-4 tablet:text-body-3 text-dark-3 dark:text-gray-400 mt-0.5">
                  {currentLang === "fa" ? "مدیریت آگهی‌ها و تنظیمات حساب شما" : "Manage your listings and account"}
                </p>
              </div>
            </div>

            {/* Account Quick Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap pt-2 tablet:pt-0 border-t tablet:border-t-0 border-light-1 dark:border-night-border">
              {userData?.role === "ADMIN" && (
                <Link
                  to="/admin"
                  className="py-2 px-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <span>🛡️</span>
                  <span>{currentLang === "fa" ? "پنل ادمین" : "Admin Panel"}</span>
                </Link>
              )}

              <Link
                to="/saved"
                className="py-2 px-3.5 rounded-xl bg-light-2 dark:bg-night-card hover:bg-light-1 dark:hover:bg-night-border text-dark-1 dark:text-gray-200 text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <span>🔖</span>
                <span>{t("savedAds", {}, currentLang)}</span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="py-2 px-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-xs font-bold border border-red-200 dark:border-red-800/40 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                title={currentLang === "fa" ? "خروج از حساب کاربری" : "Logout"}
              >
                <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>{currentLang === "fa" ? "خروج از حساب" : "Logout"}</span>
              </button>
            </div>
          </div>
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
