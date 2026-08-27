import { useState, useMemo, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllAds } from "../Services/user";
import { getCategory } from "../Services/Admin";
import { isBookmarked, toggleBookmark } from "../Utils/bookmarks";
import { getSelectedCity, clearSelectedCity, ALL_IRAN } from "../Utils/location";
import { t, getSavedLanguage } from "../Utils/i18n";
import {
  translateText,
  translateCity,
  translateCategory,
  formatAdPrice,
  formatTimeAgo,
} from "../Utils/adTranslator";
import toast, { Toaster } from "react-hot-toast";

function PostCardSkeleton() {
  return (
    <div className="card-sheypoor overflow-hidden flex rtl:flex-row-reverse ltr:flex-row laptop:flex-col h-full">
      <div className="relative w-[120px] h-[120px] laptop:w-full laptop:h-auto laptop:aspect-square flex-shrink-0 bg-light-2 dark:bg-night-surface skeleton" />
      <div className="flex-grow p-3 flex flex-col justify-between min-w-0 space-y-3">
        <div className="space-y-1.5">
          <div className="h-4 skeleton w-full" />
          <div className="h-4 skeleton w-3/4" />
        </div>
        <div className="mt-auto space-y-2 pt-2">
          <div className="h-4 skeleton w-1/2" />
          <div className="h-3 skeleton w-1/3" />
        </div>
      </div>
    </div>
  );
}

