import { describe, it, expect, beforeEach } from "vitest";
import { formatAdPrice, translateCity } from "../Utils/adTranslator";
import { getStoredChatHistory, saveChatHistory, clearChatHistory } from "../Utils/aiStorage";
import { isNotificationSupported, getNotificationPermission } from "../Services/aiNotificationService";

// Mock window and localStorage for Node test runner
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

Object.defineProperty(globalThis, "window", {
  value: {
    ...globalThis,
    localStorage: localStorageMock,
    dispatchEvent: () => {},
  },
  writable: true,
});

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  writable: true,
});

describe("1. Ad Price & City Formatting Engine", () => {
  it("formats positive numbers in Persian correctly", () => {
    const result = formatAdPrice(450000000, "fa");
    expect(result).toHaveProperty("price");
    expect(result).toHaveProperty("currency", "تومان");
  });

  it("formats zero / undefined / null price safely as negotiable string", () => {
    expect(formatAdPrice(0, "fa")).toBe("قیمت توافقی");
    expect(formatAdPrice(null, "fa")).toBe("قیمت توافقی");
    expect(formatAdPrice(undefined, "en")).toBe("Negotiable Price");
    expect(formatAdPrice(-500, "de")).toBe("Preis auf Anfrage");
  });

  it("handles string city translation gracefully with default fallback", () => {
    expect(translateCity("تهران", "fa")).toBe("تهران");
    expect(translateCity("تهران", "en")).toBe("Tehran");
    expect(translateCity("شیراز", "de")).toBe("Schiras");
    expect(translateCity("", "fa")).toBe("ایران");
  });
});

describe("2. AI Chat Storage & History Management", () => {
  beforeEach(() => {
    clearChatHistory();
  });

  it("saves and retrieves chat history without crashing", () => {
    const mockMessages = [
      {
        id: "msg-1",
        sender: "user",
        text: "خودروهای زیر ۵۰۰ میلیون تومان",
        timestamp: new Date().toISOString(),
      },
      {
        id: "msg-2",
        sender: "assistant",
        text: "۲ آگهی پیدا شد",
        results: [
          {
            ad: {
              _id: "ad-123",
              amount: 350000000,
              options: { title: "پژو 206 تیپ 2", city: "تهران" },
              images: ["/car.jpg"],
            },
            score: 95,
          },
        ],
        timestamp: new Date().toISOString(),
      },
    ];

    saveChatHistory(mockMessages);
    const retrieved = getStoredChatHistory();
    expect(Array.isArray(retrieved)).toBe(true);
    expect(retrieved.length).toBe(2);
    expect(retrieved[1].results[0].ad.options.title).toBe("پژو 206 تیپ 2");

    clearChatHistory();
    expect(getStoredChatHistory()).toEqual([]);
  });
});

describe("3. Voice Search & Result Rendering Safety", () => {
  it("safe string conversion for ad card price rendering across all types", () => {
    const pricesToTest = [
      450000000,
      "350000000",
      0,
      null,
      undefined,
      { price: "۴۵۰,۰۰۰,۰۰۰", currency: "تومان" },
    ];

    pricesToTest.forEach((rawPrice) => {
      const priceInfo = typeof rawPrice === "object" && rawPrice !== null
        ? rawPrice
        : formatAdPrice(rawPrice, "fa");

      const formattedPrice =
        typeof priceInfo === "string"
          ? priceInfo
          : priceInfo && priceInfo.price
          ? `${priceInfo.price} ${priceInfo.currency || ""}`.trim()
          : "قیمت توافقی";

      expect(typeof formattedPrice).toBe("string");
      expect(formattedPrice.length).toBeGreaterThan(0);
    });
  });
});

describe("4. Mobile SPA Notification Utilities", () => {
  it("checks notification support safely in test environment", () => {
    const supported = isNotificationSupported();
    expect(typeof supported).toBe("boolean");
  });

  it("returns notification permission without throwing", () => {
    const perm = getNotificationPermission();
    expect(typeof perm).toBe("string");
  });
});
