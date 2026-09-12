/**
 * Tests for Geo-Location Detection Engine
 * Covers: country-to-language mapping, timezone heuristics, navigator heuristics,
 *         manual override tracking, and "du" alias normalization.
 */
import { describe, it, expect, beforeEach } from "vitest";

// ─── Mock browser globals for Node testing ───────────────────────
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

const documentMock = {
  documentElement: {
    lang: "fa",
    dir: "rtl",
    classList: {
      add: () => {},
      remove: () => {},
      contains: () => false,
    },
  },
};

Object.defineProperty(globalThis, "window", {
  value: {
    localStorage: localStorageMock,
    dispatchEvent: () => {},
    matchMedia: () => ({ matches: false }),
    addEventListener: () => {},
    removeEventListener: () => {},
  },
  writable: true,
});

Object.defineProperty(globalThis, "document", {
  value: documentMock,
  writable: true,
});

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  writable: true,
});
// ─────────────────────────────────────────────────────────────────

import {
  detectLanguageFromCountryCode,
  detectCountryFromTimezone,
  detectCountryFromNavigator,
  GEO_STORAGE_KEY,
  isUserLanguageManual,
  setUserLanguageManual,
  getDetectedCountry,
} from "../Utils/geoDetection";
import {
  LANGUAGES,
  normalizeLanguage,
  setLanguage,
  getSavedLanguage,
  isRtl,
} from "../Utils/i18n";

