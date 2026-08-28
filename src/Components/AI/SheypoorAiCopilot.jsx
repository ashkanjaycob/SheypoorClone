import { useState, useEffect, useRef, useCallback } from "react";
import { executeAgentCommand } from "../../Services/aiAgent";
import { performSmartSearch } from "../../Services/aiSmartSearchEngine";
import { getStoredChatHistory, saveChatHistory, clearChatHistory } from "../../Utils/aiStorage";
import { getSavedLanguage } from "../../Utils/i18n";
import SheypoorMascot from "./SheypoorMascot";
import AiProcessingOverlay from "./AiProcessingOverlay";
import AiResultsModal from "./AiResultsModal";
import toast from "react-hot-toast";

export default function SheypoorAiCopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [activityLog, setActivityLog] = useState("");
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [currentLang, setCurrentLang] = useState(getSavedLanguage());

  // AI Processing Overlay state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(null);
  const [processingStepIndex, setProcessingStepIndex] = useState(0);
  const [processingQuery, setProcessingQuery] = useState("");

  // AI Results Modal state
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchSummary, setSearchSummary] = useState("");
  const [searchIntent, setSearchIntent] = useState(null);

  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const chipsRef = useRef(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });

  // Sync language
  useEffect(() => {
    const handleLang = (e) => setCurrentLang(e.detail || getSavedLanguage());
    window.addEventListener("sheypoor_lang_changed", handleLang);
    return () => window.removeEventListener("sheypoor_lang_changed", handleLang);
  }, []);

  // Initialize history
  useEffect(() => {
    const history = getStoredChatHistory();
    if (history && history.length > 0) {
      setMessages(history);
    } else {
      const defaultGreeting = {
        id: "welcome-1",
        sender: "assistant",
        text:
          currentLang === "fa"
            ? "سلام! 👋 من دستیار هوشمند شیپور هستم. بهم بگو چی میخوای، بقیش با من! 🚀"
            : currentLang === "de"
            ? "Hallo! 👋 Ich bin der Sheypoor AI-Assistent. Sag mir, was du suchst!"
            : "Hello! 👋 I'm your Sheypoor AI Assistant. Tell me what you need!",
        timestamp: new Date().toISOString(),
      };
      setMessages([defaultGreeting]);
    }
  }, [currentLang]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, activityLog]);

  // ===== Mouse Drag Scroll for Chips =====
  const handleChipMouseDown = useCallback((e) => {
    const container = chipsRef.current;
    if (!container) return;
    isDragging.current = true;
    dragStart.current = { x: e.pageX, scrollLeft: container.scrollLeft };
    container.style.cursor = "grabbing";
    container.style.userSelect = "none";
  }, []);

  const handleChipMouseMove = useCallback((e) => {
    if (!isDragging.current) return;
    const container = chipsRef.current;
    if (!container) return;
    e.preventDefault();
    const dx = e.pageX - dragStart.current.x;
    container.scrollLeft = dragStart.current.scrollLeft - dx;
  }, []);

  const handleChipMouseUp = useCallback(() => {
    isDragging.current = false;
    const container = chipsRef.current;
    if (container) {
      container.style.cursor = "grab";
      container.style.userSelect = "";
    }
  }, []);

  // Mouse wheel → horizontal scroll on chips
  const handleChipWheel = useCallback((e) => {
    const container = chipsRef.current;
    if (!container) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      container.scrollLeft += e.deltaY;
    }
  }, []);

  useEffect(() => {
    const container = chipsRef.current;
    if (!container) return;
    container.addEventListener("wheel", handleChipWheel, { passive: false });
    document.addEventListener("mousemove", handleChipMouseMove);
    document.addEventListener("mouseup", handleChipMouseUp);
    return () => {
      container.removeEventListener("wheel", handleChipWheel);
      document.removeEventListener("mousemove", handleChipMouseMove);
      document.removeEventListener("mouseup", handleChipMouseUp);
    };
  }, [handleChipWheel, handleChipMouseMove, handleChipMouseUp, isOpen]);

  // ===== Voice Input =====
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

  // ===== Smart AI Send (with freeze overlay + results modal) =====
  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputVal).trim();
    if (!text || isRunning) return;

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

    // Check if this is a simple command (theme, etc.) vs a search query
    const lower = text.toLowerCase();
    const isSimpleCommand =
      lower.includes("دارک") || lower.includes("تاریک") || lower.includes("dark") ||
      lower.includes("لایت") || lower.includes("روشن") || lower.includes("light");

    if (isSimpleCommand) {
      // Execute directly without overlay
      setIsRunning(true);
      setActivityLog(currentLang === "fa" ? "در حال اجرا..." : "Executing...");
      try {
        const result = await executeAgentCommand(text, (act) => {
          if (act?.message) setActivityLog(act.message);
        });
        const assistantMsg = {
          id: `assistant-${Date.now()}`,
          sender: "assistant",
          text: result.result || (currentLang === "fa" ? "انجام شد ✅" : "Done ✅"),
          timestamp: new Date().toISOString(),
        };
        const finalMessages = [...updated, assistantMsg];
        setMessages(finalMessages);
        saveChatHistory(finalMessages);
      } catch (err) {
        const errorMsg = {
          id: `err-${Date.now()}`,
          sender: "assistant",
          text: currentLang === "fa" ? `خطا: ${err.message}` : `Error: ${err.message}`,
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
      return;
    }

    // ===== SMART SEARCH: Full AI pipeline with freeze overlay =====
    setIsProcessing(true);
    setProcessingQuery(text);
    setProcessingStepIndex(0);
    setProcessingStep(null);
    setIsRunning(true);

    try {
      const { results, summary, intent } = await performSmartSearch(text, (step, idx) => {
        setProcessingStep(step);
        setProcessingStepIndex(idx);
      });

      // Add assistant message
      const assistantMsg = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        text: currentLang === "fa"
          ? `🎯 ${results.length} آگهی مرتبط با درخواست شما پیدا کردم! نتایج آماده‌ست.`
          : `🎯 Found ${results.length} relevant listings! Results are ready.`,
        timestamp: new Date().toISOString(),
      };
      const finalMessages = [...updated, assistantMsg];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);

      // Store results and show modal
      setSearchResults(results);
      setSearchSummary(summary);
      setSearchIntent(intent);

      // Small delay for the last step to complete visually
      await new Promise((r) => setTimeout(r, 600));
      setIsProcessing(false);
      setShowResults(true);
    } catch (err) {
      setIsProcessing(false);
      const errorMsg = {
        id: `err-${Date.now()}`,
        sender: "assistant",
        text: currentLang === "fa" ? `خطا در جستجوی هوشمند: ${err.message}` : `Smart search error: ${err.message}`,
        timestamp: new Date().toISOString(),
        isError: true,
      };
      const finalMessages = [...updated, errorMsg];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    } finally {
      setIsRunning(false);
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
            ? "تاریخچه پاک شد. چطور کمکت کنم؟ 🚀"
            : "Chat cleared. How can I help? 🚀",
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
      fa: "💻 لپ تاپ ارزان",
      en: "💻 Cheap Laptops",
      de: "💻 Günstige Laptops",
      cmd: "لپ تاپ ارزان پیدا کن",
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
      {/* Animated Mascot (replaces old button) */}
      <SheypoorMascot
        onClick={() => setIsOpen(!isOpen)}
        isOpen={isOpen}
        isProcessing={isProcessing}
      />

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
                    Gemini
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-green-600 dark:text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                  <span>{currentLang === "fa" ? "آماده اجرای دستورات" : "Ready to execute"}</span>
                </div>
              </div>
            </div>

            {/* Header Tools — NO settings icon for users */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                className="w-7 h-7 rounded-lg text-dark-3 dark:text-gray-400 hover:bg-light-2 dark:hover:bg-night-surface flex items-center justify-center transition-colors"
                title={currentLang === "fa" ? "پاکسازی چت" : "Clear chat"}
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

          {/* Quick Action Chips with Mouse Drag Scroll */}
          <div
            ref={chipsRef}
            onMouseDown={handleChipMouseDown}
            className="p-2.5 border-b border-light-1 dark:border-night-border/80 flex items-center gap-1.5 overflow-x-auto scrollbar-hide flex-shrink-0 bg-light-2/40 dark:bg-night-surface/40"
            style={{ cursor: "grab" }}
          >
            {quickChips.map((chip, idx) => {
              const label = currentLang === "fa" ? chip.fa : currentLang === "de" ? chip.de : chip.en;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (!isDragging.current) handleSendMessage(chip.cmd);
                  }}
                  disabled={isRunning}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-white dark:bg-night-card border border-light-0 dark:border-night-border hover:border-main/50 text-dark-2 dark:text-gray-300 hover:text-main dark:hover:text-white whitespace-nowrap shadow-xs transition-all disabled:opacity-50"
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Messages Stream */}
          <div className="p-4 space-y-3 overflow-y-auto flex-grow text-body-3 scrollbar-themed">
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
            {isRunning && !isProcessing && (
              <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs flex items-center gap-2.5 animate-pulse">
                <svg className="animate-spin w-4 h-4 text-main flex-shrink-0" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="font-mono truncate">{activityLog || (currentLang === "fa" ? "در حال پردازش..." : "Processing...")}</span>
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
                    ? "bg-accent-red text-white animate-pulse"
                    : "bg-light-2 dark:bg-night-surface text-dark-3 dark:text-gray-300 hover:bg-light-1 dark:hover:bg-night-border"
                }`}
                title={isListening ? "توقف" : "ورودی صوتی"}
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
                    ? "بگو چی میخوای... (مثلاً: گوشی سامسونگ تمیز)"
                    : "Tell me what you need..."
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

      {/* AI Processing Overlay (Full-screen freeze with HUD) */}
      <AiProcessingOverlay
        isActive={isProcessing}
        currentStep={processingStep}
        stepIndex={processingStepIndex}
        query={processingQuery}
      />

      {/* AI Results Modal */}
      <AiResultsModal
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        results={searchResults}
        summary={searchSummary}
        query={processingQuery}
        intent={searchIntent}
      />
    </>
  );
}
