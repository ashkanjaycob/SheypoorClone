/**
 * Sheypoor Geo-Location & Language/Direction Detection Engine
 *
 * Rules:
 * - Iran (IR)                      => Language: fa, Direction: rtl
 * - Germany (DE) or Austria (AT)   => Language: de, Direction: ltr
 * - Rest of the World (All others) => Language: en, Direction: ltr
 *
 * Strategy (Hybrid, zero-flicker):
 * 1. Instant: Timezone + navigator.languages heuristic (0ms)
 * 2. Background: IP geolocation with multi-provider fallback & 12h cache
 */

import { LANGUAGES, getSavedLanguage, LANG_KEY } from "./i18n";

// ─── Storage Keys ────────────────────────────────────────────────
export const GEO_STORAGE_KEY = "sheypoor_geo_country";
export const GEO_CACHE_KEY = "sheypoor_geo_cache";
export const MANUAL_LANG_KEY = "sheypoor_lang_manual";

// 12-hour cache TTL for IP lookups
const CACHE_TTL_MS = 12 * 60 * 60 * 1000;

// ─── Country → Language/Direction Mapping ────────────────────────

/**
 * Maps a two-letter ISO 3166-1 country code to application language and direction.
 * @param {string} countryCode
 * @returns {{ lang: string, dir: "rtl"|"ltr", country: string }}
 */
export function detectLanguageFromCountryCode(countryCode) {
  if (!countryCode || typeof countryCode !== "string") {
    return { lang: LANGUAGES.EN, dir: "ltr", country: "GLOBAL" };
  }

  const code = countryCode.trim().toUpperCase();

  if (code === "IR") {
    return { lang: LANGUAGES.FA, dir: "rtl", country: "IR" };
  }

  if (code === "DE" || code === "AT") {
    return { lang: LANGUAGES.DE, dir: "ltr", country: code };
  }

  return { lang: LANGUAGES.EN, dir: "ltr", country: code };
}

// ─── Timezone Heuristic ──────────────────────────────────────────

/**
 * Detects country based on system timezone (instant, no network).
 * @param {string} [timeZone] - Override for testing
 * @returns {string|null} Two-letter country code or null
 */
export function detectCountryFromTimezone(timeZone) {
  try {
    const tz =
      timeZone ||
      (typeof Intl !== "undefined" &&
        Intl.DateTimeFormat().resolvedOptions().timeZone);
    if (!tz) return null;

    if (tz === "Asia/Tehran") return "IR";
    if (tz === "Europe/Berlin" || tz === "Europe/Busingen") return "DE";
    if (tz === "Europe/Vienna") return "AT";

    return null;
  } catch {
    return null;
  }
}

// ─── Navigator Language Heuristic ────────────────────────────────

/**
 * Detects country from browser language preferences (instant fallback).
 * @param {Navigator} [nav] - Override for testing
 * @returns {string|null}
 */
export function detectCountryFromNavigator(nav) {
  try {
    const navigatorObj =
      nav || (typeof navigator !== "undefined" ? navigator : null);
    if (!navigatorObj) return null;

    const langs = navigatorObj.languages || [navigatorObj.language || ""];
    for (const lang of langs) {
      if (!lang) continue;
      const lower = lang.toLowerCase();
      if (lower.startsWith("fa")) return "IR";
      if (lower.startsWith("de")) return "DE";
    }
    return null;
  } catch {
    return null;
  }
}

// ─── Combined Client Heuristic ───────────────────────────────────

/**
 * Synchronous client heuristic combining timezone + navigator.
 * @returns {string} Two-letter country code or "GLOBAL"
 */
export function detectHeuristicCountry() {
  const tzCountry = detectCountryFromTimezone();
  if (tzCountry) return tzCountry;

  const navCountry = detectCountryFromNavigator();
  if (navCountry) return navCountry;

  return "GLOBAL";
}

// ─── Network Helpers ─────────────────────────────────────────────

