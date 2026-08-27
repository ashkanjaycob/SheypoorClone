/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { t, getSavedLanguage } from "../../Utils/i18n";

/**
 * Modern Delete Ad Confirmation Modal with dark mode & i18n
 */
function DeleteAdModal({ isOpen, onClose, onConfirm, adTitle, isLoading, error }) {
  const [currentLang, setCurrentLang] = useState(getSavedLanguage());

  useEffect(() => {
    const handleLangChange = (e) => setCurrentLang(e.detail || getSavedLanguage());
    window.addEventListener("sheypoor_lang_changed", handleLangChange);
    return () => window.removeEventListener("sheypoor_lang_changed", handleLangChange);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-dark-0/60 dark:bg-black/75 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div
        className="bg-white dark:bg-night-card rounded-sheypoor-xl shadow-modal dark:shadow-modal-dark border border-light-0 dark:border-night-border p-7 max-w-sm w-full text-center animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Danger Icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-red-bg dark:bg-red-950/60 flex items-center justify-center">
          <svg className="w-8 h-8 text-accent-red dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        <h3 className="text-heading-4 text-dark-0 dark:text-white font-bold mb-2">
          {t("deleteAd", {}, currentLang)}
        </h3>
        <p className="text-body-2 text-dark-3 dark:text-gray-300 mb-2 leading-6">
          {t("deleteAdConfirm", {}, currentLang)}
        </p>
        {adTitle && (
          <p className="text-body-2 font-semibold text-dark-1 dark:text-white mb-5 line-clamp-2">
            «{adTitle}»
          </p>
        )}

        {error && (
          <div className="mb-4 p-3 bg-accent-red-bg dark:bg-red-950/60 text-accent-red dark:text-red-300 text-body-3 rounded-sheypoor">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 btn-outline !border-light-0 dark:!border-night-border !text-dark-2 dark:!text-gray-300"
          >
            {t("cancel", {}, currentLang)}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 h-12 px-6 rounded-full bg-accent-red hover:bg-red-600 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>{t("deleting", {}, currentLang)}</span>
              </>
            ) : (
              t("confirmDelete", {}, currentLang)
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteAdModal;
