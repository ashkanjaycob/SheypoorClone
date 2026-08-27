import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getAllAds, delmySpecificAd } from "../../Services/user";
import { sp } from "../../Utils/Numbers";
import { isBookmarked, toggleBookmark } from "../../Utils/bookmarks";
import DeleteAdModal from "./DeleteAdModal";
import toast, { Toaster } from "react-hot-toast";
import PropTypes from "prop-types";

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "لحظاتی پیش";
  if (mins < 60) return `${mins} دقیقه پیش`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ساعت پیش`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} روز پیش`;
  return new Date(dateStr).toLocaleDateString("fa-IR");
}

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

function AllAds({ isAdmin = false }) {
  const { data, isLoading, refetch } = useQuery(["get-all-ads"], () => getAllAds());
  const [displayCount, setDisplayCount] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [savedIds, setSavedIds] = useState({});
  const [shuffleSeed, setShuffleSeed] = useState(0);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const deleteMutation = useMutation(delmySpecificAd, {
    onSuccess: () => {
      toast.success("آگهی با موفقیت حذف شد");
      setDeleteTarget(null);
      refetch();
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "خطا در حذف آگهی";
      setDeleteError(msg);
      toast.error(msg);
    },
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  // Randomized posts list (shuffled whenever data or seed changes)
  const randomizedPosts = useMemo(() => {
    if (!data?.posts || !Array.isArray(data.posts)) return [];
    return shuffleArray(data.posts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.posts, shuffleSeed]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayCount((prev) => prev + 12);
      setIsLoadingMore(false);
    }, 450);
  };

  const handleReshuffle = () => {
    setShuffleSeed((prev) => prev + 1);
    toast.success("آگهی‌ها با چیدمان رندوم جدید مرتب شدند");
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
    toast.success(isNowSaved ? "آگهی به ذخیره‌ها افزوده شد" : "آگهی از ذخیره‌ها حذف شد");
  };

  // Skeleton loading
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 sdesktop:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="card-sheypoor overflow-hidden">
            <div className="aspect-square skeleton" />
            <div className="p-3 space-y-2">
              <div className="h-4 skeleton w-3/4" />
              <div className="h-3 skeleton w-1/2" />
              <div className="h-3 skeleton w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!randomizedPosts || randomizedPosts.length === 0) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center bg-white rounded-sheypoor-xl border-2 border-dashed border-light-0">
        <svg className="h-16 w-16 text-dark-4 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 className="text-heading-4 text-dark-2 mb-1">هیچ آگهی یافت نشد!</h3>
        <p className="text-body-2 text-dark-3">در حال حاضر آگهی‌ای در سیستم وجود ندارد</p>
      </div>
    );
  }

  const currentVisible = randomizedPosts.slice(0, displayCount);
  const hasMore = randomizedPosts.length > displayCount;

  return (
    <>
      {/* Top Bar with Total Count and Shuffle button */}
      <div className="flex items-center justify-between mb-4 text-body-3 text-dark-3">
        <span>نمایش {Math.min(displayCount, randomizedPosts.length)} از {randomizedPosts.length} آگهی (ترکیبی از همه دسته‌ها)</span>
        <button
          onClick={handleReshuffle}
          className="chip !py-1 !px-3 text-body-4 hover:border-main hover:text-main flex items-center gap-1"
          title="ترتیب رندوم مجدد"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>چیدمان تصادفی جدید</span>
        </button>
      </div>

      {/* Desktop Grid / Mobile List */}
      <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 sdesktop:grid-cols-6 gap-4">
        {currentVisible.map((post) => {
          const postId = post._id || post.id;
          const bookmarked = savedIds[postId] !== undefined ? savedIds[postId] : isBookmarked(postId);
          const categoryBadge = post.categoryName?.trim();

          return (
            <Link
              key={postId}
              to={`/dashboard/${postId}`}
              className="block group"
            >
              <div className="card-sheypoor overflow-hidden flex flex-row-reverse laptop:flex-col h-full relative">
                {/* Bookmark Icon Button */}
                <button
                  onClick={(e) => handleBookmarkToggle(e, post)}
                  className={`absolute top-2 left-2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    bookmarked
                      ? "bg-main text-white shadow-md"
                      : "bg-white/80 backdrop-blur-sm text-dark-3 hover:text-main hover:bg-white"
                  }`}
                  title={bookmarked ? "حذف از ذخیره‌ها" : "ذخیره آگهی"}
                >
                  <svg className="w-4 h-4" fill={bookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>

                {/* Image */}
                <div className="relative w-[120px] h-[120px] laptop:w-full laptop:h-auto laptop:aspect-square flex-shrink-0 bg-light-2 overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={
                      post.images?.[0]?.startsWith("http")
                        ? post.images[0]
                        : `${import.meta.env.VITE_BASE_URL}${post.images?.[0] || ""}`
                    }
                    alt={post.options?.title || post.title || "تصویر آگهی"}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/400x400/F2F2F5/8F90A6?text=بدون+عکس";
                    }}
                  />

                  {/* Photo count badge */}
                  {post.images && post.images.length > 1 && (
                    <div className="absolute bottom-2 left-2 bg-dark-0/70 backdrop-blur-sm text-white text-body-4 px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{post.images.length}</span>
                    </div>
                  )}

                  {/* Category tag badge */}
                  {categoryBadge && (
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-dark-1 text-[11px] font-medium px-2 py-0.5 rounded-full shadow-xs">
                      {categoryBadge}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-grow p-3 flex flex-col justify-between min-w-0">
                  <h5 className="text-body-2 font-medium text-dark-0 line-clamp-2 mb-2 leading-relaxed">
                    {post.options?.title || post.title}
                  </h5>
                  <div className="mt-auto space-y-1.5">
                    {/* Price */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-body-2 font-bold text-dark-0">
                        {post.amount > 0 ? sp(post.amount) : "توافقی"}
                      </span>
                      {post.amount > 0 && (
                        <img className="w-4 h-4" src="/Toman.svg" alt="تومان" />
                      )}
                    </div>
                    {/* Meta: city + time */}
                    <div className="flex items-center gap-1 text-body-4 text-dark-3">
                      <span>{post.options?.city || post.city || "ایران"}</span>
                      <span className="text-dark-4">·</span>
                      <span>{timeAgo(post.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Admin delete button */}
                {isAdmin && (
                  <div className="px-3 pb-3 pt-1 border-t border-light-1 mt-2">
                    <button
                      type="button"
                      onClick={(e) => handleOpenDeleteModal(e, post)}
                      className="w-full py-2 bg-accent-red-bg text-accent-red font-semibold rounded-full hover:bg-red-100 transition-colors text-body-3"
                    >
                      حذف آگهی (ادمین)
                    </button>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Load More Button with Loading State */}
      {hasMore ? (
        <div className="flex justify-center mt-10">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="btn-outline text-body-2 min-w-[200px] flex items-center justify-center gap-2 hover:shadow-card-hover"
          >
            {isLoadingMore ? (
              <>
                <svg className="animate-spin w-5 h-5 text-main" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>در حال بارگذاری آگهی‌های بیشتر...</span>
              </>
            ) : (
              <span>مشاهده آگهی‌های بیشتر ({randomizedPosts.length - displayCount} آگهی دیگر)</span>
            )}
          </button>
        </div>
      ) : randomizedPosts.length > 12 ? (
        <div className="text-center mt-10 py-4 text-body-3 text-dark-3 border-t border-light-0">
          ✨ تمامی {randomizedPosts.length} آگهی نمایش داده شد
        </div>
      ) : null}

      {/* Delete Ad Custom Modal for Admin */}
      <DeleteAdModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        adTitle={deleteTarget?.options?.title || deleteTarget?.title}
        isLoading={deleteMutation.isLoading}
        error={deleteError}
      />

      <Toaster />
    </>
  );
}

AllAds.propTypes = {
  isAdmin: PropTypes.bool,
};

export default AllAds;
