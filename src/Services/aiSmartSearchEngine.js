/**
 * Sheypoor AI Smart Search Engine
 * Performs semantic search, scoring, and intelligent filtering of ads
 * using Gemini AI for natural language understanding.
 */

import { getAiConfig } from "../Utils/aiStorage";
import { getSavedLanguage } from "../Utils/i18n";
import { getAllAds } from "./user";

/**
 * Processing steps for UI display
 */
export const PROCESSING_STEPS = {
  fa: [
    {
      id: "understand",
      icon: "🧠",
      text: "درک معنایی و استخراج هوشمند فیلترها...",
    },
    {
      id: "scan",
      icon: "🔍",
      text: "اسکن عمیق پایگاه داده و آگهی‌های شیپور...",
    },
    {
      id: "analyze",
      icon: "⚡",
      text: "تحلیل تطابق قیمت، عکس‌ها و شرایط معامله...",
    },
    {
      id: "curate",
      icon: "💎",
      text: "گلچین بهترین آگهی‌ها و برآورد هوشمند بازار...",
    },
  ],
  en: [
    {
      id: "understand",
      icon: "🧠",
      text: "Understanding your request with AI intelligence...",
    },
    {
      id: "scan",
      icon: "🔍",
      text: "Deep scanning Sheypoor's listings database...",
    },
    {
      id: "analyze",
      icon: "⚡",
      text: "Analyzing price, photos & deal quality...",
    },
    {
      id: "curate",
      icon: "💎",
      text: "Curating the best matches & market insights...",
    },
  ],
  de: [
    {
      id: "understand",
      icon: "🧠",
      text: "Anfrage verstehen mit KI-Intelligenz...",
    },
    { id: "scan", icon: "🔍", text: "Tiefenscan der Sheypoor-Datenbank..." },
    {
      id: "analyze",
      icon: "⚡",
      text: "Analyse von Preis, Fotos & Konditionen...",
    },
    {
      id: "curate",
      icon: "💎",
      text: "Zusammenstellung der besten Treffer...",
    },
  ],
};

/**
 * Extract search intent from natural language using Gemini
 */
