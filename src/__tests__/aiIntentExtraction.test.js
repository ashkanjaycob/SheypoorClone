import { describe, it, expect } from "vitest";
import { performSmartSearch, PROCESSING_STEPS } from "../Services/aiSmartSearchEngine";

describe("5. Natural Language Search & Intent Extraction Scenarios", () => {
  it("has all processing steps defined for Persian, English, and German", () => {
    expect(PROCESSING_STEPS.fa).toBeDefined();
    expect(PROCESSING_STEPS.fa.length).toBe(4);
    expect(PROCESSING_STEPS.en.length).toBe(4);
    expect(PROCESSING_STEPS.de.length).toBe(4);
  });

  it("handles car search under 500M and extracts intent", async () => {
    const stepsTracked = [];
    const query = "خودروهای زیر ۵۰۰ میلیون تومان رو برام بیار";

    const response = await performSmartSearch(query, (step, idx) => {
      stepsTracked.push({ step, idx });
    });

    expect(response).toHaveProperty("results");
    expect(response).toHaveProperty("summary");
    expect(response).toHaveProperty("intent");
    expect(response.intent.category).toBe("vehicles");
    expect(response.intent.maxPrice).toBe(500000000);
    expect(stepsTracked.length).toBe(4);
  });

  it("handles mobile phone search scenario", async () => {
    const query = "ارزان‌ترین گوشی‌های موبایل رو نشون بده";
    const response = await performSmartSearch(query);

    expect(response.intent.category).toBe("digital");
    expect(response.intent.sortBy).toBe("cheapest");
  });

  it("handles real estate / apartment search scenario", async () => {
    const query = "اجاره مسکونی در تهران";
    const response = await performSmartSearch(query);

    expect(response.intent.category).toBe("real-estate");
    expect(response.intent.city).toBe("تهران");
  });

  it("gracefully handles unknown / random queries without throwing", async () => {
    const query = "xyz12345!@#$";
    const response = await performSmartSearch(query);

    expect(response).toHaveProperty("results");
    expect(Array.isArray(response.results)).toBe(true);
    expect(typeof response.summary).toBe("string");
  });
});
