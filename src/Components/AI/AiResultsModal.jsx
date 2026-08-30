/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isBookmarked, toggleBookmark } from "../../Utils/bookmarks";
import { translateText, translateCity, formatAdPrice, formatTimeAgo } from "../../Utils/adTranslator";
import { getSavedLanguage } from "../../Utils/i18n";
import PriceNegotiatorModal from "./PriceNegotiatorModal";
import toast from "react-hot-toast";

/**
 * AiResultsModal — Premium modal that displays AI-curated search results
 * with match scores, analysis summary, and one-click negotiation.
 */
export default function AiResultsModal({ isOpen, onClose, results, summary, query, intent }) {
  const [currentLang, setCurrentLang] = useState(getSavedLanguage());
  const [negotiatePost, setNegotiatePost] = useState(null);
  const [savedIds, setSavedIds] = useState({});

  useEffect(() => {
    const handleLang = (e) => setCurrentLang(e.detail || getSavedLanguage());
    window.addEventListener("sheypoor_lang_changed", handleLang);
    return () => window.removeEventListener("sheypoor_lang_changed", handleLang);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBookmark = (e, post) => {
    e.preventDefault();
    e.stopPropagation();
    const id = post._id || post.id;
    const isNowSaved = toggleBookmark(post);
    setSavedIds((prev) => ({ ...prev, [id]: isNowSaved }));
    toast.success(
      isNowSaved
        ? currentLang === "fa" ? "آگهی ذخیره شد" : "Ad saved"
        : currentLang === "fa" ? "از ذخیره‌شده‌ها حذف شد" : "Removed from saved"
    );
  };

  const getScoreBadge = (score) => {
    if (score >= 85) return { color: "bg-green-500/15 text-green-500 border-green-500/30", label: currentLang === "fa" ? "تطابق عالی" : "Excellent Match" };
    if (score >= 65) return { color: "bg-blue-500/15 text-blue-400 border-blue-400/30", label: currentLang === "fa" ? "تطابق خوب" : "Good Match" };
    if (score >= 45) return { color: "bg-amber-500/15 text-amber-500 border-amber-500/30", label: currentLang === "fa" ? "تطابق متوسط" : "Fair Match" };
    return { color: "bg-gray-500/15 text-gray-400 border-gray-400/30", label: currentLang === "fa" ? "مرتبط" : "Related" };
  };

  const getScoreRingColor = (score) => {
    if (score >= 85) return "#22c55e";
    if (score >= 65) return "#3b82f6";
    if (score >= 45) return "#f59e0b";
    return "#94a3b8";
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[9998] flex items-end tablet:items-center justify-center"
        dir={currentLang === "fa" ? "rtl" : "ltr"}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-dark-0/60 dark:bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div className="relative z-10 w-full max-w-2xl max-h-[90vh] bg-white dark:bg-night-card border border-light-0 dark:border-night-border rounded-t-3xl tablet:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="p-5 pb-4 border-b border-light-1 dark:border-night-border flex-shrink-0 bg-gradient-to-r from-main/10 via-transparent to-transparent">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-main to-blue-500 flex items-center justify-center text-white shadow-lg">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-body-1 font-bold text-dark-0 dark:text-white">
                    {currentLang === "fa" ? "نتایج هوش مصنوعی" : "AI Results"}
                  </h3>
                  <p className="text-body-4 text-dark-3 dark:text-gray-400">
                    {query ? `"${query}"` : ""}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-dark-3 dark:text-gray-400 hover:bg-light-2 dark:hover:bg-night-surface transition-colors"
              >
                ✕
              </button>
            </div>

            {/* AI Summary Card */}
            {summary && (
              <div className="p-3 bg-main/5 dark:bg-main/10 border border-main/20 rounded-xl">
                <div className="flex items-start gap-2">
                  <span className="text-base flex-shrink-0 mt-0.5">🧠</span>
                  <p className="text-body-3 text-dark-1 dark:text-gray-200 leading-relaxed">
                    {summary}
                  </p>
                </div>
              </div>
            )}

            {/* Stats row */}
            <div className="flex items-center gap-4 mt-3 text-body-4 text-dark-3 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {results?.length || 0} {currentLang === "fa" ? "آگهی یافت شد" : "listings found"}
              </span>
              {intent?.city && (
                <span className="flex items-center gap-1">
                  📍 {intent.city}
                </span>
              )}
              {intent?.maxPrice && (
                <span className="flex items-center gap-1">
                  💰 {currentLang === "fa" ? `حداکثر ${(intent.maxPrice / 1_000_000).toFixed(0)} میلیون` : `Max ${(intent.maxPrice / 1_000_000).toFixed(0)}M`}
                </span>
              )}
            </div>
          </div>

          {/* Results List */}
          <div className="flex-grow overflow-y-auto p-4 space-y-3 scrollbar-themed">
            {(!results || results.length === 0) ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🔍</div>
                <h4 className="text-body-1 font-bold text-dark-0 dark:text-white mb-2">
                  {currentLang === "fa" ? "نتیجه‌ای یافت نشد" : "No results found"}
                </h4>
                <p className="text-body-3 text-dark-3 dark:text-gray-400">
                  {currentLang === "fa"
                    ? "لطفاً عبارت دیگری را امتحان کنید."
                    : "Please try a different search."}
                </p>
              </div>
            ) : (
              results.map(({ ad, score }, idx) => {
                const postId = ad._id || ad.id;
                const title = translateText(ad.options?.title || ad.title || "", currentLang);
                const city = translateCity(ad.options?.city || ad.city || "", currentLang) || (currentLang === "fa" ? "ایران" : "Iran");
                const priceInfo = formatAdPrice(ad.amount || ad.options?.price || ad.options?.amount, currentLang);
                const timeLabel = formatTimeAgo(ad.createdAt || ad.options?.createdAt, currentLang);
                const hasImages = ad.images && ad.images.length > 0;
                const bookmarked = savedIds[postId] !== undefined ? savedIds[postId] : isBookmarked(postId);
                const badge = getScoreBadge(score);
                const ringColor = getScoreRingColor(score);

                return (
                  <div
                    key={postId}
                    className="group bg-light-3/50 dark:bg-night-surface/50 border border-light-0 dark:border-night-border rounded-2xl p-3 hover:border-main/40 dark:hover:border-white/20 transition-all"
                  >
                    <div className="flex gap-3">
                      {/* Thumbnail */}
                      <Link to={`/dashboard/${postId}`} onClick={onClose} className="flex-shrink-0">
                        <div className="relative w-24 h-24 tablet:w-28 tablet:h-28 rounded-xl overflow-hidden bg-light-2 dark:bg-night-card">
                          {hasImages ? (
                            <img
                              src={
                                ad.images[0]?.startsWith("http")
                                  ? ad.images[0]
                                  : `${import.meta.env.VITE_BASE_URL}${ad.images[0]}`
                              }
                              alt={title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://placehold.co/200x200/171D2A/94A3B8?text=📷";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl text-dark-4">
                              📷
                            </div>
                          )}

                          {/* Rank badge */}
                          {idx < 3 && (
                            <div className="absolute top-1.5 rtl:right-1.5 ltr:left-1.5 w-6 h-6 rounded-md bg-main text-white text-xs font-bold flex items-center justify-center shadow-md">
                              {idx + 1}
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Content */}
                      <div className="flex-grow min-w-0 flex flex-col justify-between">
                        <div>
                          <Link to={`/dashboard/${postId}`} onClick={onClose}>
                            <h4 className="text-body-2 font-semibold text-dark-0 dark:text-white line-clamp-1 group-hover:text-main transition-colors">
                              {title}
                            </h4>
                          </Link>

                          {/* Price */}
                          <div className="text-body-2 font-bold text-dark-0 dark:text-white mt-1">
                            {typeof priceInfo === "string" ? (
                              priceInfo
                            ) : (
                              <span>
                                {priceInfo.price}{" "}
                                <span className="text-body-4 font-normal text-dark-3 dark:text-gray-400">
                                  {priceInfo.currency}
                                </span>
                              </span>
                            )}
                          </div>

                          {/* Meta */}
                          <div className="text-body-4 text-dark-3 dark:text-gray-400 mt-0.5 flex items-center gap-2">
                            <span>{city}</span>
                            {timeLabel && <span>• {timeLabel}</span>}
                          </div>
                        </div>

                        {/* Bottom row: Score badge + Actions */}
                        <div className="flex items-center justify-between mt-2 gap-2">
                          {/* Score badge */}
                          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-xs font-semibold ${badge.color}`}>
                            {/* Mini circular score */}
                            <svg width="18" height="18" viewBox="0 0 36 36" className="flex-shrink-0">
                              <circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.2" />
                              <circle
                                cx="18" cy="18" r="14" fill="none" stroke={ringColor} strokeWidth="3"
                                strokeDasharray={`${(score / 100) * 88} 88`}
                                strokeLinecap="round"
                                transform="rotate(-90 18 18)"
                              />
                              <text x="18" y="22" textAnchor="middle" fill="currentColor" fontSize="11" fontWeight="bold">
                                {score}
                              </text>
                            </svg>
                            <span>{badge.label}</span>
                          </div>

                          {/* Action buttons */}
                          <div className="flex items-center gap-1.5">
                            {/* Bookmark */}
                            <button
                              onClick={(e) => handleBookmark(e, ad)}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                                bookmarked
                                  ? "bg-main text-white"
                                  : "bg-light-2 dark:bg-night-card text-dark-3 dark:text-gray-400 hover:text-main"
                              }`}
                              title={bookmarked ? "حذف نشان" : "ذخیره"}
                            >
                              <svg className="w-3.5 h-3.5" fill={bookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                              </svg>
                            </button>

                            {/* Negotiate */}
                            <button
                              onClick={() => setNegotiatePost(ad)}
                              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-main/10 dark:bg-main/20 text-main dark:text-main-lighter text-xs font-semibold hover:bg-main/20 dark:hover:bg-main/30 transition-colors"
                              title={currentLang === "fa" ? "چانه‌زنی هوشمند" : "Smart Negotiate"}
                            >
                              <span>💬</span>
                              <span>{currentLang === "fa" ? "چانه‌زنی" : "Negotiate"}</span>
                            </button>

                            {/* View */}
                            <Link
                              to={`/dashboard/${postId}`}
                              onClick={onClose}
                              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-light-2 dark:bg-night-card text-dark-2 dark:text-gray-300 text-xs font-medium hover:bg-light-1 dark:hover:bg-night-border transition-colors"
                            >
                              <span>{currentLang === "fa" ? "مشاهده" : "View"}</span>
                              <svg className={`w-3 h-3 ${currentLang === "fa" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-light-1 dark:border-night-border flex-shrink-0 flex items-center justify-between bg-white dark:bg-night-card">
            <button
              onClick={onClose}
              className="text-body-3 text-dark-3 dark:text-gray-400 hover:text-dark-0 dark:hover:text-white transition-colors"
            >
              {currentLang === "fa" ? "بستن" : "Close"}
            </button>
            <div className="flex items-center gap-1.5 text-body-4 text-dark-4 dark:text-gray-500">
              <span>⚡</span>
              <span>Powered by Gemini AI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Price Negotiator Modal */}
      <PriceNegotiatorModal
        isOpen={!!negotiatePost}
        onClose={() => setNegotiatePost(null)}
        post={negotiatePost}
      />
    </>
  );
}
