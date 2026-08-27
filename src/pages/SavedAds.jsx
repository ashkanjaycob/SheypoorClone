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
          <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 sdesktop:grid-cols-6 gap-4">
            {saved.map((post) => {
              const title = translateText(post.options?.title || post.title, currentLang);
              const city = translateCity(post.options?.city || post.city, currentLang);
              const priceInfo = formatAdPrice(post.amount, currentLang);
              const timeLabel = formatTimeAgo(post.createdAt, currentLang);

              return (
                <Link
                  key={post._id || post.id}
                  to={`/dashboard/${post._id || post.id}`}
                  className="block group"
                >
                  <div className="card-sheypoor overflow-hidden flex rtl:flex-row-reverse ltr:flex-row laptop:flex-col h-full relative">
                    {/* Remove Button */}
                    <button
                      onClick={(e) => handleRemove(e, post._id || post.id)}
                      className="absolute top-2 rtl:right-2 ltr:left-2 z-10 w-8 h-8 bg-white/90 dark:bg-night-card/90 dark:border dark:border-night-border backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-accent-red-bg hover:text-accent-red text-dark-3 dark:text-gray-300 transition-all"
                      title="Remove"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    {/* Image */}
                    <div className="relative w-[120px] h-[120px] laptop:w-full laptop:h-auto laptop:aspect-square flex-shrink-0 bg-light-2 dark:bg-night-surface overflow-hidden">
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
                          e.target.src = "https://placehold.co/400x400/F2F2F5/8F90A6?text=No+Photo";
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-grow p-3 flex flex-col justify-between min-w-0 rtl:text-right ltr:text-left">
                      <h5 className="text-body-2 font-medium text-dark-0 dark:text-gray-100 line-clamp-2 mb-2">
                        {title}
                      </h5>
                      <div className="mt-auto space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          {typeof priceInfo === "string" ? (
                            <span className="text-body-2 font-bold text-dark-0 dark:text-white">{priceInfo}</span>
                          ) : (
                            <>
                              <span className="text-body-2 font-bold text-dark-0 dark:text-white">{priceInfo.price}</span>
                              <span className="text-body-4 text-dark-3 dark:text-gray-400">{priceInfo.currency}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-body-4 text-dark-3 dark:text-gray-400">
                          <span>{city}</span>
                          <span className="text-dark-4 dark:text-gray-600">·</span>
                          <span>{timeLabel}</span>
                        </div>
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
