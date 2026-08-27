import { useState, useEffect, useRef } from "react";
import { executeAgentCommand } from "../../Services/aiAgent";
import { getAiConfig, getStoredChatHistory, saveChatHistory, clearChatHistory } from "../../Utils/aiStorage";
import { getSavedLanguage } from "../../Utils/i18n";
import AiSettingsModal from "./AiSettingsModal";
import toast from "react-hot-toast";

export default function SheypoorAiCopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [activityLog, setActivityLog] = useState("");
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [currentLang, setCurrentLang] = useState(getSavedLanguage());

  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Sync language
  useEffect(() => {
    const handleLang = (e) => setCurrentLang(e.detail || getSavedLanguage());
    window.addEventListener("sheypoor_lang_changed", handleLang);
    return () => window.removeEventListener("sheypoor_lang_changed", handleLang);
  }, []);

  // Initialize history & greeting
  useEffect(() => {
    const history = getStoredChatHistory();
    if (history && history.length > 0) {
      setMessages(history);
    } else {
      // Default welcome message
      const defaultGreeting = {
        id: "welcome-1",
        sender: "assistant",
        text:
          currentLang === "fa"
            ? "سلام! 👋 من دستیار هوشمند شیپور هستم (مجهز به Gemini 2.5 Flash). می‌تونم برات بین آگهی‌ها بگردم، فیلترها رو اعمال کنم یا برای خرید با فروشنده‌ها چونه بزنم! چه کمکی از دستم برمیاد؟"
            : currentLang === "de"
            ? "Hallo! 👋 Ich bin der Sheypoor AI-Assistent (mit Gemini 2.5 Flash). Ich kann Anzeigen durchsuchen, Filter anwenden oder für Sie verhandeln!"
            : "Hello! 👋 I'm your Sheypoor AI Assistant (powered by Gemini 2.5 Flash). I can search listings, apply filters, and help you negotiate deals!",
        timestamp: new Date().toISOString(),
      };
      setMessages([defaultGreeting]);
    }

    // Show proactive greeting speech bubble after 2.5s if not already opened
    const config = getAiConfig();
    if (config.autoGreeting) {
      const timer = setTimeout(() => {
        const greeted = sessionStorage.getItem("sheypoor_ai_greeted");
        if (!greeted) {
          setShowGreeting(true);
          sessionStorage.setItem("sheypoor_ai_greeted", "true");
        }
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentLang]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, activityLog]);

  // Handle Speech Recognition (Voice Input)
  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error(
        currentLang === "fa"
          ? "مرورگر شما از ورودی صوتی پشتیبانی نمی‌کند."
          : "Voice input is not supported in this browser."
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = currentLang === "fa" ? "fa-IR" : currentLang === "de" ? "de-DE" : "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        toast(currentLang === "fa" ? "🎙️ در حال گوش دادن..." : "🎙️ Listening...", { icon: "🎙️" });
      };

      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          setInputVal(transcript);
          // Auto execute if meaningful
          setTimeout(() => handleSendMessage(transcript), 400);
        }
      };

      recognition.onerror = (e) => {
        console.warn("Speech recognition error:", e);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn("Speech recognition failed to start", e);
      setIsListening(false);
    }
  };

  // Send & Execute Command
  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputVal).trim();
    if (!text || isRunning) return;

    setShowGreeting(false);
    setInputVal("");

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toISOString(),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    saveChatHistory(updated);

    setIsRunning(true);
    setActivityLog(currentLang === "fa" ? "در حال آماده‌سازی..." : "Initializing...");

    try {
      const result = await executeAgentCommand(text, (act) => {
        if (act?.message) {
          setActivityLog(act.message);
        }
      });

      const assistantMsg = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        text: result.result || (currentLang === "fa" ? "دستور با موفقیت انجام شد." : "Task completed."),
        timestamp: new Date().toISOString(),
        isRealAgent: result.isRealAgent,
      };

      const finalMessages = [...updated, assistantMsg];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    } catch (err) {
      const errorMsg = {
        id: `err-${Date.now()}`,
        sender: "assistant",
        text: currentLang === "fa" ? `خطا در اجرا: ${err.message}` : `Execution error: ${err.message}`,
        timestamp: new Date().toISOString(),
        isError: true,
      };
      const finalMessages = [...updated, errorMsg];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    } finally {
      setIsRunning(false);
      setActivityLog("");
    }
  };

  const handleClearHistory = () => {
    clearChatHistory();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "assistant",
        text:
          currentLang === "fa"
            ? "تاریخچه گفتگو پاک شد. چطور می‌تونم کمکتون کنم؟"
            : "Chat history cleared. How can I help you?",
        timestamp: new Date().toISOString(),
      },
    ]);
    toast.success(currentLang === "fa" ? "تاریخچه پاک شد" : "History cleared");
  };

  // Quick Prompt Chips
  const quickChips = [
    {
      fa: "🚗 خودرو زیر ۵۰۰ میلیون",
      en: "🚗 Cars under 500M",
      de: "🚗 Autos unter 500M",
      cmd: "خودروهای زیر ۵۰۰ میلیون تومان رو برام بیار",
    },
    {
      fa: "📱 ارزان‌ترین گوشی‌ها",
      en: "📱 Cheapest Phones",
      de: "📱 Günstigste Handys",
      cmd: "ارزان‌ترین گوشی‌های موبایل رو نشون بده",
    },
    {
      fa: "🏠 اجاره آپارتمان تهران",
      en: "🏠 Rent in Tehran",
      de: "🏠 Miete in Teheran",
      cmd: "اجاره مسکونی در تهران",
    },
    {
      fa: "🌙 تم دارک",
      en: "🌙 Dark Theme",
      de: "🌙 Dunkelmodus",
      cmd: "تم سایت رو دارک کن",
    },
  ];

  return (
    <>
      {/* Floating AI Orb Button (Bottom Corner) */}
      <div className="fixed bottom-6 rtl:left-6 ltr:right-6 z-50 flex flex-col items-end gap-3 select-none">
        {/* Proactive Welcome Speech Bubble */}
        {showGreeting && !isOpen && (
          <div
            className="w-72 p-3.5 bg-white/95 dark:bg-night-card/95 backdrop-blur-md border border-main/30 dark:border-night-border rounded-2xl shadow-xl animate-fade-in relative text-dark-0 dark:text-white"
            dir={currentLang === "fa" ? "rtl" : "ltr"}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowGreeting(false);
              }}
              className="absolute top-2 rtl:left-2 ltr:right-2 text-dark-4 hover:text-dark-1 text-xs w-5 h-5 rounded-full flex items-center justify-center"
            >
              ✕
            </button>

            <div className="flex items-start gap-2.5">
              <span className="text-2xl flex-shrink-0 animate-bounce">🤖</span>
              <div className="text-body-3 leading-snug">
                <p className="font-bold text-main dark:text-main-lighter mb-1">
                  {currentLang === "fa" ? "دستیار هوشمند شیپور" : "Sheypoor AI Copilot"}
                </p>
                <p className="text-dark-2 dark:text-gray-300 text-xs">
                  {currentLang === "fa"
                    ? "سلام! برات آگهی پیدا کنم یا سر قیمت چونه بزنم؟"
                    : "Hi! Want me to find listings or negotiate prices for you?"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-light-1 dark:border-night-border">
              <button
                onClick={() => {
                  setShowGreeting(false);
                  setIsOpen(true);
                }}
                className="w-full py-1.5 bg-main hover:bg-main-lighter text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                {currentLang === "fa" ? "گفتگو و جست‌وجو ✨" : "Start Chat ✨"}
              </button>
            </div>
          </div>
        )}

        {/* The Trigger Orb */}
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setShowGreeting(false);
          }}
          className={`relative group p-3.5 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center ${
            isOpen
              ? "bg-dark-0 dark:bg-white text-white dark:text-black scale-95"
              : "bg-gradient-to-tr from-main via-blue-500 to-indigo-600 hover:scale-105 active:scale-95 text-white ring-4 ring-main/30 dark:ring-white/20 animate-pulse"
          }`}
          title="Sheypoor AI Agent (Gemini 2.5 Flash)"
          aria-label="Toggle AI Assistant"
        >
          {isOpen ? (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <>
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              {/* Mini Gemini Badge */}
              <span className="absolute -top-1 -right-1 bg-amber-400 text-black text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-sm">
                2.5
              </span>
            </>
          )}
        </button>
      </div>

      {/* Main AI Chat Panel */}
      {isOpen && (
        <div
          className="fixed bottom-24 rtl:left-4 ltr:right-4 tablet:rtl:left-6 tablet:ltr:right-6 z-50 w-[92vw] max-w-[400px] h-[540px] max-h-[80vh] bg-white/95 dark:bg-night-card/95 backdrop-blur-xl border border-light-0 dark:border-night-border rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in text-dark-0 dark:text-white"
          dir={currentLang === "fa" ? "rtl" : "ltr"}
        >
          {/* Header */}
          <div className="p-4 border-b border-light-1 dark:border-night-border bg-gradient-to-r from-main/15 via-transparent to-transparent flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-main text-white flex items-center justify-center font-bold text-sm shadow-md">
                ⚡
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-body-2 font-bold">
                    {currentLang === "fa" ? "دستیار هوشمند شیپور" : "Sheypoor AI"}
                  </h4>
                  <span className="text-[10px] font-mono bg-main/20 text-main dark:text-main-lighter px-1.5 py-0.2 rounded-full">
                    Gemini 2.5
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-green-600 dark:text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                  <span>{currentLang === "fa" ? "آماده اجرای دستورات" : "Ready to execute"}</span>
                </div>
              </div>
            </div>

            {/* Header Tools */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="w-7 h-7 rounded-lg text-dark-3 dark:text-gray-400 hover:bg-light-2 dark:hover:bg-night-surface flex items-center justify-center transition-colors"
                title="تنظیمات کلید API"
              >
                ⚙️
              </button>
              <button
                onClick={handleClearHistory}
                className="w-7 h-7 rounded-lg text-dark-3 dark:text-gray-400 hover:bg-light-2 dark:hover:bg-night-surface flex items-center justify-center transition-colors"
                title="پاکسازی چت"
              >
                🗑️
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg text-dark-3 dark:text-gray-400 hover:bg-light-2 dark:hover:bg-night-surface flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Quick Action Chips */}
          <div className="p-2.5 border-b border-light-1 dark:border-night-border/80 flex items-center gap-1.5 overflow-x-auto scrollbar-hide flex-shrink-0 bg-light-2/40 dark:bg-night-surface/40">
            {quickChips.map((chip, idx) => {
              const label = currentLang === "fa" ? chip.fa : currentLang === "de" ? chip.de : chip.en;
              return (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip.cmd)}
                  disabled={isRunning}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-white dark:bg-night-card border border-light-0 dark:border-night-border hover:border-main/50 text-dark-2 dark:text-gray-300 hover:text-main dark:hover:text-white whitespace-nowrap shadow-xs transition-all disabled:opacity-50"
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Messages Stream */}
          <div className="p-4 space-y-3 overflow-y-auto flex-grow text-body-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl leading-relaxed text-body-3 shadow-xs ${
                    msg.sender === "user"
                      ? "bg-main text-white rounded-br-none rtl:rounded-bl-none rtl:rounded-br-2xl"
                      : msg.isError
                      ? "bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-bl-none rtl:rounded-br-none rtl:rounded-bl-2xl"
                      : "bg-light-2 dark:bg-night-surface border border-light-0 dark:border-night-border text-dark-0 dark:text-gray-100 rounded-bl-none rtl:rounded-br-none rtl:rounded-bl-2xl"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Live Activity / Progress Banner */}
            {isRunning && (
              <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs flex items-center gap-2.5 animate-pulse">
                <svg className="animate-spin w-4 h-4 text-main flex-shrink-0" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="font-mono truncate">{activityLog || "در حال پردازش..."}</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Box */}
          <div className="p-3 border-t border-light-1 dark:border-night-border flex-shrink-0 bg-white dark:bg-night-card">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              {/* Voice Input Button */}
              <button
                type="button"
                onClick={toggleVoiceInput}
                disabled={isRunning}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  isListening
                    ? "bg-accent-red text-white animate-ping"
                    : "bg-light-2 dark:bg-night-surface text-dark-3 dark:text-gray-300 hover:bg-light-1 dark:hover:bg-night-border"
                }`}
                title={isListening ? "توقف ضبط" : "ورودی صوتی"}
              >
                🎙️
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={
                  currentLang === "fa"
                    ? "به من بگو چی می‌خوای (مثلاً: گوشی سامسونگ تمیز)..."
                    : "Ask me anything (e.g. Find Samsung phones)..."
                }
                disabled={isRunning}
                className="flex-grow px-3.5 py-2 bg-light-2 dark:bg-night-surface border border-light-0 dark:border-night-border rounded-xl text-body-3 focus:outline-none focus:border-main disabled:opacity-50"
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isRunning || !inputVal.trim()}
                className="w-9 h-9 rounded-xl bg-main hover:bg-main-lighter text-white flex items-center justify-center transition-all disabled:opacity-40 active:scale-95 shadow-md flex-shrink-0"
              >
                <svg
                  className={`w-4 h-4 ${currentLang === "fa" ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AI Settings Modal */}
      <AiSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}
