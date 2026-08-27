import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBookmarks, removeBookmark, clearBookmarks } from "../Utils/bookmarks";
import { t, getSavedLanguage } from "../Utils/i18n";
import {
  translateText,
  translateCity,
  formatAdPrice,
  formatTimeAgo,
} from "../Utils/adTranslator";

function SavedAds() {
  const [saved, setSaved] = useState([]);
  const [currentLang, setCurrentLang] = useState(getSavedLanguage());

  const reload = () => setSaved(getBookmarks());

  useEffect(() => {
    reload();
    const handleBookmarkUpdate = () => reload();
    const handleLangChange = (e) => setCurrentLang(e.detail || getSavedLanguage());

    window.addEventListener("sheypoor_bookmarks_updated", handleBookmarkUpdate);
    window.addEventListener("sheypoor_lang_changed", handleLangChange);

    return () => {
      window.removeEventListener("sheypoor_bookmarks_updated", handleBookmarkUpdate);
      window.removeEventListener("sheypoor_lang_changed", handleLangChange);
    };
  }, []);

  const handleRemove = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    removeBookmark(id);
  };

  const handleClearAll = () => {
    if (saved.length === 0) return;
    clearBookmarks();
  };

  return (
    <div className="min-h-screen bg-light-3 dark:bg-night-bg text-dark-0 dark:text-white transition-colors">
      <div className="max-w-container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-body-3 text-dark-3 dark:text-gray-400 mb-5">
          <Link to="/" className="hover:text-main dark:hover:text-white transition-colors">
            {t("home", {}, currentLang)}
          </Link>
          <svg className="w-4 h-4 text-dark-4 dark:text-gray-600 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-dark-0 dark:text-white font-medium">{t("savedAds", {}, currentLang)}</span>
        </nav>

        {/* Title + Clear */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-main dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <h1 className="text-heading-4 text-dark-0 dark:text-white font-bold">{t("savedAdsTitle", {}, currentLang)}</h1>
            {saved.length > 0 && (
              <span className="text-body-3 text-dark-3 dark:text-gray-400">
                ({currentLang === "fa" ? `${saved.length} آگهی` : `${saved.length} listings`})
              </span>
            )}
          </div>
          {saved.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-body-3 text-accent-red hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium"
            >
              {currentLang === "fa" ? "حذف همه" : currentLang === "de" ? "Alle löschen" : "Clear All"}
            </button>
          )}
        </div>

        {/* Empty State */}
        {saved.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center bg-white dark:bg-night-card rounded-sheypoor-xl border-2 border-dashed border-light-0 dark:border-night-border text-center p-4">
            <svg className="h-20 w-20 text-dark-4 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <h3 className="text-heading-4 text-dark-2 dark:text-gray-200 mb-2">{t("savedAdsEmpty", {}, currentLang)}</h3>
            <p className="text-body-2 text-dark-3 dark:text-gray-400 mb-6 max-w-md">
              {t("savedAdsEmptyDesc", {}, currentLang)}
            </p>
            <Link to="/" className="btn-primary">
              {t("browseAdsBtn", {}, currentLang)}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 tablet:grid-cols-3 laptop:grid-cols-4 desktop:grid-cols-5 sdesktop:grid-cols-6 gap-4">
            {saved.map((post) => {
              const postId = post._id || post.id;
              const rawTitle = post.options?.title || post.title || "";
              const title = translateText(rawTitle, currentLang) || rawTitle;
              const rawCity = post.options?.city || post.city || "";
              const city = translateCity(rawCity, currentLang) || rawCity || (currentLang === "fa" ? "ایران" : "Iran");
              const priceInfo = formatAdPrice(post.amount || post.options?.price || post.options?.amount, currentLang);
              const timeLabel = formatTimeAgo(post.createdAt || post.options?.createdAt, currentLang);
              const imagesCount = post.images?.length || 0;

              return (
                <Link
                  key={postId}
                  to={`/dashboard/${postId}`}
                  className="block group select-none"
                >
                  <div className="flex flex-col h-full">
                    {/* 1. Thumbnail Image */}
                    <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-light-2 dark:bg-night-surface border border-light-0/60 dark:border-night-border/80 group-hover:border-main/40 dark:group-hover:border-white/30 transition-all duration-200 shadow-xs">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        src={
                          post.images?.[0]?.startsWith("http")
                            ? post.images[0]
                            : `${import.meta.env.VITE_BASE_URL}${post.images?.[0] || ""}`
                        }
                        alt={title}
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/400x400/171D2A/94A3B8?text=Photo";
                        }}
                      />

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={(e) => handleRemove(e, postId)}
                        className="absolute top-2.5 rtl:left-2.5 ltr:right-2.5 z-10 w-8 h-8 bg-dark-0/70 hover:bg-accent-red text-white backdrop-blur-sm rounded-lg flex items-center justify-center transition-all shadow-sm"
                        title="Remove"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>

                      {/* Photo Count */}
                      {imagesCount > 0 && (
                        <div className="absolute bottom-2.5 rtl:left-2.5 ltr:right-2.5 bg-dark-0/70 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-md flex items-center gap-1 font-mono">
                          <span>{imagesCount}</span>
                          <svg className="w-3.5 h-3.5 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* 2. Text Info Directly Below Image */}
                    <div className="pt-2 px-0.5 flex flex-col flex-grow rtl:text-right ltr:text-left">
                      <h4 className="text-[14px] font-semibold text-dark-0 dark:text-white line-clamp-1 leading-snug group-hover:text-main dark:group-hover:text-main-lighter transition-colors">
                        {title}
                      </h4>
                      <div className="text-[14px] font-bold text-dark-0 dark:text-white mt-1">
                        {typeof priceInfo === "string" ? (
                          <span>{priceInfo}</span>
                        ) : (
                          <span>
                            {priceInfo.price}{" "}
                            <span className="text-[12px] font-normal text-dark-3 dark:text-gray-400">
                              {priceInfo.currency}
                            </span>
                          </span>
                        )}
                      </div>
                      <div className="text-[12px] text-dark-3 dark:text-gray-400 mt-1 flex items-center justify-between gap-1">
                        <span className="truncate">{city}</span>
                        {timeLabel && (
                          <span className="flex-shrink-0 text-dark-3 dark:text-gray-400 text-[11px]">
                            {timeLabel}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedAds;
