/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getSavedLanguage } from "../../Utils/i18n";
import { MascotVisualLayers } from "./SheypoorMascot";

/**
 * AiProcessingOverlay — Full-screen freeze overlay with holographic AI loading HUD.
 * Features live thinking 3D Mascot with radar aura and step-by-step AI reasoning.
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
      <div className="absolute inset-0 bg-dark-0/75 dark:bg-black/85 backdrop-blur-md" />

      {/* Radial glow effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated scanning rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px]">
          <div className="absolute inset-0 rounded-full border-2 border-main/20 animate-ping" style={{ animationDuration: "3s" }} />
          <div className="absolute inset-8 rounded-full border border-blue-400/15 animate-ping" style={{ animationDuration: "2.5s", animationDelay: "0.5s" }} />
          <div className="absolute inset-16 rounded-full border border-indigo-400/10 animate-ping" style={{ animationDuration: "2s", animationDelay: "1s" }} />
        </div>

        {/* Floating particles */}
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-main/50"
            style={{
              top: `${15 + Math.random() * 70}%`,
              left: `${10 + Math.random() * 80}%`,
              animation: `float-particle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main HUD Card */}
      <div className="relative z-10 w-[90vw] max-w-md bg-white/10 dark:bg-night-card/60 backdrop-blur-2xl border border-white/20 dark:border-night-border rounded-3xl p-6 shadow-2xl">
        {/* Animated Thinking Mascot in Header */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            {/* Thinking Aura Halo */}
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.6, 0.95, 0.6],
              }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -inset-4 rounded-full bg-gradient-to-tr from-amber-400/50 via-orange-500/40 to-main/50 blur-xl pointer-events-none"
            />

            {/* Radar Rings */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeOut" }}
              className="absolute inset-0 rounded-full border-2 border-amber-400 pointer-events-none"
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{ scale: 2.1, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.8, delay: 0.6, ease: "easeOut" }}
              className="absolute inset-0 rounded-full border border-blue-400 pointer-events-none"
            />

            {/* Live 3D Layered Mascot Avatar */}
            <MascotVisualLayers
              isProcessing={true}
              sizeClass="w-24 h-24"
              showBadge={true}
            />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-lg font-bold text-white mb-1">
          {currentLang === "fa" ? "دستیار هوشمند شیپور" : "Sheypoor AI Agent"}
        </h2>
        <p className="text-center text-sm text-white/70 mb-5 max-w-xs mx-auto truncate font-medium">
          {query ? `"${query}"` : ""}
        </p>

        {/* Step Progress */}
        <div className="space-y-2.5 mb-5">
          {Array.from({ length: totalSteps }).map((_, i) => {
            const isComplete = i < stepIndex;
            const isCurrent = i === stepIndex;
            const stepData = currentStep && i === stepIndex ? currentStep : null;

            return (
              <div
                key={i}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-500 ${
                  isCurrent
                    ? "bg-white/20 backdrop-blur-md border border-white/30 shadow-lg text-white font-semibold"
                    : isComplete
                    ? "bg-green-500/15 border border-green-500/30 text-green-300"
                    : "opacity-35 text-white/40"
                }`}
              >
                {/* Step indicator */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${
                  isComplete
                    ? "bg-green-500/25 text-green-400 font-bold"
                    : isCurrent
                    ? "bg-main text-white shadow-md"
                    : "bg-white/10 text-white/40"
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
                <span className={`text-sm ${
                  isComplete
                    ? "text-green-300 font-medium"
                    : isCurrent
                    ? "text-white font-bold"
                    : "text-white/40"
                }`}>
                  {stepData?.text || (isCurrent ? `${currentLang === "fa" ? "در حال پردازش" : "Processing"}${dots}` : `${currentLang === "fa" ? "گام" : "Step"} ${i + 1}`)}
                </span>

                {/* Activity indicator */}
                {isCurrent && (
                  <div className="mr-auto rtl:mr-0 rtl:ml-auto">
                    <svg className="animate-spin w-4 h-4 text-amber-300" fill="none" viewBox="0 0 24 24">
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
        <div className="h-1.5 bg-white/15 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-main via-amber-400 to-orange-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-center text-xs text-white/60">
          {currentLang === "fa"
            ? "لطفاً کمی صبر کنید، دستیار هوشمند در حال جستجو و تحلیل پایگاه داده شیپور است..."
            : "Please wait, AI assistant is searching and analyzing Sheypoor database..."}
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