async function extractSearchIntent(query) {
  const config = getAiConfig();
  const lang = getSavedLanguage();

  if (!config.apiKey) {
    return extractSearchIntentLocal(query, lang);
  }

  try {
    const endpoint = `${config.baseURL.replace(/\/+$/, "")}/chat/completions`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: config.model || "gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a search query analyzer for Sheypoor, an Iranian marketplace (like Craigslist/OLX). 
Extract the user's search intent and return a JSON object with these fields:
- "keywords": array of search keywords (in the original language)
- "category": detected category slug if any (e.g. "car", "mobile", "real-estate", "laptop", "apartment")
- "maxPrice": maximum price in Tomans if mentioned (number or null)
- "minPrice": minimum price in Tomans if mentioned (number or null)
- "city": city name if mentioned (in Persian)
- "sortBy": "cheapest" | "expensive" | "newest" | null
- "hasPhoto": true if user wants listings with photos, else null
- "summary": a brief one-line summary of what the user wants in ${lang}
Output only valid JSON.`,
          },
          { role: "user", content: query },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;
      if (content) {
        return JSON.parse(content);
      }
    }
  } catch (err) {
    console.warn("Gemini intent extraction failed, using local fallback:", err);
  }

  return extractSearchIntentLocal(query, lang);
}

/**
 * Local fallback for extracting search intent without API
 */
function extractSearchIntentLocal(query) {
  const lower = query.toLowerCase().trim();

  // Stop words to exclude from keyword matching (Persian & English)
  const stopWords = new Set([
    "رو",
    "را",
    "برام",
    "بده",
    "بیار",
    "نشون",
    "پیدا",
    "کن",
    "بگرد",
    "جستجو",
    "لطفا",
    "لطفاً",
    "سرچ",
    "بزن",
    "های",
    "ترین",
    "من",
    "که",
    "در",
    "از",
    "به",
    "با",
    "هم",
    "و",
    "تا",
    "یا",
    "برای",
    "این",
    "آن",
    "هست",
    "نیست",
    "the",
    "a",
    "an",
    "for",
    "me",
    "find",
    "show",
    "search",
    "get",
    "to",
    "in",
    "is",
    "are",
    "with",
    "my",
    "i",
    "please",
  ]);

  const keywords = query
    .split(/[\s,،.؟?!]+/)
    .map((w) => w.trim().toLowerCase())
    .filter((w) => w.length > 1 && !stopWords.has(w));

  const intent = {
    keywords,
    category: null,
    categoryKeywords: [], // Additional category-specific terms for title matching
    maxPrice: null,
    minPrice: null,
    city: null,
    sortBy: null,
    hasPhoto: null,
    summary: query,
  };

  // Price detection (Persian numbers and Arabic/Latin digits)
  const priceMatch = lower.match(
    /(?:زیر|کمتر از|تا)\s*([\d٫٬,.۰-۹]+)\s*(میلیون|هزار|تومن|تومان)/,
  );
  if (priceMatch) {
    // Convert Persian digits to Latin
    let numStr = priceMatch[1]
      .replace(/[٫٬,]/g, "")
      .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
    let num = parseFloat(numStr);
    if (priceMatch[2].includes("میلیون")) num *= 1_000_000;
    else if (priceMatch[2].includes("هزار")) num *= 1_000;
    intent.maxPrice = num;
  }

  // ===== Category detection with title keyword hints =====
  if (
    /خودرو|ماشین|car|auto|اتومبیل|پراید|پژو|سمند|تیبا|دنا|هایما|کوییک|ساینا|۲۰۶|۲۰۷|پارس|ال۹۰|تندر/.test(
      lower,
    )
  ) {
    intent.category = "vehicles";
    intent.categoryKeywords = [
      "خودرو",
      "ماشین",
      "اتومبیل",
      "پراید",
      "پژو",
      "سمند",
      "تیبا",
      "دنا",
      "ساینا",
      "car",
      "auto",
    ];
  } else if (
    /گوشی|موبایل|phone|mobile|آیفون|iphone|سامسونگ|samsung|شیائومی|xiaomi|هواوی|huawei|نوکیا|nokia|گلکسی|galaxy|ردمی|redmi|pixel|وان\s?پلاس|oneplus/.test(
      lower,
    )
  ) {
    intent.category = "digital";
    intent.categoryKeywords = [
      "گوشی",
      "موبایل",
      "تبلت",
      "آیفون",
      "سامسونگ",
      "شیائومی",
      "هواوی",
      "نوکیا",
      "گلکسی",
      "phone",
      "mobile",
      "iphone",
      "samsung",
    ];
  } else if (
    /آپارتمان|اجاره|خانه|مسکن|ملک|ویلا|زمین|apartment|rent|house|real.?estate|اجاره\s?مسکونی/.test(
      lower,
    )
  ) {
    intent.category = "real-estate";
    intent.categoryKeywords = [
      "آپارتمان",
      "اجاره",
      "خانه",
      "ملک",
      "ویلا",
      "زمین",
      "مسکن",
      "apartment",
      "rent",
      "house",
    ];
  } else if (
    /لپ\s?تاپ|لپتاپ|laptop|نوت\s?بوک|notebook|مک\s?بوک|macbook/.test(lower)
  ) {
    intent.category = "digital";
    intent.categoryKeywords = [
      "لپ تاپ",
      "لپتاپ",
      "نوت بوک",
      "مک بوک",
      "laptop",
      "notebook",
      "macbook",
    ];
  } else if (/تبلت|tablet|آیپد|ipad/.test(lower)) {
    intent.category = "digital";
    intent.categoryKeywords = ["تبلت", "tablet", "آیپد", "ipad"];
  } else if (/مبل|کاناپه|میز|صندلی|تخت|فرش|furniture|sofa|table/.test(lower)) {
    intent.category = "furniture";
    intent.categoryKeywords = [
      "مبل",
      "کاناپه",
      "میز",
      "صندلی",
      "تخت",
      "فرش",
      "furniture",
    ];
  } else if (/لباس|کفش|ساعت|عینک|کیف|clothing|shoes|fashion/.test(lower)) {
    intent.category = "personal";
    intent.categoryKeywords = [
      "لباس",
      "کفش",
      "ساعت",
      "عینک",
      "کیف",
      "clothing",
      "shoes",
    ];
  }

  // Sort detection
  if (/ارزان|cheapest|günstig/.test(lower)) intent.sortBy = "cheapest";
  else if (/گران|expensive|teuer/.test(lower)) intent.sortBy = "expensive";

  // Photo filter
  if (/عکس|photo|foto|تصویر/.test(lower)) intent.hasPhoto = true;

  // City detection
  const cities = [
    "تهران",
    "اصفهان",
    "شیراز",
    "مشهد",
    "تبریز",
    "کرج",
    "اهواز",
    "قم",
    "رشت",
    "کرمان",
    "یزد",
    "ساری",
    "بندرعباس",
    "ارومیه",
    "زنجان",
    "همدان",
    "کرمانشاه",
    "اردبیل",
  ];
  for (const city of cities) {
    if (lower.includes(city)) {
      intent.city = city;
      break;
    }
  }

  return intent;
}

/**
 * Map intent category slug to all possible ad category name variants
 */
const CATEGORY_SLUG_TO_AD_CATEGORIES = {
  vehicles: [
    "vehicles",
    "vehicles & cars",
    "وسایل نقلیه",
    "وسایل نقلیه و خودرو",
    "خودرو",
    "car",
    "cars",
  ],
  digital: [
    "digital",
    "لوازم الکترونیکی",
    "موبایل و تبلت",
    "electronic",
    "electronics",
    "لوازم برقی و خانگی",
  ],
  "real-estate": [
    "realstate",
    "real-state",
    "real-estate",
    "real estate",
    "املاک",
    "املاک و مسکن",
  ],
  furniture: [
    "furniture",
    "home-kitchen",
    "لوازم خانگی",
    "لوازم خانه و آشپزخانه",
  ],
  personal: ["personal", "وسایل شخصی"],
  services: ["service", "services", "خدمات", "خدمات و کسب‌وکار"],
  jobs: ["work", "jobs", "hire", "استخدام", "استخدام و کاریابی"],
};

/**
 * Check if ad belongs to a category group
 */
function adMatchesCategory(ad, intentCategory) {
  if (!intentCategory) return true; // No category filter = match all

  const adCatRaw = (
    ad.categoryName ||
    (typeof ad.category === "string"
      ? ad.category
      : ad.category?.name || ad.category?.slug) ||
    ""
  )
    .toLowerCase()
    .trim();

  const validNames = CATEGORY_SLUG_TO_AD_CATEGORIES[intentCategory] || [];
  return validNames.some(
    (name) =>
      adCatRaw.includes(name.toLowerCase()) ||
      name.toLowerCase().includes(adCatRaw),
  );
}

/**
 * Score how well an ad matches the search intent (0-100)
 * Category matching is the PRIMARY factor.
 */
function scoreAd(ad, intent) {
  let score = 0;

  const title = (ad.options?.title || ad.title || "").toLowerCase();
  const city = (ad.options?.city || ad.city || "").toLowerCase();
  const price =
    Number(ad.amount || ad.options?.price || ad.options?.amount) || 0;
  const hasImages = ad.images && ad.images.length > 0;

  // ===== CATEGORY MATCHING (most important, +40 points) =====
  const categoryMatched = adMatchesCategory(ad, intent.category);
  if (intent.category) {
    if (categoryMatched) {
      score += 40;
    } else {
      // Not the right category — heavily penalized, cap at 20 max
      // Still check title for any keyword match as last resort
      const titleKeywordHits = (intent.categoryKeywords || []).some((kw) =>
        title.includes(kw.toLowerCase()),
      );
      if (titleKeywordHits) {
        score += 15; // Title mentions the category term even if ad category field doesn't match
      }
      // Cap score for wrong-category ads
      return Math.min(20, score);
    }
  } else {
    // No specific category detected, give a moderate base
    score += 25;
  }

  // ===== KEYWORD MATCHING (+30 points max) =====
  const keywords = intent.keywords || [];
  // Also include categoryKeywords for title matching
  const allMatchTerms = [...keywords, ...(intent.categoryKeywords || [])];
  const uniqueTerms = [...new Set(allMatchTerms.map((k) => k.toLowerCase()))];

  let keywordHits = 0;
  for (const kw of uniqueTerms) {
    if (title.includes(kw)) {
      keywordHits++;
    }
  }
  if (uniqueTerms.length > 0) {
    score += Math.round((keywordHits / uniqueTerms.length) * 30);
  }

  // ===== CITY MATCH (+10) =====
  if (intent.city && city.includes(intent.city.toLowerCase())) {
    score += 10;
  }

  // ===== PRICE RANGE (+15 max) =====
  if (intent.maxPrice && price > 0) {
    if (price <= intent.maxPrice) {
      score += 10;
      const ratio = price / intent.maxPrice;
      if (ratio < 0.8) score += 5;
    } else {
      score -= 15;
    }
  }
  if (intent.minPrice && price > 0) {
    if (price >= intent.minPrice) score += 5;
    else score -= 10;
  }

  // ===== PHOTO BONUS (+5) =====
  if (intent.hasPhoto && hasImages) score += 5;
  if (hasImages) score += 2;

  return Math.max(0, Math.min(100, score));
}

/**
 * Generate AI analysis/summary of the results
 */
async function generateResultsSummary(query, results, intent) {
  const config = getAiConfig();
  const lang = getSavedLanguage();

  if (!config.apiKey || results.length === 0) {
    return getLocalSummary(results, intent, lang);
  }

  try {
    const topAds = results.slice(0, 5).map((r) => ({
      title: r.ad.options?.title || r.ad.title,
      price: r.ad.amount || r.ad.options?.price,
      city: r.ad.options?.city || r.ad.city,
      score: r.score,
    }));

    const endpoint = `${config.baseURL.replace(/\/+$/, "")}/chat/completions`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: config.model || "gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a Sheypoor marketplace expert analyst. Provide a brief, insightful analysis of the search results. Be concise and helpful. Respond in ${lang === "fa" ? "Persian/Farsi" : lang === "de" ? "German" : "English"}.`,
          },
          {
            role: "user",
            content: `User searched for: "${query}"
Found ${results.length} matching listings. Top results: ${JSON.stringify(topAds)}
Provide a 2-3 sentence market analysis and recommendation.`,
          },
        ],
        temperature: 0.6,
        max_tokens: 200,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return (
        data?.choices?.[0]?.message?.content ||
        getLocalSummary(results, intent, lang)
      );
    }
  } catch (err) {
    console.warn("Failed to generate AI summary:", err);
  }

  return getLocalSummary(results, intent, lang);
}

