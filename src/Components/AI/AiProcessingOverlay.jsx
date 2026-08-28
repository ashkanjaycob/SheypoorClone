/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { getSavedLanguage } from "../../Utils/i18n";

/**
 * AiProcessingOverlay — Full-screen freeze overlay with holographic AI loading HUD.
 * Shows step-by-step AI reasoning progress while processing in the background.
 */
export default function AiProcessingOverlay({ isActive, currentStep, stepIndex, query }) {
  const [dots, setDots] = useState("");
  const [currentLang] = useState(getSavedLanguage());

  // Animated dots
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  const totalSteps = 4;
  const progress = ((stepIndex + 1) / totalSteps) * 100;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center select-none" style={{ direction: currentLang === "fa" ? "rtl" : "ltr" }}>
      {/* Backdrop blur + dark overlay */}
      <div className="absolute inset-0 bg-dark-0/70 dark:bg-black/80 backdrop-blur-md" />

      {/* Radial glow effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated scanning rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]">
          <div className="absolute inset-0 rounded-full border-2 border-main/20 animate-ping" style={{ animationDuration: "3s" }} />
          <div className="absolute inset-8 rounded-full border border-blue-400/15 animate-ping" style={{ animationDuration: "2.5s", animationDelay: "0.5s" }} />
          <div className="absolute inset-16 rounded-full border border-indigo-400/10 animate-ping" style={{ animationDuration: "2s", animationDelay: "1s" }} />
        </div>

        {/* Floating particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-main/50"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${10 + Math.random() * 80}%`,
              animation: `float-particle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main HUD Card */}
      <div className="relative z-10 w-[90vw] max-w-md">
        {/* AI Brain Icon with glow */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-main via-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-main/40">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            {/* Rotating ring */}
            <div className="absolute -inset-3 rounded-[22px] border-2 border-dashed border-main/40 animate-spin" style={{ animationDuration: "8s" }} />
            {/* Glow */}
            <div className="absolute -inset-6 rounded-full bg-main/10 blur-xl animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-lg font-bold text-white mb-1">
          {currentLang === "fa" ? "دستیار هوشمند شیپور" : "Sheypoor AI Agent"}
        </h2>
        <p className="text-center text-sm text-white/60 mb-6 max-w-xs mx-auto truncate">
          {query ? `"${query}"` : ""}
        </p>

        {/* Step Progress */}
        <div className="space-y-3 mb-6">
          {Array.from({ length: totalSteps }).map((_, i) => {
            const isComplete = i < stepIndex;
            const isCurrent = i === stepIndex;
            const stepData = currentStep && i === stepIndex ? currentStep : null;

            return (
              <div
                key={i}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-500 ${
                  isCurrent
                    ? "bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg"
                    : isComplete
                    ? "bg-green-500/10 border border-green-500/20"
                    : "opacity-30"
                }`}
              >
                {/* Step indicator */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${
                  isComplete
                    ? "bg-green-500/20 text-green-400"
                    : isCurrent
                    ? "bg-main/30 text-white"
                    : "bg-white/5 text-white/30"
                }`}>
                  {isComplete ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isCurrent ? (
                    <span className="text-base">{stepData?.icon || "⏳"}</span>
                  ) : (
                    <span className="text-xs font-mono">{i + 1}</span>
                  )}
                </div>

                {/* Step text */}
                <span className={`text-sm font-medium ${
                  isComplete
                    ? "text-green-400"
                    : isCurrent
                    ? "text-white"
                    : "text-white/30"
                }`}>
                  {stepData?.text || (isCurrent ? `${currentLang === "fa" ? "در حال پردازش" : "Processing"}${dots}` : `${currentLang === "fa" ? "گام" : "Step"} ${i + 1}`)}
                </span>

                {/* Activity indicator */}
                {isCurrent && (
                  <div className="mr-auto rtl:mr-0 rtl:ml-auto">
                    <svg className="animate-spin w-4 h-4 text-main" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-main via-blue-400 to-indigo-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-center text-xs text-white/40">
          {currentLang === "fa"
            ? "لطفاً صبر کنید، هوش مصنوعی در حال تحلیل درخواست شماست..."
            : "Please wait, AI is analyzing your request..."}
        </p>
      </div>

      {/* Keyframe styles */}
      <style>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
          50% { transform: translateY(-20px) scale(1.5); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
