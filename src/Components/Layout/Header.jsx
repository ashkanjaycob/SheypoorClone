import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllAds, getProfile } from "../../Services/user";
import { delCookie } from "../../Utils/cookie";
import { getSelectedCity, ALL_IRAN } from "../../Utils/location";
import { t, getSavedLanguage } from "../../Utils/i18n";
import { translateCity, translateText } from "../../Utils/adTranslator";
import navLogo from "../../assets/LogosSheypoor/sheypoor-Logo.png";
import MobileBottomNav from "./MobileBottomNav";
import ComingSoonModal, { useComingSoon } from "./ComingSoonModal";
import LocationModal from "./LocationModal";
import ThemeLanguageToggle from "./ThemeLanguageToggle";

function Header() {
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedCity, setSelectedCityState] = useState(getSelectedCity());
  const [currentLang, setCurrentLang] = useState(getSavedLanguage());

  const comingSoon = useComingSoon();

  const { data: profileData } = useQuery(["profile"], getProfile);
  const { data: adsData } = useQuery(["get-all-ads"], () => getAllAds());

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Listen to city and language change events
  useEffect(() => {
    const handleCityChange = (e) => {
      setSelectedCityState(e.detail || getSelectedCity());
    };
    const handleLangChange = (e) => {
      setCurrentLang(e.detail || getSavedLanguage());
    };

    window.addEventListener("sheypoor_city_changed", handleCityChange);
    window.addEventListener("sheypoor_lang_changed", handleLangChange);

    return () => {
      window.removeEventListener("sheypoor_city_changed", handleCityChange);
      window.removeEventListener("sheypoor_lang_changed", handleLangChange);
    };
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim() || !adsData?.posts) {
      setSearchResults([]);
      return;
    }
    const filtered = adsData.posts.filter((p) => {
      const title = (p.options?.title || p.title || "").toLowerCase();
      const translatedTitle = translateText(title, currentLang).toLowerCase();
      const matchText = title.includes(query.toLowerCase()) || translatedTitle.includes(query.toLowerCase());
      const matchCity =
        selectedCity === ALL_IRAN ||
        (p.options?.city || p.city || "").includes(selectedCity);
      return matchText && matchCity;
    });
    setSearchResults(filtered.slice(0, 8));
  };

  const handleLogout = () => {
    delCookie("accessToken");
    delCookie("refreshToken");
    window.location.href = "/";
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest(".user-menu-container")) setShowUserMenu(false);
      if (!e.target.closest(".search-container")) {
        setSearchResults([]);
        if (isMobile) setShowSearch(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [isMobile]);

  const isFilteredByCity = selectedCity && selectedCity !== ALL_IRAN;
  const displayCityLabel = isFilteredByCity
    ? translateCity(selectedCity, currentLang)
    : t("allIran", {}, currentLang);

  const searchPlaceholder = isFilteredByCity
    ? t("searchInCityPlaceholder", { city: displayCityLabel }, currentLang)
    : t("searchPlaceholder", {}, currentLang);

  return (
    <>
      {/* ===== DESKTOP / MAIN HEADER ===== */}
      <header className="fixed top-0 left-0 w-full bg-white dark:bg-night-surface border-b border-light-0 dark:border-night-border z-50 shadow-header dark:shadow-header-dark transition-colors">
        <div className="max-w-container mx-auto px-4">
          <div className="flex items-center justify-between h-header-mobile laptop:h-header-desktop gap-3">
            
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <img
                className="w-[100px] laptop:w-[120px] cursor-pointer dark:brightness-0 dark:invert transition-all"
                src={navLogo}
                alt={t("appName", {}, currentLang)}
              />
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden laptop:flex flex-grow max-w-[520px] search-container relative">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="input-sheypoor rtl:pr-12 rtl:pl-36 ltr:pl-12 ltr:pr-36 !rounded-full text-body-2"
                />
                {/* Search Icon */}
                <svg
                  className="absolute rtl:right-4 ltr:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-3 dark:text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>

                {/* Location Trigger Pill Button */}
                <button
                  type="button"
                  onClick={() => setShowLocationModal(true)}
                  className={`absolute rtl:left-1.5 ltr:right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1 px-3 py-1.5 text-body-3 rounded-full transition-all ${
                    isFilteredByCity
                      ? "bg-light-special dark:bg-white/10 text-main dark:text-white font-semibold border border-main/30 dark:border-white/30"
                      : "bg-light-2 dark:bg-night-card text-dark-2 dark:text-gray-300 hover:bg-light-1 dark:hover:bg-night-border"
                  }`}
                  title={t("selectCity", {}, currentLang)}
                >
                  <svg
                    className={`w-4 h-4 ${isFilteredByCity ? "text-main dark:text-white" : "text-dark-3 dark:text-gray-400"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="line-clamp-1 max-w-[90px]">{displayCityLabel}</span>
                </button>
              </div>

              {/* Search Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-night-card rounded-sheypoor-lg shadow-modal dark:shadow-modal-dark border border-light-0 dark:border-night-border overflow-hidden z-50 animate-fade-in">
                  {searchResults.map((result) => {
                    const title = translateText(result.options?.title || result.title, currentLang);
                    const city = translateCity(result.options?.city || result.city, currentLang);
                    return (
                      <Link
                        key={result._id || result.id}
                        to={`/dashboard/${result._id || result.id}`}
                        onClick={() => { setSearchQuery(""); setSearchResults([]); }}
                        className="flex items-center justify-between px-4 py-3 hover:bg-light-3 dark:hover:bg-night-surface transition-colors border-b border-light-1 dark:border-night-border last:border-0"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <svg className="w-4 h-4 text-dark-3 dark:text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <span className="text-body-2 text-dark-1 dark:text-gray-100 line-clamp-1">{title}</span>
                        </div>
                        <span className="text-body-4 text-dark-3 dark:text-gray-400 flex-shrink-0 rtl:mr-2 ltr:ml-2">{city}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mobile Header Actions (Location, Search, Theme/Lang) */}
            {isMobile && (
              <div className="flex items-center gap-1.5">
                <ThemeLanguageToggle compact={true} />

                <button
                  onClick={() => setShowLocationModal(true)}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-full transition-colors ${
                    isFilteredByCity
                      ? "bg-light-special dark:bg-white/10 text-main dark:text-white font-semibold border border-main/30"
                      : "bg-light-2 dark:bg-night-card text-dark-2 dark:text-gray-300"
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span className="line-clamp-1 max-w-[65px]">{displayCityLabel}</span>
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); setShowSearch(!showSearch); }}
                  className="p-1.5 rounded-full hover:bg-light-2 dark:hover:bg-night-card text-dark-2 dark:text-gray-300 transition-colors"
                  aria-label="Search"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            )}

            {/* Desktop Nav Actions */}
            <div className="hidden laptop:flex items-center gap-2">
              {/* Theme & Language Selector */}
              <ThemeLanguageToggle />

              {/* Bookmarks */}
              <Link to="/saved" className="btn-ghost flex items-center gap-1.5 text-body-3">
                <svg className="w-5 h-5 text-dark-2 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span>{t("savedAds", {}, currentLang)}</span>
              </Link>

              {/* Chat / Messages */}
              <button
                type="button"
                onClick={comingSoon.open}
                className="btn-ghost flex items-center gap-1.5 text-body-3"
              >
                <svg className="w-5 h-5 text-dark-2 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{t("messages", {}, currentLang)}</span>
              </button>

              {/* User Account Dropdown */}
              <div className="relative user-menu-container">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowUserMenu(!showUserMenu); }}
                  className="btn-ghost flex items-center gap-1.5 text-body-3"
                >
                  <svg className="w-5 h-5 text-dark-2 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{t("myAccount", {}, currentLang)}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute rtl:left-0 ltr:right-0 top-full mt-2 w-52 bg-white dark:bg-night-card rounded-sheypoor shadow-modal dark:shadow-modal-dark border border-light-0 dark:border-night-border py-1 z-50 animate-fade-in">
                    {profileData ? (
                      <>
                        <div className="px-4 py-2 border-b border-light-1 dark:border-night-border">
                          <span className="text-body-4 text-dark-3 dark:text-gray-400 block">{t("myAccount", {}, currentLang)}</span>
                          <span className="text-body-3 font-semibold text-dark-1 dark:text-white" dir="ltr">{profileData.mobile}</span>
                        </div>
                        <Link to="/dashboard" className="block px-4 py-2.5 text-body-2 text-dark-1 dark:text-gray-200 hover:bg-light-3 dark:hover:bg-night-surface transition-colors">
                          {t("myAds", {}, currentLang)}
                        </Link>
                        <Link to="/saved" className="block px-4 py-2.5 text-body-2 text-dark-1 dark:text-gray-200 hover:bg-light-3 dark:hover:bg-night-surface transition-colors">
                          {t("savedAdsTitle", {}, currentLang)}
                        </Link>
                        {profileData.role === "ADMIN" && (
                          <Link to="/admin" className="block px-4 py-2.5 text-body-2 text-main dark:text-white font-medium hover:bg-light-special dark:hover:bg-night-surface transition-colors">
                            {t("adminPanel", {}, currentLang)}
                          </Link>
                        )}
                        <div className="border-t border-light-1 dark:border-night-border my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="block w-full rtl:text-right ltr:text-left px-4 py-2.5 text-body-2 text-accent-red hover:bg-accent-red-bg dark:hover:bg-red-950/40 transition-colors"
                        >
                          {t("logout", {}, currentLang)}
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/auth" className="block px-4 py-2.5 text-body-2 text-main dark:text-white font-medium hover:bg-light-special dark:hover:bg-night-surface transition-colors">
                          {t("login", {}, currentLang)}
                        </Link>
                        <Link to="/saved" className="block px-4 py-2.5 text-body-2 text-dark-1 dark:text-gray-200 hover:bg-light-3 dark:hover:bg-night-surface transition-colors">
                          {t("savedAdsTitle", {}, currentLang)}
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Post Ad CTA */}
              <Link to="/dashboard" className="rtl:mr-1 ltr:ml-1">
                <button className="btn-primary !h-10 !py-2 !px-5 text-body-3 flex items-center gap-1.5">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>{t("postAd", {}, currentLang)}</span>
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Search Expanded */}
        {isMobile && showSearch && (
          <div className="search-container px-4 pb-3 bg-white dark:bg-night-surface border-t border-light-1 dark:border-night-border animate-slide-up">
            <div className="relative">
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="input-sheypoor rtl:pr-10 rtl:pl-28 ltr:pl-10 ltr:pr-28 !rounded-full text-body-2"
                autoFocus
              />
              <svg className="absolute rtl:right-3 ltr:left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-3 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>

              {/* Mobile Location trigger inside expanded search */}
              <button
                type="button"
                onClick={() => setShowLocationModal(true)}
                className={`absolute rtl:left-1 ltr:right-1 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2.5 py-1 text-xs rounded-full ${
                  isFilteredByCity
                    ? "bg-light-special dark:bg-white/10 text-main dark:text-white font-semibold border border-main/30"
                    : "bg-light-2 dark:bg-night-card text-dark-2 dark:text-gray-300"
                }`}
              >
                <span>{displayCityLabel}</span>
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="mt-2 bg-white dark:bg-night-card rounded-sheypoor shadow-modal dark:shadow-modal-dark border border-light-0 dark:border-night-border overflow-hidden animate-fade-in max-h-60 overflow-y-auto">
                {searchResults.map((result) => {
                  const title = translateText(result.options?.title || result.title, currentLang);
                  const city = translateCity(result.options?.city || result.city, currentLang);
                  return (
                    <Link
                      key={result._id || result.id}
                      to={`/dashboard/${result._id || result.id}`}
                      onClick={() => { setSearchQuery(""); setSearchResults([]); setShowSearch(false); }}
                      className="flex items-center justify-between px-4 py-3 hover:bg-light-3 dark:hover:bg-night-surface transition-colors border-b border-light-1 dark:border-night-border last:border-0"
                    >
                      <span className="text-body-2 text-dark-1 dark:text-gray-100 line-clamp-1">{title}</span>
                      <span className="text-body-4 text-dark-3 dark:text-gray-400 flex-shrink-0 rtl:mr-2 ltr:ml-2">{city}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </header>

      {/* Mobile Bottom Nav */}
      {isMobile && <MobileBottomNav profileData={profileData} onOpenMessages={comingSoon.open} />}

      {/* Coming Soon Dialog */}
      <ComingSoonModal isOpen={comingSoon.isOpen} onClose={comingSoon.close} />

      {/* Location Modal */}
      <LocationModal isOpen={showLocationModal} onClose={() => setShowLocationModal(false)} />
    </>
  );
}

export default Header;
