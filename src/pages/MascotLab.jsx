import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

/**
 * MascotLab — Hidden Interactive Playground & Test Suite for Sheypoor AI Mascot
 * URL: /mascot-lab
 */
export default function MascotLab() {
  // Preset animation variant
  const [activeVariant, setActiveVariant] = useState("idle"); // idle | thinking | waving | excited | talking | sleeping

  // Visual size
  const [stageSize, setStageSize] = useState(240); // px

  // Background style
  const [bgStyle, setBgStyle] = useState("dark"); // light | dark | grid | glass | checker

  // Reference overlay opacity (0 to 1)
  const [refOpacity, setRefOpacity] = useState(0);

  // Manual blink trigger
  const [isBlinking, setIsBlinking] = useState(false);

  // Re-trigger entrance
  const [entranceKey, setEntranceKey] = useState(0);

  // Layer Visibility
  const [visibleLayers, setVisibleLayers] = useState({
    body: true,
    leftHand: true,
    rightHand: true,
    face: true,
    head: true,
    hat: true,
    leftEye: true,
    rightEye: true,
    lips: true,
    aura: true,
    particles: true,
  });

  // Layer Tweaks (Dimensions & Positioning)
  const [tweaks, setTweaks] = useState({
    hatWidth: 28,
    hatHeight: 22,
    hatTop: 1.5,
    hatLeft: 36,
    hatScale: 1,
    floatDuration: 2.6,
    floatDistance: 8,
    waveSpeed: 0.9,
    glowColor: "blue", // blue | amber | purple | emerald
    glowIntensity: 0.6,
    eyeFollowMouse: true,
  });

  // Mouse Tracking for interactive canvas
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const toggleLayer = (layerName) => {
    setVisibleLayers((prev) => ({ ...prev, [layerName]: !prev[layerName] }));
  };

  const handleStageMouseMove = (e) => {
    if (!tweaks.eyeFollowMouse) return;
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

  // Trigger manual blink
  const triggerBlink = () => {
    setIsBlinking(true);
    setTimeout(() => setIsBlinking(false), 160);
  };

  // Copy Code config
  const copyConfig = () => {
    const configStr = `// Sheypoor Mascot Config
const mascotConfig = ${JSON.stringify(tweaks, null, 2)};`;
    navigator.clipboard.writeText(configStr);
    toast.success("تنظیمات با موفقیت در کلیپ‌بورد کپی شد!");
  };

  // Reset tweaks to default
  const resetTweaks = () => {
    setTweaks({
      hatWidth: 28,
      hatHeight: 22,
      hatTop: 1.5,
      hatLeft: 36,
      hatScale: 1,
      floatDuration: 2.6,
      floatDistance: 8,
      waveSpeed: 0.9,
      glowColor: "blue",
      glowIntensity: 0.6,
      eyeFollowMouse: true,
    });
    toast("تنظیمات به حالت پیش‌فرض برگشت.");
  };

  // Background map
  const bgClasses = {
    dark: "bg-[#0B0F19] text-white",
    light: "bg-[#F4F4F8] text-dark-0",
    grid: "bg-[#090D16] text-white bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:16px_16px]",
    glass: "bg-gradient-to-tr from-slate-900 via-indigo-950 to-blue-950 text-white",
    checker: "bg-[#1E293B] text-white bg-[linear-gradient(45deg,#0F172A_25%,transparent_25%),linear-gradient(-45deg,#0F172A_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#0F172A_75%),linear-gradient(-45deg,transparent_75%,#0F172A_75%)] [background-size:20px_20px] [background-position:0_0,0_10px,10px_-10px,-10px_0px]",
  };

  const glowGradients = {
    blue: "from-main via-blue-400 to-indigo-500",
    amber: "from-amber-400 via-orange-500 to-red-500",
    purple: "from-purple-500 via-pink-500 to-indigo-500",
    emerald: "from-emerald-400 via-teal-500 to-cyan-500",
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 p-4 tablet:p-8 font-sans" dir="rtl">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-main to-blue-400 flex items-center justify-center text-white text-xl shadow-lg shadow-main/30">
            🧪
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">
                آزمایشگاه و استودیو مسکات هوش مصنوعی (Mascot Test Lab)
              </h1>
              <span className="text-xs bg-amber-400/20 text-amber-300 font-mono px-2 py-0.5 rounded-full border border-amber-400/30">
                Hidden Route
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              محیط اختصاصی تست، کنترل پویای لایه‌ها، ترکینگ چشم و تغییر انیمیشن‌های کاراکتر AI
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={copyConfig}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <span>📋</span>
            <span>کپی Config</span>
          </button>
          <Link
            to="/"
            className="px-3.5 py-1.5 rounded-xl bg-main hover:bg-main-lighter text-xs font-semibold text-white shadow-md transition-colors"
          >
            ← بازگشت به سایت
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left/Top Canvas Viewport (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Main Stage */}
          <div
            onMouseMove={handleStageMouseMove}
            onMouseLeave={handleStageMouseLeave}
            className={`relative w-full h-[460px] rounded-3xl border border-slate-800 shadow-2xl flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${bgClasses[bgStyle]}`}
          >
            {/* Stage Info Badge */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <span className="text-[11px] font-mono bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                Variant: <strong className="text-main">{activeVariant}</strong>
              </span>
              <span className="text-[11px] font-mono bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                Size: {stageSize}px
              </span>
            </div>

            {/* Stage Controls Overlay */}
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
              <button
                onClick={() => setEntranceKey((prev) => prev + 1)}
                className="text-xs px-3 py-1.5 rounded-xl bg-black/70 hover:bg-black text-white border border-white/15 backdrop-blur-md transition-all active:scale-95 flex items-center gap-1"
                title="تست مجدد انیمیشن ورود"
              >
                <span>🔄</span>
                <span>اجرای ورود</span>
              </button>
              <button
                onClick={triggerBlink}
                className="text-xs px-3 py-1.5 rounded-xl bg-black/70 hover:bg-black text-white border border-white/15 backdrop-blur-md transition-all active:scale-95 flex items-center gap-1"
              >
                <span>👁️</span>
                <span>پلک زدن</span>
              </button>
            </div>

            {/* Reference Overlay (full.png) */}
            {refOpacity > 0 && (
              <div
                className="absolute pointer-events-none z-30 transition-opacity"
                style={{
                  width: stageSize,
                  height: stageSize,
                  opacity: refOpacity,
                }}
              >
                <img
                  src="/AI-MASCAT/full.png"
                  alt="Reference Full"
                  className="w-full h-full object-contain filter hue-rotate-90"
                />
                <span className="absolute top-2 left-2 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-mono">
                  REF (Green overlay)
                </span>
              </div>
            )}

            {/* ================= MASCOT RENDER STAGE ================= */}
            <motion.div
              key={entranceKey}
              initial={{ opacity: 0, scale: 0, y: 70, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
              transition={{ type: "spring", stiffness: 240, damping: 16 }}
              style={{ width: stageSize, height: stageSize }}
              className="relative select-none"
            >
              {/* Glow Aura */}
              {visibleLayers.aura && (
                <motion.div
                  animate={{
                    scale: activeVariant === "thinking" ? [1, 1.3, 1] : [1, 1.12, 1],
                    opacity: activeVariant === "thinking" ? [0.7, 1, 0.7] : tweaks.glowIntensity,
                  }}
                  transition={{
                    duration: activeVariant === "thinking" ? 1.2 : 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={`absolute -inset-4 rounded-full blur-2xl pointer-events-none bg-gradient-to-tr ${glowGradients[tweaks.glowColor]}`}
                />
              )}

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

              {/* 1. Body Base Layer */}
              {visibleLayers.body && (
                <motion.img
                  src="/AI-MASCAT/bodyNohand.png"
                  alt="Body"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-lg"
                  animate={{
                    y:
                      activeVariant === "sleeping"
                        ? [0, 4, 0]
                        : activeVariant === "excited"
                        ? [-4, 6, -4]
                        : [0, -tweaks.floatDistance, 0],
                  }}
                  transition={{
                    duration: activeVariant === "excited" ? 0.6 : tweaks.floatDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}

              {/* 2. Left Hand Layer */}
              {visibleLayers.leftHand && (
                <motion.img
                  src="/AI-MASCAT/leftHand.png"
                  alt="Left Hand"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md origin-[25%_60%]"
                  animate={{
                    y:
                      activeVariant === "thinking"
                        ? [-2, -8, -2]
                        : activeVariant === "excited"
                        ? [-8, 4, -8]
                        : [0, -tweaks.floatDistance * 1.1, 0],
                    rotate:
                      activeVariant === "thinking"
                        ? [0, -12, 0]
                        : activeVariant === "excited"
                        ? [-15, 10, -15]
                        : [0, 3, 0],
                  }}
                  transition={{
                    duration: activeVariant === "excited" ? 0.6 : tweaks.floatDuration * 0.9,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}

              {/* 3. Right Hand Layer */}
              {visibleLayers.rightHand && (
                <motion.img
                  src="/AI-MASCAT/rightHand.png"
                  alt="Right Hand"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md origin-[75%_65%]"
                  animate={{
                    y:
                      activeVariant === "thinking"
                        ? [-4, -12, -4] // Hand goes to chin!
                        : activeVariant === "waving"
                        ? [-2, -8, -2]
                        : activeVariant === "excited"
                        ? [-12, 6, -12]
                        : [0, -tweaks.floatDistance * 1.1, 0],
                    rotate:
                      activeVariant === "thinking"
                        ? [0, 24, 8, 24, 0]
                        : activeVariant === "waving"
                        ? [0, 26, -10, 26, 0] // Happy waving 👋
                        : activeVariant === "excited"
                        ? [15, -15, 15]
                        : [0, -3, 0],
                  }}
                  transition={{
                    duration:
                      activeVariant === "waving"
                        ? tweaks.waveSpeed
                        : activeVariant === "excited"
                        ? 0.5
                        : tweaks.floatDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}

              {/* 4. Face Plate */}
              {visibleLayers.face && (
                <motion.img
                  src="/AI-MASCAT/face.png"
                  alt="Face"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                  animate={{
                    x: mouseOffset.x * 0.5,
                    y:
                      (activeVariant === "thinking"
                        ? -4
                        : activeVariant === "sleeping"
                        ? 3
                        : 0) +
                      mouseOffset.y * 0.5,
                    rotate: activeVariant === "thinking" ? -8 : mouseOffset.x * 0.6,
                  }}
                  transition={{ type: "spring", stiffness: 180, damping: 14 }}
                />
              )}

              {/* 5. Left Eye */}
              {visibleLayers.leftEye && (
                <motion.img
                  src="/AI-MASCAT/leftEye.png"
                  alt="Left Eye"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none origin-[39%_50%]"
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
              )}

              {/* 6. Right Eye */}
              {visibleLayers.rightEye && (
                <motion.img
                  src="/AI-MASCAT/rightEye.png"
                  alt="Right Eye"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none origin-[61%_50%]"
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
              )}

              {/* 7. Lips */}
              {visibleLayers.lips && (
                <motion.img
                  src="/AI-MASCAT/lips.png"
                  alt="Lips"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none origin-[50%_60%]"
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
              )}

              {/* 8. Head Outer Frame */}
              {visibleLayers.head && (
                <motion.img
                  src="/AI-MASCAT/head.png"
                  alt="Head"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-lg"
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
              )}

              {/* 9. Top Antenna / Hat */}
              {visibleLayers.hat && (
                <motion.img
                  src="/AI-MASCAT/hat.png"
                  alt="Hat"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md origin-[50%_20%]"
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
                    scale: activeVariant === "thinking" ? [1, 1.12, 1] : tweaks.hatScale,
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
                    scale: { duration: 0.7, repeat: activeVariant === "thinking" ? Infinity : 0 },
                  }}
                />
              )}
            </motion.div>
          </div>

          {/* Quick Stage Settings Bar */}
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center justify-between gap-4 flex-wrap">
            {/* Background Style Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">پس‌زمینه:</span>
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
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
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
              <span className="text-xs text-slate-400 font-medium">سایز کادر:</span>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {[
                  { size: 120, label: "120px" },
                  { size: 180, label: "180px" },
                  { size: 240, label: "240px" },
                  { size: 320, label: "320px" },
                ].map((s) => (
                  <button
                    key={s.size}
                    onClick={() => setStageSize(s.size)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
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

            {/* Full.png Comparison Slider */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">تطابق با Reference:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={refOpacity}
                onChange={(e) => setRefOpacity(parseFloat(e.target.value))}
                className="w-24 accent-main cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-400 w-8">
                {Math.round(refOpacity * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Right Controls Panel (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* 1. Animation Variants Switcher */}
          <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <span>🎭</span>
              <span>حالت‌ها و وریانت‌های انیمیشن (Animation Variants)</span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "idle", label: "معلق و آرام (Idle)", icon: "🌿", desc: "شناوری نرم و تنفس" },
                { id: "thinking", label: "در حال فکر (Thinking)", icon: "🧠", desc: "خم شدن سر و رادار" },
                { id: "waving", label: "دست تکان دادن (Waving)", icon: "👋", desc: "واکنش هاور" },
                { id: "excited", label: "هیجان‌زده (Excited)", icon: "🎉", desc: "پیدا شدن نتیجه" },
                { id: "talking", label: "در حال صحبت (Talking)", icon: "💬", desc: "حرکت دهان" },
                { id: "sleeping", label: "حالت استندبای (Sleep)", icon: "💤", desc: "چشمان بسته" },
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => setActiveVariant(v.id)}
                  className={`p-3 rounded-2xl border text-right transition-all flex flex-col gap-1 ${
                    activeVariant === v.id
                      ? "border-main bg-main/15 text-white font-bold ring-2 ring-main/30"
                      : "border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{v.icon}</span>
                    <span className="text-xs">{v.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal">{v.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Hat Fine-tuning Controls */}
          <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>🎩</span>
                <span>تنظیمات کلاه / آنتن (Hat Calibration)</span>
              </h3>
              <button
                onClick={resetTweaks}
                className="text-[11px] text-slate-400 hover:text-white underline"
              >
                ریست
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Hat Width */}
              <div>
                <div className="flex justify-between text-slate-400 mb-1 font-mono">
                  <span>Width (%):</span>
                  <span className="text-main font-bold">{tweaks.hatWidth}%</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="60"
                  value={tweaks.hatWidth}
                  onChange={(e) =>
                    setTweaks((p) => ({ ...p, hatWidth: Number(e.target.value) }))
                  }
                  className="w-full accent-main cursor-pointer"
                />
              </div>

              {/* Hat Height */}
              <div>
                <div className="flex justify-between text-slate-400 mb-1 font-mono">
                  <span>Height (%):</span>
                  <span className="text-main font-bold">{tweaks.hatHeight}%</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="50"
                  value={tweaks.hatHeight}
                  onChange={(e) =>
                    setTweaks((p) => ({ ...p, hatHeight: Number(e.target.value) }))
                  }
                  className="w-full accent-main cursor-pointer"
                />
              </div>

              {/* Hat Top Offset */}
              <div>
                <div className="flex justify-between text-slate-400 mb-1 font-mono">
                  <span>Top Offset (%):</span>
                  <span className="text-main font-bold">{tweaks.hatTop}%</span>
                </div>
                <input
                  type="range"
                  min="-10"
                  max="20"
                  step="0.5"
                  value={tweaks.hatTop}
                  onChange={(e) =>
                    setTweaks((p) => ({ ...p, hatTop: Number(e.target.value) }))
                  }
                  className="w-full accent-main cursor-pointer"
                />
              </div>

              {/* Hat Left Offset */}
              <div>
                <div className="flex justify-between text-slate-400 mb-1 font-mono">
                  <span>Left Offset (%):</span>
                  <span className="text-main font-bold">{tweaks.hatLeft}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="50"
                  step="0.5"
                  value={tweaks.hatLeft}
                  onChange={(e) =>
                    setTweaks((p) => ({ ...p, hatLeft: Number(e.target.value) }))
                  }
                  className="w-full accent-main cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* 3. Layer Visibility Switches */}
          <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <span>🥞</span>
              <span>لایه‌های کاراکتر (Layer Toggles)</span>
            </h3>

            <div className="grid grid-cols-3 gap-2">
              {Object.keys(visibleLayers).map((k) => (
                <button
                  key={k}
                  onClick={() => toggleLayer(k)}
                  className={`p-2 rounded-xl text-xs font-mono border transition-all flex items-center justify-between ${
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