/**
 * Local fallback summary
 */
function getLocalSummary(results, intent, lang) {
  const count = results.length;
  if (lang === "fa") {
    if (count === 0)
      return "متأسفانه آگهی منطبق با درخواست شما یافت نشد. لطفاً عبارت جستجو را تغییر دهید.";
    const avgScore = Math.round(
      results.reduce((s, r) => s + r.score, 0) / count,
    );
    return `${count} آگهی با میانگین تطابق ${avgScore}٪ یافت شد. ${count > 5 ? "نتایج بر اساس بیشترین تطابق با درخواست شما مرتب شده‌اند." : "تمامی نتایج مرتبط نمایش داده شده‌اند."}`;
  }
  if (count === 0)
    return "No matching listings found. Please try a different search.";
  const avgScore = Math.round(results.reduce((s, r) => s + r.score, 0) / count);
  return `Found ${count} listings with an average match score of ${avgScore}%. ${count > 5 ? "Results are ranked by relevance to your request." : "All relevant results are shown."}`;
}

/**
 * Main smart search function - the core engine
 * @param {string} query - Natural language query
 * @param {function} onStep - Callback for processing step updates
 * @returns {Promise<{results: Array, summary: string, intent: object}>}
 */
export async function performSmartSearch(query, onStep) {
  const lang = getSavedLanguage();
  const steps = PROCESSING_STEPS[lang] || PROCESSING_STEPS.en;

  // Step 1: Understand the query
  onStep?.(steps[0], 0);
  await delay(800);
  const intent = await extractSearchIntent(query);

  // Step 2: Scan the database
  onStep?.(steps[1], 1);
  await delay(600);
  let adsData;
  try {
    adsData = await getAllAds();
  } catch {
    adsData = { posts: [] };
  }
  const allAds = adsData?.posts || [];

  // Step 3: Analyze and score
  onStep?.(steps[2], 2);
  await delay(700);

  let scoredAds = allAds.map((ad) => ({
    ad,
    score: scoreAd(ad, intent),
  }));

  // Apply filters
  if (intent.hasPhoto) {
    scoredAds = scoredAds.filter((r) => r.ad.images && r.ad.images.length > 0);
  }
  if (intent.city) {
    // Boost but don't exclude
    scoredAds = scoredAds.map((r) => {
      const adCity = (r.ad.options?.city || r.ad.city || "").toLowerCase();
      if (adCity.includes(intent.city.toLowerCase())) {
        return { ...r, score: Math.min(100, r.score + 10) };
      }
      return r;
    });
  }

  // Sort
  if (intent.sortBy === "cheapest") {
    scoredAds.sort((a, b) => {
      const pA = Number(a.ad.amount || a.ad.options?.price) || Infinity;
      const pB = Number(b.ad.amount || b.ad.options?.price) || Infinity;
      return pA - pB;
    });
  } else if (intent.sortBy === "expensive") {
    scoredAds.sort((a, b) => {
      const pA = Number(a.ad.amount || a.ad.options?.price) || 0;
      const pB = Number(b.ad.amount || b.ad.options?.price) || 0;
      return pB - pA;
    });
  } else {
    // Default: sort by score desc
    scoredAds.sort((a, b) => b.score - a.score);
  }

  // Filter out very low scores and limit results
  // Filter out very low scores and limit results
  // If a category was detected, only show ads scoring above 25 (effectively only matching category)
  const minScore = intent.category ? 25 : 15;
  const results = scoredAds.filter((r) => r.score >= minScore).slice(0, 20);

  // Step 4: Curate and summarize
  onStep?.(steps[3], 3);
  await delay(500);
  const summary = await generateResultsSummary(query, results, intent);

  return { results, summary, intent };
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
