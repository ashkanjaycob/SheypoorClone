import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllAds } from "../Services/user";
import { getCategory } from "../Services/Admin";
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

function Category() {
  const [categoryTitle, setCategoryTitle] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const { id } = useParams();
  const categorySlug = id;

  const { data, isLoading } = useQuery(["get-all-ads", categorySlug], () =>
    getAllAds(categorySlug)
  );
  const { data: categoriesList } = useQuery(["get-categories"], getCategory);

  const [displayCount, setDisplayCount] = useState(12);
  const handleLoadMore = () => setDisplayCount((c) => c + 12);

  useEffect(() => {
    if (categoriesList && Array.isArray(categoriesList)) {
      const found = categoriesList.find((c) => c._id === categorySlug);
      setCategoryTitle(found?.name || "دسته‌بندی");
    }
  }, [categorySlug, categoriesList]);

  const filteredPosts = data?.posts?.filter(
    (post) =>
      post.category === categorySlug || post.category?._id === categorySlug
  ) || [];

  const filters = [
    { id: "all", label: "همه" },
    { id: "photo", label: "عکس‌دار" },
    { id: "cheap", label: "ارزان‌ترین" },
    { id: "expensive", label: "گران‌ترین" },
  ];

  let displayedPosts = [...filteredPosts];
  if (activeFilter === "photo") {
    displayedPosts = displayedPosts.filter((p) => p.images?.length > 0);
  } else if (activeFilter === "cheap") {
    displayedPosts.sort((a, b) => a.amount - b.amount);
  } else if (activeFilter === "expensive") {
    displayedPosts.sort((a, b) => b.amount - a.amount);
  }

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
          <span className="text-dark-0 font-medium whitespace-nowrap">{categoryTitle}</span>
        </nav>

        {/* Title */}
        <div className="flex items-center gap-3 mb-5">
          <img className="w-6 h-6" src="/sheypoorBlack.svg" alt="" />
          <h1 className="text-heading-4 text-dark-0">
            آگهی‌های <span className="text-main">{categoryTitle}</span>
          </h1>
          {filteredPosts.length > 0 && (
            <span className="text-body-3 text-dark-3 mr-auto">
              {filteredPosts.length} آگهی
            </span>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
          {/* Filter icon chip */}
          <button className="chip flex-shrink-0 !gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>فیلتر</span>
          </button>

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

          {/* Save search */}
          <button className="chip flex-shrink-0 !gap-1 mr-auto">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span>ذخیره جستجو</span>
          </button>
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
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <svg className="h-16 w-16 text-dark-4 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-heading-4 text-dark-2 mb-2">آگهی‌ای یافت نشد</h3>
            <p className="text-body-2 text-dark-3">در این دسته‌بندی هنوز آگهی ثبت نشده است</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 sdesktop:grid-cols-6 gap-4">
              {displayedPosts.slice(0, displayCount).map((post) => (
                <Link
                  key={post._id}
                  to={`/dashboard/${post._id}`}
                  className="block group"
                >
                  <div className="card-sheypoor overflow-hidden flex flex-row-reverse laptop:flex-col h-full">
                    {/* Image */}
                    <div className="relative w-[120px] h-[120px] laptop:w-full laptop:h-auto laptop:aspect-square flex-shrink-0 bg-light-2 overflow-hidden">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        src={
                          post.images?.[0]?.startsWith("http")
                            ? post.images[0]
                            : `${import.meta.env.VITE_BASE_URL}${post.images?.[0] || ""}`
                        }
                        alt={post.options?.title || "عکس آگهی"}
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

            {displayedPosts.length > displayCount && (
              <div className="flex justify-center mt-8">
                <button onClick={handleLoadMore} className="btn-outline text-body-2">
                  مشاهده آگهی‌های بیشتر
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Category;
