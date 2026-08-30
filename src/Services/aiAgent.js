/**
 * Sheypoor AI Agent Service
 * Integrates page-agent with Google Gemini 2.5 Flash and provides
 * in-page DOM automation, intelligent greetings, and deal negotiation.
 */

import { getAiConfig } from "../Utils/aiStorage";
import { getSavedLanguage } from "../Utils/i18n";
import { sp } from "../Utils/Numbers";

let activePageAgentInstance = null;

/**
 * Initializes or updates the PageAgent instance
 */
export async function getPageAgent() {
  if (typeof window === "undefined") return null;

  const config = getAiConfig();
  const lang = getSavedLanguage();

  if (!config.apiKey) {
    return null; // Will trigger smart simulated execution if no API key is set
  }

  try {
    const { PageAgent } = await import("page-agent");
    
    // Map language code
    const agentLang = lang === "fa" ? "fa-IR" : lang === "de" ? "de-DE" : "en-US";

    activePageAgentInstance = new PageAgent({
      model: config.model || "gemini-2.5-flash",
      baseURL: config.baseURL || "https://generativelanguage.googleapis.com/v1beta/openai/",
      apiKey: config.apiKey,
      language: agentLang,
      maxSteps: 25,
    });

    return activePageAgentInstance;
  } catch (err) {
    console.warn("Failed to initialize PageAgent:", err);
    return null;
  }
}

/**
 * Tests connection to Google Gemini API
 */
export async function testGeminiConnection(apiKey, model = "gemini-2.5-flash", baseURL = "https://generativelanguage.googleapis.com/v1beta/openai/") {
  if (!apiKey || !apiKey.trim()) {
    throw new Error("لطفاً کلید API را وارد کنید / Please provide an API key.");
  }

  const endpoint = `${baseURL.replace(/\/+$/, "")}/chat/completions`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify({
      model: model || "gemini-2.5-flash",
      messages: [
        {
          role: "user",
          content: "Hello Gemini! Confirm you are working for Sheypoor AI assistant by responding with 'OK'.",
        },
      ],
      max_tokens: 10,
    }),
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    const message = errJson?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(message);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || "Connected successfully!";
}

/**
 * Executes a natural language command via PageAgent or Smart In-Page Heuristic
 */
export async function executeAgentCommand(instruction, onActivity, signal) {
  const config = getAiConfig();
  const currentLang = getSavedLanguage();

  if (onActivity) {
    onActivity({
      type: "thinking",
      message: currentLang === "fa" ? "در حال تحلیل درخواست و ساختار صفحه..." : "Analyzing request and page structure...",
    });
  }

  // 1. Try running through real PageAgent if API key is configured
  if (config.apiKey) {
    try {
      const agent = await getPageAgent();
      if (agent) {
        // Subscribe to live agent activities
        const activityHandler = (act) => {
          if (onActivity) {
            let msg = "";
            if (act.type === "thinking") {
              msg = currentLang === "fa" ? "در حال تفکر و تصمیم‌گیری..." : "Thinking...";
            } else if (act.type === "executing") {
              msg = currentLang === "fa" ? `در حال اجرای عملیات ${act.tool || ""}...` : `Executing ${act.tool || ""}...`;
            } else if (act.type === "executed") {
              msg = currentLang === "fa" ? `عملیات انجام شد (${act.duration || 0}ms)` : `Step completed (${act.duration || 0}ms)`;
            }
            onActivity({ type: act.type, message: msg, raw: act });
          }
        };

        if (typeof agent.on === "function") {
          agent.on("activity", activityHandler);
        }

        const result = await agent.execute(instruction);
        return {
          success: true,
          result: result || (currentLang === "fa" ? "عملیات با موفقیت در صفحه انجام شد." : "Task executed successfully."),
          isRealAgent: true,
        };
      }
    } catch (err) {
      console.warn("PageAgent live execution error, falling back to in-page handler:", err);
      if (onActivity) {
        onActivity({
          type: "warning",
          message: currentLang === "fa" ? "تلاش با کنترلر مستقیم صفحه..." : "Switching to direct page controller...",
        });
      }
    }
  }

  // 2. High-precision In-Page DOM Controller (Works with or without API key)
  return await executeDirectDomAction(instruction, onActivity, signal);
}

