import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBookmarks, removeBookmark, clearBookmarks } from "../Utils/bookmarks";
import { sp } from "../Utils/Numbers";

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

function SavedAds() {
  const [saved, setSaved] = useState([]);

  const reload = () => setSaved(getBookmarks());

  useEffect(() => {
    reload();
    window.addEventListener("sheypoor_bookmarks_updated", reload);
    return () => window.removeEventListener("sheypoor_bookmarks_updated", reload);
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
    <div className="min-h-screen bg-light-3">
      <div className="max-w-container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-body-3 text-dark-3 mb-5">
          <Link to="/" className="hover:text-main transition-colors">خانه</Link>
          <svg className="w-4 h-4 text-dark-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-dark-0 font-medium">ذخیره‌ها</span>
        </nav>

        {/* Title + Clear */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-main" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <h1 className="text-heading-4 text-dark-0">آگهی‌های ذخیره‌شده</h1>
            {saved.length > 0 && (
              <span className="text-body-3 text-dark-3">({saved.length} آگهی)</span>
            )}
          </div>
          {saved.length > 0 && (
            <button onClick={handleClearAll} className="text-body-3 text-accent-red hover:text-red-600 transition-colors">
              حذف همه
            </button>
          )}
        </div>

        {/* Empty State */}
        {saved.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center bg-white rounded-sheypoor-xl border-2 border-dashed border-light-0">
            <svg className="h-20 w-20 text-dark-4 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <h3 className="text-heading-4 text-dark-2 mb-2">هیچ آگهی ذخیره نشده!</h3>
            <p className="text-body-2 text-dark-3 mb-6">آگهی‌هایی که ذخیره می‌کنید اینجا نمایش داده می‌شوند.</p>
            <Link to="/" className="btn-primary">مشاهده آگهی‌ها</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 sdesktop:grid-cols-6 gap-4">
            {saved.map((post) => (
              <Link
                key={post._id || post.id}
                to={`/dashboard/${post._id || post.id}`}
                className="block group"
              >
                <div className="card-sheypoor overflow-hidden flex flex-row-reverse laptop:flex-col h-full relative">
                  {/* Remove Button */}
                  <button
                    onClick={(e) => handleRemove(e, post._id || post.id)}
                    className="absolute top-2 right-2 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-accent-red-bg hover:text-accent-red text-dark-3 transition-all"
                    title="حذف از ذخیره‌ها"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                      alt={post.options?.title || "تصویر آگهی"}
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/400x400/F2F2F5/8F90A6?text=بدون+عکس";
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-grow p-3 flex flex-col justify-between min-w-0">
                    <h5 className="text-body-2 font-medium text-dark-0 line-clamp-2 mb-2">
                      {post.options?.title}
                    </h5>
                    <div className="mt-auto space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-body-2 font-bold text-dark-0">
                          {post.amount > 0 ? sp(post.amount) : "توافقی"}
                        </span>
                        {post.amount > 0 && <img className="w-4 h-4" src="/Toman.svg" alt="تومان" />}
                      </div>
                      <div className="flex items-center gap-1 text-body-4 text-dark-3">
                        <span>{post.options?.city}</span>
                        <span className="text-dark-4">·</span>
                        <span>{timeAgo(post.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedAds;
