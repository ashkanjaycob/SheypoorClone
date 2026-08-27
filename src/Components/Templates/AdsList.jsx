import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getmyAds, delmySpecificAd } from "../../Services/user";
import { isBookmarked, toggleBookmark } from "../../Utils/bookmarks";
import { t, getSavedLanguage } from "../../Utils/i18n";
import {
  translateText,
  translateCity,
  formatAdPrice,
  formatTimeAgo,
} from "../../Utils/adTranslator";
import DeleteAdModal from "./DeleteAdModal";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function AdsList() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(["get-my-ads"], getmyAds);
  const [displayCount, setDisplayCount] = useState(12);
  const [savedIds, setSavedIds] = useState({});
  const [currentLang, setCurrentLang] = useState(getSavedLanguage());

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const handleLangChange = (e) => setCurrentLang(e.detail || getSavedLanguage());
    window.addEventListener("sheypoor_lang_changed", handleLangChange);
    return () => window.removeEventListener("sheypoor_lang_changed", handleLangChange);
  }, []);

  const deleteMutation = useMutation(delmySpecificAd, {
    onSuccess: () => {
      toast.success(currentLang === "fa" ? "آگهی با موفقیت حذف شد" : "Listing deleted successfully");
      queryClient.invalidateQueries(["get-my-ads"]);
      queryClient.invalidateQueries(["get-all-ads"]);
      setDeleteTarget(null);
    },
    onError: (err) => {
      const msg = err.response?.data?.message || (currentLang === "fa" ? "خطا در حذف آگهی" : "Error deleting ad");
      setDeleteError(msg);
      toast.error(msg);
    },
  });

  const handleLoadMore = () => setDisplayCount((c) => c + 6);

  const handleOpenDelete = (e, post) => {
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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 sdesktop:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card-sheypoor overflow-hidden">
            <div className="aspect-square skeleton" />
            <div className="p-3 space-y-2">
              <div className="h-4 skeleton w-3/4" />
              <div className="h-3 skeleton w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data?.posts || data.posts.length === 0) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center bg-white dark:bg-night-card rounded-sheypoor-xl border-2 border-dashed border-light-0 dark:border-night-border text-center p-4">
        <svg className="h-16 w-16 text-dark-4 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 className="text-heading-4 text-dark-2 dark:text-gray-200 mb-1">
          {currentLang === "fa" ? "هنوز آگهی ثبت نکرده‌اید!" : "You have not published any listings yet!"}
        </h3>
        <p className="text-body-2 text-dark-3 dark:text-gray-400">
          {currentLang === "fa" ? "از فرم بالا می‌توانید آگهی جدید خود را ثبت کنید." : "Use the form above to publish your first free listing."}
        </p>
      </div>
    );
  }

  const posts = data.posts;
  const hasMore = posts.length > displayCount;

  return (
    <>
      <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 sdesktop:grid-cols-6 gap-4">
        {posts.slice(0, displayCount).map((post) => {
          const postId = post._id || post.id;
          const bookmarked = savedIds[postId] !== undefined ? savedIds[postId] : isBookmarked(postId);
          const title = translateText(post.options?.title || post.title, currentLang);
          const city = translateCity(post.options?.city || post.city, currentLang);
          const priceInfo = formatAdPrice(post.amount, currentLang);
          const timeLabel = formatTimeAgo(post.createdAt, currentLang);

          return (
            <div key={postId} className="card-sheypoor overflow-hidden flex flex-col justify-between group relative">
              {/* Top Bookmark */}
              <button
                onClick={(e) => handleBookmarkToggle(e, post)}
                className={`absolute top-2 rtl:left-2 ltr:right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  bookmarked
                    ? "bg-main text-white shadow-md"
                    : "bg-white/80 dark:bg-night-card/80 backdrop-blur-sm text-dark-3 dark:text-gray-300 hover:text-main dark:hover:text-white hover:bg-white"
                }`}
                title="Bookmark"
              >
                <svg className="w-4 h-4" fill={bookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>

              <Link to={`/dashboard/${postId}`} className="block">
                {/* Image */}
                <div className="relative aspect-square bg-light-2 dark:bg-night-surface overflow-hidden">
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
                  {post.images && post.images.length > 1 && (
                    <div className="absolute bottom-2 rtl:left-2 ltr:right-2 bg-dark-0/70 dark:bg-night-bg/80 backdrop-blur-sm text-white text-body-4 px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                      <span>{post.images.length}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-3">
                  <h5 className="text-body-2 font-medium text-dark-0 dark:text-gray-100 line-clamp-2 mb-2">
                    {title}
                  </h5>
                  <div className="flex items-center gap-1.5 mb-1.5">
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
                    <span>·</span>
                    <span>{timeLabel}</span>
                  </div>
                </div>
              </Link>

              {/* Action Buttons: Edit + Delete */}
              <div className="p-2 border-t border-light-1 dark:border-night-border flex items-center gap-1.5 bg-light-3 dark:bg-night-surface">
                <Link
                  to={`/dashboard/update/${postId}`}
                  className="flex-1 text-center py-1.5 text-xs font-semibold text-main dark:text-white hover:bg-light-special dark:hover:bg-night-card rounded-md transition-colors"
                >
                  {currentLang === "fa" ? "ویرایش" : "Edit"}
                </Link>
                <button
                  type="button"
                  onClick={(e) => handleOpenDelete(e, post)}
                  className="flex-1 py-1.5 text-xs font-semibold text-accent-red hover:bg-accent-red-bg dark:hover:bg-red-950/60 rounded-md transition-colors"
                >
                  {t("deleteAd", {}, currentLang)}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button onClick={handleLoadMore} className="btn-outline text-body-2 min-w-[160px]">
            {t("loadMore", {}, currentLang)}
          </button>
        </div>
      )}

      {/* Custom Delete Modal */}
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

export default AdsList;