/**
 * Smart In-Page DOM Controller
 * Performs direct interaction (search, location filter, category click, feed filtering)
 */
async function executeDirectDomAction(instruction, onActivity, signal) {
  const currentLang = getSavedLanguage();
  const lower = instruction.toLowerCase().trim();

  await new Promise((r) => setTimeout(r, 600));
  if (signal?.aborted) throw new Error("Aborted");

  // A. Search action
  const isSearch =
    lower.includes("جستجو") ||
    lower.includes("بگرد") ||
    lower.includes("پیدا کن") ||
    lower.includes("سرچ") ||
    lower.includes("search") ||
    lower.includes("find") ||
    lower.includes("suche") ||
    lower.includes("finde");

  if (isSearch || lower.length > 2) {
    // Extract query keyword
    let query = instruction
      .replace(/لطفا|بیار|پیدا کن|بگرد|جستجو کن|سرچ کن|برام|در شیپور|search for|find|look for|suche nach/gi, "")
      .trim();

    if (onActivity) {
      onActivity({
        type: "executing",
        tool: "type",
        message: currentLang === "fa" ? `در حال جست‌وجوی عبارت «${query}» در کادر جست‌وجو...` : `Searching for "${query}" in search input...`,
      });
    }

    const searchInput = document.querySelector('input[type="text"][placeholder*="جست"], input[placeholder*="search"], input[placeholder*="Anzeigen"]');
    if (searchInput) {
      searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
      searchInput.focus();
      
      // Simulate typing
      searchInput.value = query;
      searchInput.dispatchEvent(new Event("input", { bubbles: true }));
      searchInput.dispatchEvent(new Event("change", { bubbles: true }));

      // If form exists, submit it or trigger Enter key
      const form = searchInput.closest("form");
      if (form) {
        form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      } else {
        searchInput.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", keyCode: 13, bubbles: true }));
      }
    }

    await new Promise((r) => setTimeout(r, 800));

    // B. Check for price filter requests
    if (lower.includes("ارزان") || lower.includes("cheapest") || lower.includes("günstig")) {
      if (onActivity) {
        onActivity({
          type: "executing",
          tool: "click",
          message: currentLang === "fa" ? "در حال اعمال فیلتر ارزان‌ترین‌ها..." : "Applying lowest price filter...",
        });
      }
      const cheapChip = Array.from(document.querySelectorAll("button")).find(
        (b) => b.textContent.includes("ارزان") || b.textContent.includes("Lowest") || b.textContent.includes("Günstigste")
      );
      if (cheapChip) cheapChip.click();
    } else if (lower.includes("گران") || lower.includes("expensive") || lower.includes("teuer")) {
      if (onActivity) {
        onActivity({
          type: "executing",
          tool: "click",
          message: currentLang === "fa" ? "در حال اعمال فیلتر گران‌ترین‌ها..." : "Applying highest price filter...",
        });
      }
      const expChip = Array.from(document.querySelectorAll("button")).find(
        (b) => b.textContent.includes("گران") || b.textContent.includes("Highest") || b.textContent.includes("Teuerste")
      );
      if (expChip) expChip.click();
    } else if (lower.includes("عکس") || lower.includes("photo") || lower.includes("foto")) {
      if (onActivity) {
        onActivity({
          type: "executing",
          tool: "click",
          message: currentLang === "fa" ? "در حال اعمال فیلتر عکس‌دار..." : "Applying with-photos filter...",
        });
      }
      const photoChip = Array.from(document.querySelectorAll("button")).find(
        (b) => b.textContent.includes("عکس‌دار") || b.textContent.includes("Photos") || b.textContent.includes("Fotos")
      );
      if (photoChip) photoChip.click();
    }

    // Scroll smoothly to results
    await new Promise((r) => setTimeout(r, 500));
    window.scrollTo({ top: 480, behavior: "smooth" });

    return {
      success: true,
      result:
        currentLang === "fa"
          ? `نتایج جست‌وجو برای «${query}» در صفحه آماده شد.`
          : `Search results for "${query}" have been displayed on page.`,
      isRealAgent: false,
    };
  }

  // C. Theme or Language command
  if (lower.includes("دارک") || lower.includes("تاریک") || lower.includes("dark")) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("sheypoor_theme", "dark");
    window.dispatchEvent(new CustomEvent("sheypoor_theme_changed", { detail: "dark" }));
    return { success: true, result: currentLang === "fa" ? "تم تاریک فعال شد." : "Dark theme activated." };
  }

  if (lower.includes("لایت") || lower.includes("روشن") || lower.includes("light")) {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("sheypoor_theme", "light");
    window.dispatchEvent(new CustomEvent("sheypoor_theme_changed", { detail: "light" }));
    return { success: true, result: currentLang === "fa" ? "تم روشن فعال شد." : "Light theme activated." };
  }

  // Default scroll / explore action
  window.scrollBy({ top: 600, behavior: "smooth" });
  return {
    success: true,
    result: currentLang === "fa" ? "دستور شما در صفحه پیمایش شد." : "Navigated the page according to your request.",
  };
}

