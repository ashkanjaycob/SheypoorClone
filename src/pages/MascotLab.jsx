import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

/**
 * MascotLab — Full-Featured Multi-Layer Calibration Studio & Test Suite
 * URL: /ai-lab and /mascot-lab
 */
const DEFAULT_PARTS = {
  hat: { name: "کلاه / آنتن (Hat)", icon: "🎩", x: 0, y: -25, scale: 1 },
  head: { name: "سر و کلاهخود (Head)", icon: "🤖", x: 0, y: 0, scale: 1 },
  body: { name: "بدن (Body)", icon: "🦾", x: 0, y: 25, scale: 1 },
  leftHand: { name: "دست چپ (Left Hand)", icon: "✋", x: -8, y: 25, scale: 1 },
  rightHand: { name: "دست راست (Right Hand)", icon: "👋", x: 8, y: 25, scale: 1 },
  leftEye: { name: "چشم چپ (Left Eye)", icon: "👁️", x: 0, y: 0, scale: 1 },
  rightEye: { name: "چشم راست (Right Eye)", icon: "👁️", x: 0, y: 0, scale: 1 },
  lips: { name: "دهان و لبخند (Lips)", icon: "👄", x: 0, y: 0, scale: 1 },
};

export default function MascotLab() {
  // Preset animation variant
  const [activeVariant, setActiveVariant] = useState("idle"); // idle | thinking | waving | excited | talking | sleeping

  // Visual size
  const [stageSize, setStageSize] = useState(260); // px

  // Background style
  const [bgStyle, setBgStyle] = useState("dark"); // light | dark | grid | glass | checker

  // Reference overlay opacity (0 to 1)
  const [refOpacity, setRefOpacity] = useState(0);

  // Manual blink trigger
  const [isBlinking, setIsBlinking] = useState(false);

  // Selected Part for calibration
  const [selectedPartKey, setSelectedPartKey] = useState("hat");

  // Multi-part offsets and scale
  const [parts, setParts] = useState(DEFAULT_PARTS);

  // Global settings
  const [globalSettings, setGlobalSettings] = useState({
    floatDuration: 2.6,
    floatDistance: 6,
    waveSpeed: 0.9,
    glowColor: "blue", // blue | amber | purple | emerald
    glowIntensity: 0.6,
    eyeFollowMouse: true,
    showBoxes: true,
  });

  // Layer Visibility
  const [visibleLayers, setVisibleLayers] = useState({
    body: true,
    leftHand: true,
    rightHand: true,
    head: true,
    hat: true,
    leftEye: true,
    rightEye: true,
    lips: true,
    aura: true,
    particles: true,
  });

  // Mouse Tracking for interactive canvas
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const toggleLayer = (layerName) => {
    setVisibleLayers((prev) => ({ ...prev, [layerName]: !prev[layerName] }));
  };

  const updatePart = (partKey, field, value) => {
    setParts((prev) => ({
      ...prev,
      [partKey]: {
        ...prev[partKey],
        [field]: typeof value === "number" ? Math.round(value * 100) / 100 : value,
      },
    }));
  };

  const nudgePart = (partKey, dx, dy, dScale = 0) => {
    setParts((prev) => ({
      ...prev,
      [partKey]: {
        ...prev[partKey],
        x: Math.round((prev[partKey].x + dx) * 10) / 10,
        y: Math.round((prev[partKey].y + dy) * 10) / 10,
        scale: Math.max(0.1, Math.round((prev[partKey].scale + dScale) * 100) / 100),
      },
    }));
  };

  const resetSinglePart = (partKey) => {
    setParts((prev) => ({
      ...prev,
      [partKey]: { ...DEFAULT_PARTS[partKey] },
    }));
    toast.success(`تنظیمات ${DEFAULT_PARTS[partKey].name} به حالت اولیه برگشت.`);
  };

  const resetAllParts = () => {
    setParts(DEFAULT_PARTS);
    toast.success("تمام لایه‌ها به حالت پیش‌فرض برگشتند.");
  };

  // Preset Spacing Options
  const applyPreset = (presetName) => {
    if (presetName === "clustered") {
      setParts({
        hat: { ...DEFAULT_PARTS.hat, x: 0, y: 0, scale: 1 },
        head: { ...DEFAULT_PARTS.head, x: 0, y: 0, scale: 1 },
        body: { ...DEFAULT_PARTS.body, x: 0, y: 0, scale: 1 },
        leftHand: { ...DEFAULT_PARTS.leftHand, x: 0, y: 0, scale: 1 },
        rightHand: { ...DEFAULT_PARTS.rightHand, x: 0, y: 0, scale: 1 },
        leftEye: { ...DEFAULT_PARTS.leftEye, x: 0, y: 0, scale: 1 },
        rightEye: { ...DEFAULT_PARTS.rightEye, x: 0, y: 0, scale: 1 },
        lips: { ...DEFAULT_PARTS.lips, x: 0, y: 0, scale: 1 },
      });
      toast("پریست: حالت چسبیده (0%) اعمال شد.");
    } else if (presetName === "spaced") {
      setParts({
        hat: { ...DEFAULT_PARTS.hat, x: 0, y: -25, scale: 1 },
        head: { ...DEFAULT_PARTS.head, x: 0, y: 0, scale: 1 },
        body: { ...DEFAULT_PARTS.body, x: 0, y: 25, scale: 1 },
        leftHand: { ...DEFAULT_PARTS.leftHand, x: -8, y: 25, scale: 1 },
        rightHand: { ...DEFAULT_PARTS.rightHand, x: 8, y: 25, scale: 1 },
        leftEye: { ...DEFAULT_PARTS.leftEye, x: 0, y: 0, scale: 1 },
        rightEye: { ...DEFAULT_PARTS.rightEye, x: 0, y: 0, scale: 1 },
        lips: { ...DEFAULT_PARTS.lips, x: 0, y: 0, scale: 1 },
      });
      toast("پریست: فاصله‌گذاری استاندارد (25%) اعمال شد.");
    } else if (presetName === "extraSpaced") {
      setParts({
        hat: { ...DEFAULT_PARTS.hat, x: 0, y: -45, scale: 1.1 },
        head: { ...DEFAULT_PARTS.head, x: 0, y: 0, scale: 1 },
        body: { ...DEFAULT_PARTS.body, x: 0, y: 45, scale: 1 },
        leftHand: { ...DEFAULT_PARTS.leftHand, x: -16, y: 45, scale: 1 },
        rightHand: { ...DEFAULT_PARTS.rightHand, x: 16, y: 45, scale: 1 },
        leftEye: { ...DEFAULT_PARTS.leftEye, x: 0, y: 0, scale: 1 },
        rightEye: { ...DEFAULT_PARTS.rightEye, x: 0, y: 0, scale: 1 },
        lips: { ...DEFAULT_PARTS.lips, x: 0, y: 0, scale: 1 },
      });
      toast("پریست: فاصله زیاد (45%) اعمال شد.");
    }
  };

  const handleStageMouseMove = (e) => {
    if (!globalSettings.eyeFollowMouse) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = (e.clientX - centerX) / 15;
    const dy = (e.clientY - centerY) / 15;
    setMouseOffset({
      x: Math.max(-10, Math.min(10, dx)),
      y: Math.max(-10, Math.min(10, dy)),
    });
  };

  const handleStageMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  const triggerBlink = () => {
    setIsBlinking(true);
    setTimeout(() => setIsBlinking(false), 160);
  };

  // Copy Code config to clipboard
  const copyConfig = () => {
    const configExport = {
      hatY: parts.hat.y,
      hatX: parts.hat.x,
      hatScale: parts.hat.scale,

      bodyY: parts.body.y,
      bodyX: parts.body.x,
      bodyScale: parts.body.scale,

      leftHandY: parts.leftHand.y,
      leftHandX: parts.leftHand.x,
      leftHandScale: parts.leftHand.scale,

      rightHandY: parts.rightHand.y,
      rightHandX: parts.rightHand.x,
      rightHandScale: parts.rightHand.scale,

      headY: parts.head.y,
      headX: parts.head.x,
      headScale: parts.head.scale,

      leftEyeY: parts.leftEye.y,
      leftEyeX: parts.leftEye.x,

      rightEyeY: parts.rightEye.y,
      rightEyeX: parts.rightEye.x,

      lipsY: parts.lips.y,
      lipsX: parts.lips.x,
    };

    const configStr = `// Sheypoor Mascot Fine-Tuned Offsets\nexport const MASCOT_OFFSETS = ${JSON.stringify(configExport, null, 2)};`;
    navigator.clipboard.writeText(configStr);
    toast.success("کد تنظیمات با موفقیت در کلیپ‌بورد کپی شد!");
  };

  // Background map
  const bgClasses = {
    dark: "bg-[#0B0F19] text-white",
    light: "bg-[#F4F4F8] text-dark-0",
    grid: "bg-[#090D16] text-white bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:16px_16px]",
    glass: "bg-gradient-to-tr from-slate-900 via-indigo-950 to-blue-950 text-white",
    checker:
      "bg-[#1E293B] text-white bg-[linear-gradient(45deg,#0F172A_25%,transparent_25%),linear-gradient(-45deg,#0F172A_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#0F172A_75%),linear-gradient(-45deg,transparent_75%,#0F172A_75%)] [background-size:20px_20px] [background-position:0_0,0_10px,10px_-10px,-10px_0px]",
  };

  const glowGradients = {
    blue: "from-main via-blue-400 to-indigo-500",
    amber: "from-amber-400 via-orange-500 to-red-500",
    purple: "from-purple-500 via-pink-500 to-indigo-500",
    emerald: "from-emerald-400 via-teal-500 to-cyan-500",
  };

  const activePart = parts[selectedPartKey] || parts.hat;

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 p-4 tablet:p-8 font-sans" dir="rtl">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex items-center justify-between pb-6 mb-6 border-b border-slate-800 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-main to-blue-400 flex items-center justify-center text-white text-2xl shadow-lg shadow-main/30">
            🎛️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">
                استودیو تنظیم دستی قطعات مسکات (Mascot Part Studio)
              </h1>
              <span className="text-xs bg-emerald-400/20 text-emerald-300 font-mono px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                Live Calibrator
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              موقعیت (X/Y) و اندازه (Scale) هر جزء را تغییر دهید و ترکیب ایده‌آل خود را بیابید.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={copyConfig}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <span>📋</span>
            <span>کپی کد تنظیمات (Copy Config)</span>
          </button>

          <button
            onClick={resetAllParts}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            <span>🔄</span>
            <span>ریست همه</span>
          </button>

          <Link
            to="/"
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs rounded-xl border border-slate-800 transition-all"
          >
            صفحه اصلی
          </Link>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Canvas Stage (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Main Stage Card */}
          <div
            className={`relative rounded-3xl p-8 border border-slate-800/80 shadow-2xl flex flex-col items-center justify-center min-h-[480px] overflow-hidden transition-all duration-300 ${bgClasses[bgStyle]}`}
            onMouseMove={handleStageMouseMove}
            onMouseLeave={handleStageMouseLeave}
          >
            {/* Background Aura Glow */}
            {visibleLayers.aura && (
              <div
                className={`absolute w-72 h-72 rounded-full blur-3xl opacity-30 bg-gradient-to-tr ${glowGradients[globalSettings.glowColor]} pointer-events-none`}
              />
            )}

            {/* Reference Overlay (full.png) */}
            {refOpacity > 0 && (
              <img
                src="/AI-MASCAT/full.png"
                alt="Reference Master"
                style={{
                  width: `${stageSize}px`,
                  height: `${stageSize}px`,
                  opacity: refOpacity,
                }}
                className="absolute object-contain pointer-events-none z-30 transition-opacity"
              />
            )}

            {/* Mascot Character Stage Container */}
            <motion.div
              style={{
                width: `${stageSize}px`,
                height: `${stageSize}px`,
              }}
              className="relative select-none z-20 overflow-visible"
            >
              {/* Thinking Radar Rings */}
              {activeVariant === "thinking" && visibleLayers.particles && (
                <>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: 1.7, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full border-2 border-amber-400 pointer-events-none"
                  />
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: 2.1, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.8, delay: 0.6, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full border border-blue-400 pointer-events-none"
                  />
                </>
              )}

              {/* 1. Body Layer */}
              {visibleLayers.body && (
                <div
                  className="absolute inset-0 w-full h-full pointer-events-none origin-[50%_65%]"
                  style={{
                    transform: `translate(${parts.body.x}%, ${parts.body.y}%) scale(${parts.body.scale})`,
                  }}
                >
                  <motion.img
                    src="/AI-MASCAT/body.png"
                    alt="Body"
                    className={`w-full h-full object-contain drop-shadow-lg ${
                      selectedPartKey === "body" && globalSettings.showBoxes
                        ? "filter drop-shadow-[0_0_16px_rgba(59,130,246,0.9)] brightness-110"
                        : ""
                    }`}
                    animate={{
                      y:
                        activeVariant === "sleeping"
                          ? [0, 3, 0]
                          : activeVariant === "excited"
                          ? [-4, 5, -4]
                          : [0, -globalSettings.floatDistance, 0],
                    }}
                    transition={{
                      duration: activeVariant === "excited" ? 0.6 : globalSettings.floatDuration,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              )}

              {/* 2. Left Hand Layer */}
              {visibleLayers.leftHand && (
                <div
                  className="absolute inset-0 w-full h-full pointer-events-none origin-[20%_60%]"
                  style={{
                    transform: `translate(${parts.leftHand.x}%, ${parts.leftHand.y}%) scale(${parts.leftHand.scale})`,
                  }}
                >
                  <motion.img
                    src="/AI-MASCAT/leftHand.png"
                    alt="Left Hand"
                    className={`w-full h-full object-contain drop-shadow-md origin-[20%_60%] ${
                      selectedPartKey === "leftHand" && globalSettings.showBoxes
                        ? "filter drop-shadow-[0_0_16px_rgba(59,130,246,0.9)] brightness-110"
                        : ""
                    }`}
                    animate={{
                      y:
                        activeVariant === "thinking"
                          ? [-2, -8, -2]
                          : activeVariant === "excited"
                          ? [-8, 4, -8]
                          : [0, -globalSettings.floatDistance * 1.1, 0],
                      rotate:
                        activeVariant === "thinking"
                          ? [0, -12, 0]
                          : activeVariant === "excited"
                          ? [-15, 10, -15]
                          : [0, 3, 0],
                    }}
                    transition={{
                      duration: activeVariant === "excited" ? 0.6 : globalSettings.floatDuration * 0.9,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              )}

              {/* 3. Right Hand Layer */}
              {visibleLayers.rightHand && (
                <div
                  className="absolute inset-0 w-full h-full pointer-events-none origin-[80%_60%]"
                  style={{
                    transform: `translate(${parts.rightHand.x}%, ${parts.rightHand.y}%) scale(${parts.rightHand.scale})`,
                  }}
                >
                  <motion.img
                    src="/AI-MASCAT/rightHand.png"
                    alt="Right Hand"
                    className={`w-full h-full object-contain drop-shadow-md origin-[80%_60%] ${
                      selectedPartKey === "rightHand" && globalSettings.showBoxes
                        ? "filter drop-shadow-[0_0_16px_rgba(59,130,246,0.9)] brightness-110"
                        : ""
                    }`}
                    animate={{
                      y:
                        activeVariant === "thinking"
                          ? [-4, -12, -4]
                          : activeVariant === "waving"
                          ? [-2, -8, -2]
                          : activeVariant === "excited"
                          ? [-12, 6, -12]
                          : [0, -globalSettings.floatDistance * 1.1, 0],
                      rotate:
                        activeVariant === "thinking"
                          ? [0, 24, 8, 24, 0]
                          : activeVariant === "waving"
                          ? [0, 26, -10, 26, 0]
                          : activeVariant === "excited"
                          ? [15, -15, 15]
                          : [0, -3, 0],
                    }}
                    transition={{
                      duration:
                        activeVariant === "waving"
                          ? globalSettings.waveSpeed
                          : activeVariant === "excited"
                          ? 0.5
                          : globalSettings.floatDuration,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              )}

              {/* 4. Left Eye */}
              {visibleLayers.leftEye && (
                <div
                  className="absolute inset-0 w-full h-full pointer-events-none origin-[39%_50%]"
                  style={{
                    transform: `translate(${parts.leftEye.x}%, ${parts.leftEye.y}%) scale(${parts.leftEye.scale})`,
                  }}
                >
                  <motion.img
                    src="/AI-MASCAT/leftEye.png"
                    alt="Left Eye"
                    className={`w-full h-full object-contain origin-[39%_50%] ${
                      selectedPartKey === "leftEye" && globalSettings.showBoxes
                        ? "filter drop-shadow-[0_0_16px_rgba(59,130,246,0.9)] brightness-125"
                        : ""
                    }`}
                    animate={{
                      scaleY: isBlinking || activeVariant === "sleeping" ? 0.08 : 1,
                      scaleX: activeVariant === "excited" ? 1.2 : 1,
                      x:
                        activeVariant === "thinking"
                          ? [-3, 3, -3]
                          : mouseOffset.x * 0.9,
                      y:
                        activeVariant === "thinking"
                          ? [-5, -7, -5]
                          : mouseOffset.y * 0.9,
                    }}
                    transition={{
                      scaleY: { duration: 0.1 },
                      x: { duration: activeVariant === "thinking" ? 2.6 : 0.2, repeat: activeVariant === "thinking" ? Infinity : 0 },
                      y: { duration: activeVariant === "thinking" ? 2.6 : 0.2, repeat: activeVariant === "thinking" ? Infinity : 0 },
                    }}
                  />
                </div>
              )}

              {/* 5. Right Eye */}
              {visibleLayers.rightEye && (
                <div
                  className="absolute inset-0 w-full h-full pointer-events-none origin-[61%_50%]"
                  style={{
                    transform: `translate(${parts.rightEye.x}%, ${parts.rightEye.y}%) scale(${parts.rightEye.scale})`,
                  }}
                >
                  <motion.img
                    src="/AI-MASCAT/rightEye.png"
                    alt="Right Eye"
                    className={`w-full h-full object-contain origin-[61%_50%] ${
                      selectedPartKey === "rightEye" && globalSettings.showBoxes
                        ? "filter drop-shadow-[0_0_16px_rgba(59,130,246,0.9)] brightness-125"
                        : ""
                    }`}
                    animate={{
                      scaleY: isBlinking || activeVariant === "sleeping" ? 0.08 : 1,
                      scaleX: activeVariant === "excited" ? 1.2 : 1,
                      x:
                        activeVariant === "thinking"
                          ? [-3, 3, -3]
                          : mouseOffset.x * 0.9,
                      y:
                        activeVariant === "thinking"
                          ? [-5, -7, -5]
                          : mouseOffset.y * 0.9,
                    }}
                    transition={{
                      scaleY: { duration: 0.1 },
                      x: { duration: activeVariant === "thinking" ? 2.6 : 0.2, repeat: activeVariant === "thinking" ? Infinity : 0 },
                      y: { duration: activeVariant === "thinking" ? 2.6 : 0.2, repeat: activeVariant === "thinking" ? Infinity : 0 },
                    }}
                  />
                </div>
              )}

              {/* 6. Lips / Mouth */}
              {visibleLayers.lips && (
                <div
                  className="absolute inset-0 w-full h-full pointer-events-none origin-[50%_60%]"
                  style={{
                    transform: `translate(${parts.lips.x}%, ${parts.lips.y}%) scale(${parts.lips.scale})`,
                  }}
                >
                  <motion.img
                    src="/AI-MASCAT/lips.png"
                    alt="Lips"
                    className={`w-full h-full object-contain origin-[50%_60%] ${
                      selectedPartKey === "lips" && globalSettings.showBoxes
                        ? "filter drop-shadow-[0_0_16px_rgba(59,130,246,0.9)] brightness-125"
                        : ""
                    }`}
                    animate={{
                      scaleY:
                        activeVariant === "talking"
                          ? [1, 1.5, 0.8, 1.4, 1]
                          : activeVariant === "excited"
                          ? 1.25
                          : 1,
                      scaleX: activeVariant === "excited" ? 1.15 : 1,
                      y: (activeVariant === "thinking" ? -3 : 0) + mouseOffset.y * 0.6,
                      x: mouseOffset.x * 0.6,
                    }}
                    transition={{
                      scaleY: { duration: activeVariant === "talking" ? 0.6 : 0.2, repeat: activeVariant === "talking" ? Infinity : 0 },
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                    }}
                  />
                </div>
              )}

              {/* 7. Head Helmet */}
              {visibleLayers.head && (
                <div
                  className="absolute inset-0 w-full h-full pointer-events-none origin-[50%_50%]"
                  style={{
                    transform: `translate(${parts.head.x}%, ${parts.head.y}%) scale(${parts.head.scale})`,
                  }}
                >
                  <motion.img
                    src="/AI-MASCAT/head.png"
                    alt="Head"
                    className={`w-full h-full object-contain drop-shadow-lg ${
                      selectedPartKey === "head" && globalSettings.showBoxes
                        ? "filter drop-shadow-[0_0_16px_rgba(59,130,246,0.9)] brightness-110"
                        : ""
                    }`}
                    animate={{
                      x: mouseOffset.x * 0.4,
                      y:
                        (activeVariant === "thinking"
                          ? -3
                          : activeVariant === "sleeping"
                          ? 3
                          : 0) +
                        mouseOffset.y * 0.4,
                      rotate: activeVariant === "thinking" ? -8 : mouseOffset.x * 0.5,
                    }}
                    transition={{ type: "spring", stiffness: 160, damping: 14 }}
                  />
                </div>
              )}

              {/* 8. Top Antenna / Hat */}
              {visibleLayers.hat && (
                <div
                  className="absolute inset-0 w-full h-full pointer-events-none origin-[50%_20%]"
                  style={{
                    transform: `translate(${parts.hat.x}%, ${parts.hat.y}%) scale(${parts.hat.scale})`,
                  }}
                >
                  <motion.img
                    src="/AI-MASCAT/hat.png"
                    alt="Hat"
                    className={`w-full h-full object-contain drop-shadow-md origin-[50%_20%] ${
                      selectedPartKey === "hat" && globalSettings.showBoxes
                        ? "filter drop-shadow-[0_0_16px_rgba(59,130,246,0.9)] brightness-110"
                        : ""
                    }`}
                    animate={{
                      rotate:
                        activeVariant === "thinking"
                          ? [-12, 12, -12]
                          : activeVariant === "waving"
                          ? [-8, 8, -8]
                          : activeVariant === "excited"
                          ? [-15, 15, -15]
                          : [0, 2.5, -2.5, 0],
                      y:
                        activeVariant === "thinking"
                          ? -4
                          : activeVariant === "excited"
                          ? [-2, 2, -2]
                          : [0, -2, 0],
                    }}
                    transition={{
                      rotate: {
                        duration:
                          activeVariant === "thinking"
                            ? 0.7
                            : activeVariant === "excited"
                            ? 0.4
                            : 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                      y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
                    }}
                  />
                </div>
              )}
            </motion.div>
          </div>

          {/* Quick Stage Settings Bar */}
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center justify-between gap-4 flex-wrap text-xs">
            {/* Background Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">پس‌زمینه:</span>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {[
                  { id: "dark", label: "Dark" },
                  { id: "light", label: "Light" },
                  { id: "grid", label: "Grid" },
                  { id: "glass", label: "Glass" },
                  { id: "checker", label: "Checker" },
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBgStyle(b.id)}
                    className={`px-2.5 py-1 rounded-lg font-mono transition-all cursor-pointer ${
                      bgStyle === b.id
                        ? "bg-main text-white font-bold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">سایز کادر:</span>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {[
                  { size: 140, label: "Small" },
                  { size: 200, label: "Medium" },
                  { size: 260, label: "Large" },
                  { size: 340, label: "XL" },
                ].map((s) => (
                  <button
                    key={s.size}
                    onClick={() => setStageSize(s.size)}
                    className={`px-2 py-1 rounded-lg font-mono transition-all cursor-pointer ${
                      stageSize === s.size
                        ? "bg-main text-white font-bold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reference Overlay Slider */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">تطابق با Reference:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={refOpacity}
                onChange={(e) => setRefOpacity(parseFloat(e.target.value))}
                className="w-20 accent-main cursor-pointer"
              />
              <span className="font-mono text-slate-400 w-8">{Math.round(refOpacity * 100)}%</span>
            </div>

            {/* Glow Outline on Selected Part */}
            <button
              onClick={() =>
                setGlobalSettings((p) => ({ ...p, showBoxes: !p.showBoxes }))
              }
              className={`px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
                globalSettings.showBoxes
                  ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                  : "bg-slate-950 text-slate-500 border-slate-800"
              }`}
            >
              هایلایت قطعه انتخاب‌شده: {globalSettings.showBoxes ? "روشن" : "خاموش"}
            </button>
          </div>
        </div>

        {/* Right Column: Part Calibrator & Controls (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* 1. Part Selector Tabs */}
          <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>🧩</span>
                <span>انتخاب قطعه برای تنظیم (Select Part)</span>
              </h3>
              <button
                onClick={() => resetSinglePart(selectedPartKey)}
                className="text-[11px] text-amber-400 hover:text-amber-300 underline cursor-pointer"
              >
                ریست این قطعه
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {Object.keys(parts).map((key) => {
                const p = parts[key];
                const isSelected = selectedPartKey === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedPartKey(key)}
                    className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      isSelected
                        ? "border-main bg-main/20 text-white font-bold ring-2 ring-main/40 shadow-lg shadow-main/20"
                        : "border-slate-800 bg-slate-950/70 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    <span className="text-xl">{p.icon}</span>
                    <span className="text-[11px] truncate w-full font-medium">{p.name.split(" ")[0]}</span>
                    <span className="text-[9px] text-slate-500 font-mono">
                      {p.y > 0 ? `+${p.y}%` : `${p.y}%`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Active Part Slider Controls */}
          <div className="p-5 bg-gradient-to-b from-slate-900/95 to-slate-900/80 border border-slate-800 rounded-3xl shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activePart.icon}</span>
                <div>
                  <h4 className="text-sm font-bold text-white">{activePart.name}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    X: {activePart.x}% | Y: {activePart.y}% | Scale: {activePart.scale}x
                  </span>
                </div>
              </div>

              {/* D-Pad Micro Nudge Buttons */}
              <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                <div />
                <button
                  onClick={() => nudgePart(selectedPartKey, 0, -2)}
                  title="بالا (Y -2%)"
                  className="w-6 h-6 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded text-[11px] text-white cursor-pointer"
                >
                  ⬆️
                </button>
                <div />
                <button
                  onClick={() => nudgePart(selectedPartKey, -2, 0)}
                  title="چپ (X -2%)"
                  className="w-6 h-6 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded text-[11px] text-white cursor-pointer"
                >
                  ⬅️
                </button>
                <button
                  onClick={() => nudgePart(selectedPartKey, 0, 0)}
                  title="مرکز"
                  className="w-6 h-6 flex items-center justify-center bg-slate-900 text-[10px] text-slate-400 cursor-default"
                >
                  🎯
                </button>
                <button
                  onClick={() => nudgePart(selectedPartKey, 2, 0)}
                  title="راست (X +2%)"
                  className="w-6 h-6 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded text-[11px] text-white cursor-pointer"
                >
                  ➡️
                </button>
                <div />
                <button
                  onClick={() => nudgePart(selectedPartKey, 0, 2)}
                  title="پایین (Y +2%)"
                  className="w-6 h-6 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded text-[11px] text-white cursor-pointer"
                >
                  ⬇️
                </button>
                <div />
              </div>
            </div>

            <div className="space-y-4 text-xs">
              {/* Y Offset Slider (بالا / پایین) */}
              <div>
                <div className="flex justify-between items-center text-slate-300 mb-1.5 font-mono">
                  <span className="font-sans font-medium flex items-center gap-1.5">
                    <span>↕️</span>
                    <span>موقعیت عمودی (Y Offset):</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={activePart.y}
                      onChange={(e) =>
                        updatePart(selectedPartKey, "y", parseFloat(e.target.value) || 0)
                      }
                      className="w-16 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-left font-mono text-main font-bold"
                    />
                    <span className="text-main font-bold">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="-80"
                  max="80"
                  step="1"
                  value={activePart.y}
                  onChange={(e) => updatePart(selectedPartKey, "y", parseFloat(e.target.value))}
                  className="w-full accent-main cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>-80% (بالاتر)</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => updatePart(selectedPartKey, "y", 0)}
                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 cursor-pointer"
                    >
                      0%
                    </button>
                    <button
                      onClick={() => nudgePart(selectedPartKey, 0, -10)}
                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 cursor-pointer"
                    >
                      -10%
                    </button>
                    <button
                      onClick={() => nudgePart(selectedPartKey, 0, 10)}
                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 cursor-pointer"
                    >
                      +10%
                    </button>
                  </div>
                  <span>+80% (پایین‌تر)</span>
                </div>
              </div>

              {/* X Offset Slider (چپ / راست) */}
              <div>
                <div className="flex justify-between items-center text-slate-300 mb-1.5 font-mono">
                  <span className="font-sans font-medium flex items-center gap-1.5">
                    <span>↔️</span>
                    <span>موقعیت افقی (X Offset):</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={activePart.x}
                      onChange={(e) =>
                        updatePart(selectedPartKey, "x", parseFloat(e.target.value) || 0)
                      }
                      className="w-16 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-left font-mono text-main font-bold"
                    />
                    <span className="text-main font-bold">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="-80"
                  max="80"
                  step="1"
                  value={activePart.x}
                  onChange={(e) => updatePart(selectedPartKey, "x", parseFloat(e.target.value))}
                  className="w-full accent-main cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>-80% (چپ‌تر)</span>
                  <button
                    onClick={() => updatePart(selectedPartKey, "x", 0)}
                    className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 cursor-pointer"
                  >
                    0% (مرکز)
                  </button>
                  <span>+80% (راست‌تر)</span>
                </div>
              </div>

              {/* Scale Slider (اندازه) */}
              <div>
                <div className="flex justify-between items-center text-slate-300 mb-1.5 font-mono">
                  <span className="font-sans font-medium flex items-center gap-1.5">
                    <span>🔍</span>
                    <span>اندازه و مقیاس (Scale):</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.05"
                      value={activePart.scale}
                      onChange={(e) =>
                        updatePart(selectedPartKey, "scale", parseFloat(e.target.value) || 1)
                      }
                      className="w-16 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-left font-mono text-main font-bold"
                    />
                    <span className="text-main font-bold">x</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="2.5"
                  step="0.05"
                  value={activePart.scale}
                  onChange={(e) => updatePart(selectedPartKey, "scale", parseFloat(e.target.value))}
                  className="w-full accent-main cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>0.3x (کوچک)</span>
                  <button
                    onClick={() => updatePart(selectedPartKey, "scale", 1)}
                    className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 cursor-pointer"
                  >
                    1.0x (پیش‌فرض)
                  </button>
                  <span>2.5x (بزرگ)</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Quick Preset Spacings */}
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-bold">پریست‌های آماده:</span>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => applyPreset("clustered")}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
              >
                چسبیده (0%)
              </button>
              <button
                onClick={() => applyPreset("spaced")}
                className="px-2.5 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs rounded-xl border border-blue-500/40 transition-all cursor-pointer font-bold"
              >
                فاصله‌دار (25%)
              </button>
              <button
                onClick={() => applyPreset("extraSpaced")}
                className="px-2.5 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs rounded-xl border border-purple-500/40 transition-all cursor-pointer font-bold"
              >
                فاصله زیاد (45%)
              </button>
            </div>
          </div>

          {/* 4. Animation Variants Switcher */}
          <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>🎭</span>
                <span>تست انیمیشن‌ها (Animation Preview)</span>
              </h3>
              <button
                onClick={triggerBlink}
                className="text-[11px] text-blue-400 hover:text-blue-300 underline cursor-pointer"
              >
                پلک زدن دستی 👁️
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "idle", label: "معلق (Idle)", icon: "🌿" },
                { id: "thinking", label: "فکر (Thinking)", icon: "🧠" },
                { id: "waving", label: "دست تکان (Waving)", icon: "👋" },
                { id: "excited", label: "هیجان (Excited)", icon: "🎉" },
                { id: "talking", label: "صحبت (Talking)", icon: "💬" },
                { id: "sleeping", label: "خواب (Sleep)", icon: "💤" },
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => setActiveVariant(v.id)}
                  className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    activeVariant === v.id
                      ? "border-main bg-main/20 text-white font-bold ring-2 ring-main/40 shadow-lg shadow-main/20"
                      : "border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <span className="text-lg">{v.icon}</span>
                  <span className="text-xs">{v.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 5. Layer Visibility Switches */}
          <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <span>🥞</span>
              <span>روشن/خاموش کردن لایه‌ها (Layer Toggles)</span>
            </h3>

            <div className="grid grid-cols-4 gap-2">
              {Object.keys(visibleLayers).map((k) => (
                <button
                  key={k}
                  onClick={() => toggleLayer(k)}
                  className={`p-2 rounded-xl text-xs font-mono border transition-all flex items-center justify-between cursor-pointer ${
                    visibleLayers[k]
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-semibold"
                      : "border-slate-800 bg-slate-950 text-slate-500 opacity-60"
                  }`}
                >
                  <span className="truncate">{k}</span>
                  <span>{visibleLayers[k] ? "✓" : "✕"}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Toaster position="bottom-center" />
    </div>
  );
}
