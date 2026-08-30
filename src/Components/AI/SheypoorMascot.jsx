/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSavedLanguage } from "../../Utils/i18n";
import { getAiConfig } from "../../Utils/aiStorage";

/**
 * SheypoorMascot — High-End Layered 3D AI Robot Mascot powered by Framer Motion.
 * Built with modular layered PNG parts (/AI-MASCAT/):
 * - bodyNohand, leftHand, rightHand, face, head, hat, leftEye, rightEye, lips
 * 
 * Supports:
 * 1. Bouncy spring entry animation
 * 2. Thinking state (head tilt, looking up/around, chin-tap hand, pulsing antenna aura)
 * 3. Idle levitation / breathing floating
 * 4. Happy waving hand & blinking eyes
 * 5. Interactive cursor parallax tracking
 */
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

      {/* Main Mascot Trigger */}
      <motion.button
        onClick={() => {
          setShowBubble(false);
          onClick?.();
        }}
        initial={{ opacity: 0, scale: 0, y: 60, rotate: -15 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 15,
          delay: 0.2,
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="relative group focus:outline-none cursor-pointer"
        aria-label="Toggle Sheypoor AI Mascot"
      >
        {/* Glow Aura when thinking or hovering */}
        <motion.div
          animate={{
            scale: isProcessing ? [1, 1.25, 1] : isHovered ? 1.15 : 1,
            opacity: isProcessing ? [0.6, 0.9, 0.6] : isHovered ? 0.5 : 0.2,
          }}
          transition={{
            duration: isProcessing ? 1.2 : 0.4,
            repeat: isProcessing ? Infinity : 0,
            ease: "easeInOut",
          }}
          className={`absolute -inset-3 rounded-full blur-xl pointer-events-none transition-colors duration-300 ${
            isProcessing
              ? "bg-gradient-to-tr from-amber-400 via-orange-500 to-red-500"
              : "bg-gradient-to-tr from-main via-blue-400 to-indigo-500"
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

        {/* Mascot Body Canvas Container (84px width, maintaining aspect ratio) */}
        <div className="relative w-20 h-20 tablet:w-22 tablet:h-22 select-none overflow-visible">
          {/* Base Layer: Body (shifted 50px / 6% down) */}
          <motion.img
            src="/AI-MASCAT/body.png"
            alt="Body"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md origin-[50%_65%] translate-y-[6%]"
            animate={{
              y: isProcessing ? [0, -2, 0] : [0, -3, 0],
            }}
            transition={{
              duration: isProcessing ? 1.5 : 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Left Hand Layer (Viewer's Left - shifted 50px / 6% down) */}
          <motion.img
            src="/AI-MASCAT/leftHand.png"
            alt="Left Hand"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm origin-[20%_60%] translate-y-[6%]"
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

          {/* Right Hand Layer (Viewer's Right - Waving Hand - shifted 50px / 6% down) */}
          <motion.img
            src="/AI-MASCAT/rightHand.png"
            alt="Right Hand"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm origin-[80%_60%] translate-y-[6%]"
            animate={{
              y: isProcessing
                ? [-3, -8, -3] // Raising hand towards chin while thinking
                : isHovered
                ? [-2, -6, -2]
                : [0, -3, 0],
              rotate: isProcessing
                ? [0, 18, 5, 18, 0]
                : isHovered
                ? [0, 22, -8, 22, 0] // Happy waving animation on hover!
                : [0, -2, 0],
            }}
            transition={{
              duration: isProcessing ? 2.5 : isHovered ? 0.9 : 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Left Eye */}
          <motion.img
            src="/AI-MASCAT/leftEye.png"
            alt="Left Eye"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none origin-[39%_50%]"
            animate={{
              scaleY: isBlinking ? 0.1 : 1,
              scaleX: isHovered ? 1.1 : 1,
              x: isProcessing
                ? [-2, 2, -2] // Looking around thoughtfully
                : mouseOffset.x * 0.9,
              y: isProcessing
                ? [-4, -6, -4] // Looking up thoughtfully
                : mouseOffset.y * 0.9,
            }}
            transition={{
              scaleY: { duration: 0.1 },
              x: { duration: isProcessing ? 2.8 : 0.2, repeat: isProcessing ? Infinity : 0 },
              y: { duration: isProcessing ? 2.8 : 0.2, repeat: isProcessing ? Infinity : 0 },
            }}
          />

          {/* Right Eye */}
          <motion.img
            src="/AI-MASCAT/rightEye.png"
            alt="Right Eye"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none origin-[61%_50%]"
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

          {/* Lips / Mouth */}
          <motion.img
            src="/AI-MASCAT/lips.png"
            alt="Lips"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none origin-[50%_60%]"
            animate={{
              scale: isHovered ? 1.15 : isProcessing ? 0.85 : 1,
              y: (isProcessing ? -2 : 0) + mouseOffset.y * 0.6,
              x: mouseOffset.x * 0.6,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          />

          {/* Outer Helmet / Head Frame */}
          <motion.img
            src="/AI-MASCAT/head.png"
            alt="Head"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md"
            animate={{
              x: mouseOffset.x * 0.4,
              y: (isProcessing ? -3 : 0) + mouseOffset.y * 0.4,
              rotate: isProcessing ? -6 : mouseOffset.x * 0.5,
            }}
            transition={{ type: "spring", stiffness: 160, damping: 14 }}
          />

          {/* Top Antenna / Hat (Proportioned on canvas - shifted 50px / 6% up) */}
          <motion.img
            src="/AI-MASCAT/hat.png"
            alt="Hat"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm origin-[50%_20%] -translate-y-[6%]"
            animate={{
              rotate: isProcessing
                ? [-10, 10, -10] // Wobbling antenna when thinking!
                : isHovered
                ? [-6, 6, -6]
                : [0, 2, -2, 0],
              y: isProcessing ? -3 : [0, -2, 0],
              scale: isProcessing ? [1, 1.1, 1] : 1,
            }}
            transition={{
              rotate: { duration: isProcessing ? 0.8 : 2.5, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 0.8, repeat: isProcessing ? Infinity : 0 },
            }}
          />

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
