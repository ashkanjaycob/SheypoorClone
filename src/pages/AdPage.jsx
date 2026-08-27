/* eslint-disable react/prop-types */
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getmySpecificAd, delmySpecificAd } from "../Services/user";
import { sp } from "../Utils/Numbers";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";

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

const AdPage = ({ userdata }) => {
  const { id } = useParams();
  const { data, isFetching } = useQuery(["get-ad-id", id], () =>
    getmySpecificAd(id)
  );
  const [showFullNumber, setShowFullNumber] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const deleteadHandler = async () => {
    if (!window.confirm("آیا از حذف این آگهی اطمینان دارید؟")) return;
    try {
      await delmySpecificAd(id);
      toast.success("آگهی با موفقیت حذف شد.");
      setTimeout(() => window.location.href = "/", 1500);
    } catch {
      toast.error("مشکلی پیش آمده است!");
    }
  };

  const post = data?.post;
  const images = post?.images || [];

  // Skeleton Loading
  if (isFetching) {
    return (
      <div className="min-h-screen bg-light-3">
        <div className="max-w-container mx-auto px-4 py-6">
          <div className="h-4 skeleton w-48 mb-6" />
          <div className="grid grid-cols-1 laptop:grid-cols-12 gap-6">
            <div className="laptop:col-span-8 space-y-4">
              <div className="aspect-[4/3] skeleton rounded-sheypoor-lg" />
              <div className="h-8 skeleton w-3/4" />
              <div className="h-6 skeleton w-1/3" />
              <div className="grid grid-cols-3 gap-3">
                {[1,2,3,4,5,6].map(i => <div key={i} className="h-20 skeleton rounded-sheypoor" />)}
              </div>
            </div>
            <div className="laptop:col-span-4">
              <div className="h-64 skeleton rounded-sheypoor-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-light-3 flex flex-col items-center justify-center">
        <svg className="h-20 w-20 text-dark-4 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-heading-3 text-dark-1 mb-3">آگهی یافت نشد</h2>
        <p className="text-body-1 text-dark-3 mb-6">آگهی مورد نظر حذف شده یا وجود ندارد</p>
        <Link to="/" className="btn-primary">بازگشت به صفحه اصلی</Link>
      </div>
    );
  }

  const getImageUrl = (img) =>
    img?.startsWith("http") ? img : `${import.meta.env.VITE_BASE_URL}${img}`;

  return (
    <div className="min-h-screen bg-light-3">
      <div className="max-w-container mx-auto px-4 py-4 laptop:py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-body-3 text-dark-3 mb-4 overflow-x-auto scrollbar-hide">
          <Link to="/" className="hover:text-main transition-colors whitespace-nowrap">خانه</Link>
          <svg className="w-4 h-4 text-dark-4 flex-shrink-0 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-dark-3 whitespace-nowrap">{post.options.city || "ایران"}</span>
          <svg className="w-4 h-4 text-dark-4 flex-shrink-0 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-dark-0 font-medium whitespace-nowrap line-clamp-1">{post.options.title}</span>
        </nav>

        {/* 12-Column Grid: 8 col content + 4 col sidebar */}
        <div className="grid grid-cols-1 laptop:grid-cols-12 gap-6">
          {/* ===== LEFT: Main Content (8 cols) ===== */}
          <div className="laptop:col-span-8 space-y-5">
            {/* Image Gallery */}
            <div className="relative rounded-sheypoor-lg overflow-hidden bg-dark-1">
              {images.length > 0 ? (
                <>
                  {/* Blurred Background */}
                  <div
                    className="absolute inset-0 bg-cover bg-center blur-3xl opacity-30 scale-110"
                    style={{ backgroundImage: `url(${getImageUrl(images[currentImageIndex])})` }}
                  />
                  {/* Main Image */}
                  <div
                    className="relative flex items-center justify-center min-h-[280px] laptop:min-h-[420px] cursor-pointer"
                    onClick={() => setShowLightbox(true)}
                  >
                    <img
                      className="max-w-full max-h-[420px] object-contain relative z-10"
                      src={getImageUrl(images[currentImageIndex])}
                      alt={post.options.title}
                    />
                  </div>
                  {/* Nav Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImageIndex((i) => (i > 0 ? i - 1 : images.length - 1))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                      >
                        <svg className="w-5 h-5 text-dark-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setCurrentImageIndex((i) => (i < images.length - 1 ? i + 1 : 0))}
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                      >
                        <svg className="w-5 h-5 text-dark-1 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      {/* Dot Indicators */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                        {images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              idx === currentImageIndex ? "bg-white w-6" : "bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  {/* Photo Count */}
                  <div className="absolute top-4 left-4 z-20 bg-dark-1/70 backdrop-blur-sm text-white text-body-4 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{currentImageIndex + 1} / {images.length}</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center min-h-[280px] bg-light-2">
                  <div className="text-center text-dark-3">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-body-2">بدون تصویر</span>
                  </div>
                </div>
              )}
            </div>

            {/* Title + Price + Actions */}
            <div className="bg-white rounded-sheypoor-lg p-5 border border-light-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-grow">
                  <h1 className="text-heading-4 laptop:text-heading-3 text-dark-0 mb-3 leading-relaxed">
                    {post.options.title}
                  </h1>
                  <div className="flex items-center gap-2">
                    <span className="text-heading-4 font-bold text-dark-0">
                      {post.amount > 0 ? sp(post.amount) : "توافقی"}
                    </span>
                    {post.amount > 0 && (
                      <img className="w-5 h-5" src="/Toman.svg" alt="تومان" />
                    )}
                  </div>
                </div>
                {/* Action Icons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className="w-10 h-10 rounded-full bg-light-2 flex items-center justify-center hover:bg-light-1 transition-colors" title="اشتراک‌گذاری">
                    <svg className="w-5 h-5 text-dark-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                  <button className="w-10 h-10 rounded-full bg-light-2 flex items-center justify-center hover:bg-light-1 transition-colors" title="ذخیره">
                    <svg className="w-5 h-5 text-dark-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex items-center gap-3 mt-4 text-body-3 text-dark-3">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{post.options.city}</span>
                </div>
                <span className="text-dark-4">·</span>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{timeAgo(post.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-sheypoor-lg p-5 border border-light-0">
              <h3 className="text-heading-5 text-dark-0 mb-3">توضیحات آگهی</h3>
              <div className="text-body-2 text-dark-2 leading-8 whitespace-pre-line">
                {post.options.content}
              </div>
            </div>

            {/* Phone Number */}
            <div className="bg-white rounded-sheypoor-lg p-5 border border-light-0">
              <div className="flex items-center justify-between">
                <span className="text-heading-5 text-dark-0">شماره تماس</span>
                <button
                  onClick={() => setShowFullNumber(!showFullNumber)}
                  className={`text-body-1 font-medium transition-colors ${
                    showFullNumber ? "text-main" : "text-main hover:text-main-darker"
                  }`}
                  dir="ltr"
                >
                  {showFullNumber ? (
                    post.userMobile
                  ) : (
                    <span className="flex items-center gap-2">
                      {post.userMobile?.replace(/^(\d{4})(.*)/, "$1****")}
                      <span className="text-body-3 bg-light-special text-main px-3 py-1 rounded-full">
                        نمایش شماره
                      </span>
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Safety Guide */}
            <div className="bg-accent-orange-bg rounded-sheypoor-lg p-4 border border-accent-orange/20">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent-orange flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h4 className="text-body-2 font-semibold text-dark-0 mb-1">نکات ایمنی خرید</h4>
                  <p className="text-body-3 text-dark-2">
                    قبل از خرید، حتماً کالا را به‌صورت حضوری بررسی کنید و از واریز وجه قبل از دریافت کالا خودداری نمایید.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ===== RIGHT: Sticky Sidebar (4 cols) ===== */}
          <div className="laptop:col-span-4">
            <div className="laptop:sticky laptop:top-28 space-y-4">
              {/* Seller Card */}
              <div className="bg-white rounded-sheypoor-lg p-5 border border-light-0">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-14 h-14 rounded-full bg-light-2 flex items-center justify-center">
                    <svg className="w-8 h-8 text-dark-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-body-1 font-semibold text-dark-0">کاربر شیپور</h4>
                    <p className="text-body-3 text-dark-3">عضویت در شیپور</p>
                  </div>
                </div>

                {/* CTA Buttons */}
                <button
                  onClick={() => setShowFullNumber(!showFullNumber)}
                  className="btn-primary w-full mb-3 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>اطلاعات تماس</span>
                </button>

                <button className="btn-outline w-full flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>چت با فروشنده</span>
                </button>
              </div>

              {/* Management Actions (for owner/admin) */}
              {userdata && (
                <div className="bg-white rounded-sheypoor-lg p-5 border border-light-0 space-y-3">
                  <h4 className="text-heading-6 text-dark-2 mb-1">مدیریت آگهی</h4>
                  <Link
                    to={`/dashboard/update/${id}`}
                    className="btn-outline w-full flex items-center justify-center gap-2 text-body-3"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    ویرایش آگهی
                  </Link>
                  <button
                    onClick={deleteadHandler}
                    className="w-full py-3 bg-accent-red-bg text-accent-red font-semibold rounded-full hover:bg-red-100 transition-colors text-body-3 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    حذف آگهی
                  </button>
                  {userdata.role === "ADMIN" && (
                    <p className="text-body-4 text-dark-3 text-center pt-1">
                      شما با دسترسی ادمین وارد شده‌اید
                    </p>
                  )}
                </div>
              )}

              {/* View Others Link */}
              <Link to="/" className="block text-center text-body-3 text-main hover:text-main-darker transition-colors py-2">
                مشاهده سایر آگهی‌ها
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && images.length > 0 && (
        <div
          className="fixed inset-0 bg-dark-0/95 z-[100] flex items-center justify-center"
          onClick={() => setShowLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 z-[101] w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            onClick={() => setShowLightbox(false)}
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            className="max-w-[90vw] max-h-[85vh] object-contain"
            src={getImageUrl(images[currentImageIndex])}
            alt={post.options.title}
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((i) => (i > 0 ? i - 1 : images.length - 1)); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((i) => (i < images.length - 1 ? i + 1 : 0)); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <svg className="w-6 h-6 text-white rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-body-2 bg-dark-1/50 px-4 py-1 rounded-full">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>
      )}

      <Toaster />
    </div>
  );
};

export default AdPage;
