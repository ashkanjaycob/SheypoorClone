import { useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllAds } from "../Services/user";
import { getCategory } from "../Services/Admin";
import { sp } from "../Utils/Numbers";
import { isBookmarked, toggleBookmark } from "../Utils/bookmarks";
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

function Category() {
  const { id } = useParams();
  const [activeFilter, setActiveFilter] = useState("all");
  const [displayCount, setDisplayCount] = useState(20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [savedIds, setSavedIds] = useState({});

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
  const categoryTitle = currentCategory?.name?.trim() || "دسته‌بندی";

  // 3. Fetch ads by resolved category slug
  const { data, isLoading: isAdsLoading } = useQuery(
    ["get-all-ads-category", resolvedSlug],
    () => getAllAds(resolvedSlug),
    {
      enabled: !!resolvedSlug,
    }
  );

  const posts = data?.posts || [];

  // 4. Client-side sorting/filtering
  const displayedPosts = useMemo(() => {
    let result = [...posts];
    if (activeFilter === "photo") {
      result = result.filter((p) => p.images && p.images.length > 0);
    } else if (activeFilter === "cheap") {
      result.sort((a, b) => (Number(a.amount) || 0) - (Number(b.amount) || 0));
    } else if (activeFilter === "expensive") {
      result.sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0));
    }
    return result;
  }, [posts, activeFilter]);

  const handleBookmarkToggle = (e, post) => {
    e.preventDefault();
    e.stopPropagation();
    const isNowSaved = toggleBookmark(post);
    setSavedIds((prev) => ({ ...prev, [post._id || post.id]: isNowSaved }));
    toast.success(isNowSaved ? "آگهی به ذخیره‌ها افزوده شد" : "آگهی از ذخیره‌ها حذف شد");
  };

  const filters = [
    { id: "all", label: "همه" },
    { id: "photo", label: "عکس‌دار" },
    { id: "cheap", label: "ارزان‌ترین" },
    { id: "expensive", label: "گران‌ترین" },
  ];

  const isLoading = isCategoriesLoading || isAdsLoading;

  return (
    <div className="min-h-screen bg-light-3">
      <div className="max-w-container mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-body-3 text-dark-3 mb-4 overflow-x-auto scrollbar-hide">
          <Link to="/" className="hover:text-main transition-colors whitespace-nowrap">
            خانه
          </Link>
          <svg className="w-4 h-4 text-dark-4 flex-shrink-0 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-dark-3 whitespace-nowrap">دسته‌بندی‌ها</span>
          <svg className="w-4 h-4 text-dark-4 flex-shrink-0 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-dark-0 font-medium whitespace-nowrap">{categoryTitle}</span>
        </nav>

        {/* Title Header */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-light-2 flex items-center justify-center">
              <img
                className="w-5 h-5 object-contain"
                src={`/${currentCategory?.icon || "sheypoorBlack"}.svg`}
                alt=""
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/sheypoorBlack.svg";
                }}
              />
            </div>
            <h1 className="text-heading-4 text-dark-0">
              آگهی‌های <span className="text-main">{categoryTitle}</span>
            </h1>
          </div>
          {!isLoading && (
            <span className="text-body-3 text-dark-3">
              {displayedPosts.length} آگهی
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
          <Link to="/saved" className="chip flex-shrink-0 !gap-1 mr-auto hover:text-main">
            <svg className="w-4 h-4 text-main" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span>مشاهده ذخیره‌ها</span>
          </Link>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 sdesktop:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="card-sheypoor overflow-hidden">
                <div className="aspect-square skeleton" />
                <div className="p-3 space-y-2">
                  <div className="h-4 skeleton w-3/4" />
                  <div className="h-3 skeleton w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedPosts.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center bg-white rounded-sheypoor-xl border border-light-0">
            <svg className="h-16 w-16 text-dark-4 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-heading-4 text-dark-2 mb-2">هنوز آگهی‌ای در این دسته‌بندی ثبت نشده است</h3>
            <p className="text-body-2 text-dark-3 mb-6">اولین نفری باشید که در این دسته آگهی ثبت می‌کند!</p>
            <Link to="/dashboard" className="btn-primary">
              + ثبت آگهی رایگان
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 sdesktop:grid-cols-6 gap-4">
              {displayedPosts.slice(0, displayCount).map((post) => {
                const postId = post._id || post.id;
                const bookmarked = savedIds[postId] !== undefined ? savedIds[postId] : isBookmarked(postId);

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
                          alt={post.options?.title || post.title || "عکس آگهی"}
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/400x400/F2F2F5/8F90A6?text=بدون+عکس";
                          }}
                        />
                        {post.images?.length > 1 && (
                          <div className="absolute bottom-2 left-2 bg-dark-1/70 backdrop-blur-sm text-white text-body-4 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{post.images.length}</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
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
                );
              })}
            </div>

            {displayedPosts.length > displayCount && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => {
                    setIsLoadingMore(true);
                    setTimeout(() => {
                      setDisplayCount((c) => c + 12);
                      setIsLoadingMore(false);
                    }, 400);
                  }}
                  disabled={isLoadingMore}
                  className="btn-outline text-body-2 min-w-[200px] flex items-center justify-center gap-2"
                >
                  {isLoadingMore ? (
                    <>
                      <svg className="animate-spin w-5 h-5 text-main" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>در حال بارگذاری...</span>
                    </>
                  ) : (
                    <span>مشاهده آگهی‌های بیشتر ({displayedPosts.length - displayCount} آگهی دیگر)</span>
                  )}
                </button>
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