/**
 * Smart Deal & Price Negotiator powered by Gemini 2.5 Flash
 */
export async function generateNegotiationProposal({
  adTitle,
  amount,
  city,
  description,
  strategy = "friendly", // 'friendly' | 'expert' | 'cash'
  targetDiscountPercent = 10,
  currentLang = "fa",
}) {
  const config = getAiConfig();
  const priceNum = Number(amount) || 0;
  const targetPrice = priceNum > 0 ? Math.round(priceNum * (1 - targetDiscountPercent / 100)) : 0;

  const formattedOriginalPrice = priceNum > 0 ? `${sp(priceNum)} تومان` : "توافقی";
  const formattedTargetPrice = targetPrice > 0 ? `${sp(targetPrice)} تومان` : "پیشنهاد متناسب";

  // System prompt for deal negotiation
  const prompt = `
You are a master price negotiation assistant for Sheypoor marketplace.
Generate a persuasive, respectful, and high-conversion purchase negotiation message from a prospective buyer to the seller.

Listing Details:
- Title: ${adTitle || "آگهی بدون عنوان"}
- Listed Price: ${formattedOriginalPrice}
- Buyer's Target Price: ${formattedTargetPrice} (${targetDiscountPercent}% discount requested)
- Location: ${city || "ایران"}
- Description: ${description ? description.slice(0, 200) : "ندارد"}
- Strategy: ${strategy} (friendly = polite/ready-cash, expert = analytical/market comparison, cash = fast transaction today)
- Target Output Language: ${currentLang}

Provide the response in JSON format with exactly these fields:
{
  "offerPrice": "${formattedTargetPrice}",
  "discountPercent": ${targetDiscountPercent},
  "messageText": "The complete, ready-to-copy polite message to the seller in ${currentLang}",
  "reasoning": "A short 1-sentence tip on why this negotiation angle works best in ${currentLang}",
  "tips": ["Tip 1", "Tip 2"]
}
`;

  // 1. If Gemini API Key is available, call Gemini 2.5 Flash
  if (config.apiKey) {
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
              content: "You are a professional marketplace negotiation expert. Output only valid JSON.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const contentStr = data?.choices?.[0]?.message?.content;
        if (contentStr) {
          const parsed = JSON.parse(contentStr);
          return {
            offerPrice: parsed.offerPrice || formattedTargetPrice,
            discountPercent: parsed.discountPercent || targetDiscountPercent,
            messageText: parsed.messageText,
            reasoning: parsed.reasoning,
            tips: parsed.tips || [],
            source: "gemini-2.5-flash",
          };
        }
      }
    } catch (err) {
      console.warn("Gemini API call failed for negotiation, using fallback:", err);
    }
  }

  // 2. Intelligent Built-in Fallback Generator
  return buildFallbackNegotiation({
    adTitle,
    formattedTargetPrice,
    strategy,
    targetDiscountPercent,
    currentLang,
  });
}