describe("Geo-Location Detection Engine", () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset document attributes
    document.documentElement.lang = "fa";
    document.documentElement.dir = "rtl";
  });

  // ─── 1. Country → Language/Direction Mapping ─────────────────
  describe("detectLanguageFromCountryCode", () => {
    it("maps Iran (IR) to fa/rtl", () => {
      const result = detectLanguageFromCountryCode("IR");
      expect(result.lang).toBe(LANGUAGES.FA);
      expect(result.dir).toBe("rtl");
      expect(result.country).toBe("IR");
    });

    it("maps Germany (DE) to de/ltr", () => {
      const result = detectLanguageFromCountryCode("DE");
      expect(result.lang).toBe(LANGUAGES.DE);
      expect(result.dir).toBe("ltr");
      expect(result.country).toBe("DE");
    });

    it("maps Austria (AT) to de/ltr", () => {
      const result = detectLanguageFromCountryCode("AT");
      expect(result.lang).toBe(LANGUAGES.DE);
      expect(result.dir).toBe("ltr");
      expect(result.country).toBe("AT");
    });

    it("maps United States (US) to en/ltr", () => {
      const result = detectLanguageFromCountryCode("US");
      expect(result.lang).toBe(LANGUAGES.EN);
      expect(result.dir).toBe("ltr");
      expect(result.country).toBe("US");
    });

    it("maps United Kingdom (GB) to en/ltr", () => {
      const result = detectLanguageFromCountryCode("GB");
      expect(result.lang).toBe(LANGUAGES.EN);
      expect(result.dir).toBe("ltr");
    });

    it("maps France (FR) to en/ltr", () => {
      const result = detectLanguageFromCountryCode("FR");
      expect(result.lang).toBe(LANGUAGES.EN);
      expect(result.dir).toBe("ltr");
    });

    it("maps Armenia (AM) to en/ltr", () => {
      const result = detectLanguageFromCountryCode("AM");
      expect(result.lang).toBe(LANGUAGES.EN);
      expect(result.dir).toBe("ltr");
    });

    it("maps Japan (JP) to en/ltr", () => {
      const result = detectLanguageFromCountryCode("JP");
      expect(result.lang).toBe(LANGUAGES.EN);
      expect(result.dir).toBe("ltr");
    });

    it("handles lowercase input (ir → IR → fa/rtl)", () => {
      const result = detectLanguageFromCountryCode("ir");
      expect(result.lang).toBe(LANGUAGES.FA);
      expect(result.dir).toBe("rtl");
    });

    it("handles null/undefined input as en/ltr", () => {
      expect(detectLanguageFromCountryCode(null).lang).toBe(LANGUAGES.EN);
      expect(detectLanguageFromCountryCode(undefined).lang).toBe(LANGUAGES.EN);
      expect(detectLanguageFromCountryCode("").lang).toBe(LANGUAGES.EN);
    });
  });

  // ─── 2. Timezone Heuristic ───────────────────────────────────
  describe("detectCountryFromTimezone", () => {
    it("detects Iran from Asia/Tehran timezone", () => {
      expect(detectCountryFromTimezone("Asia/Tehran")).toBe("IR");
    });

    it("detects Germany from Europe/Berlin timezone", () => {
      expect(detectCountryFromTimezone("Europe/Berlin")).toBe("DE");
    });

    it("detects Germany from Europe/Busingen timezone", () => {
      expect(detectCountryFromTimezone("Europe/Busingen")).toBe("DE");
    });

    it("detects Austria from Europe/Vienna timezone", () => {
      expect(detectCountryFromTimezone("Europe/Vienna")).toBe("AT");
    });

    it("returns null for unrecognized timezones", () => {
      expect(detectCountryFromTimezone("America/New_York")).toBeNull();
      expect(detectCountryFromTimezone("Europe/London")).toBeNull();
      expect(detectCountryFromTimezone("Asia/Tokyo")).toBeNull();
    });
  });

  // ─── 3. Navigator Language Heuristic ─────────────────────────
  describe("detectCountryFromNavigator", () => {
    it("detects Iran from fa-IR language", () => {
      const fakeNav = { languages: ["fa-IR", "en-US"], language: "fa-IR" };
      expect(detectCountryFromNavigator(fakeNav)).toBe("IR");
    });

    it("detects Germany from de-DE language", () => {
      const fakeNav = { languages: ["de-DE", "en-US"], language: "de-DE" };
      expect(detectCountryFromNavigator(fakeNav)).toBe("DE");
    });

    it("returns null for English-only navigator", () => {
      const fakeNav = { languages: ["en-US", "en-GB"], language: "en-US" };
      expect(detectCountryFromNavigator(fakeNav)).toBeNull();
    });

    it("returns null for null navigator", () => {
      expect(detectCountryFromNavigator(null)).toBeNull();
    });
  });

  // ─── 4. "du" alias normalization ─────────────────────────────
  describe("normalizeLanguage (du alias)", () => {
    it("normalizes 'du' to 'de'", () => {
      expect(normalizeLanguage("du")).toBe(LANGUAGES.DE);
    });

    it("normalizes 'DU' to 'de' (case insensitive)", () => {
      expect(normalizeLanguage("DU")).toBe(LANGUAGES.DE);
    });

    it("keeps 'de' as 'de'", () => {
      expect(normalizeLanguage("de")).toBe(LANGUAGES.DE);
    });

    it("keeps 'fa' as 'fa'", () => {
      expect(normalizeLanguage("fa")).toBe(LANGUAGES.FA);
    });

    it("keeps 'en' as 'en'", () => {
      expect(normalizeLanguage("en")).toBe(LANGUAGES.EN);
    });

    it("returns 'fa' for unknown codes", () => {
      expect(normalizeLanguage("xx")).toBe(LANGUAGES.FA);
    });
  });

  // ─── 5. Manual Override Tracking ─────────────────────────────
  describe("Manual language override", () => {
    it("is not manual by default", () => {
      expect(isUserLanguageManual()).toBe(false);
    });

    it("is manual after user explicitly sets language via setLanguage", () => {
      setLanguage(LANGUAGES.EN); // isManual defaults to true
      expect(isUserLanguageManual()).toBe(true);
      expect(getSavedLanguage()).toBe(LANGUAGES.EN);
    });

    it("can be cleared back to auto", () => {
      setLanguage(LANGUAGES.DE);
      expect(isUserLanguageManual()).toBe(true);

      setUserLanguageManual(false);
      expect(isUserLanguageManual()).toBe(false);
    });

    it("is NOT manual when setLanguage called with { isManual: false }", () => {
      setLanguage(LANGUAGES.FA, { isManual: false });
      expect(isUserLanguageManual()).toBe(false);
      expect(getSavedLanguage()).toBe(LANGUAGES.FA);
    });
  });

  // ─── 6. getDetectedCountry ───────────────────────────────────
  describe("getDetectedCountry", () => {
    it("returns cached country from localStorage when available", () => {
      localStorage.setItem(GEO_STORAGE_KEY, "DE");
      expect(getDetectedCountry()).toBe("DE");
    });

    it("falls back to heuristic when no cache exists", () => {
      const country = getDetectedCountry();
      expect(typeof country).toBe("string");
      expect(country.length).toBeGreaterThanOrEqual(2);
    });
  });

  // ─── 7. End-to-end language/direction after geo detection ────
  describe("End-to-end: language and direction consistency", () => {
    it("sets fa + rtl for Iran", () => {
      setLanguage(LANGUAGES.FA, { isManual: false });
      expect(getSavedLanguage()).toBe("fa");
      expect(isRtl()).toBe(true);
      expect(document.documentElement.dir).toBe("rtl");
      expect(document.documentElement.lang).toBe("fa");
    });

    it("sets de + ltr for Germany/Austria", () => {
      setLanguage(LANGUAGES.DE, { isManual: false });
      expect(getSavedLanguage()).toBe("de");
      expect(isRtl()).toBe(false);
      expect(document.documentElement.dir).toBe("ltr");
      expect(document.documentElement.lang).toBe("de");
    });

    it("sets en + ltr for rest of world", () => {
      setLanguage(LANGUAGES.EN, { isManual: false });
      expect(getSavedLanguage()).toBe("en");
      expect(isRtl()).toBe(false);
      expect(document.documentElement.dir).toBe("ltr");
      expect(document.documentElement.lang).toBe("en");
    });
  });
});
