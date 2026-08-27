/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { t, getSavedLanguage } from "../../Utils/i18n";

/**
 * Coming Soon Modal with dark mode & i18n
 */
function ComingSoonModal({ isOpen, onClose }) {
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
    >
      <div
        className="bg-white dark:bg-night-card rounded-sheypoor-xl shadow-modal dark:shadow-modal-dark border border-light-0 dark:border-night-border p-8 max-w-sm w-full text-center animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-light-special dark:bg-night-surface flex items-center justify-center">
          <svg className="w-8 h-8 text-main dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>

        <h3 className="text-heading-4 text-dark-0 dark:text-white font-bold mb-2">
          {t("comingSoonTitle", {}, currentLang)}
        </h3>
        <p className="text-body-2 text-dark-3 dark:text-gray-300 mb-6 leading-6">
          {t("comingSoonDesc", {}, currentLang)}
        </p>

        <button onClick={onClose} className="btn-primary w-full">
          {t("gotIt", {}, currentLang)}
        </button>
      </div>
    </div>
  );
}

export function useComingSoon() {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
}

export default ComingSoonModal;
