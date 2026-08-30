/* eslint-disable react/prop-types */
import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { executeAgentCommand } from "../../Services/aiAgent";
import { performSmartSearch } from "../../Services/aiSmartSearchEngine";
import { getStoredChatHistory, saveChatHistory, clearChatHistory } from "../../Utils/aiStorage";
import { getSavedLanguage } from "../../Utils/i18n";
import { formatAdPrice, translateCity } from "../../Utils/adTranslator";
import { requestNotificationPermission, sendAiNotification, isNotificationSupported } from "../../Services/aiNotificationService";
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
  const [currentLang, setCurrentLang] = useState(getSavedLanguage());

  // Voice recording & preview state
  const [isListening, setIsListening] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [voicePreview, setVoicePreview] = useState(null); // { audioUrl, duration, transcript }
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

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
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const audioPlayerRef = useRef(null);
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
            ? "سلام! 👋 من دستیار هوشمند شیپور هستم. بهم بگو چی میخوای، برات از بین آگهی‌های شیپور با بهترین قیمت پیدا کنم! 🚀"
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
  }, [messages, isOpen, activityLog, voicePreview]);

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

  // ===== Voice Recording & Studio Review =====
  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      setRecordingSeconds(0);
      setVoicePreview(null);

      // 1. Audio stream capture for playback
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          const audioUrl = URL.createObjectURL(audioBlob);
          setVoicePreview((prev) => ({
            ...prev,
            audioUrl,
            blob: audioBlob,
            duration: recordingSeconds,
          }));
          // Stop media tracks
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
      }

      // 2. Speech recognition for real-time text transcription
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = currentLang === "fa" ? "fa-IR" : currentLang === "de" ? "de-DE" : "en-US";
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
          let currentTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setInputVal(currentTranscript);
          setVoicePreview((prev) => ({
            ...prev,
            transcript: currentTranscript,
          }));
        };

        recognition.onerror = (e) => {
          console.warn("Speech recognition error:", e);
        };

        recognitionRef.current = recognition;
        recognition.start();
      }

      setIsListening(true);

      // Start timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn("Could not start recording:", err);
      toast.error(
        currentLang === "fa"
          ? "دسترسی به میکروفون امکان‌پذیر نشد."
          : "Microphone access was denied or not supported."
      );
      setIsListening(false);
    }
  };

  const stopRecording = () => {
    setIsListening(false);
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const toggleVoiceRecording = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const discardVoicePreview = () => {
    if (voicePreview?.audioUrl) {
      URL.revokeObjectURL(voicePreview.audioUrl);
    }
    setVoicePreview(null);
    setInputVal("");
    setIsPlayingAudio(false);
  };

  const toggleAudioPlay = () => {
    if (!audioPlayerRef.current) return;
    if (isPlayingAudio) {
      audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  // ===== Smart AI Send (with freeze overlay + results modal + inline cards) =====
  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputVal).trim();
    if (!text || isRunning) return;

    setInputVal("");
    discardVoicePreview();

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toISOString(),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    saveChatHistory(updated);

    // Check if this is a simple UI command (theme, etc.)
    const lower = text.toLowerCase();
    const isSimpleCommand =
      lower.includes("دارک") || lower.includes("تاریک") || lower.includes("dark") ||
      lower.includes("لایت") || lower.includes("روشن") || lower.includes("light");

    if (isSimpleCommand) {
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

      // Add assistant message WITH embedded results preview cards
      const assistantMsg = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        text: currentLang === "fa"
          ? (results.length > 0
              ? `🎯 ${results.length} آگهی منطبق با «${text}» از پایگاه داده شیپور برات گلچین کردم:`
              : `🔍 آگهی دقیقی منطبق با «${text}» یافت نشد. می‌تونی فیلترها رو تغییر بدی.`)
          : (results.length > 0
              ? `🎯 Found ${results.length} matching listings for "${text}":`
              : `🔍 No exact matches found for "${text}".`),
        results: results || [],
        summary,
        intent,
        timestamp: new Date().toISOString(),
      };
      const finalMessages = [...updated, assistantMsg];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);

      // Store results and show modal
      setSearchResults(results);
      setSearchSummary(summary);
      setSearchIntent(intent);

      // Trigger optional system notification if user permitted
      if (results.length > 0) {
        sendAiNotification({
          title: `🤖 دستیار شیپور: ${results.length} آگهی جدید یافت شد`,
          body: `نتایج جستجوی «${text}» با بالاترین تطابق آماده بررسی است.`,
        });
      }

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

  const handleRequestNotification = async () => {
    const res = await requestNotificationPermission();
    if (res === "granted") {
      toast.success(currentLang === "fa" ? "نوتیفیکیشن هوش مصنوعی فعال شد 🔔" : "AI Notifications enabled 🔔");
    } else {
      toast(currentLang === "fa" ? "نوتیفیکیشن فعال نشد یا توسط مرورگر رد شد." : "Notifications denied or not allowed.");
    }
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
      {/* Animated Mascot (Sticky left-0 and bottom-[74px] on mobile above bottom nav) */}
      <SheypoorMascot
        onClick={() => setIsOpen(!isOpen)}
        isOpen={isOpen}
        isProcessing={isProcessing}
      />

      {/* Main AI Chat Panel */}
      {isOpen && (
        <div
          className="fixed bottom-[80px] tablet:bottom-24 left-2 right-2 tablet:left-6 tablet:right-auto z-50 w-auto tablet:w-[430px] max-w-[450px] h-[550px] max-h-[78vh] bg-white/95 dark:bg-night-card/95 backdrop-blur-xl border border-light-0 dark:border-night-border rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in text-dark-0 dark:text-white"
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
                  <span className="text-[10px] font-medium bg-main/20 text-main dark:text-main-lighter px-2 py-0.5 rounded-full">
                    {currentLang === "fa" ? "هوش مصنوعی" : "AI"}
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
              {isNotificationSupported() && (
                <button
                  onClick={handleRequestNotification}
                  className="w-7 h-7 rounded-lg text-dark-3 dark:text-gray-400 hover:bg-light-2 dark:hover:bg-night-surface flex items-center justify-center transition-colors"
                  title={currentLang === "fa" ? "فعالسازی اعلان‌ها" : "Enable notifications"}
                >
                  🔔
                </button>
              )}
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
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-white dark:bg-night-card border border-light-0 dark:border-night-border hover:border-main/50 text-dark-2 dark:text-gray-300 hover:text-main dark:hover:text-white whitespace-nowrap shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Messages Stream */}
          <div className="p-4 space-y-3.5 overflow-y-auto flex-grow text-body-3 scrollbar-themed">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                {/* Message Bubble */}
                <div
                  className={`max-w-[88%] p-3 rounded-2xl leading-relaxed text-body-3 shadow-xs ${
                    msg.sender === "user"
                      ? "bg-main text-white rounded-br-none rtl:rounded-bl-none rtl:rounded-br-2xl"
                      : msg.isError
                      ? "bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-bl-none rtl:rounded-br-none rtl:rounded-bl-2xl"
                      : "bg-light-2 dark:bg-night-surface border border-light-0 dark:border-night-border text-dark-0 dark:text-gray-100 rounded-bl-none rtl:rounded-br-none rtl:rounded-bl-2xl"
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Inline Similar Ads Cards in Chat */}
                  {msg.results && msg.results.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-dark-4/10 dark:border-white/10 space-y-2">
                      <div className="grid grid-cols-1 gap-2">
                        {msg.results.slice(0, 3).map((item, idx) => {
                          const ad = item.ad || item;
                          const id = ad._id || ad.id || "";
                          const title = typeof (ad.options?.title || ad.title) === "string" 
                            ? (ad.options?.title || ad.title) 
                            : "آگهی شیپور";
                          const rawPrice = ad.amount || ad.options?.price || ad.options?.amount;
                          const priceInfo = formatAdPrice(rawPrice, currentLang);
                          const formattedPrice = typeof priceInfo === "string" 
                            ? priceInfo 
                            : priceInfo && priceInfo.price 
                            ? `${priceInfo.price} ${priceInfo.currency || ""}`.trim() 
                            : (currentLang === "fa" ? "قیمت توافقی" : "Negotiable");
                          const rawCity = ad.options?.city || ad.city || "";
                          const city = typeof rawCity === "string" ? translateCity(rawCity, currentLang) : "";
                          const image = (Array.isArray(ad.images) && ad.images[0]) || "/sheypoor-Logo.png";

                          return (
                            <Link
                              key={id || idx}
                              to={`/dashboard/${id}`}
                              className="flex items-center gap-2.5 p-2 bg-white dark:bg-night-card rounded-xl border border-light-0 dark:border-night-border hover:border-main transition-all group"
                            >
                              <img
                                src={image}
                                alt={title}
                                className="w-12 h-12 rounded-lg object-cover bg-light-2 flex-shrink-0"
                                onError={(e) => {
                                  e.target.src = "/sheypoor-Logo.png";
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <h5 className="text-xs font-bold text-dark-0 dark:text-white truncate group-hover:text-main transition-colors">
                                  {title}
                                </h5>
                                <p className="text-[11px] font-bold text-main dark:text-main-lighter mt-0.5">
                                  {formattedPrice}
                                </p>
                                {city && (
                                  <span className="text-[10px] text-dark-3 dark:text-gray-400">
                                    📍 {city}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-dark-4 group-hover:text-main rtl:rotate-180">
                                ➔
                              </span>
                            </Link>
                          );
                        })}
                      </div>

                      {/* View full results button */}
                      <button
                        onClick={() => {
                          setSearchResults(msg.results);
                          setSearchSummary(msg.summary || "");
                          setSearchIntent(msg.intent || null);
                          setShowResults(true);
                        }}
                        className="w-full mt-1.5 py-1.5 px-3 bg-gradient-to-r from-main to-blue-500 hover:from-main-lighter hover:to-blue-400 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>📋 مشاهده کامل نتایج ({msg.results.length} آگهی)</span>
                      </button>
                    </div>
                  )}
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

          {/* Voice Preview & Audio Player Studio Card (before sending) */}
          {voicePreview && (
            <div className="p-3 bg-gradient-to-r from-main/10 via-blue-500/10 to-indigo-500/10 border-t border-main/20 flex flex-col gap-2 flex-shrink-0 animate-fade-in">
              <audio
                ref={audioPlayerRef}
                src={voicePreview.audioUrl}
                onEnded={() => setIsPlayingAudio(false)}
                className="hidden"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleAudioPlay}
                    className="w-8 h-8 rounded-full bg-main text-white flex items-center justify-center shadow-md active:scale-90 transition-transform"
                    title={isPlayingAudio ? "توقف پخش" : "پخش ویس"}
                  >
                    {isPlayingAudio ? "⏸️" : "▶️"}
                  </button>
                  <div>
                    <p className="text-[11px] font-bold text-dark-1 dark:text-white">
                      {currentLang === "fa" ? "ویس ضبط‌شده" : "Recorded Audio"}
                    </p>
                    <p className="text-[10px] text-dark-3 dark:text-gray-400 font-mono">
                      00:{String(voicePreview.duration || recordingSeconds).padStart(2, "0")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={discardVoicePreview}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 text-xs transition-colors"
                    title={currentLang === "fa" ? "حذف و ضبط مجدد" : "Discard"}
                  >
                    🗑️ {currentLang === "fa" ? "حذف" : "Delete"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendMessage(inputVal || voicePreview.transcript)}
                    className="py-1 px-3 bg-main hover:bg-main-lighter text-white rounded-lg text-xs font-bold shadow-xs active:scale-95 transition-all"
                  >
                    🚀 {currentLang === "fa" ? "ارسال" : "Send"}
                  </button>
                </div>
              </div>

              {/* Editable transcribed text info */}
              <div className="text-[11px] text-dark-2 dark:text-gray-300 bg-white/70 dark:bg-night-card/70 p-2 rounded-lg border border-light-0 dark:border-night-border">
                <span className="font-semibold text-main dark:text-main-lighter">
                  {currentLang === "fa" ? "متن تشخیص داده‌شده: " : "Transcribed: "}
                </span>
                <span>{inputVal || (currentLang === "fa" ? "(می‌توانید در کادر زیر متن را ویرایش یا ارسال کنید)" : "(You can edit below)")}</span>
              </div>
            </div>
          )}

          {/* Chat Input Box */}
          <div className="p-3 border-t border-light-1 dark:border-night-border flex-shrink-0 bg-white dark:bg-night-card">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              {/* Voice Recording / Stop Button */}
              <button
                type="button"
                onClick={toggleVoiceRecording}
                disabled={isRunning}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  isListening
                    ? "bg-accent-red text-white animate-pulse shadow-md"
                    : "bg-light-2 dark:bg-night-surface text-dark-3 dark:text-gray-300 hover:bg-light-1 dark:hover:bg-night-border"
                }`}
                title={isListening ? "توقف ضبط ویس" : "ضبط ویس برای هوش مصنوعی"}
              >
                {isListening ? (
                  <span className="text-xs font-mono font-bold">{recordingSeconds}s</span>
                ) : (
                  "🎙️"
                )}
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={
                  isListening
                    ? (currentLang === "fa" ? "در حال گوش دادن... صحبت کنید 🎙️" : "Listening... Speak now 🎙️")
                    : (currentLang === "fa" ? "بگو چی میخوای... (مثلاً: خودرو زیر ۵۰۰ میلیون)" : "Tell me what you need...")
                }
                disabled={isRunning}
                className="flex-grow px-3.5 py-2 bg-light-2 dark:bg-night-surface border border-light-0 dark:border-night-border rounded-xl text-body-3 focus:outline-none focus:border-main disabled:opacity-50"
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isRunning || !inputVal.trim()}
                className="w-9 h-9 rounded-xl bg-main hover:bg-main-lighter text-white flex items-center justify-center transition-all disabled:opacity-40 active:scale-95 shadow-md flex-shrink-0 cursor-pointer"
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

      {/* AI Processing Overlay (Full-screen freeze with HUD + live thinking 3D Mascot) */}
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
