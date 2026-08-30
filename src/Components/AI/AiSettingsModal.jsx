/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { getAiConfig, setAiConfig } from "../../Utils/aiStorage";
import { testGeminiConnection } from "../../Services/aiAgent";
import { t, getSavedLanguage } from "../../Utils/i18n";
import toast from "react-hot-toast";

export default function AiSettingsModal({ isOpen, onClose }) {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gemini-2.5-flash");
  const [persona, setPersona] = useState("friendly");
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [currentLang, setCurrentLang] = useState(getSavedLanguage());

  useEffect(() => {
    const handleLang = (e) => setCurrentLang(e.detail || getSavedLanguage());
    window.addEventListener("sheypoor_lang_changed", handleLang);
    return () => window.removeEventListener("sheypoor_lang_changed", handleLang);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const config = getAiConfig();
      setApiKey(config.apiKey || "");
      setModel(config.model || "gemini-2.5-flash");
      setPersona(config.persona || "friendly");
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    setAiConfig({ apiKey, model, persona });
    toast.success(t("aiSettingsSaved", {}, currentLang) || "تنظیمات هوش مصنوعی با موفقیت ذخیره شد.");
    onClose();
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      toast.error(t("aiKeyRequired", {}, currentLang) || "لطفاً ابتدا کلید API را وارد کنید.");
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await testGeminiConnection(apiKey, model);
      setTestResult({ success: true, message: res });
      toast.success(t("aiConnectedSuccess", {}, currentLang) || "ارتباط با مدل Gemini 2.5 Flash با موفقیت برقرار شد!");
    } catch (err) {
      setTestResult({ success: false, message: err.message });
      toast.error(err.message || "خطا در برقراری ارتباط با Gemini API");
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-dark-0/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white dark:bg-night-card border border-light-0 dark:border-night-border rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-dark-0 dark:text-white"
        dir={currentLang === "fa" ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-light-1 dark:border-night-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-main to-blue-400 flex items-center justify-center text-white shadow-md">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-body-1 font-bold">
                {t("aiSettingsTitle", {}, currentLang) || "تنظیمات هوش مصنوعی (Gemini 2.5 Flash)"}
              </h3>
              <p className="text-body-4 text-dark-3 dark:text-gray-400">
                {t("aiSettingsSubtitle", {}, currentLang) || "تنظیمات کلید API و مدل PageAgent"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-dark-3 dark:text-gray-400 hover:bg-light-2 dark:hover:bg-night-surface transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <div className="py-4 space-y-4">
          {/* Gemini API Key */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-body-2 font-medium">
                {t("geminiApiKeyLabel", {}, currentLang) || "Google Gemini API Key"}
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-main hover:underline flex items-center gap-1"
              >
                <span>{t("getFreeKey", {}, currentLang) || "دریافت کلید رایگان"}</span>
                <span>↗</span>
              </a>
            </div>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 bg-light-2 dark:bg-night-surface border border-light-0 dark:border-night-border rounded-xl text-body-2 focus:outline-none focus:border-main font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute rtl:left-3 ltr:right-3 top-1/2 -translate-y-1/2 text-dark-3 dark:text-gray-400 text-xs px-1.5 py-0.5 rounded bg-light-1 dark:bg-night-card"
              >
                {showKey ? "مخفی" : "نمایش"}
              </button>
            </div>
            <p className="text-[11px] text-dark-3 dark:text-gray-400 mt-1">
              {t("apiKeyNote", {}, currentLang) || "کلید شما فقط به صورت محلی در مرورگر ذخیره می‌شود و به هیچ سرور شخص ثالثی ارسال نمی‌گردد."}
            </p>
          </div>

          {/* Model Selection */}
          <div>
            <label className="text-body-2 font-medium block mb-1.5">
              {t("modelSelectionLabel", {}, currentLang) || "مدل انتخابی"}
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-light-2 dark:bg-night-surface border border-light-0 dark:border-night-border rounded-xl text-body-2 focus:outline-none focus:border-main"
            >
              <option value="gemini-2.5-flash">Gemini 2.5 Flash (پیشنهادی - فوق‌سریع و دقیق)</option>
              <option value="gemini-2.5-pro">Gemini 2.5 Pro (استدلال پیچیده)</option>
              <option value="gemini-3.7-flash">Gemini 3.7 Flash</option>
            </select>
          </div>

          {/* Persona */}
          <div>
            <label className="text-body-2 font-medium block mb-1.5">
              {t("agentPersonaLabel", {}, currentLang) || "لحن و شخصیت دستیار"}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "friendly", label: "دوستانه و مودب", icon: "🌿" },
                { id: "expert", label: "کارشناس بازار", icon: "💼" },
                { id: "cash", label: "خریدار فوری و نقد", icon: "⚡" },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPersona(p.id)}
                  className={`py-2 px-2 rounded-xl text-xs font-medium border flex flex-col items-center gap-1 transition-all ${
                    persona === p.id
                      ? "border-main bg-main/10 text-main dark:text-white font-bold"
                      : "border-light-0 dark:border-night-border bg-light-2 dark:bg-night-surface text-dark-2 dark:text-gray-300"
                  }`}
                >
                  <span className="text-base">{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Connection Test Result */}
          {testResult && (
            <div
              className={`p-3 rounded-xl text-xs font-mono border ${
                testResult.success
                  ? "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400"
                  : "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
              }`}
            >
              <div className="font-bold mb-0.5">{testResult.success ? "✓ اتصال موفق" : "✕ خطا در اتصال"}</div>
              <div className="truncate">{testResult.message}</div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-light-1 dark:border-night-border gap-2">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTesting || !apiKey}
            className="px-4 py-2 rounded-xl border border-light-0 dark:border-night-border hover:bg-light-2 dark:hover:bg-night-surface text-body-3 font-medium transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            {isTesting && (
              <svg className="animate-spin w-4 h-4 text-main" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            <span>{isTesting ? "در حال تست..." : "⚡ تست اتصال"}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-body-3 font-medium text-dark-3 hover:bg-light-2 dark:hover:bg-night-surface transition-colors"
            >
              {t("cancel", {}, currentLang) || "انصراف"}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="btn-primary px-5 py-2 rounded-xl text-body-3"
            >
              {t("save", {}, currentLang) || "ذخیره تنظیمات"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