function Category() {
  const { id } = useParams();
  const [activeFilter, setActiveFilter] = useState("all");
  const [displayCount, setDisplayCount] = useState(12);
  const [autoScrollCount, setAutoScrollCount] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [savedIds, setSavedIds] = useState({});
  const [selectedCity, setSelectedCityState] = useState(getSelectedCity());
  const [currentLang, setCurrentLang] = useState(getSavedLanguage());

  const sentinelRef = useRef(null);
  const MAX_AUTO_SCROLL = 3;

  // Listen to city and language changes
  useEffect(() => {
    const handleCityChange = (e) => {
      setSelectedCityState(e.detail || getSelectedCity());
      setDisplayCount(12);
      setAutoScrollCount(0);
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

  // 1. Fetch categories
  const { data: categoriesList, isLoading: isCategoriesLoading } = useQuery(
    ["get-categories"],
    getCategory
  );

  // 2. Resolve target category slug and name
  const currentCategory = useMemo(() => {
    if (!categoriesList || !Array.isArray(categoriesList)) return null;
    return categoriesList.find(
      (c) =>
        c.slug === id ||
        String(c.id) === String(id) ||
        String(c._id) === String(id)
    );
  }, [categoriesList, id]);

  const resolvedSlug = currentCategory?.slug || id;
  const rawCategoryTitle = currentCategory?.name?.trim() || "دسته‌بندی";
  const categoryTitle = translateCategory(currentCategory?.slug || rawCategoryTitle, currentLang) || rawCategoryTitle;

  // 3. Fetch ads by resolved category slug
  const { data, isLoading: isAdsLoading } = useQuery(
    ["get-all-ads-category", resolvedSlug],
    () => getAllAds(resolvedSlug),
    {
      enabled: !!resolvedSlug,
    }
  );

  // 4. Client-side city filtering & sorting
  const displayedPosts = useMemo(() => {
    let result = [...(data?.posts || [])];

    // Filter by selected city
    if (selectedCity && selectedCity !== ALL_IRAN) {
      result = result.filter((p) => {
        const city = p.options?.city || p.city || "";
        return city.includes(selectedCity);
      });
    }

    // Filter by type
    if (activeFilter === "photo") {
      result = result.filter((p) => p.images && p.images.length > 0);
    } else if (activeFilter === "cheap") {
      result.sort((a, b) => (Number(a.amount) || 0) - (Number(b.amount) || 0));
    } else if (activeFilter === "expensive") {
      result.sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0));
    }
    return result;
  }, [data?.posts, selectedCity, activeFilter]);

  const hasMore = displayedPosts.length > displayCount;
  const isLoading = isCategoriesLoading || isAdsLoading;
  const isFilteredByCity = selectedCity && selectedCity !== ALL_IRAN;
  const cityTranslatedName = translateCity(selectedCity, currentLang);

  // Hybrid Infinite Scroll: Auto-load for 3 cycles, then button
  useEffect(() => {
    if (autoScrollCount >= MAX_AUTO_SCROLL || !hasMore || isLoadingMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setDisplayCount((prev) => prev + 12);
            setAutoScrollCount((prev) => prev + 1);
            setIsLoadingMore(false);
          }, 450);
        }
      },
      { rootMargin: "300px" }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) observer.unobserve(currentSentinel);
    };
  }, [autoScrollCount, hasMore, isLoadingMore, isLoading]);

  const handleManualLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayCount((prev) => prev + 12);
      setIsLoadingMore(false);
    }, 450);
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

  const filters = [
    { id: "all", label: t("filterAll", {}, currentLang) },
    { id: "photo", label: t("filterPhoto", {}, currentLang) },
    { id: "cheap", label: t("filterCheap", {}, currentLang) },
    { id: "expensive", label: t("filterExpensive", {}, currentLang) },
  ];

  return (
    <div className="min-h-screen bg-light-3 dark:bg-night-bg text-dark-0 dark:text-white transition-colors">
      <div className="max-w-container mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-body-3 text-dark-3 dark:text-gray-400 mb-4 overflow-x-auto scrollbar-hide">
          <Link to="/" className="hover:text-main dark:hover:text-white transition-colors whitespace-nowrap">
            {t("home", {}, currentLang)}
          </Link>
          <svg className="w-4 h-4 text-dark-4 dark:text-gray-600 flex-shrink-0 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-dark-3 dark:text-gray-400 whitespace-nowrap">{t("categories", {}, currentLang)}</span>
          <svg className="w-4 h-4 text-dark-4 dark:text-gray-600 flex-shrink-0 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-dark-0 dark:text-white font-medium whitespace-nowrap">{categoryTitle}</span>
        </nav>

        {/* City Filter Active Banner */}
        {isFilteredByCity && (
          <div className="mb-4 p-3.5 bg-light-special dark:bg-night-surface border border-main/30 dark:border-night-border rounded-sheypoor-lg flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2 text-body-2 text-dark-1 dark:text-gray-200">
              <svg className="w-5 h-5 text-main dark:text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span>
                {currentLang === "fa"
                  ? `در حال نمایش آگهی‌های ${categoryTitle} در شهر: ${cityTranslatedName} (${displayedPosts.length} آگهی)`
                  : `Showing ${categoryTitle} listings for: ${cityTranslatedName} (${displayedPosts.length})`}
              </span>
            </div>
            <button
              onClick={clearSelectedCity}
              className="text-body-3 text-accent-red hover:text-red-700 dark:hover:text-red-400 font-medium flex items-center gap-1"
            >
              <span>{t("clearCityFilter", {}, currentLang)}</span>
              <span>✕</span>
            </button>
          </div>
        )}

        {/* Title Header */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-light-2 dark:bg-white/10 border border-transparent dark:border-white/15 flex items-center justify-center shadow-sm">
              <img
                className="w-5 h-5 object-contain dark:brightness-0 dark:invert transition-all"
                src={`/${currentCategory?.icon || "sheypoorBlack"}.svg`}
                alt=""
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/sheypoorBlack.svg";
                }}
              />
            </div>
            <h1 className="text-heading-4 text-dark-0 dark:text-white font-bold">
              {currentLang === "fa" ? (
                <>
                  آگهی‌های <span className="text-main dark:text-white underline">{categoryTitle}</span>
                  {isFilteredByCity && <span className="text-dark-2 dark:text-gray-300 text-heading-5"> در {cityTranslatedName}</span>}
                </>
              ) : (
                <>
                  <span className="text-main dark:text-white">{categoryTitle}</span> Classifieds
                  {isFilteredByCity && <span className="text-dark-2 dark:text-gray-300 text-heading-5"> in {cityTranslatedName}</span>}
                </>
              )}
            </h1>
          </div>
          {!isLoading && (
            <span className="text-body-3 text-dark-3 dark:text-gray-400">
              {currentLang === "fa"
                ? `${displayedPosts.length} آگهی`
                : `${displayedPosts.length} listings`}
            </span>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`flex-shrink-0 ${
                activeFilter === f.id ? "chip-active" : "chip"
              }`}
            >
              {f.label}
            </button>
          ))}

          {/* Quick link to Saved */}
          <Link to="/saved" className="chip flex-shrink-0 !gap-1 rtl:mr-auto ltr:ml-auto hover:text-main dark:hover:text-white">
            <svg className="w-4 h-4 text-main dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span>{t("savedAds", {}, currentLang)}</span>
          </Link>
        </div>

        {/* SKELETON LOADING ON INITIAL LOAD */}
        {isLoading ? (
          <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 sdesktop:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        ) : displayedPosts.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center bg-white dark:bg-night-card rounded-sheypoor-xl border border-light-0 dark:border-night-border">
            <svg className="h-16 w-16 text-dark-4 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-heading-4 text-dark-2 dark:text-gray-200 mb-2">
              {isFilteredByCity
                ? (currentLang === "fa"
                    ? `در دسته‌بندی ${categoryTitle} برای شهر «${cityTranslatedName}» آگهی‌ای یافت نشد.`
                    : `No ${categoryTitle} listings found for «${cityTranslatedName}».`)
                : (currentLang === "fa"
                    ? `هنوز آگهی‌ای در این دسته‌بندی ثبت نشده است.`
                    : `No listings have been posted in this category yet.`)}
            </h3>
            <p className="text-body-2 text-dark-3 dark:text-gray-400 mb-6">
              {isFilteredByCity
                ? (currentLang === "fa"
                    ? "می‌توانید آگهی‌های این دسته در کل کشور را مشاهده فرمایید."
                    : "You can view listings for all regions.")
                : (currentLang === "fa"
                    ? "اولین نفری باشید که در این دسته آگهی ثبت می‌کند!"
                    : "Be the first to post a free listing here!")}
            </p>
            {isFilteredByCity ? (
              <button onClick={clearSelectedCity} className="btn-primary">
                {t("viewAllIranAds", {}, currentLang)}
              </button>
            ) : (
              <Link to="/dashboard" className="btn-primary">
                + {t("postAd", {}, currentLang)}
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 sdesktop:grid-cols-6 gap-4">
              {displayedPosts.slice(0, displayCount).map((post) => {
                const postId = post._id || post.id;
                const bookmarked = savedIds[postId] !== undefined ? savedIds[postId] : isBookmarked(postId);
                const title = translateText(post.options?.title || post.title, currentLang);
                const rawCity = post.options?.city || post.city || "";
                const city = translateCity(rawCity, currentLang);
                const priceInfo = formatAdPrice(post.amount, currentLang);
                const timeLabel = formatTimeAgo(post.createdAt, currentLang);

                return (
                  <Link
                    key={postId}
                    to={`/dashboard/${postId}`}
                    className="block group"
                  >
                    <div className="card-sheypoor overflow-hidden flex rtl:flex-row-reverse ltr:flex-row laptop:flex-col h-full relative">
                      {/* Bookmark Icon Button */}
                      <button
                        onClick={(e) => handleBookmarkToggle(e, post)}
                        className={`absolute top-2 rtl:left-2 ltr:right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          bookmarked
                            ? "bg-main text-white shadow-md"
                            : "bg-white/80 dark:bg-night-card/80 backdrop-blur-sm text-dark-3 dark:text-gray-300 hover:text-main dark:hover:text-white hover:bg-white dark:hover:bg-night-border"
                        }`}
                        title={bookmarked ? t("adUnsaved", {}, currentLang) : t("adSaved", {}, currentLang)}
                      >
                        <svg className="w-4 h-4" fill={bookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
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
                        {post.images?.length > 1 && (
                          <div className="absolute bottom-2 rtl:left-2 ltr:right-2 bg-dark-1/70 dark:bg-night-bg/80 backdrop-blur-sm text-white text-body-4 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{post.images.length}</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-grow p-3 flex flex-col justify-between min-w-0 rtl:text-right ltr:text-left">
                        <h5 className="text-body-2 font-medium text-dark-0 dark:text-gray-100 line-clamp-2 mb-2 leading-relaxed">
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
                            <span className={isFilteredByCity && rawCity.includes(selectedCity) ? "text-main dark:text-white font-semibold" : ""}>
                              {city}
                            </span>
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

            {/* Skeletons while auto-scrolling */}
            {isLoadingMore && autoScrollCount < MAX_AUTO_SCROLL && (
              <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 sdesktop:grid-cols-6 gap-4 mt-4 animate-fade-in">
                {Array.from({ length: 6 }).map((_, i) => (
                  <PostCardSkeleton key={`cat-skel-${i}`} />
                ))}
              </div>
            )}

            {/* Sentinel for auto-scroll */}
            {autoScrollCount < MAX_AUTO_SCROLL && hasMore && (
              <div ref={sentinelRef} className="h-10 w-full flex items-center justify-center my-4" />
            )}

            {/* Manual button on cycle 4+ */}
            {autoScrollCount >= MAX_AUTO_SCROLL && hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleManualLoadMore}
                  disabled={isLoadingMore}
                  className="btn-outline text-body-2 min-w-[200px] flex items-center justify-center gap-2"
                >
                  {isLoadingMore ? (
                    <>
                      <svg className="animate-spin w-5 h-5 text-main dark:text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>{t("loadingMore", {}, currentLang)}</span>
                    </>
                  ) : (
                    <span>
                      {t(
                        "loadMoreRemaining",
                        { count: displayedPosts.length - displayCount },
                        currentLang
                      )}
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* End of list */}
            {!hasMore && displayedPosts.length > 12 && (
              <div className="text-center mt-10 py-4 text-body-3 text-dark-3 dark:text-gray-400 border-t border-light-0 dark:border-night-border">
                ✨ {t("allAdsLoaded", { count: displayedPosts.length }, currentLang)}
              </div>
            )}
          </>
        )}
      </div>
      <Toaster />
    </div>
  );
}

export default Category;
