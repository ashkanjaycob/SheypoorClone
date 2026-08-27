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
 * Standard PostCard Component - Matches Authentic Sheypoor Card Design
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
  const title = translateText(rawTitle, currentLang) || rawTitle;
  const rawCity = post.options?.city || post.city || "";
  const city = translateCity(rawCity, currentLang) || rawCity || (currentLang === "fa" ? "ایران" : "Iran");
  const rawCat = post.categoryName?.trim() || (typeof post.category === "string" ? post.category : post.category?.name || post.category?.slug);
  const categoryBadge = rawCat ? translateCategory(rawCat, currentLang) : "";
  const priceInfo = formatAdPrice(post.amount || post.options?.price || post.options?.amount, currentLang);
  const timeLabel = formatTimeAgo(post.createdAt || post.options?.createdAt, currentLang);

  const imagesCount = post.images?.length || 0;
  const isUrgent = post.isUrgent || post.options?.urgent;
  const isSpecial = post.isSpecial || post.options?.special;

  return (
    <Link to={`/dashboard/${postId}`} className="block group select-none">
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

          {/* Bookmark Button (Top Corner) */}
          <button
            type="button"
            onClick={(e) => onBookmarkToggle(e, post)}
            className={`absolute top-2.5 rtl:left-2.5 ltr:right-2.5 z-10 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              bookmarked
                ? "bg-main text-white shadow-md scale-105"
                : "bg-dark-0/60 backdrop-blur-sm text-white/80 hover:text-white hover:bg-dark-0/80"
            }`}
            title={bookmarked ? t("adUnsaved", {}, currentLang) : t("adSaved", {}, currentLang)}
          >
            <svg className="w-4 h-4" fill={bookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>

          {/* Photo Count (Bottom Corner) */}
          {imagesCount > 0 && (
            <div className="absolute bottom-2.5 rtl:left-2.5 ltr:right-2.5 bg-dark-0/70 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-md flex items-center gap-1 font-mono">
              <span>{imagesCount}</span>
              <svg className="w-3.5 h-3.5 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Special / Discount / Category Badge */}
          {isUrgent ? (
            <div className="absolute bottom-2.5 rtl:right-2.5 ltr:left-2.5 bg-accent-red text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              {currentLang === "fa" ? "فوری" : "Urgent"}
            </div>
          ) : isSpecial ? (
            <div className="absolute bottom-2.5 rtl:right-2.5 ltr:left-2.5 bg-accent-orange text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              {currentLang === "fa" ? "ویژه" : "Featured"}
            </div>
          ) : categoryBadge ? (
            <div className="absolute top-2.5 rtl:right-2.5 ltr:left-2.5 bg-dark-0/60 backdrop-blur-sm text-white/90 text-[11px] font-medium px-2 py-0.5 rounded-md">
              {categoryBadge}
            </div>
          ) : null}
        </div>

        {/* 2. Text Info Directly Below Image */}
        <div className="pt-2 px-0.5 flex flex-col flex-grow rtl:text-right ltr:text-left">
          {/* Title */}
          <h4 className="text-[14px] font-semibold text-dark-0 dark:text-white line-clamp-1 leading-snug group-hover:text-main dark:group-hover:text-main-lighter transition-colors">
            {title}
          </h4>

          {/* Price */}
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

          {/* Meta (City + Time) */}
          <div className="text-[12px] text-dark-3 dark:text-gray-400 mt-1 flex items-center justify-between gap-1">
            <span className={`truncate ${isFilteredByCity && rawCity.includes(selectedCity) ? "text-main dark:text-main-lighter font-semibold" : ""}`}>
              {city}
            </span>
            {timeLabel && (
              <span className="flex-shrink-0 text-dark-3 dark:text-gray-400 text-[11px]">
                {timeLabel}
              </span>
            )}
          </div>
        </div>

        {/* Admin Delete Button */}
        {isAdmin && (
          <div className="pt-2">
            <button
              type="button"
              onClick={(e) => onOpenDeleteModal(e, post)}
              className="w-full py-1.5 bg-accent-red-bg dark:bg-red-950/60 text-accent-red dark:text-red-400 font-semibold rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-xs"
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
    <div className="flex flex-col h-full">
      <div className="aspect-square w-full rounded-2xl bg-light-2 dark:bg-night-surface skeleton" />
      <div className="pt-2 px-0.5 space-y-2">
        <div className="h-4 skeleton w-full rounded" />
        <div className="h-4 skeleton w-2/3 rounded" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-3 skeleton w-1/3 rounded" />
          <div className="h-3 skeleton w-1/4 rounded" />
        </div>
      </div>
    </div>
  );
}

function AllAds({ withShowcase = true }) {
  const [displayCount, setDisplayCount] = useState(12);
  const [autoScrollCount, setAutoScrollCount] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [randomSeed, setRandomSeed] = useState(0);
  const [savedIds, setSavedIds] = useState({});
  const [deleteModalPost, setDeleteModalPost] = useState(null);
  const [selectedCity, setSelectedCityState] = useState(getSelectedCity());
  const [currentLang, setCurrentLang] = useState(getSavedLanguage());

  const sentinelRef = useRef(null);
  const MAX_AUTO_SCROLL = 3;
  const INITIAL_BATCH_SIZE = 12;

  // Listen for city and language changes
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

  const { data, isLoading, isError, refetch } = useQuery(
    ["get-all-ads"],
    () => getAllAds()
  );

  const { mutate: deleteAdMutate } = useMutation(delmySpecificAd, {
    onSuccess: (dataRes) => {
      toast.success(dataRes?.message || t("deleteSuccess", {}, currentLang));
      setDeleteModalPost(null);
      refetch();
    },
    onError: () => {
      toast.error(t("deleteError", {}, currentLang));
    },
  });

  const rawUser = localStorage.getItem("userData");
  const userdata = rawUser ? JSON.parse(rawUser) : null;
  const isAdmin = userdata?.role === "ADMIN";

  const isFilteredByCity = selectedCity && selectedCity !== ALL_IRAN;
  const cityTranslatedName = translateCity(selectedCity, currentLang);

  // Filter and randomize posts
  const processedPosts = useMemo(() => {
    if (!data?.posts) return [];
    let posts = [...data.posts];

    // 1. Filter by city
    if (selectedCity && selectedCity !== ALL_IRAN) {
      posts = posts.filter((p) => {
        const postCity = p.options?.city || p.city || "";
        return postCity.includes(selectedCity);
      });
    }

    // 2. Filter by type
    if (activeFilter === "photo") {
      posts = posts.filter((p) => p.images && p.images.length > 0);
    } else if (activeFilter === "cheap") {
      posts.sort((a, b) => (Number(a.amount) || 0) - (Number(b.amount) || 0));
    } else if (activeFilter === "expensive") {
      posts.sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0));
    } else {
      // Default: randomized for discovery
      posts = shuffleArray(posts);
    }

    return posts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.posts, selectedCity, activeFilter, randomSeed]);

  const displayedPosts = processedPosts.slice(0, displayCount);
  const hasMore = displayCount < processedPosts.length;

  const firstBatch = withShowcase
    ? displayedPosts.slice(0, INITIAL_BATCH_SIZE)
    : displayedPosts;

  const remainingBatch = withShowcase
    ? displayedPosts.slice(INITIAL_BATCH_SIZE)
    : [];

  // Infinite auto-scroll observer
  useEffect(() => {
    if (autoScrollCount >= MAX_AUTO_SCROLL || !hasMore || isLoadingMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !isLoadingMore && hasMore) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setDisplayCount((prev) => prev + 12);
            setAutoScrollCount((prev) => prev + 1);
            setIsLoadingMore(false);
          }, 400);
        }
      },
      { threshold: 0.1, rootMargin: "150px" }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [autoScrollCount, hasMore, isLoadingMore, displayCount]);

  const handleManualLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayCount((prev) => prev + 12);
      setIsLoadingMore(false);
    }, 400);
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

  const handleOpenDeleteModal = (e, post) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteModalPost(post);
  };

  const handleConfirmDelete = () => {
    if (deleteModalPost) {
      deleteAdMutate(deleteModalPost._id || deleteModalPost.id);
    }
  };

  const handleReshuffle = () => {
    setRandomSeed((prev) => prev + 1);
    setDisplayCount(12);
    setAutoScrollCount(0);
  };

  const filters = [
    { id: "all", label: t("allAdsFilter", {}, currentLang) },
    { id: "photo", label: t("withPhotoFilter", {}, currentLang) },
    { id: "cheap", label: t("cheapestFilter", {}, currentLang) },
    { id: "expensive", label: t("mostExpensiveFilter", {}, currentLang) },
  ];

  if (isLoading) {
    return (
      <div>
        <div className="grid grid-cols-2 tablet:grid-cols-3 laptop:grid-cols-4 desktop:grid-cols-5 sdesktop:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <PostCardSkeleton key={`skeleton-initial-${i}`} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center bg-white dark:bg-night-card rounded-sheypoor-lg border border-light-0 dark:border-night-border my-6">
        <p className="text-body-1 text-accent-red font-semibold mb-2">
          {t("loadingError", {}, currentLang)}
        </p>
        <button onClick={() => refetch()} className="btn-primary mt-2">
          {t("retry", {}, currentLang)}
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* City Filter Active Banner */}
      {isFilteredByCity && (
        <div className="mb-4 p-3.5 bg-light-special dark:bg-night-surface border border-main/30 dark:border-night-border rounded-sheypoor-lg flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2 text-body-2 text-dark-1 dark:text-gray-200">
            <svg className="w-5 h-5 text-main dark:text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span>
              {currentLang === "fa"
                ? `در حال نمایش آگهی‌های شهر: ${cityTranslatedName} (${processedPosts.length} آگهی)`
                : `Showing ads for: ${cityTranslatedName} (${processedPosts.length} listings)`}
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

      {/* Filter Tabs & Reshuffle Button */}
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => {
                setActiveFilter(f.id);
                setDisplayCount(12);
                setAutoScrollCount(0);
              }}
              className={activeFilter === f.id ? "chip-active" : "chip"}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-body-3 text-dark-3 dark:text-gray-400">
            {currentLang === "fa"
              ? `نمایش ${displayedPosts.length} از ${processedPosts.length} آگهی`
              : `Showing ${displayedPosts.length} of ${processedPosts.length} ads`}
          </span>

          <button
            onClick={handleReshuffle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-light-0 dark:border-night-border bg-white dark:bg-night-card hover:bg-light-2 dark:hover:bg-night-surface text-body-3 text-dark-2 dark:text-gray-300 transition-colors"
            title={t("randomizeFeed", {}, currentLang)}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{t("randomizeFeed", {}, currentLang)}</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {processedPosts.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-night-card rounded-sheypoor-lg border border-light-0 dark:border-night-border my-6">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-heading-4 text-dark-0 dark:text-white font-bold mb-2">
            {t("noAdsInCity", {}, currentLang)}
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
          <div className="grid grid-cols-2 tablet:grid-cols-3 laptop:grid-cols-4 desktop:grid-cols-5 sdesktop:grid-cols-6 gap-4">
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
              <div className="grid grid-cols-2 tablet:grid-cols-3 laptop:grid-cols-4 desktop:grid-cols-5 sdesktop:grid-cols-6 gap-4">
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
            <div className="grid grid-cols-2 tablet:grid-cols-3 laptop:grid-cols-4 desktop:grid-cols-5 sdesktop:grid-cols-6 gap-4 mt-4 animate-fade-in">
              {Array.from({ length: 6 }).map((_, i) => (
                <PostCardSkeleton key={`skeleton-more-${i}`} />
              ))}
            </div>
          )}

          {/* Infinite Scroll Sentinel */}
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
                  <span>{t("loadMoreAds", {}, currentLang)}</span>
                )}
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Ad Confirmation Modal (Admin) */}
      <DeleteAdModal
        isOpen={!!deleteModalPost}
        onClose={() => setDeleteModalPost(null)}
        onConfirm={handleConfirmDelete}
        title={deleteModalPost?.options?.title || deleteModalPost?.title || ""}
      />

      <Toaster />
    </div>
  );
}

AllAds.propTypes = {
  withShowcase: PropTypes.bool,
};

export default AllAds;
