/* eslint-disable react/prop-types */
import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getmySpecificAd, delmySpecificAd } from "../Services/user";
import { isBookmarked, toggleBookmark } from "../Utils/bookmarks";
import { t, getSavedLanguage } from "../Utils/i18n";
import {
  translateText,
  translateCity,
  translateCategory,
  formatAdPrice,
  formatTimeAgo,
} from "../Utils/adTranslator";
import DeleteAdModal from "../Components/Templates/DeleteAdModal";
import ComingSoonModal, { useComingSoon } from "../Components/Layout/ComingSoonModal";
import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";

const AdPage = ({ userdata }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isFetching } = useQuery(["get-ad-id", id], () =>
    getmySpecificAd(id)
  );

  const [showFullNumber, setShowFullNumber] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [bookmarked, setBookmarked] = useState(false);
  const [currentLang, setCurrentLang] = useState(getSavedLanguage());

  const comingSoon = useComingSoon();

  const post = data?.post;
  const images = post?.images || [];

  useEffect(() => {
    const handleLangChange = (e) => setCurrentLang(e.detail || getSavedLanguage());
    window.addEventListener("sheypoor_lang_changed", handleLangChange);
    return () => window.removeEventListener("sheypoor_lang_changed", handleLangChange);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [id]);

  useEffect(() => {
    if (post) {
      setBookmarked(isBookmarked(post._id || post.id));
    }
  }, [post]);

  const handleBookmarkToggle = () => {
    if (!post) return;
    const isNowSaved = toggleBookmark(post);
    setBookmarked(isNowSaved);
    toast.success(
      isNowSaved ? t("adSaved", {}, currentLang) : t("adUnsaved", {}, currentLang)
    );
  };

  const handleShare = () => {
    const postTitle = translateText(post?.options?.title || post?.title || "Sheypoor Listing", currentLang);
    if (navigator.share) {
      navigator
        .share({
          title: postTitle,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success(currentLang === "fa" ? "لینک آگهی کپی شد!" : "Listing link copied!");
    }
  };

  const confirmDeleteHandler = async () => {
    setIsDeleting(true);
    setDeleteError("");
    try {
      await delmySpecificAd(id);
      toast.success(currentLang === "fa" ? "آگهی با موفقیت حذف شد" : "Listing deleted successfully");
      setIsDeleteModalOpen(false);
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      const msg = err.response?.data?.message || (currentLang === "fa" ? "خطا در حذف آگهی." : "Error deleting listing.");
      setDeleteError(msg);
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const getImageUrl = (img) => {
    if (!img) return "https://placehold.co/800x600/F2F2F5/8F90A6?text=No+Photo";
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    return `${import.meta.env.VITE_BASE_URL}${img}`;
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-light-3 dark:bg-night-bg py-8">
        <div className="max-w-container mx-auto px-4">
          <div className="h-6 w-48 skeleton mb-6" />
          <div className="grid grid-cols-1 laptop:grid-cols-12 gap-6">
            <div className="laptop:col-span-8 space-y-4">
              <div className="aspect-[16/10] skeleton rounded-sheypoor-lg" />
              <div className="h-24 skeleton rounded-sheypoor-lg" />
              <div className="h-40 skeleton rounded-sheypoor-lg" />
            </div>
            <div className="laptop:col-span-4 space-y-4">
              <div className="h-48 skeleton rounded-sheypoor-lg" />
              <div className="h-32 skeleton rounded-sheypoor-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-light-3 dark:bg-night-bg flex flex-col items-center justify-center py-20 px-4 text-center">
        <h2 className="text-heading-3 text-dark-1 dark:text-white mb-2">{t("noAdsFound", {}, currentLang)}</h2>
        <p className="text-body-2 text-dark-3 dark:text-gray-400 mb-6">
          {currentLang === "fa" ? "آگهی مورد نظر یافت نشد یا ممکن است حذف شده باشد." : "The requested listing does not exist or has been removed."}
        </p>
        <Link to="/" className="btn-primary">
          {t("home", {}, currentLang)}
        </Link>
      </div>
    );
  }

  const rawTitle = post.options?.title || post.title || "";
  const postTitle = translateText(rawTitle, currentLang);
  const rawCity = post.options?.city || post.city || "";
  const postCity = translateCity(rawCity, currentLang);
  const rawContent = post.options?.content || post.content || "";
  const postContent = translateText(rawContent, currentLang);
  const rawCategoryName = post.categoryName?.trim() || (typeof post.category === "string" ? post.category : post.category?.name || post.category?.slug) || "";
  const postCategory = translateCategory(rawCategoryName, currentLang) || rawCategoryName;
  const priceInfo = formatAdPrice(post.amount, currentLang);
  const timeLabel = formatTimeAgo(post.createdAt, currentLang);

  // Check ownership
  const isOwner =
    userdata &&
    (userdata._id === post.userId ||
      userdata.id === post.userId ||
      (userdata.mobile && post.userMobile && userdata.mobile === post.userMobile));

  const isAdmin = userdata?.role === "ADMIN";
  const canManage = isOwner || isAdmin;

  return (
    <div className="min-h-screen bg-light-3 dark:bg-night-bg text-dark-0 dark:text-white pb-16 pt-4 transition-colors">
      <div className="max-w-container mx-auto px-4">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-body-3 text-dark-3 dark:text-gray-400 mb-5 overflow-x-auto scrollbar-hide py-1">
          <Link to="/" className="hover:text-main dark:hover:text-white transition-colors whitespace-nowrap">
            {t("home", {}, currentLang)}
          </Link>
          <svg className="w-4 h-4 text-dark-4 dark:text-gray-600 flex-shrink-0 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {post.category && (
            <>
              <Link to={`/category/${post.category}`} className="hover:text-main dark:hover:text-white transition-colors whitespace-nowrap">
                {postCategory || t("categories", {}, currentLang)}
              </Link>
              <svg className="w-4 h-4 text-dark-4 dark:text-gray-600 flex-shrink-0 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
          <span className="text-dark-3 dark:text-gray-400 whitespace-nowrap">{postCity}</span>
          <svg className="w-4 h-4 text-dark-4 dark:text-gray-600 flex-shrink-0 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-dark-0 dark:text-white font-medium whitespace-nowrap line-clamp-1">{postTitle}</span>
        </nav>

        {/* 12-Column Grid */}
        <div className="grid grid-cols-1 laptop:grid-cols-12 gap-6">
          {/* ===== Main Content (8 cols) ===== */}
          <div className="laptop:col-span-8 space-y-5">
            {/* Full Size Image Gallery Frame */}
            <div className="relative rounded-sheypoor-lg overflow-hidden bg-white dark:bg-night-card border border-light-0 dark:border-night-border shadow-card dark:shadow-card-dark">
              {images.length > 0 ? (
                <div className="flex flex-col">
                  {/* Main Full-Size Image Container */}
                  <div
                    className="relative w-full aspect-[16/10] laptop:aspect-[16/9] bg-light-2 dark:bg-night-surface flex items-center justify-center cursor-zoom-in overflow-hidden"
                    onClick={() => setShowLightbox(true)}
                  >
                    <img
                      className="w-full h-full object-contain max-h-[520px] transition-transform duration-300 hover:scale-[1.02]"
                      src={getImageUrl(images[currentImageIndex])}
                      alt={postTitle}
                    />

                    {/* Nav Arrows */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex((i) => (i > 0 ? i - 1 : images.length - 1));
                          }}
                          className="absolute rtl:right-3 ltr:left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 dark:bg-night-card/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white dark:hover:bg-night-border transition-colors text-dark-1 dark:text-white"
                          aria-label="Previous"
                        >
                          <svg className="w-5 h-5 rtl:rotate-0 ltr:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex((i) => (i < images.length - 1 ? i + 1 : 0));
                          }}
                          className="absolute rtl:left-3 ltr:right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 dark:bg-night-card/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white dark:hover:bg-night-border transition-colors text-dark-1 dark:text-white"
                          aria-label="Next"
                        >
                          <svg className="w-5 h-5 rtl:rotate-180 ltr:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}

                    {/* Photo Count Badge */}
                    <div className="absolute top-4 rtl:left-4 ltr:right-4 z-20 bg-dark-0/70 dark:bg-night-bg/80 backdrop-blur-sm text-white text-body-4 px-3 py-1 rounded-full flex items-center gap-1.5 font-mono">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{currentImageIndex + 1} / {images.length}</span>
                    </div>
                  </div>

                  {/* Thumbnail Row */}
                  {images.length > 1 && (
                    <div className="flex items-center gap-2 p-3 bg-white dark:bg-night-card border-t border-light-1 dark:border-night-border overflow-x-auto scrollbar-hide">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-16 h-16 rounded-sheypoor overflow-hidden flex-shrink-0 border-2 transition-all ${
                            idx === currentImageIndex ? "border-main dark:border-white scale-105 shadow-sm" : "border-transparent opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={getImageUrl(img)}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center aspect-[16/10] bg-light-2 dark:bg-night-surface">
                  <div className="text-center text-dark-3 dark:text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-2 text-dark-4 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-body-2">{currentLang === "fa" ? "بدون تصویر" : "No Photo"}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Title + Price + Actions */}
            <div className="bg-white dark:bg-night-card rounded-sheypoor-lg p-6 border border-light-0 dark:border-night-border shadow-card dark:shadow-card-dark">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-grow">
                  <h1 className="text-heading-3 text-dark-0 dark:text-white mb-3 leading-relaxed font-bold">
                    {postTitle}
                  </h1>
                  <div className="flex items-center gap-2">
                    {typeof priceInfo === "string" ? (
                      <span className="text-heading-3 font-bold text-dark-0 dark:text-white">{priceInfo}</span>
                    ) : (
                      <>
                        <span className="text-heading-3 font-bold text-dark-0 dark:text-white">{priceInfo.price}</span>
                        <span className="text-heading-5 text-dark-3 dark:text-gray-400 font-normal">{priceInfo.currency}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Quick Actions (Share & Bookmark) */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={handleShare}
                    className="w-10 h-10 rounded-full bg-light-2 dark:bg-night-surface flex items-center justify-center hover:bg-light-1 dark:hover:bg-night-border transition-colors text-dark-2 dark:text-gray-300"
                    title="Share"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>

                  <button
                    onClick={handleBookmarkToggle}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      bookmarked
                        ? "bg-main text-white dark:bg-white dark:text-black shadow-md"
                        : "bg-light-2 dark:bg-night-surface text-dark-2 dark:text-gray-300 hover:bg-light-1 dark:hover:bg-night-border"
                    }`}
                    title={bookmarked ? t("adUnsaved", {}, currentLang) : t("adSaved", {}, currentLang)}
                  >
                    <svg className="w-5 h-5" fill={bookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex items-center gap-3 mt-4 text-body-3 text-dark-3 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{postCity}</span>
                </div>
                <span className="text-dark-4 dark:text-gray-600">·</span>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{timeLabel}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-night-card rounded-sheypoor-lg p-6 border border-light-0 dark:border-night-border shadow-card dark:shadow-card-dark">
              <h3 className="text-heading-4 text-dark-0 dark:text-white font-bold mb-4">
                {t("description", {}, currentLang)}
              </h3>
              <div className="text-body-1 text-dark-2 dark:text-gray-300 leading-8 whitespace-pre-line">
                {postContent}
              </div>
            </div>

            {/* Safety Tips */}
            <div className="bg-accent-orange-bg dark:bg-orange-950/40 rounded-sheypoor-lg p-5 border border-accent-orange/20 dark:border-orange-800/40">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-accent-orange flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h4 className="text-body-1 font-semibold text-dark-0 dark:text-white mb-1">
                    {currentLang === "fa" ? "راهنمای خرید امن" : currentLang === "de" ? "Sicherheits-Leitfaden" : "Safe Shopping Guide"}
                  </h4>
                  <p className="text-body-3 text-dark-2 dark:text-gray-300 leading-6">
                    {t("safetyWarning", {}, currentLang)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ===== Sidebar (4 cols) ===== */}
          <div className="laptop:col-span-4">
            <div className="laptop:sticky laptop:top-28 space-y-4">
              {/* Seller Contact Card */}
              <div className="bg-white dark:bg-night-card rounded-sheypoor-lg p-6 border border-light-0 dark:border-night-border shadow-card dark:shadow-card-dark">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-14 h-14 rounded-full bg-light-2 dark:bg-night-surface flex items-center justify-center">
                    <svg className="w-8 h-8 text-dark-4 dark:text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-body-1 font-semibold text-dark-0 dark:text-white">
                      {currentLang === "fa" ? "کاربر شیپور" : "Sheypoor Member"}
                    </h4>
                    <p className="text-body-3 text-dark-3 dark:text-gray-400">
                      {currentLang === "fa" ? "عضو فعال" : "Verified User"}
                    </p>
                  </div>
                </div>

                {/* Primary CTA: Call */}
                <button
                  onClick={() => setShowFullNumber(true)}
                  className="btn-primary w-full mb-3 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>
                    {showFullNumber && post.userMobile
                      ? post.userMobile
                      : t("sellerPhone", {}, currentLang)}
                  </span>
                </button>

                {/* Secondary CTA: Chat */}
                <button
                  type="button"
                  onClick={comingSoon.open}
                  className="btn-outline w-full flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>{t("messages", {}, currentLang)}</span>
                </button>
              </div>

              {/* Management Card */}
              {canManage && (
                <div className="bg-white dark:bg-night-card rounded-sheypoor-lg p-6 border border-light-0 dark:border-night-border shadow-card dark:shadow-card-dark space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-heading-5 text-dark-0 dark:text-white font-bold">
                      {currentLang === "fa" ? "مدیریت آگهی" : "Listing Management"}
                    </h4>
                    {isAdmin && (
                      <span className="badge-promoted">Admin</span>
                    )}
                  </div>

                  <Link
                    to={`/dashboard/update/${id}`}
                    className="btn-outline w-full text-body-3 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>{currentLang === "fa" ? "ویرایش آگهی" : "Edit Listing"}</span>
                  </Link>

                  <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="btn-danger w-full text-body-3 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>{t("deleteAd", {}, currentLang)}</span>
                  </button>
                </div>
              )}

              {/* View Others Link */}
              <Link to="/" className="block text-center text-body-3 text-main dark:text-white font-medium hover:underline py-2">
                {currentLang === "fa" ? "← مشاهده سایر آگهی‌ها" : "← Browse other listings"}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Ad Custom Modal */}
      <DeleteAdModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setDeleteError(""); }}
        onConfirm={confirmDeleteHandler}
        adTitle={postTitle}
        isLoading={isDeleting}
        error={deleteError}
      />

      {/* Coming Soon Modal */}
      <ComingSoonModal isOpen={comingSoon.isOpen} onClose={comingSoon.close} />

      {/* Fullscreen Lightbox */}
      {showLightbox && images.length > 0 && (
        <div
          className="fixed inset-0 bg-dark-0/95 z-[100] flex items-center justify-center"
          onClick={() => setShowLightbox(false)}
        >
          <button
            className="absolute top-4 rtl:right-4 ltr:left-4 z-[101] w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            onClick={() => setShowLightbox(false)}
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            className="max-w-[90vw] max-h-[85vh] object-contain"
            src={getImageUrl(images[currentImageIndex])}
            alt={postTitle}
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((i) => (i > 0 ? i - 1 : images.length - 1));
                }}
                className="absolute rtl:right-4 ltr:left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <svg className="w-6 h-6 text-white rtl:rotate-0 ltr:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((i) => (i < images.length - 1 ? i + 1 : 0));
                }}
                className="absolute rtl:left-4 ltr:right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <svg className="w-6 h-6 text-white rtl:rotate-180 ltr:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-body-2 bg-dark-1/60 px-4 py-1 rounded-full font-mono">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>
      )}

      <Toaster />
    </div>
  );
};

export default AdPage;
