import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getmyAds } from "../../Services/user";
import { sp } from "../../Utils/Numbers";
import { Link } from "react-router-dom";

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
  const { data, isLoading } = useQuery(["get-my-ads"], getmyAds);
  const [displayCount, setDisplayCount] = useState(12);

  const handleLoadMore = () => setDisplayCount((c) => c + 6);

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
      <div className="w-full py-16 flex flex-col items-center justify-center bg-light-2 rounded-sheypoor-xl border-2 border-dashed border-light-0">
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
        {data.posts.slice(0, displayCount).map((post) => (
          <Link
            key={post._id}
            to={`/dashboard/${post._id}`}
            className="block group"
          >
            <div className="card-sheypoor overflow-hidden flex flex-row-reverse laptop:flex-col h-full">
              <div className="relative w-[120px] h-[120px] laptop:w-full laptop:h-auto laptop:aspect-square flex-shrink-0 bg-light-2 overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src={
                    post.images[0]?.startsWith("http")
                      ? post.images[0]
                      : `${import.meta.env.VITE_BASE_URL}${post.images[0]}`
                  }
                  alt={post.options.title || "تصویر آگهی"}
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/400x400/F2F2F5/8F90A6?text=بدون+عکس";
                  }}
                />
                {post.images && post.images.length > 1 && (
                  <div className="absolute bottom-2 left-2 bg-dark-1/70 backdrop-blur-sm text-white text-body-4 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{post.images.length}</span>
                  </div>
                )}
              </div>
              <div className="flex-grow p-3 flex flex-col justify-between min-w-0">
                <h5 className="text-body-2 font-medium text-dark-0 line-clamp-2 mb-2">
                  {post.options.title}
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
                    <span>{post.options.city}</span>
                    <span className="text-dark-4">·</span>
                    <span>{timeAgo(post.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {data.posts.length > displayCount && (
        <div className="flex justify-center mt-8">
          <button onClick={handleLoadMore} className="btn-outline text-body-2">
            مشاهده آگهی‌های بیشتر
          </button>
        </div>
      )}
    </>
  );
}

export default AdsList;
