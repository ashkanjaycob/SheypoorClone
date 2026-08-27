/* eslint-disable react/prop-types */
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllAds } from "../../Services/user";
import { isBookmarked, toggleBookmark } from "../../Utils/bookmarks";
import { t, getSavedLanguage, isRtl } from "../../Utils/i18n";
import { translateText, translateCity, formatAdPrice } from "../../Utils/adTranslator";
import toast from "react-hot-toast";

function ShowcaseSection({ className = "" }) {
  const scrollRef = useRef(null);
  const { data, isLoading } = useQuery(["get-all-ads"], () => getAllAds());
  const [savedIds, setSavedIds] = useState({});
  const [currentLang, setCurrentLang] = useState(getSavedLanguage());

  useEffect(() => {
    const handleLangChange = (e) => setCurrentLang(e.detail || getSavedLanguage());
    window.addEventListener("sheypoor_lang_changed", handleLangChange);
    return () => window.removeEventListener("sheypoor_lang_changed", handleLangChange);
  }, []);

  // Filter ads with photos for the showcase, or fallback to first items
  const showcaseAds = (data?.posts || [])
    .filter((p) => p.images && p.images.length > 0)
    .slice(0, 10);

  // If not enough with images, take first items
  const finalAds = showcaseAds.length >= 3 ? showcaseAds : (data?.posts || []).slice(0, 8);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const isRTL = isRtl(currentLang);
      let scrollAmount = 340;
      if (direction === "left") {
        scrollAmount = isRTL ? -340 : 340;
      } else {
        scrollAmount = isRTL ? 340 : -340;
      }
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleBookmarkToggle = (e, post) => {
    e.preventDefault();
    e.stopPropagation();
    const isNowSaved = toggleBookmark(post);
    setSavedIds((prev) => ({ ...prev, [post._id || post.id]: isNowSaved }));
    toast.success(
      isNowSaved ? t("adSaved", {}, currentLang) : t("adUnsaved", {}, currentLang)
    );
  };

  if (!isLoading && finalAds.length === 0) return null;

  return (
    <div className={`my-8 ${className}`}>
      <div className="bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#1E40AF] dark:from-[#151C2C] dark:via-[#1B2438] dark:to-[#141A28] dark:border dark:border-[#2A374F] rounded-2xl laptop:rounded-3xl p-5 laptop:p-7 text-white shadow-xl relative overflow-hidden transition-colors">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <h3 className="text-heading-4 laptop:text-heading-3 font-bold text-white">
                {t("nationwideShowcase", {}, currentLang)}
              </h3>
            </div>
            <p className="text-blue-100 dark:text-gray-300 text-body-3 mt-1">
              {t("nationwideShowcaseSubtitle", {}, currentLang)}
            </p>
          </div>

          <a
            href="#more-ads-section"
            className="px-4 py-1.5 rounded-full border border-white/40 text-white hover:bg-white hover:text-black text-body-3 font-medium transition-all"
          >
            {t("viewAll", {}, currentLang)}
          </a>
        </div>

        {/* Carousel Container */}
        <div className="relative group/carousel">
          {/* Scroll Backward (Right in RTL, Left in LTR) */}
          <button
            onClick={() => scroll("right")}
            className="absolute rtl:-right-3 ltr:-left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white text-dark-1 dark:bg-night-card dark:text-white rounded-full shadow-lg flex items-center justify-center hover:bg-light-1 hover:scale-110 active:scale-95 transition-all opacity-90 hover:opacity-100"
            aria-label="Previous"
          >
            <svg className={`w-5 h-5 ${!isRtl(currentLang) ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Scroll Forward (Left in RTL, Right in LTR) */}
          <button
            onClick={() => scroll("left")}
            className="absolute rtl:-left-3 ltr:-right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white text-dark-1 dark:bg-night-card dark:text-white rounded-full shadow-lg flex items-center justify-center hover:bg-light-1 hover:scale-110 active:scale-95 transition-all opacity-90 hover:opacity-100"
            aria-label="Next"
          >
            <svg className={`w-5 h-5 ${isRtl(currentLang) ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Cards Row */}
          <div
            ref={scrollRef}
            className="flex items-stretch gap-3.5 overflow-x-auto scrollbar-hide scroll-smooth py-1 px-1"
          >
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-[290px] tablet:w-[330px] h-[120px] bg-[#1A1E36] dark:bg-night-surface rounded-xl flex rtl:flex-row-reverse ltr:flex-row border border-white/10 overflow-hidden flex-shrink-0 animate-pulse"
                >
                  <div className="w-[115px] tablet:w-[130px] h-full bg-[#131628] dark:bg-night-card" />
                  <div className="flex-grow p-3 flex flex-col justify-between space-y-2">
                    <div className="space-y-1.5">
                      <div className="h-3.5 bg-white/20 rounded w-full" />
                      <div className="h-3 bg-white/10 rounded w-2/3" />
                    </div>
                    <div className="space-y-1 mt-auto">
                      <div className="h-3.5 bg-white/25 rounded w-1/2" />
                      <div className="h-2.5 bg-white/10 rounded w-1/3" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              finalAds.map((post) => {
                const postId = post._id || post.id;
                const bookmarked =
                  savedIds[postId] !== undefined ? savedIds[postId] : isBookmarked(postId);

                const title = translateText(post.options?.title || post.title, currentLang);
                const city = translateCity(post.options?.city || post.city, currentLang);
                const priceInfo = formatAdPrice(post.amount, currentLang);

                return (
                  <Link
                    key={postId}
                    to={`/dashboard/${postId}`}
                    className="w-[290px] tablet:w-[330px] flex-shrink-0 bg-[#1A1E36] dark:bg-[#1E273A] hover:bg-[#202542] dark:hover:bg-[#253046] rounded-xl overflow-hidden border border-white/10 dark:border-white/15 hover:border-white/25 transition-all duration-200 group flex rtl:flex-row-reverse ltr:flex-row shadow-md"
                  >
                    {/* Image Column */}
                    <div className="relative w-[115px] tablet:w-[130px] flex-shrink-0 bg-[#0F1222] dark:bg-[#141A28] overflow-hidden">
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
                          e.target.src = "https://placehold.co/400x400/1A1E36/FFFFFF?text=Photo";
                        }}
                      />

                      {/* Bookmark Icon */}
                      <button
                        onClick={(e) => handleBookmarkToggle(e, post)}
                        className={`absolute top-1.5 rtl:left-1.5 ltr:right-1.5 z-10 w-7 h-7 rounded-md flex items-center justify-center transition-all ${
                          bookmarked
                            ? "bg-main text-white"
                            : "bg-dark-0/60 backdrop-blur-sm text-white/80 hover:text-white"
                        }`}
                        title={bookmarked ? "Remove bookmark" : "Save listing"}
                      >
                        <svg
                          className="w-4 h-4"
                          fill={bookmarked ? "currentColor" : "none"}
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                          />
                        </svg>
                      </button>

                      {/* Photo Count Badge */}
                      {post.images && post.images.length > 0 && (
                        <div className="absolute bottom-1.5 rtl:left-1.5 ltr:right-1.5 bg-dark-0/80 backdrop-blur-sm text-white text-[11px] px-1.5 py-0.5 rounded flex items-center gap-1 font-mono">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>{post.images.length}</span>
                        </div>
                      )}

                      {/* Featured Badge */}
                      <div className="absolute top-1.5 rtl:right-1.5 ltr:left-1.5 bg-accent-orange text-white text-[10px] font-semibold px-1.5 py-0.5 rounded shadow-xs">
                        {t("featuredBadge", {}, currentLang)}
                      </div>
                    </div>

                    {/* Content Column */}
                    <div className="flex-grow p-3 flex flex-col justify-between min-w-0 rtl:text-right ltr:text-left">
                      <h4 className="text-body-2 font-medium text-white line-clamp-2 leading-snug group-hover:text-blue-200 transition-colors">
                        {title}
                      </h4>

                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-1">
                          {typeof priceInfo === "string" ? (
                            <span className="text-body-2 font-bold text-white">{priceInfo}</span>
                          ) : (
                            <>
                              <span className="text-body-2 font-bold text-white">{priceInfo.price}</span>
                              <span className="text-body-4 text-blue-200 dark:text-gray-300">{priceInfo.currency}</span>
                            </>
                          )}
                        </div>

                        <div className="text-body-4 text-gray-400 line-clamp-1">
                          {city}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowcaseSection;
