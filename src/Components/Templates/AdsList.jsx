import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getmyAds, delmySpecificAd } from "../../Services/user";
import { sp } from "../../Utils/Numbers";
import { isBookmarked, toggleBookmark } from "../../Utils/bookmarks";
import DeleteAdModal from "./DeleteAdModal";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

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

function AdsList() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(["get-my-ads"], getmyAds);
  const [displayCount, setDisplayCount] = useState(12);
  const [savedIds, setSavedIds] = useState({});

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const deleteMutation = useMutation(delmySpecificAd, {
    onSuccess: () => {
      toast.success("آگهی با موفقیت حذف شد");
      queryClient.invalidateQueries(["get-my-ads"]);
      queryClient.invalidateQueries(["get-all-ads"]);
      setDeleteTarget(null);
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "خطا در حذف آگهی";
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
    toast.success(isNowSaved ? "آگهی به ذخیره‌ها افزوده شد" : "آگهی از ذخیره‌ها حذف شد");
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
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
      <div className="w-full py-16 flex flex-col items-center justify-center bg-white rounded-sheypoor-xl border-2 border-dashed border-light-0">
        <svg className="h-14 w-14 text-dark-4 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 className="text-heading-5 text-dark-2 mb-1">شما هنوز هیچ آگهی ثبت نکرده‌اید!</h3>
        <p className="text-body-3 text-dark-3">اولین آگهی خود را از فرم بالا ثبت کنید.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 gap-4">
        {data.posts.slice(0, displayCount).map((post) => {
          const postId = post._id || post.id;
          const bookmarked = savedIds[postId] !== undefined ? savedIds[postId] : isBookmarked(postId);

          return (
            <div
              key={postId}
              className="card-sheypoor overflow-hidden flex flex-col justify-between"
            >
              <Link
                to={`/dashboard/${postId}`}
                className="block group flex-grow"
              >
                <div className="flex flex-row-reverse laptop:flex-col relative">
                  {/* Bookmark Button */}
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
                  </div>
                  <div className="flex-grow p-3 flex flex-col justify-between min-w-0">
                    <h5 className="text-body-2 font-medium text-dark-0 line-clamp-2 mb-2 leading-relaxed">
                      {post.options?.title || post.title}
                    </h5>
                    <div className="mt-auto space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-body-2 font-bold text-dark-0">
                          {post.amount > 0 ? sp(post.amount) : "توافقی"}
                        </span>
                        {post.amount > 0 && (
                          <img className="w-4 h-4" src="/Toman.svg" alt="تومان" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-body-4 text-dark-3">
                        <span>{post.options?.city || post.city || "ایران"}</span>
                        <span className="text-dark-4">·</span>
                        <span>{timeAgo(post.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Actions row: Edit + Delete */}
              <div className="p-3 pt-0 flex gap-2 border-t border-light-1 mt-2">
                <Link
                  to={`/dashboard/update/${postId}`}
                  className="flex-1 py-2 text-center rounded-full border border-light-0 text-dark-2 text-body-4 hover:border-main hover:text-main font-medium transition-colors"
                >
                  ویرایش
                </Link>
                <button
                  onClick={(e) => handleOpenDelete(e, post)}
                  className="flex-1 py-2 text-center rounded-full bg-accent-red-bg text-accent-red text-body-4 hover:bg-red-100 font-medium transition-colors"
                >
                  حذف
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {data.posts.length > displayCount && (
        <div className="flex justify-center mt-8">
          <button onClick={handleLoadMore} className="btn-outline text-body-2">
            مشاهده آگهی‌های بیشتر
          </button>
        </div>
      )}

      {/* Delete Modal */}
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

export default AdsList;