/** Fetch with abort-timeout */
async function fetchWithTimeout(url, options = {}, timeoutMs = 3000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// ─── IP Geolocation (Multi-Provider with Cache) ──────────────────

/**
 * Resolves country code via external IP geolocation services.
 * Uses three providers with automatic fallback and 12h localStorage cache.
 * @returns {Promise<string|null>} Two-letter country code or null
 */
export async function fetchCountryFromIp() {
  if (typeof window === "undefined") return null;

  // 1. Check cache
  try {
    const cached = localStorage.getItem(GEO_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (
        parsed.country &&
        parsed.timestamp &&
        Date.now() - parsed.timestamp < CACHE_TTL_MS
      ) {
        return parsed.country;
      }
    }
  } catch {
    // Ignore cache read errors
  }

  // Provider 1: api.country.is (ultra-lightweight JSON)
  try {
    const res = await fetchWithTimeout("https://api.country.is/", {}, 3000);
    if (res.ok) {
      const data = await res.json();
      if (data?.country && typeof data.country === "string" && data.country.length === 2) {
        const country = data.country.toUpperCase();
        saveGeoCache(country);
        return country;
      }
    }
  } catch {
    // Try next
  }

  // Provider 2: Cloudflare Trace (global CDN, very fast)
  try {
    const res = await fetchWithTimeout("https://1.1.1.1/cdn-cgi/trace", {}, 3000);
    if (res.ok) {
      const text = await res.text();
      const match = text.match(/loc=([A-Za-z]{2})/i);
      if (match?.[1]) {
        const country = match[1].toUpperCase();
        saveGeoCache(country);
        return country;
      }
    }
  } catch {
    // Try next
  }

  // Provider 3: ipwho.is (backup)
  try {
    const res = await fetchWithTimeout("https://ipwho.is/", {}, 3000);
    if (res.ok) {
      const data = await res.json();
      if (data?.success && data.country_code) {
        const country = data.country_code.toUpperCase();
        saveGeoCache(country);
        return country;
      }
    }
  } catch {
    // All providers failed
  }

  return null;
}

// ─── Cache Persistence ───────────────────────────────────────────

/** Saves detected country to localStorage cache */
function saveGeoCache(countryCode) {
  try {
    localStorage.setItem(
      GEO_CACHE_KEY,
      JSON.stringify({ country: countryCode, timestamp: Date.now() })
    );
    localStorage.setItem(GEO_STORAGE_KEY, countryCode);
  } catch {
    // Ignore storage errors
  }
}

// ─── Manual Override Tracking ────────────────────────────────────

/**
 * Checks whether user has explicitly selected a language manually.
 * @returns {boolean}
 */
export function isUserLanguageManual() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(MANUAL_LANG_KEY) === "true";
}

/**
 * Marks user's language selection as manual or auto.
 * @param {boolean} isManual
 */
export function setUserLanguageManual(isManual = true) {
  if (typeof window === "undefined") return;
  if (isManual) {
    localStorage.setItem(MANUAL_LANG_KEY, "true");
  } else {
    localStorage.removeItem(MANUAL_LANG_KEY);
  }
}

// ─── Detected Country Getter ─────────────────────────────────────

/**
 * Gets currently detected or cached country code.
 * @returns {string}
 */
export function getDetectedCountry() {
  if (typeof window === "undefined") return "GLOBAL";
  return localStorage.getItem(GEO_STORAGE_KEY) || detectHeuristicCountry();
}

// ─── Main Initializer ────────────────────────────────────────────

/**
 * Main initialization for Geo-Location Language & Direction Detection.
 * Runs non-blocking at app startup.
 *
 * - If user manually picked a language, honors that choice.
 * - Otherwise, applies instant heuristic, then resolves IP in background.
 *
 * @param {Object} deps - Dependency injection for i18n functions (avoids circular import)
 * @param {Function} deps.setLanguageFn  - setLanguage from i18n
 * @param {Function} deps.applyLanguageFn - applyLanguage from i18n
 */
export async function initGeoLanguageDetection({ setLanguageFn, applyLanguageFn }) {
  if (typeof window === "undefined") return;

  // If user has a manual preference, just apply it and stop
  if (isUserLanguageManual()) {
    applyLanguageFn(getSavedLanguage());
    return;
  }

  // Step 1: Immediate zero-latency heuristic
  const heuristicCountry = detectHeuristicCountry();
  const heuristicConfig = detectLanguageFromCountryCode(heuristicCountry);

  const currentSaved = localStorage.getItem(LANG_KEY);
  if (!currentSaved) {
    // First visit — apply heuristic immediately
    setLanguageFn(heuristicConfig.lang);
    localStorage.setItem(GEO_STORAGE_KEY, heuristicConfig.country);
  } else {
    applyLanguageFn(currentSaved);
  }

  // Step 2: Background IP geolocation
  try {
    const ipCountry = await fetchCountryFromIp();
    const finalCountry = ipCountry || heuristicCountry;
    const finalConfig = detectLanguageFromCountryCode(finalCountry);

    // Re-check manual flag (user might have changed language during fetch)
    if (!isUserLanguageManual()) {
      localStorage.setItem(GEO_STORAGE_KEY, finalConfig.country);
      if (getSavedLanguage() !== finalConfig.lang) {
        setLanguageFn(finalConfig.lang);
      }
    }

    // Broadcast detected geo info for any interested components
    window.dispatchEvent(
      new CustomEvent("sheypoor_geo_detected", {
        detail: {
          country: finalCountry,
          lang: finalConfig.lang,
          dir: finalConfig.dir,
          source: ipCountry ? "ip" : "heuristic",
        },
      })
    );
  } catch (e) {
    console.warn("Geo detection background lookup failed, using heuristic:", e);
  }
}

// ─── Simulation Helper (Dev / Testing) ───────────────────────────

/**
 * Simulates a specific country for testing or demos.
 * @param {string} countryCode - e.g. "IR", "DE", "AT", "US"
 * @param {Object} deps
 * @param {Function} deps.setLanguageFn
 * @returns {{ lang: string, dir: string, country: string }}
 */
export function simulateGeoLocation(countryCode, { setLanguageFn }) {
  const config = detectLanguageFromCountryCode(countryCode);
  saveGeoCache(config.country);
  setUserLanguageManual(false);
  setLanguageFn(config.lang);
  window.dispatchEvent(
    new CustomEvent("sheypoor_geo_detected", {
      detail: {
        country: config.country,
        lang: config.lang,
        dir: config.dir,
        source: "simulation",
      },
    })
  );
  return config;
}
