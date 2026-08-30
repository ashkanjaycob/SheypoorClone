/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { generateNegotiationProposal } from "../../Services/aiAgent";
import { sp } from "../../Utils/Numbers";
import { t, getSavedLanguage } from "../../Utils/i18n";
import toast from "react-hot-toast";

export default function PriceNegotiatorModal({ isOpen, onClose, post }) {
  const [strategy, setStrategy] = useState("friendly");
  const [discountPercent, setDiscountPercent] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [proposal, setProposal] = useState(null);
  const [copied, setCopied] = useState(false);
  const [currentLang, setCurrentLang] = useState(getSavedLanguage());

  const rawTitle = post?.options?.title || post?.title || "";
  const rawCity = post?.options?.city || post?.city || "";
  const amount = Number(post?.amount || post?.options?.price || post?.options?.amount) || 0;

  useEffect(() => {
    const handleLang = (e) => setCurrentLang(e.detail || getSavedLanguage());
    window.addEventListener("sheypoor_lang_changed", handleLang);
    return () => window.removeEventListener("sheypoor_lang_changed", handleLang);
  }, []);

  // Calculate target offer price
  const offerPriceNum = amount > 0 ? Math.round(amount * (1 - discountPercent / 100)) : 0;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setCopied(false);
    try {
      const res = await generateNegotiationProposal({
        adTitle: rawTitle,
        amount,
        city: rawCity,
        description: post?.description || post?.options?.description || "",
        strategy,
        targetDiscountPercent: discountPercent,
        currentLang,
      });
      setProposal(res);
    } catch (err) {
      toast.error(err.message || "خطا در تولید پیشنهاد");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (isOpen && post) {
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, post, strategy, discountPercent]);

  if (!isOpen || !post) return null;

  const handleCopy = () => {
    if (proposal?.messageText) {
      navigator.clipboard.writeText(proposal.messageText);
      setCopied(true);
      toast.success(t("messageCopied", {}, currentLang) || "متن پیام در کلیپ‌بورد کپی شد!");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-dark-0/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white dark:bg-night-card border border-light-0 dark:border-night-border rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative text-dark-0 dark:text-white"
        dir={currentLang === "fa" ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="p-5 border-b border-light-1 dark:border-night-border flex items-center justify-between flex-shrink-0 bg-gradient-to-r from-main/10 via-transparent to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-main text-white flex items-center justify-center text-xl shadow-md">
              🤝
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-body-1 font-bold">
                  {t("negotiatorTitle", {}, currentLang) || "دستیار مذاکره و چانه‌زنی قیمت"}
                </h3>
                <span className="text-[10px] bg-main/20 text-main dark:text-main-lighter font-medium px-2 py-0.5 rounded-full">
                  {currentLang === "fa" ? "هوش مصنوعی" : "AI"}
                </span>
              </div>
              <p className="text-body-4 text-dark-3 dark:text-gray-400">
                {t("negotiatorSubtitle", {}, currentLang) || "تولید پیام‌های هوشمند و متقاعدکننده برای تخفیف گرفتن از فروشنده"}
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

        {/* Scrollable Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-grow scrollbar-themed">
          {/* Ad Summary Card */}
          <div className="p-3.5 bg-light-2 dark:bg-night-surface border border-light-0 dark:border-night-border rounded-xl flex items-center gap-3">
            {post.images?.[0] ? (
              <img
                src={
                  post.images[0].startsWith("http")
                    ? post.images[0]
                    : `${import.meta.env.VITE_BASE_URL}${post.images[0]}`
                }
                alt={rawTitle}
                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-dark-0/10 flex items-center justify-center text-2xl">
                📦
              </div>
            )}
            <div className="min-w-0 flex-grow">
              <h4 className="text-body-2 font-semibold line-clamp-1">{rawTitle}</h4>
              <div className="flex items-center gap-2 text-body-4 text-dark-3 dark:text-gray-400 mt-0.5">
                <span>قیمت درج‌شده:</span>
                <span className="font-bold text-dark-0 dark:text-white">
                  {amount > 0 ? `${sp(amount)} تومان` : "توافقی"}
                </span>
              </div>
            </div>
          </div>

          {/* Strategy Tabs */}
          <div>
            <label className="text-body-3 font-semibold block mb-2">
              {t("selectStrategy", {}, currentLang) || "انتخاب استراتژی مذاکره:"}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "friendly", label: "مودبانه و منصفانه", icon: "🌿", discount: 8 },
                { id: "expert", label: "کارشناسی بازار", icon: "💼", discount: 15 },
                { id: "cash", label: "تسویه نقدی فوری", icon: "⚡", discount: 20 },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setStrategy(s.id);
                    setDiscountPercent(s.discount);
                  }}
                  className={`py-2.5 px-2 rounded-xl text-xs font-medium border flex flex-col items-center gap-1 transition-all ${
                    strategy === s.id
                      ? "border-main bg-main/10 text-main dark:text-white font-bold shadow-xs scale-102"
                      : "border-light-0 dark:border-night-border bg-light-2 dark:bg-night-surface text-dark-2 dark:text-gray-300 hover:border-main/40"
                  }`}
                >
                  <span className="text-lg">{s.icon}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Discount Slider */}
          {amount > 0 && (
            <div className="p-3.5 bg-light-2 dark:bg-night-surface border border-light-0 dark:border-night-border rounded-xl">
              <div className="flex items-center justify-between text-body-3 mb-2">
                <span className="font-medium text-dark-2 dark:text-gray-300">درصد تخفیف پیشنهادی:</span>
                <span className="font-bold text-main dark:text-main-lighter font-mono text-base">
                  {discountPercent}٪ تخفیف
                </span>
              </div>
              <input
                type="range"
                min={3}
                max={35}
                step={1}
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full h-2 bg-light-0 dark:bg-night-border rounded-lg appearance-none cursor-pointer accent-main"
              />
              <div className="flex items-center justify-between text-xs text-dark-3 dark:text-gray-400 mt-2">
                <span>قیمت پیشنهادی خریدار:</span>
                <span className="font-bold text-green-600 dark:text-green-400 text-sm">
                  {sp(offerPriceNum)} تومان
                </span>
              </div>
            </div>
          )}

          {/* Generated Negotiation Output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-body-3 font-semibold flex items-center gap-1.5">
                <span>✨ متن پیام آماده برای ارسال به فروشنده:</span>
                {isGenerating && (
                  <span className="text-xs text-main animate-pulse">در حال نگارش با هوش مصنوعی...</span>
                )}
              </label>
            </div>

            <div className="relative">
              <textarea
                value={proposal?.messageText || ""}
                onChange={(e) =>
                  setProposal((prev) => ({ ...prev, messageText: e.target.value }))
                }
                rows={4}
                placeholder="متن پیام در حال تولید..."
                className="w-full p-3.5 bg-light-1 dark:bg-night-surface border border-light-0 dark:border-night-border rounded-xl text-body-2 focus:outline-none focus:border-main leading-relaxed resize-none"
              />

              <button
                type="button"
                onClick={handleCopy}
                disabled={!proposal?.messageText}
                className="absolute rtl:left-3 ltr:right-3 bottom-3 px-3 py-1.5 rounded-lg bg-main hover:bg-main-lighter text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
              >
                <span>{copied ? "✓ کپی شد" : "📋 کپی متن پیام"}</span>
              </button>
            </div>

            {/* AI Reasoning / Tips */}
            {proposal?.reasoning && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-800 dark:text-blue-200 flex items-start gap-2">
                <span className="text-base flex-shrink-0">💡</span>
                <p className="leading-relaxed">{proposal.reasoning}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-light-1 dark:border-night-border flex items-center justify-between flex-shrink-0 bg-light-2/50 dark:bg-night-surface/50">
          <span className="text-[11px] text-dark-3 dark:text-gray-400">
            {currentLang === "fa" ? "طراحی شده با هوش مصنوعی شیپور" : "Powered by Sheypoor AI"}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-body-3 font-medium text-dark-3 hover:bg-light-2 dark:hover:bg-night-surface transition-colors"
            >
              بستن
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="btn-primary px-5 py-2 rounded-xl text-body-3 flex items-center gap-1.5"
            >
              <span>📋 کپی و آماده‌سازی</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
