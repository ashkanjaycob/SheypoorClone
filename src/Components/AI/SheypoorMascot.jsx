/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSavedLanguage } from "../../Utils/i18n";
import { getAiConfig } from "../../Utils/aiStorage";

/**
 * =========================================================================
 * ⚙️ تنظیمات نهایی و دقیق کالیبراسیون قطعات مسکات شیپور (Calibrated Offsets)
 * =========================================================================
 */
export const MASCOT_OFFSETS = {
  // 🎩 کلاه / آنتن (Hat)
  hatX: 0,
  hatY: -10,
  hatScale: 0.7,

  // 🦾 بدن (Body)
  bodyX: 1,
  bodyY: 16,
  bodyScale: 0.7,

  // ✋ دست چپ (Left Hand)
  leftHandX: 9,
  leftHandY: 35,
  leftHandScale: 0.7,

  // 👋 دست راست (Right Hand)
  rightHandX: -11,
  rightHandY: 30,
  rightHandScale: 0.7,

  // 🤖 سر و کلاهخود (Head)
  headX: 0,
  headY: 0,
  headScale: 1,

  // 👁️ چشم چپ (Left Eye)
  leftEyeX: 0,
  leftEyeY: 0,
  leftEyeScale: 1,

  // 👁️ چشم راست (Right Eye)
  rightEyeX: 0,
  rightEyeY: 0,
  rightEyeScale: 1,

  // 👄 دهان و لبخند (Lips)
  lipsX: 0,
  lipsY: 0,
  lipsScale: 1,
};