/**
 * Built-in Rule-based Negotiation Generator (Offline Fallback)
 */
function buildFallbackNegotiation({
  adTitle,
  formattedTargetPrice,
  strategy,
  targetDiscountPercent,
  currentLang,
}) {
  let messageText = "";
  let reasoning = "";
  let tips = [];

  if (currentLang === "fa") {
    if (strategy === "friendly") {
      messageText = `سلام وقتتون بخیر، آگهی «${adTitle}» رو دیدم و مورد پسندم هست. با توجه به اینکه خریدار واقعی و نقد هستم، اگر براتون مقدوره با مبلغ ${formattedTargetPrice} تقدیمم کنید، امروز برای تحویل یا معامله هماهنگ کنیم. ممنون از حسن توجه شما.`;
      reasoning = "رویکرد محترمانه همراه با تاکید بر خرید نقد و قطعی، بیشترین شانس پذیرش تخفیف را ایجاد می‌کند.";
      tips = [
        "به زمان فروشنده احترام بگذارید و از اصرار بیش از حد خودداری کنید.",
        "پیشنهاد تسویه فوری نقدی قوی‌ترین اهرم چانه‌زنی است.",
      ];
    } else if (strategy === "expert") {
      messageText = `درود و احترام، در خصوص آگهی «${adTitle}» خدمتتون پیام می‌دم. با توجه به مقایسه مدل‌ها و موارد مشابه بازار، ارزش منصفانه در حدود ${formattedTargetPrice} ارزیابی می‌شه. در صورت موافقت خوشحال می‌شم توافق نهایی رو انجام بدیم.`;
      reasoning = "استفاده از لحن کارشناسی و قیمت‌گذاری منصفانه بازار مانع از موضع‌گیری منفی فروشنده می‌شود.";
      tips = [
        "قبل از ارسال، مشخصات فنی و استهلاک کالا را دقیق بررسی کنید.",
        "پیشنهاد قیمت را در قالب یک عدد رند مطرح نمایید.",
      ];
    } else {
      // cash / urgent
      messageText = `سلام، برای «${adTitle}» خریدار نقد هستم بدون معطلی. اگر با مبلغ ${formattedTargetPrice} موافقید، همین الان واریز یا معامله رو انجام بدم. تشکر.`;
      reasoning = "فروشندگانی که نیاز به نقدینگی سریع دارند، به پیشنهاد‌های بدون پیش‌شرط و فوری پاسخ مثبت می‌دهند.";
      tips = [
        "آمادگی داشته باشید بلافاصله پس از تایید مبلغ، مراحل تحویل را پیش ببرید.",
        "هیچ‌گاه قبل از رویت کالا بیعانه پرداخت نکنید.",
      ];
    }
  } else if (currentLang === "de") {
    messageText = `Guten Tag, ich interessiere mich sehr für Ihre Anzeige "${adTitle}". Da ich den Betrag sofort und unkompliziert bezahlen kann, wollte ich fragen, ob wir uns auf ${formattedTargetPrice} einigen könnten? Ich könnte das Geschäft zeitnah abwickeln. Vielen Dank!`;
    reasoning = "Höfliche Formulierung mit Fokus auf sofortige Zahlungsbereitschaft.";
    tips = ["Freundlich bleiben", "Keine Vorabzahlungen ohne Warenprüfung leisten"];
  } else {
    // en
    messageText = `Hello! I came across your listing "${adTitle}" and I'm very interested. As a serious buyer ready to pay immediately in cash, would you consider an offer of ${formattedTargetPrice}? I can finalize the purchase right away. Thank you!`;
    reasoning = "Polite and direct cash offer showing serious intent.";
    tips = ["Always inspect items in person before paying deposits", "Maintain respectful communication"];
  }

  return {
    offerPrice: formattedTargetPrice,
    discountPercent: targetDiscountPercent,
    messageText,
    reasoning,
    tips,
    source: "built-in-engine",
  };
}
