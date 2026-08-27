/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { getSavedTheme, setTheme, THEMES } from "../../Utils/theme";
import { getSavedLanguage, setLanguage, LANGUAGES } from "../../Utils/i18n";

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

  const langLabels = {
    [LANGUAGES.FA]: { flag: "🇮🇷", label: "فا", name: "فارسی" },
    [LANGUAGES.EN]: { flag: "🇬🇧", label: "EN", name: "English" },
    [LANGUAGES.DE]: { flag: "🇩🇪", label: "DE", name: "Deutsch" },
  };

  const themeLabels = {
    [LANGUAGES.FA]: {
      [THEMES.LIGHT]: "روشن",
      [THEMES.DARK]: "تاریک",
      [THEMES.SYSTEM]: "خودکار سیستم",
      langHeading: "زبان",
      themeHeading: "تم صفحه",
    },
    [LANGUAGES.EN]: {
      [THEMES.LIGHT]: "Light",
      [THEMES.DARK]: "Dark",
      [THEMES.SYSTEM]: "System Default",
      langHeading: "Language",
      themeHeading: "Appearance",
    },
    [LANGUAGES.DE]: {
      [THEMES.LIGHT]: "Hell",
      [THEMES.DARK]: "Dunkel",
      [THEMES.SYSTEM]: "Systemstandard",
      langHeading: "Sprache",
      themeHeading: "Erscheinungsbild",
    },
  };

  const activeLangConfig = langLabels[currentLang] || langLabels[LANGUAGES.FA];
  const activeThemeDict = themeLabels[currentLang] || themeLabels[LANGUAGES.FA];

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Minimal Trigger Button (Only Flag & Language Code) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-light-0 dark:border-night-border bg-white dark:bg-night-surface hover:border-main dark:hover:border-main/50 text-dark-1 dark:text-gray-200 text-body-3 font-medium transition-all shadow-xs"
        title="زبان و تم"
        aria-label="Language and theme options"
      >
        <span className="text-sm">{activeLangConfig.flag}</span>
        <span className="text-xs font-semibold">{activeLangConfig.label}</span>
        <svg
          className={`w-3.5 h-3.5 text-dark-3 dark:text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7 7" />
        </svg>
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div
          className={`absolute top-full mt-2 z-50 w-56 bg-white dark:bg-night-card rounded-sheypoor-lg border border-light-0 dark:border-night-border shadow-modal dark:shadow-modal-dark p-3 animate-fade-in ${
            compact ? "rtl:left-0 ltr:right-0" : "rtl:left-0 ltr:right-0 ltr:left-auto"
          }`}
        >
          {/* 1. Language Section (Only Flags) */}
          <div className="mb-2.5">
            <span className="text-[11px] font-bold text-dark-3 dark:text-gray-400 uppercase tracking-wider block mb-2 px-1">
              {activeThemeDict.langHeading}
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {Object.keys(langLabels).map((key) => {
                const isSelected = currentLang === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectLang(key)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${
                      isSelected
                        ? "bg-main text-white font-bold shadow-xs"
                        : "bg-light-2 dark:bg-night-surface text-dark-1 dark:text-gray-300 hover:bg-light-1 dark:hover:bg-night-hover"
                    }`}
                  >
                    <span>{langLabels[key].flag}</span>
                    <span>{langLabels[key].label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-light-1 dark:border-night-border my-2" />

          {/* 2. Theme Section (Clean & Minimal without icons) */}
          <div>
            <span className="text-[11px] font-bold text-dark-3 dark:text-gray-400 uppercase tracking-wider block mb-1.5 px-1">
              {activeThemeDict.themeHeading}
            </span>
            <div className="space-y-1">
              {[THEMES.LIGHT, THEMES.DARK, THEMES.SYSTEM].map((themeKey) => {
                const isSelected = currentTheme === themeKey;
                return (
                  <button
                    key={themeKey}
                    type="button"
                    onClick={() => handleSelectTheme(themeKey)}
                    className={`w-full py-1.5 px-3 rounded-lg text-xs font-medium flex items-center justify-between transition-all ${
                      isSelected
                        ? "bg-main/10 dark:bg-main/20 text-main dark:text-main-lighter font-bold"
                        : "text-dark-1 dark:text-gray-300 hover:bg-light-2 dark:hover:bg-night-surface"
                    }`}
                  >
                    <span>{activeThemeDict[themeKey]}</span>
                    {isSelected && (
                      <span className="text-main dark:text-main-lighter font-bold">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ThemeLanguageToggle;