export default function SheypoorMascot({ onClick, isOpen, isProcessing }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState("");
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [currentLang, setCurrentLang] = useState(getSavedLanguage());

  const mascotRef = useRef(null);
  const bubbleTimerRef = useRef(null);

  // Sync language
  useEffect(() => {
    const handleLang = (e) => setCurrentLang(e.detail || getSavedLanguage());
    window.addEventListener("sheypoor_lang_changed", handleLang);
    return () => window.removeEventListener("sheypoor_lang_changed", handleLang);
  }, []);

  // Periodic blinking effect (every 3 to 5 seconds)
  useEffect(() => {
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 140);
    };
    const interval = setInterval(triggerBlink, 3200 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  // Proactive greeting bubble after entry
  useEffect(() => {
    const config = getAiConfig();
    if (config.autoGreeting && !isOpen) {
      bubbleTimerRef.current = setTimeout(() => {
        const greeted = sessionStorage.getItem("sheypoor_mascot_greeted");
        if (!greeted) {
          const greetings = {
            fa: [
              "سلام! 👋 دنبال چی می‌گردی؟",
              "بزن روم! برات کارای خفن بکنم ✨",
              "هر چی بخوای با بهترین قیمت برات پیدا می‌کنم 💎",
            ],
            en: [
              "Hi! 👋 What are you looking for?",
              "Tap me! I can find great deals ✨",
              "Let me search the best prices for you 💎",
            ],
            de: [
              "Hallo! 👋 Was suchst du heute?",
              "Klick mich! Ich finde tolle Angebote ✨",
            ],
          };
          const list = greetings[currentLang] || greetings.fa;
          setBubbleText(list[Math.floor(Math.random() * list.length)]);
          setShowBubble(true);
          sessionStorage.setItem("sheypoor_mascot_greeted", "true");

          // Auto-hide bubble after 7s
          setTimeout(() => setShowBubble(false), 7000);
        }
      }, 2500);
    }
    return () => clearTimeout(bubbleTimerRef.current);
  }, [isOpen, currentLang]);

  // Hide bubble when opened or processing
  useEffect(() => {
    if (isOpen || isProcessing) setShowBubble(false);
  }, [isOpen, isProcessing]);

  // Subtle Mouse Parallax Tracking on Hover
  const handleMouseMove = (e) => {
    if (!mascotRef.current) return;
    const rect = mascotRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = (e.clientX - centerX) / 25;
    const dy = (e.clientY - centerY) / 25;
    setMouseOffset({
      x: Math.max(-6, Math.min(6, dx)),
      y: Math.max(-6, Math.min(6, dy)),
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMouseOffset({ x: 0, y: 0 });
  };

  return (
    <div
      ref={mascotRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="fixed bottom-6 rtl:left-6 ltr:right-6 z-50 flex flex-col items-end rtl:items-start gap-2 select-none"
    >
      {/* Speech Bubble */}
      <AnimatePresence>
        {showBubble && !isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative w-64 p-3.5 bg-white/95 dark:bg-night-card/95 backdrop-blur-xl border border-main/30 dark:border-night-border rounded-2xl shadow-2xl"
            dir={currentLang === "fa" ? "rtl" : "ltr"}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowBubble(false);
              }}
              className="absolute top-2 rtl:left-2 ltr:right-2 text-dark-4 hover:text-dark-1 dark:hover:text-white text-xs w-5 h-5 rounded-full flex items-center justify-center transition-colors"
            >
              ✕
            </button>

            <div className="flex items-start gap-2.5">
              <div className="text-xl">✨</div>
              <div className="text-body-3">
                <p className="font-bold text-main dark:text-main-lighter text-xs mb-0.5">
                  {currentLang === "fa" ? "دستیار هوشمند شیپور" : "Sheypoor AI"}
                </p>
                <p className="text-dark-1 dark:text-gray-200 text-xs leading-relaxed">
                  {bubbleText}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setShowBubble(false);
                onClick?.();
              }}
              className="mt-2.5 w-full py-1.5 bg-gradient-to-r from-main to-blue-500 hover:from-main-lighter hover:to-blue-400 text-white rounded-xl text-xs font-semibold shadow-md transition-all active:scale-95"
            >
              {currentLang === "fa" ? "گفتگو و جست‌وجو 🚀" : "Start Chat 🚀"}
            </button>

            {/* Bubble Tail */}
            <div className="absolute -bottom-2 rtl:left-8 ltr:right-8 w-4 h-4 bg-white/95 dark:bg-night-card/95 border-b border-r rtl:border-r-0 rtl:border-l border-main/30 dark:border-night-border transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Trigger Button */}
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        animate={{
          y: isProcessing
            ? [0, -8, 0]
            : isOpen
            ? [0, -3, 0]
            : [0, -6, 0],
        }}
        transition={{
          duration: isProcessing ? 1.4 : isOpen ? 3.5 : 2.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative group p-1.5 focus:outline-none cursor-pointer"
        aria-label="Sheypoor AI Assistant"
      >
        {/* Ambient Glow Aura */}
        <motion.div
          animate={{
            scale: isProcessing ? [1, 1.25, 1] : isHovered ? 1.15 : 1,
            opacity: isProcessing ? [0.6, 0.95, 0.6] : isHovered ? 0.75 : 0.45,
          }}
          transition={{
            duration: isProcessing ? 1.2 : 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute -inset-2 rounded-full blur-xl pointer-events-none transition-all duration-500 ${
            isProcessing
              ? "bg-gradient-to-tr from-amber-400 via-orange-500 to-red-500"
              : isHovered
              ? "bg-gradient-to-tr from-main via-blue-400 to-indigo-500"
              : "bg-gradient-to-tr from-main/60 to-blue-500/40"
          }`}
        />

        {/* Thinking Radar Rings (displayed when processing) */}
        {isProcessing && (
          <>
            <motion.div
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeOut" }}
              className="absolute inset-0 rounded-full border-2 border-amber-400 pointer-events-none"
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{ scale: 1.9, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.8, delay: 0.6, ease: "easeOut" }}
              className="absolute inset-0 rounded-full border border-blue-400 pointer-events-none"
            />
          </>
        )}

        {/* Mascot Body Canvas Container */}
        <div className="relative w-20 h-20 tablet:w-22 tablet:h-22 select-none overflow-visible">
          {/* 1. Base Layer: Body */}
          <div
            className="absolute inset-0 w-full h-full pointer-events-none origin-[50%_65%]"
            style={{
              transform: `translate(${MASCOT_OFFSETS.bodyX}%, ${MASCOT_OFFSETS.bodyY}%) scale(${MASCOT_OFFSETS.bodyScale})`,
            }}
          >
            <motion.img
              src="/AI-MASCAT/body.png"
              alt="Body"
              className="w-full h-full object-contain drop-shadow-md origin-[50%_65%]"
              animate={{
                y: isProcessing ? [0, -2, 0] : [0, -3, 0],
              }}
              transition={{
                duration: isProcessing ? 1.5 : 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          {/* 2. Left Hand Layer (Viewer's Left) */}
          <div
            className="absolute inset-0 w-full h-full pointer-events-none origin-[20%_60%]"
            style={{
              transform: `translate(${MASCOT_OFFSETS.leftHandX}%, ${MASCOT_OFFSETS.leftHandY}%) scale(${MASCOT_OFFSETS.leftHandScale})`,
            }}
          >
            <motion.img
              src="/AI-MASCAT/leftHand.png"
              alt="Left Hand"
              className="w-full h-full object-contain drop-shadow-sm origin-[20%_60%]"
              animate={{
                y: isProcessing ? [-2, -6, -2] : isHovered ? [-1, 2, -1] : [0, -3, 0],
                rotate: isProcessing ? [0, -10, 0] : isHovered ? [0, -6, 0] : [0, 2, 0],
              }}
              transition={{
                duration: isProcessing ? 1.2 : 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          {/* 3. Right Hand Layer (Viewer's Right - Waving Hand!) */}
          <div
            className="absolute inset-0 w-full h-full pointer-events-none origin-[80%_60%]"
            style={{
              transform: `translate(${MASCOT_OFFSETS.rightHandX}%, ${MASCOT_OFFSETS.rightHandY}%) scale(${MASCOT_OFFSETS.rightHandScale})`,
            }}
          >
            <motion.img
              src="/AI-MASCAT/rightHand.png"
              alt="Right Hand"
              className="w-full h-full object-contain drop-shadow-sm origin-[80%_60%]"
              animate={{
                y: isProcessing
                  ? [-3, -8, -3]
                  : isHovered
                  ? [-2, -6, -2]
                  : [0, -3, 0],
                rotate: isProcessing
                  ? [0, 18, 5, 18, 0]
                  : isHovered
                  ? [0, 22, -8, 22, 0]
                  : [0, -2, 0],
              }}
              transition={{
                duration: isProcessing ? 2.5 : isHovered ? 0.9 : 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          {/* 4. Left Eye */}
          <div
            className="absolute inset-0 w-full h-full pointer-events-none origin-[39%_50%]"
            style={{
              transform: `translate(${MASCOT_OFFSETS.leftEyeX}%, ${MASCOT_OFFSETS.leftEyeY}%) scale(${MASCOT_OFFSETS.leftEyeScale})`,
            }}
          >
            <motion.img
              src="/AI-MASCAT/leftEye.png"
              alt="Left Eye"
              className="w-full h-full object-contain origin-[39%_50%]"
              animate={{
                scaleY: isBlinking ? 0.1 : 1,
                scaleX: isHovered ? 1.1 : 1,
                x: isProcessing
                  ? [-2, 2, -2]
                  : mouseOffset.x * 0.9,
                y: isProcessing
                  ? [-4, -6, -4]
                  : mouseOffset.y * 0.9,
              }}
              transition={{
                scaleY: { duration: 0.1 },
                x: { duration: isProcessing ? 2.8 : 0.2, repeat: isProcessing ? Infinity : 0 },
                y: { duration: isProcessing ? 2.8 : 0.2, repeat: isProcessing ? Infinity : 0 },
              }}
            />
          </div>

          {/* 5. Right Eye */}
          <div
            className="absolute inset-0 w-full h-full pointer-events-none origin-[61%_50%]"
            style={{
              transform: `translate(${MASCOT_OFFSETS.rightEyeX}%, ${MASCOT_OFFSETS.rightEyeY}%) scale(${MASCOT_OFFSETS.rightEyeScale})`,
            }}
          >
            <motion.img
              src="/AI-MASCAT/rightEye.png"
              alt="Right Eye"
              className="w-full h-full object-contain origin-[61%_50%]"
              animate={{
                scaleY: isBlinking ? 0.1 : 1,
                scaleX: isHovered ? 1.1 : 1,
                x: isProcessing
                  ? [-2, 2, -2]
                  : mouseOffset.x * 0.9,
                y: isProcessing
                  ? [-4, -6, -4]
                  : mouseOffset.y * 0.9,
              }}
              transition={{
                scaleY: { duration: 0.1 },
                x: { duration: isProcessing ? 2.8 : 0.2, repeat: isProcessing ? Infinity : 0 },
                y: { duration: isProcessing ? 2.8 : 0.2, repeat: isProcessing ? Infinity : 0 },
              }}
            />
          </div>

          {/* 6. Lips / Mouth */}
          <div
            className="absolute inset-0 w-full h-full pointer-events-none origin-[50%_60%]"
            style={{
              transform: `translate(${MASCOT_OFFSETS.lipsX}%, ${MASCOT_OFFSETS.lipsY}%) scale(${MASCOT_OFFSETS.lipsScale})`,
            }}
          >
            <motion.img
              src="/AI-MASCAT/lips.png"
              alt="Lips"
              className="w-full h-full object-contain origin-[50%_60%]"
              animate={{
                scale: isHovered ? 1.15 : isProcessing ? 0.85 : 1,
                y: (isProcessing ? -2 : 0) + mouseOffset.y * 0.6,
                x: mouseOffset.x * 0.6,
              }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            />
          </div>

          {/* 7. Outer Helmet / Head Frame */}
          <div
            className="absolute inset-0 w-full h-full pointer-events-none origin-[50%_50%]"
            style={{
              transform: `translate(${MASCOT_OFFSETS.headX}%, ${MASCOT_OFFSETS.headY}%) scale(${MASCOT_OFFSETS.headScale})`,
            }}
          >
            <motion.img
              src="/AI-MASCAT/head.png"
              alt="Head"
              className="w-full h-full object-contain drop-shadow-md"
              animate={{
                x: mouseOffset.x * 0.4,
                y: (isProcessing ? -3 : 0) + mouseOffset.y * 0.4,
                rotate: isProcessing ? -6 : mouseOffset.x * 0.5,
              }}
              transition={{ type: "spring", stiffness: 160, damping: 14 }}
            />
          </div>

          {/* 8. Top Antenna / Hat */}
          <div
            className="absolute inset-0 w-full h-full pointer-events-none origin-[50%_20%]"
            style={{
              transform: `translate(${MASCOT_OFFSETS.hatX}%, ${MASCOT_OFFSETS.hatY}%) scale(${MASCOT_OFFSETS.hatScale})`,
            }}
          >
            <motion.img
              src="/AI-MASCAT/hat.png"
              alt="Hat"
              className="w-full h-full object-contain drop-shadow-sm origin-[50%_20%]"
              animate={{
                rotate: isProcessing
                  ? [-10, 10, -10]
                  : isHovered
                  ? [-6, 6, -6]
                  : [0, 2, -2, 0],
                y: isProcessing ? -3 : [0, -2, 0],
              }}
              transition={{
                rotate: { duration: isProcessing ? 0.8 : 2.5, repeat: Infinity, ease: "easeInOut" },
                y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
              }}
            />
          </div>

          {/* Status Badge */}
          <motion.span
            animate={{
              scale: isProcessing ? [1, 1.15, 1] : 1,
            }}
            transition={{ duration: 1, repeat: isProcessing ? Infinity : 0 }}
            className={`absolute -top-1 -right-1 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg border-2 border-white dark:border-night-card leading-none ${
              isProcessing
                ? "bg-gradient-to-r from-amber-500 to-orange-500"
                : "bg-gradient-to-r from-main to-blue-500"
            }`}
          >
            {isProcessing ? "🧠..." : "AI ✨"}
          </motion.span>
        </div>
      </motion.button>
    </div>
  );
}
