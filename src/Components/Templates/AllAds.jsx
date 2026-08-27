/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getAllAds, delmySpecificAd } from "../../Services/user";
import { isBookmarked, toggleBookmark } from "../../Utils/bookmarks";
import { getSelectedCity, clearSelectedCity, ALL_IRAN } from "../../Utils/location";
import { t, getSavedLanguage } from "../../Utils/i18n";
import {
  translateText,
  translateCity,
  translateCategory,
  formatAdPrice,
  formatTimeAgo,
} from "../../Utils/adTranslator";
import DeleteAdModal from "./DeleteAdModal";
import ShowcaseSection from "./ShowcaseSection";
import toast, { Toaster } from "react-hot-toast";
import PropTypes from "prop-types";

/**
 * Fisher-Yates array shuffle for randomizing posts across categories
 */
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Standard PostCard Component
 */
function PostCard({
  post,
  bookmarked,
  onBookmarkToggle,
  isAdmin,
  onOpenDeleteModal,
  isFilteredByCity,
  selectedCity,
  currentLang,
}) {
  const postId = post._id || post.id;
  const rawTitle = post.options?.title || post.title || "";
  const title = translateText(rawTitle, currentLang);
  const rawCity = post.options?.city || post.city || "";
  const city = translateCity(rawCity, currentLang);
  const rawCat = post.categoryName?.trim();
  const categoryBadge = rawCat ? translateCategory(rawCat, currentLang) : "";
  const priceInfo = formatAdPrice(post.amount, currentLang);
  const timeLabel = formatTimeAgo(post.createdAt, currentLang);

  return (
    <Link to={`/dashboard/${postId}`} className="block group">
      <div className="card-sheypoor overflow-hidden flex rtl:flex-row-reverse ltr:flex-row laptop:flex-col h-full relative">
        {/* Bookmark Icon Button */}
        <button
          onClick={(e) => onBookmarkToggle(e, post)}
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

          {/* Photo count badge */}
          {post.images && post.images.length > 1 && (
            <div className="absolute bottom-2 rtl:left-2 ltr:right-2 bg-dark-0/70 dark:bg-night-bg/80 backdrop-blur-sm text-white text-body-4 px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{post.images.length}</span>
            </div>
          )}

          {/* Category tag badge */}
          {categoryBadge && (
            <div className="absolute top-2 rtl:right-2 ltr:left-2 bg-white/90 dark:bg-night-surface/90 dark:border dark:border-night-border backdrop-blur-sm text-dark-1 dark:text-gray-200 text-[11px] font-medium px-2 py-0.5 rounded-full shadow-xs">
              {categoryBadge}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-grow p-3 flex flex-col justify-between min-w-0 rtl:text-right ltr:text-left">
          <h5 className="text-body-2 font-medium text-dark-0 dark:text-gray-100 line-clamp-2 mb-2 leading-relaxed">
            {title}
          </h5>
          <div className="mt-auto space-y-1.5">
            {/* Price */}
            <div className="flex items-center gap-1.5">
              {typeof priceInfo === "string" ? (
                <span className="text-body-2 font-bold text-dark-0 dark:text-white">{priceInfo}</span>
              ) : (
                <>
                  <span className="text-body-2 font-bold text-dark-0 dark:text-white">{priceInfo.price}</span>
                  <span className="text-body-4 text-dark-3 dark:text-gray-400 font-normal">{priceInfo.currency}</span>
                </>
              )}
            </div>
            {/* Meta: city + time */}
            <div className="flex items-center gap-1 text-body-4 text-dark-3 dark:text-gray-400">
              <span className={isFilteredByCity && rawCity.includes(selectedCity) ? "text-main dark:text-white font-semibold" : ""}>
                {city}
              </span>
              <span className="text-dark-4 dark:text-gray-600">·</span>
              <span>{timeLabel}</span>
            </div>
          </div>
        </div>

        {/* Admin delete button */}
        {isAdmin && (
          <div className="px-3 pb-3 pt-1 border-t border-light-1 dark:border-night-border mt-2">
            <button
              type="button"
              onClick={(e) => onOpenDeleteModal(e, post)}
              className="w-full py-2 bg-accent-red-bg dark:bg-red-950/60 text-accent-red dark:text-red-400 font-semibold rounded-full hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-body-3"
            >
              {t("deleteAd", {}, currentLang)} (Admin)
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}

/**
 * Standard PostCard Skeleton Placeholder
 */
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

function AllAds({ isAdmin = false, withShowcase = false }) {
  const { data, isLoading, refetch } = useQuery(["get-all-ads"], () => getAllAds());
  const [displayCount, setDisplayCount] = useState(12);
  const [autoScrollCount, setAutoScrollCount] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [savedIds, setSavedIds] = useState({});
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [selectedCity, setSelectedCityState] = useState(getSelectedCity());
  const [currentLang, setCurrentLang] = useState(getSavedLanguage());

  const sentinelRef = useRef(null);
  const MAX_AUTO_SCROLL = 3;

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const deleteMutation = useMutation(delmySpecificAd, {
    onSuccess: () => {
      toast.success(currentLang === "fa" ? "آگهی با موفقیت حذف شد" : "Listing deleted successfully");
      setDeleteTarget(null);
      refetch();
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "Error deleting ad";
      setDeleteError(msg);
      toast.error(msg);
    },
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  // Listen to city and language change events
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

  // 1. Randomized posts list
  const randomizedPosts = useMemo(() => {
    if (!data?.posts || !Array.isArray(data.posts)) return [];
    return shuffleArray(data.posts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.posts, shuffleSeed]);

  // 2. Filter posts by selected city
  const filteredPosts = useMemo(() => {
    if (!randomizedPosts) return [];
    if (!selectedCity || selectedCity === ALL_IRAN) return randomizedPosts;

    return randomizedPosts.filter((p) => {
      const city = p.options?.city || p.city || "";
      return city.includes(selectedCity);
    });
  }, [randomizedPosts, selectedCity]);

  const isFilteredByCity = selectedCity && selectedCity !== ALL_IRAN;
  const hasMore = filteredPosts.length > displayCount;
  const cityTranslatedName = translateCity(selectedCity, currentLang);

  // Hybrid Infinite Scroll: Auto-load for 3 cycles, then require button click
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

  const handleReshuffle = () => {
    setShuffleSeed((prev) => prev + 1);
    setDisplayCount(12);
    setAutoScrollCount(0);
    toast.success(currentLang === "fa" ? "آگهی‌ها با چیدمان رندوم جدید مرتب شدند" : "Listings randomized");
  };

  const handleOpenDeleteModal = (e, post) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteError("");
    setDeleteTarget(post);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget._id || deleteTarget.id);
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

  // SKELETON LOADING ON INITIAL LOAD
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 sdesktop:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Empty state when database has 0 posts
  if (!data?.posts || data.posts.length === 0) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center bg-white dark:bg-night-card rounded-sheypoor-xl border-2 border-dashed border-light-0 dark:border-night-border">
        <svg className="h-16 w-16 text-dark-4 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 className="text-heading-4 text-dark-2 dark:text-gray-200 mb-1">{t("noAdsFound", {}, currentLang)}</h3>
      </div>
    );
  }

  // If withShowcase is true:
  // First 12 ads (2 rows of 6) -> Showcase Section -> Remaining ads with Load More
  const firstBatch = withShowcase ? filteredPosts.slice(0, 12) : filteredPosts.slice(0, displayCount);
  const remainingBatch = withShowcase ? filteredPosts.slice(12, displayCount) : [];

  return (
    <>
      {/* City Filter Active Banner */}
      {isFilteredByCity && (
        <div className="mb-4 p-3.5 bg-light-special dark:bg-night-surface border border-main/30 dark:border-night-border rounded-sheypoor-lg flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2 text-body-2 text-dark-1 dark:text-gray-200">
            <svg className="w-5 h-5 text-main dark:text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span>
              {t("showingCityAds", { city: cityTranslatedName }, currentLang)} ({filteredPosts.length})
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

      {/* Top Bar with Total Count and Shuffle button */}
      <div className="flex items-center justify-between mb-4 text-body-3 text-dark-3 dark:text-gray-400">
        <span>
          {currentLang === "fa"
            ? `نمایش ${Math.min(displayCount, filteredPosts.length)} از ${filteredPosts.length} آگهی`
            : currentLang === "de"
            ? `Zeige ${Math.min(displayCount, filteredPosts.length)} von ${filteredPosts.length} Anzeigen`
            : `Showing ${Math.min(displayCount, filteredPosts.length)} of ${filteredPosts.length} listings`}
        </span>
        <button
          onClick={handleReshuffle}
          className="chip !py-1 !px-3 text-body-4 hover:border-main dark:hover:border-white hover:text-main dark:hover:text-white flex items-center gap-1"
          title="Reshuffle"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{t("shuffleAds", {}, currentLang)}</span>
        </button>
      </div>

      {/* If city filtered has 0 results */}
      {filteredPosts.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-center bg-white dark:bg-night-card rounded-sheypoor-xl border border-light-0 dark:border-night-border">
          <svg className="h-16 w-16 text-dark-4 dark:text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="text-heading-4 text-dark-1 dark:text-white mb-2">
            {t("noAdsInCity", { city: cityTranslatedName }, currentLang)}
          </h3>
          <p className="text-body-2 text-dark-3 dark:text-gray-400 mb-5">
            {currentLang === "fa"
              ? "می‌توانید آگهی‌های کل کشور را مشاهده فرمایید."
              : "You can view listings from all regions."}
          </p>
          <button onClick={clearSelectedCity} className="btn-primary">
            {t("viewAllIranAds", {}, currentLang)}
          </button>
        </div>
      ) : (
        <>
          {/* 1. FIRST BATCH (First 2 rows of ads) */}
          <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 sdesktop:grid-cols-6 gap-4">
            {firstBatch.map((post) => {
              const postId = post._id || post.id;
              const bookmarked = savedIds[postId] !== undefined ? savedIds[postId] : isBookmarked(postId);

              return (
                <PostCard
                  key={postId}
                  post={post}
                  bookmarked={bookmarked}
                  onBookmarkToggle={handleBookmarkToggle}
                  isAdmin={isAdmin}
                  onOpenDeleteModal={handleOpenDeleteModal}
                  isFilteredByCity={isFilteredByCity}
                  selectedCity={selectedCity}
                  currentLang={currentLang}
                />
              );
            })}
          </div>

          {/* 2. SHOWCASE SECTION (ویترین سراسری in between) */}
          {withShowcase && <ShowcaseSection />}

          {/* 3. REMAINING ADS (Second Grid after Showcase) */}
          {withShowcase && remainingBatch.length > 0 && (
            <div id="more-ads-section" className="mt-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">📢</span>
                <h3 className="text-heading-5 text-dark-0 dark:text-white font-bold">
                  {t("otherRecentAds", {}, currentLang)}
                </h3>
              </div>
              <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 sdesktop:grid-cols-6 gap-4">
                {remainingBatch.map((post) => {
                  const postId = post._id || post.id;
                  const bookmarked = savedIds[postId] !== undefined ? savedIds[postId] : isBookmarked(postId);

                  return (
                    <PostCard
                      key={postId}
                      post={post}
                      bookmarked={bookmarked}
                      onBookmarkToggle={handleBookmarkToggle}
                      isAdmin={isAdmin}
                      onOpenDeleteModal={handleOpenDeleteModal}
                      isFilteredByCity={isFilteredByCity}
                      selectedCity={selectedCity}
                      currentLang={currentLang}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Skeleton placeholders while auto-scrolling is fetching */}
          {isLoadingMore && autoScrollCount < MAX_AUTO_SCROLL && (
            <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 sdesktop:grid-cols-6 gap-4 mt-4 animate-fade-in">
              {Array.from({ length: 6 }).map((_, i) => (
                <PostCardSkeleton key={`skeleton-more-${i}`} />
              ))}
            </div>
          )}

          {/* Infinite Scroll Sentinel (Invisible target observed for auto-scrolling) */}
          {autoScrollCount < MAX_AUTO_SCROLL && hasMore && (
            <div ref={sentinelRef} className="h-10 w-full flex items-center justify-center my-4" />
          )}

          {/* 4th cycle & beyond: MANUAL LOAD MORE BUTTON */}
          {autoScrollCount >= MAX_AUTO_SCROLL && hasMore && (
            <div className="flex justify-center mt-10">
              <button
                onClick={handleManualLoadMore}
                disabled={isLoadingMore}
                className="btn-outline text-body-2 min-w-[220px] flex items-center justify-center gap-2 hover:shadow-card-hover"
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
                      { count: filteredPosts.length - displayCount },
                      currentLang
                    )}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* End of list banner */}
          {!hasMore && filteredPosts.length > 12 && (
            <div className="text-center mt-10 py-4 text-body-3 text-dark-3 dark:text-gray-400 border-t border-light-0 dark:border-night-border">
              ✨ {t("allAdsLoaded", { count: filteredPosts.length }, currentLang)}
            </div>
          )}
        </>
      )}

      {/* Delete Ad Custom Modal for Admin */}
      <DeleteAdModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        adTitle={translateText(deleteTarget?.options?.title || deleteTarget?.title, currentLang)}
        isLoading={deleteMutation.isLoading}
        error={deleteError}
      />

      <Toaster />
    </>
  );
}

AllAds.propTypes = {
  isAdmin: PropTypes.bool,
  withShowcase: PropTypes.bool,
};

export default AllAds;
