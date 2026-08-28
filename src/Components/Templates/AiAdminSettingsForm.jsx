import { useState, useEffect } from "react";
import { getAiConfig, setAiConfig } from "../../Utils/aiStorage";
import { testGeminiConnection } from "../../Services/aiAgent";
import { getSavedLanguage } from "../../Utils/i18n";
import toast from "react-hot-toast";

/**
 * AI Admin Settings Form — Only visible in Admin Panel
 * Manages API key, model, persona, system prompt for all users.
 */
export default function AiAdminSettingsForm() {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gemini-2.5-flash");
  const [persona, setPersona] = useState("friendly");
  const [autoGreeting, setAutoGreeting] = useState(true);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [currentLang, setCurrentLang] = useState(getSavedLanguage());

  useEffect(() => {
    const handleLang = (e) => setCurrentLang(e.detail || getSavedLanguage());
    window.addEventListener("sheypoor_lang_changed", handleLang);
    return () => window.removeEventListener("sheypoor_lang_changed", handleLang);
  }, []);

  useEffect(() => {
    const config = getAiConfig();
    setApiKey(config.apiKey || "");
    setModel(config.model || "gemini-2.5-flash");
    setPersona(config.persona || "friendly");
    setAutoGreeting(config.autoGreeting !== false);
    setSystemPrompt(config.systemPrompt || "");
  }, []);

  const handleSave = () => {
    setAiConfig({ apiKey, model, persona, autoGreeting, systemPrompt });
    setIsSaved(true);
    toast.success(
      currentLang === "fa"
        ? "✅ تنظیمات هوش مصنوعی با موفقیت ذخیره شد."
        : "✅ AI settings saved successfully."
    );
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      toast.error(
        currentLang === "fa"
          ? "لطفاً ابتدا کلید API را وارد کنید."
          : "Please enter an API key first."
      );
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testGeminiConnection(apiKey, model);
      setTestResult({ success: true, message: res });
      toast.success(
        currentLang === "fa"
          ? "ارتباط با مدل Gemini با موفقیت برقرار شد!"
          : "Connected to Gemini successfully!"
      );
    } catch (err) {
      setTestResult({ success: false, message: err.message });
      toast.error(err.message || "Connection failed");
    } finally {
      setIsTesting(false);
    }
  };

  const maskedKey = apiKey
    ? apiKey.slice(0, 6) + "•••" + apiKey.slice(-4)
    : "";

  const personas = [
    {
      id: "friendly",
      label: currentLang === "fa" ? "دوستانه و مودب" : "Friendly",
      icon: "🌿",
      desc: currentLang === "fa" ? "لحن صمیمی، حمایتگرانه و مودبانه" : "Warm, supportive & polite tone",
    },
    {
      id: "expert",
      label: currentLang === "fa" ? "کارشناس بازار" : "Market Expert",
      icon: "💼",
      desc: currentLang === "fa" ? "تحلیلگرانه و حرفه‌ای" : "Analytical & professional",
    },
    {
      id: "cash",
      label: currentLang === "fa" ? "خریدار فوری و نقد" : "Quick Cash Buyer",
      icon: "⚡",
      desc: currentLang === "fa" ? "مستقیم، سریع و نتیجه‌گرا" : "Direct, fast & result-oriented",
    },
  ];

  const models = [
    { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash", badge: currentLang === "fa" ? "پیشنهادی" : "Recommended" },
    { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro", badge: currentLang === "fa" ? "استدلال پیچیده" : "Complex Reasoning" },
    { value: "gemini-3.7-flash", label: "Gemini 3.7 Flash", badge: "" },
  ];

  return (
    <div
      className="card-sheypoor p-6"
      dir={currentLang === "fa" ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-light-0 dark:border-night-border">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-main via-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h3 className="text-heading-5 font-bold text-dark-0 dark:text-white">
            {currentLang === "fa" ? "تنظیمات هوش مصنوعی (AI Agent)" : "AI Agent Settings"}
          </h3>
          <p className="text-body-3 text-dark-3 dark:text-gray-400 mt-0.5">
            {currentLang === "fa"
              ? "پیکربندی مرکزی Gemini API برای دستیار هوشمند شیپور — تمامی کاربران از این تنظیمات بهره‌مند خواهند شد."
              : "Central Gemini API configuration for Sheypoor AI — All users benefit from these settings."}
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* 1. API Key */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-body-2 font-semibold text-dark-0 dark:text-white">
              Google Gemini API Key
            </label>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-main hover:underline flex items-center gap-1"
            >
              <span>{currentLang === "fa" ? "دریافت کلید رایگان" : "Get Free Key"}</span>
              <span>↗</span>
            </a>
          </div>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="input-sheypoor font-mono !text-sm"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute rtl:left-3 ltr:right-3 top-1/2 -translate-y-1/2 text-dark-3 dark:text-gray-400 text-xs px-2 py-1 rounded-lg bg-light-1 dark:bg-night-card hover:bg-light-0 dark:hover:bg-night-border transition-colors"
            >
              {showKey
                ? currentLang === "fa" ? "مخفی" : "Hide"
                : currentLang === "fa" ? "نمایش" : "Show"}
            </button>
          </div>
          {apiKey && !showKey && (
            <p className="text-xs text-dark-4 dark:text-gray-500 mt-1 font-mono">
              {maskedKey}
            </p>
          )}
          <p className="text-[11px] text-dark-3 dark:text-gray-400 mt-1.5">
            {currentLang === "fa"
              ? "این کلید فقط در مرورگر ادمین ذخیره و به تمام کاربران اعمال می‌شود."
              : "This key is stored locally in the admin's browser and shared with all users."}
          </p>
        </div>

        {/* 2. Model Selection */}
        <div>
          <label className="text-body-2 font-semibold block mb-2 text-dark-0 dark:text-white">
            {currentLang === "fa" ? "مدل هوش مصنوعی" : "AI Model"}
          </label>
          <div className="grid grid-cols-1 tablet:grid-cols-3 gap-2">
            {models.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setModel(m.value)}
                className={`relative py-3 px-3 rounded-xl text-sm font-medium border flex items-center gap-2 transition-all ${
                  model === m.value
                    ? "border-main bg-main/10 text-main dark:text-main-lighter font-bold ring-2 ring-main/30"
                    : "border-light-0 dark:border-night-border bg-light-2 dark:bg-night-surface text-dark-2 dark:text-gray-300 hover:border-main/40"
                }`}
              >
                <span className="font-mono text-xs">{m.label}</span>
                {m.badge && (
                  <span className="text-[10px] bg-main/20 text-main dark:text-main-lighter px-1.5 py-0.5 rounded-full">
                    {m.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Persona Selection */}
        <div>
          <label className="text-body-2 font-semibold block mb-2 text-dark-0 dark:text-white">
            {currentLang === "fa" ? "لحن و شخصیت دستیار" : "Assistant Personality"}
          </label>
          <div className="grid grid-cols-1 tablet:grid-cols-3 gap-2">
            {personas.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPersona(p.id)}
                className={`py-3 px-3 rounded-xl text-sm border flex flex-col items-center gap-1.5 transition-all ${
                  persona === p.id
                    ? "border-main bg-main/10 text-main dark:text-white font-bold ring-2 ring-main/30"
                    : "border-light-0 dark:border-night-border bg-light-2 dark:bg-night-surface text-dark-2 dark:text-gray-300 hover:border-main/40"
                }`}
              >
                <span className="text-xl">{p.icon}</span>
                <span className="font-semibold text-xs">{p.label}</span>
                <span className="text-[10px] text-dark-3 dark:text-gray-400 font-normal">{p.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. System Prompt (Optional) */}
        <div>
          <label className="text-body-2 font-semibold block mb-2 text-dark-0 dark:text-white">
            {currentLang === "fa" ? "پرومپت سیستم (اختیاری)" : "System Prompt (Optional)"}
          </label>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder={
              currentLang === "fa"
                ? "دستورات اضافی سیستمی برای هوش مصنوعی (مثلاً: همیشه قیمت‌ها را تومان نمایش بده)..."
                : "Extra system instructions for the AI..."
            }
            rows={3}
            className="input-sheypoor !h-auto resize-y text-sm"
          />
        </div>

        {/* 5. Auto Greeting Toggle */}
        <div className="flex items-center justify-between p-3 bg-light-2 dark:bg-night-surface rounded-xl border border-light-0 dark:border-night-border">
          <div>
            <span className="text-body-2 font-medium text-dark-0 dark:text-white">
              {currentLang === "fa" ? "خوش‌آمدگویی خودکار" : "Auto Greeting"}
            </span>
            <p className="text-xs text-dark-3 dark:text-gray-400 mt-0.5">
              {currentLang === "fa"
                ? "نمایش خودکار پیام خوش‌آمدگویی مسکات هوش مصنوعی به کاربران"
                : "Automatically show mascot greeting to new visitors"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAutoGreeting(!autoGreeting)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
              autoGreeting ? "bg-main" : "bg-dark-4 dark:bg-night-border"
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                autoGreeting
                  ? "rtl:right-0.5 ltr:left-[26px]"
                  : "rtl:right-[26px] ltr:left-0.5"
              }`}
            />
          </button>
        </div>

        {/* Connection Test Result */}
        {testResult && (
          <div
            className={`p-3 rounded-xl text-xs font-mono border animate-fade-in ${
              testResult.success
                ? "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400"
                : "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
            }`}
          >
            <div className="font-bold mb-0.5">
              {testResult.success
                ? currentLang === "fa" ? "✓ اتصال موفقیت‌آمیز" : "✓ Connection Successful"
                : currentLang === "fa" ? "✕ خطا در اتصال" : "✕ Connection Failed"}
            </div>
            <div className="truncate">{testResult.message}</div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-5 mt-5 border-t border-light-0 dark:border-night-border gap-3">
        <button
          type="button"
          onClick={handleTestConnection}
          disabled={isTesting || !apiKey}
          className="btn-outline !h-10 !px-4 text-body-3 flex items-center gap-2 disabled:opacity-50"
        >
          {isTesting && (
            <svg className="animate-spin w-4 h-4 text-main" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          <span>
            {isTesting
              ? currentLang === "fa" ? "در حال تست..." : "Testing..."
              : currentLang === "fa" ? "⚡ تست اتصال" : "⚡ Test Connection"}
          </span>
        </button>

        <button
          type="button"
          onClick={handleSave}
          className={`btn-primary !h-10 !px-6 text-body-3 flex items-center gap-2 transition-all ${
            isSaved ? "!bg-green-600 hover:!bg-green-700" : ""
          }`}
        >
          {isSaved ? (
            <>
              <span>✓</span>
              <span>{currentLang === "fa" ? "ذخیره شد!" : "Saved!"}</span>
            </>
          ) : (
            <span>{currentLang === "fa" ? "ذخیره تنظیمات" : "Save Settings"}</span>
          )}
        </button>
      </div>
    </div>
  );
}
