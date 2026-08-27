/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { getSavedTheme, setTheme, THEMES } from "../../Utils/theme";
import { getSavedLanguage, setLanguage, LANGUAGES, t } from "../../Utils/i18n";

function ThemeLanguageToggle({ compact = false }) {
  const [currentTheme, setCurrentTheme] = useState(getSavedTheme());
  const [currentLang, setCurrentLang] = useState(getSavedLanguage());
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleThemeChange = (e) => setCurrentTheme(e.detail || getSavedTheme());
    const handleLangChange = (e) => setCurrentLang(e.detail || getSavedLanguage());

    window.addEventListener("sheypoor_theme_changed", handleThemeChange);
    window.addEventListener("sheypoor_lang_changed", handleLangChange);

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("sheypoor_theme_changed", handleThemeChange);
      window.removeEventListener("sheypoor_lang_changed", handleLangChange);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectTheme = (newTheme) => {
    setTheme(newTheme);
    setCurrentTheme(newTheme);
  };

  const handleSelectLang = (newLang) => {
    setLanguage(newLang);
    setCurrentLang(newLang);
  };

  const langFlags = {
    [LANGUAGES.FA]: "🇮🇷 فا",
    [LANGUAGES.EN]: "🇬🇧 EN",
    [LANGUAGES.DE]: "🇩🇪 DE",
  };

  const themeIcons = {
    [THEMES.LIGHT]: "☀️",
    [THEMES.DARK]: "🌙",
    [THEMES.SYSTEM]: "💻",
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-light-0 dark:border-night-border bg-white dark:bg-night-surface hover:bg-light-1 dark:hover:bg-night-card text-dark-1 dark:text-night-text text-body-3 font-medium transition-all shadow-xs"
        title="تغییر تم و زبان | Theme & Language"
        aria-label="Theme and Language switcher"
      >
        <span className="text-sm">{themeIcons[currentTheme] || "☀️"}</span>
        <span className="text-xs font-semibold">{langFlags[currentLang] || "🇮🇷"}</span>
        <svg
          className={`w-3.5 h-3.5 text-dark-3 dark:text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7 7" />
        </svg>
      </button>

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute top-full mt-2 z-50 w-64 bg-white dark:bg-night-card rounded-sheypoor-lg border border-light-0 dark:border-night-border shadow-modal dark:shadow-modal-dark p-3 animate-fade-in ${
            compact ? "left-0" : "left-0 ltr:right-0 ltr:left-auto"
          }`}
        >
          {/* Language Selector Section */}
          <div className="mb-3">
            <div className="text-[11px] font-bold text-dark-3 dark:text-gray-400 uppercase tracking-wider mb-2 px-1">
              {currentLang === LANGUAGES.FA
                ? "انتخاب زبان / Language"
                : currentLang === LANGUAGES.DE
                ? "Sprache auswählen"
                : "Select Language"}
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => handleSelectLang(LANGUAGES.FA)}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${
                  currentLang === LANGUAGES.FA
                    ? "bg-main text-white dark:bg-white dark:text-black font-bold shadow-xs"
                    : "bg-light-2 dark:bg-night-surface text-dark-1 dark:text-gray-300 hover:bg-light-1 dark:hover:bg-night-border"
                }`}
              >
                <span>🇮🇷</span>
                <span>فارسی</span>
              </button>

              <button
                onClick={() => handleSelectLang(LANGUAGES.EN)}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${
                  currentLang === LANGUAGES.EN
                    ? "bg-main text-white dark:bg-white dark:text-black font-bold shadow-xs"
                    : "bg-light-2 dark:bg-night-surface text-dark-1 dark:text-gray-300 hover:bg-light-1 dark:hover:bg-night-border"
                }`}
              >
                <span>🇬🇧</span>
                <span>EN</span>
              </button>

              <button
                onClick={() => handleSelectLang(LANGUAGES.DE)}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${
                  currentLang === LANGUAGES.DE
                    ? "bg-main text-white dark:bg-white dark:text-black font-bold shadow-xs"
                    : "bg-light-2 dark:bg-night-surface text-dark-1 dark:text-gray-300 hover:bg-light-1 dark:hover:bg-night-border"
                }`}
              >
                <span>🇩🇪</span>
                <span>DE</span>
              </button>
            </div>
          </div>

          <div className="border-t border-light-1 dark:border-night-border my-2" />

          {/* Theme Selector Section */}
          <div>
            <div className="text-[11px] font-bold text-dark-3 dark:text-gray-400 uppercase tracking-wider mb-2 px-1">
              {currentLang === LANGUAGES.FA
                ? "انتخاب تم / Theme"
                : currentLang === LANGUAGES.DE
                ? "Design / Theme"
                : "Select Theme"}
            </div>
            <div className="space-y-1">
              {/* Light Mode */}
              <button
                onClick={() => handleSelectTheme(THEMES.LIGHT)}
                className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-all ${
                  currentTheme === THEMES.LIGHT
                    ? "bg-main/10 text-main dark:bg-white/10 dark:text-white font-bold"
                    : "text-dark-1 dark:text-gray-300 hover:bg-light-2 dark:hover:bg-night-surface"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>☀️</span>
                  <span>{t("themeLight", {}, currentLang)}</span>
                </div>
                {currentTheme === THEMES.LIGHT && <span>✓</span>}
              </button>

              {/* Dark Mode (Black & White) */}
              <button
                onClick={() => handleSelectTheme(THEMES.DARK)}
                className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-all ${
                  currentTheme === THEMES.DARK
                    ? "bg-main/10 text-main dark:bg-white/10 dark:text-white font-bold"
                    : "text-dark-1 dark:text-gray-300 hover:bg-light-2 dark:hover:bg-night-surface"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>🌙</span>
                  <span>{t("themeDark", {}, currentLang)}</span>
                </div>
                {currentTheme === THEMES.DARK && <span>✓</span>}
              </button>

              {/* System Mode */}
              <button
                onClick={() => handleSelectTheme(THEMES.SYSTEM)}
                className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-all ${
                  currentTheme === THEMES.SYSTEM
                    ? "bg-main/10 text-main dark:bg-white/10 dark:text-white font-bold"
                    : "text-dark-1 dark:text-gray-300 hover:bg-light-2 dark:hover:bg-night-surface"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>💻</span>
                  <span>{t("themeSystem", {}, currentLang)}</span>
                </div>
                {currentTheme === THEMES.SYSTEM && <span>✓</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ThemeLanguageToggle;
