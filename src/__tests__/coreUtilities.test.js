import { describe, it, expect, beforeEach } from "vitest";
import { e2p, p2e, sp } from "../Utils/Numbers";
import { setCookie, getCookie, delCookie } from "../Utils/cookie";
import { getBookmarks, toggleBookmark, isBookmarked, removeBookmark, clearBookmarks } from "../Utils/bookmarks";
import { getSavedTheme, setTheme, isDarkActive, THEMES } from "../Utils/theme";
import { getSelectedCity, setSelectedCity, clearSelectedCity, ALL_IRAN } from "../Utils/location";
import { getSavedLanguage, setLanguage, t, LANGUAGES, isRtl } from "../Utils/i18n";

// Mock localStorage and document for Node testing
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

let mockCookieStr = "";
const documentMock = {
  get cookie() {
    return mockCookieStr;
  },
  set cookie(val) {
    const parts = val.split(";")[0];
    const [k, v] = parts.split("=");
    if (val.includes("max-age=0") || val.includes("1970")) {
      mockCookieStr = mockCookieStr
        .split(";")
        .filter((c) => c.trim().split("=")[0] !== k.trim())
        .join(";");
    } else {
      mockCookieStr = mockCookieStr ? `${mockCookieStr}; ${parts}` : parts;
    }
  },
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

describe("1. Persian / English Number Utilities", () => {
  it("converts English digits to Persian correctly (e2p)", () => {
    expect(e2p("1234567890")).toBe("۱۲۳۴۵۶۷۸۹۰");
    expect(e2p(500)).toBe("۵۰۰");
  });

  it("converts Persian digits to English correctly (p2e)", () => {
    expect(p2e("۱۲۳۴۵۶۷۸۹۰")).toBe("1234567890");
    expect(p2e("۵۰۰۰۰۰")).toBe("500000");
  });

  it("separates thousands and converts to Persian digits (sp)", () => {
    expect(sp(1000000)).toBe("۱,۰۰۰,۰۰۰");
    expect(sp(450000000)).toBe("۴۵۰,۰۰۰,۰۰۰");
  });
});

describe("2. Cookie Management Utilities", () => {
  beforeEach(() => {
    mockCookieStr = "";
  });

  it("sets, gets, and deletes authentication cookies safely", () => {
    setCookie({ accessToken: "test_access_token", refreshToken: "test_refresh_token" });
    expect(getCookie("accessToken")).toBe("test_access_token");
    expect(getCookie("refreshToken")).toBe("test_refresh_token");

    delCookie("accessToken");
    expect(getCookie("accessToken")).toBeUndefined();
  });
});

describe("3. Bookmarks / Saved Ads Management", () => {
  beforeEach(() => {
    clearBookmarks();
  });

  it("toggles and checks bookmarks correctly", () => {
    const mockAd = {
      _id: "ad-999",
      amount: 250000000,
      title: "پراید 131 مدل 98",
      options: { city: "تهران" },
    };

    expect(isBookmarked("ad-999")).toBe(false);
    const added = toggleBookmark(mockAd);
    expect(added).toBe(true);
    expect(isBookmarked("ad-999")).toBe(true);
    expect(getBookmarks().length).toBe(1);

    // Toggle off
    const removed = toggleBookmark(mockAd);
    expect(removed).toBe(false);
    expect(isBookmarked("ad-999")).toBe(false);
    expect(getBookmarks().length).toBe(0);
  });
});

describe("4. Theme Manager Utilities", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("sets and retrieves theme preference", () => {
    setTheme(THEMES.DARK);
    expect(getSavedTheme()).toBe(THEMES.DARK);
    expect(isDarkActive()).toBe(true);

    setTheme(THEMES.LIGHT);
    expect(getSavedTheme()).toBe(THEMES.LIGHT);
    expect(isDarkActive()).toBe(false);
  });
});

describe("5. Location & City Filter Utilities", () => {
  beforeEach(() => {
    clearSelectedCity();
  });

  it("saves and retrieves active city filter", () => {
    setSelectedCity("تهران");
    expect(getSelectedCity()).toBe("تهران");

    setSelectedCity("شیراز");
    expect(getSelectedCity()).toBe("شیراز");

    clearSelectedCity();
    expect(getSelectedCity()).toBe(ALL_IRAN);
  });
});

describe("6. Internationalization (i18n) Utilities", () => {
  it("translates key phrases in Persian, English, and German", () => {
    setLanguage(LANGUAGES.FA);
    expect(getSavedLanguage()).toBe(LANGUAGES.FA);
    expect(isRtl(LANGUAGES.FA)).toBe(true);
    expect(t("home")).toBe("خانه");
    expect(t("categories")).toBe("دسته‌بندی‌ها");

    setLanguage(LANGUAGES.EN);
    expect(getSavedLanguage()).toBe(LANGUAGES.EN);
    expect(isRtl(LANGUAGES.EN)).toBe(false);
    expect(t("home")).toBe("Home");
    expect(t("categories")).toBe("Categories");

    setLanguage(LANGUAGES.DE);
    expect(getSavedLanguage()).toBe(LANGUAGES.DE);
    expect(isRtl(LANGUAGES.DE)).toBe(false);
    expect(t("home")).toBe("Startseite");
    expect(t("categories")).toBe("Kategorien");
  });
});
