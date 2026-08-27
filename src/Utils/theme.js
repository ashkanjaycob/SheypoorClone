/**
 * Sheypoor Theme Manager (Light / Dark B&W / System)
 */

export const THEME_KEY = "sheypoor_theme";
export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
};

/**
 * Returns the raw saved theme preference ('light' | 'dark' | 'system')
 */
export function getSavedTheme() {
  if (typeof window === "undefined") return THEMES.SYSTEM;
  return localStorage.getItem(THEME_KEY) || THEMES.SYSTEM;
}

/**
 * Resolves whether the current active appearance should be dark
 */
export function isDarkActive() {
  if (typeof window === "undefined") return false;
  const saved = getSavedTheme();
  if (saved === THEMES.DARK) return true;
  if (saved === THEMES.LIGHT) return false;
  // System mode
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/**
 * Applies the 'dark' CSS class to document.documentElement
 */
export function applyTheme(theme = getSavedTheme()) {
  if (typeof window === "undefined") return;

  const isDark =
    theme === THEMES.DARK ||
    (theme === THEMES.SYSTEM &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

/**
 * Sets a new theme and notifies all subscribers
 */
export function setTheme(theme) {
  if (typeof window === "undefined") return;
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
  window.dispatchEvent(new CustomEvent("sheypoor_theme_changed", { detail: theme }));
}

// Initial theme application and system change listener
if (typeof window !== "undefined") {
  applyTheme();

  // Listen to OS color scheme changes when on SYSTEM mode
  if (window.matchMedia) {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", () => {
        if (getSavedTheme() === THEMES.SYSTEM) {
          applyTheme(THEMES.SYSTEM);
          window.dispatchEvent(
            new CustomEvent("sheypoor_theme_changed", { detail: THEMES.SYSTEM })
          );
        }
      });
  }
}
