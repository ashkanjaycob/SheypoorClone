import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * AddToHomeScreenPrompt Component
 * 
 * Intelligent PWA installation prompt tailored for:
 * 1. iOS (iPhone / iPad) - Step-by-step Safari Share & Add to Home Screen visual guide
 * 2. Android (Chrome, Samsung Internet, Edge, etc.) - Native 1-click install via beforeinstallprompt + manual fallback
 * 
 * Features:
 * - Standalone PWA detection (hidden if already installed)
 * - Remembers dismissal in localStorage (3 days snoozing)
 * - Dark mode & Light mode full support
 * - Persian RTL layout with crisp native SVG icons
 * - Developer test mode (?preview_a2hs=ios / ?preview_a2hs=android or test floating badge)
 */
export default function AddToHomeScreenPrompt() {
  const [platform, setPlatform] = useState(null); // 'ios' | 'android' | 'other' | null
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [previewMode, setPreviewMode] = useState(null); // 'ios' | 'android' | null (for dev testing)
  const [isInstalling, setIsInstalling] = useState(false);
  const [showAndroidManualSteps, setShowAndroidManualSteps] = useState(false);

  useEffect(() => {
    // 1. Check if running in Standalone (already installed PWA)
    const checkStandalone = () => {
      const isWindowStandalone = window.matchMedia("(display-mode: standalone)").matches;
      const isNavigatorStandalone = window.navigator.standalone === true;
      const isAndroidApp = document.referrer && document.referrer.includes("android-app://");
      return isWindowStandalone || isNavigatorStandalone || isAndroidApp;
    };

    const standaloneActive = checkStandalone();
    setIsStandalone(standaloneActive);

    // 2. Check URL search params for developer preview testing (e.g. ?a2hs=ios or ?a2hs=android)
    const urlParams = new URLSearchParams(window.location.search);
    const forcedPreview = urlParams.get("preview_a2hs") || urlParams.get("a2hs");

    if (forcedPreview === "ios" || forcedPreview === "android") {
      setPreviewMode(forcedPreview);
      setPlatform(forcedPreview);
      setIsOpen(true);
      return;
    }

    if (standaloneActive) {
      // Don't show if already installed
      return;
    }

    // 3. Check dismissal timestamp in localStorage
    const dismissedUntil = localStorage.getItem("sheypoor_a2hs_dismissed_until");
    if (dismissedUntil && Date.now() < parseInt(dismissedUntil, 10)) {
      return;
    }

    // 4. Detect Platform (iOS vs Android)
    const userAgent = window.navigator.userAgent || window.navigator.vendor || window.opera || "";
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    const isAndroidDevice = /Android/i.test(userAgent);

    // 5. Listen for Android beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setPlatform("android");
      // Open prompt after 1.5 seconds delay for natural user entry
      setTimeout(() => {
        setIsOpen(true);
      }, 1500);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 6. If iOS, show after a short pleasant delay
    if (isIOSDevice) {
      setPlatform("ios");
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1800);
      return () => clearTimeout(timer);
    } else if (isAndroidDevice) {
      setPlatform("android");
      // In case beforeinstallprompt already fired or is delayed
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1800);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  // Handle Close / Dismiss
  const handleDismiss = (days = 3) => {
    setIsOpen(false);
    const expireTime = Date.now() + days * 24 * 60 * 60 * 1000;
    localStorage.setItem("sheypoor_a2hs_dismissed_until", expireTime.toString());
  };

  // Handle Android Native Install Trigger
  const handleAndroidInstall = async () => {
    if (!deferredPrompt) {
      // If browser doesn't support direct prompt, show manual steps
      setShowAndroidManualSteps(true);
      return;
    }

    try {
      setIsInstalling(true);
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsOpen(false);
        setDeferredPrompt(null);
      }
    } catch (err) {
      console.error("Install prompt error:", err);
      setShowAndroidManualSteps(true);
    } finally {
      setIsInstalling(false);
    }
  };

  // If already standalone (and not previewing), do not render
  if (isStandalone && !previewMode) {
    return null;
  }

  const activePlatform = previewMode || platform;

  return (
    <AnimatePresence>
        {isOpen && activePlatform && (
          <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none p-0 sm:p-4">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => handleDismiss(1)}
              className="absolute inset-0 bg-dark-0/60 dark:bg-black/75 backdrop-blur-[2px] pointer-events-auto"
            />

            {/* Bottom Sheet Modal */}
            <motion.div
              initial={{ y: "100%", opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              className="relative w-full max-w-md bg-white dark:bg-night-surface border-t sm:border border-light-0 dark:border-night-border rounded-t-sheypoor-xl sm:rounded-sheypoor-xl shadow-modal dark:shadow-modal-dark p-5 sm:p-6 pointer-events-auto pb-8 sm:pb-6 overflow-hidden"
              dir="rtl"
            >
              {/* Drag handle pill */}
              <div className="w-12 h-1.5 bg-light-0 dark:bg-night-border rounded-full mx-auto mb-4" />

              {/* Close Button */}
              <button
                onClick={() => handleDismiss(3)}
                className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-light-2 dark:bg-night-card text-dark-2 dark:text-night-muted hover:text-dark-0 dark:hover:text-white transition-colors"
                aria-label="بستن"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* App Header Banner */}
              <div className="flex items-center gap-3.5 mb-4">
                <div className="relative flex-shrink-0">
                  <img
                    src="/Sheypoor-192.png"
                    alt="شیپور"
                    className="w-14 h-14 rounded-sheypoor shadow-card object-cover border border-light-0 dark:border-night-border"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-main text-white p-0.5 rounded-full shadow-sm">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-heading-4 font-bold text-dark-0 dark:text-night-text">
                      نصب وب‌اپلیکیشن شیپور
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-main/10 text-main dark:bg-main/20">
                      PWA
                    </span>
                  </div>
                  <p className="text-body-3 text-dark-2 dark:text-night-muted mt-0.5">
                    {activePlatform === "ios"
                      ? "دسترسی سریع، بدون نیاز به اپ‌استور و بدون قطعی"
                      : "نصب مستقیم، سبک و دسترسی همیشگی با یک کلیک"}
                  </p>
                </div>
              </div>

              {/* ----------------- iOS Specific View ----------------- */}
              {activePlatform === "ios" && (
                <div className="space-y-3.5 my-4 bg-light-3 dark:bg-night-card/70 border border-light-1 dark:border-night-border rounded-sheypoor p-4">
                  <div className="text-body-3 font-semibold text-dark-1 dark:text-night-text flex items-center gap-1.5">
                    <span>📱</span>
                    <span>راهنمای افزودن به صفحه اصلی (iOS Safari):</span>
                  </div>

                  {/* Step 1 */}
                  <div className="flex items-start gap-3 text-body-3 text-dark-1 dark:text-night-text">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-main text-white text-body-4 font-bold flex-shrink-0 mt-0.5">
                      ۱
                    </div>
                    <div className="flex-1">
                      در نوار پایین مرورگر سافاری روی دکمه{" "}
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 mx-0.5 rounded bg-light-1 dark:bg-night-surface border border-light-0 dark:border-night-border font-medium text-main">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                          <polyline points="16 6 12 2 8 6" />
                          <line x1="12" y1="2" x2="12" y2="15" />
                        </svg>
                        Share (اشتراک‌گذاری)
                      </span>{" "}
                      بزنید.
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start gap-3 text-body-3 text-dark-1 dark:text-night-text">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-main text-white text-body-4 font-bold flex-shrink-0 mt-0.5">
                      ۲
                    </div>
                    <div className="flex-1">
                      در منوی باز شده به پایین اسکرول کرده و گزینه{" "}
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 mx-0.5 rounded bg-light-1 dark:bg-night-surface border border-light-0 dark:border-night-border font-medium text-dark-0 dark:text-white">
                        <svg className="w-3.5 h-3.5 text-main" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <line x1="12" y1="8" x2="12" y2="16" />
                          <line x1="8" y1="12" x2="16" y2="12" />
                        </svg>
                        «Add to Home Screen»
                      </span>{" "}
                      را لمس کنید.
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start gap-3 text-body-3 text-dark-1 dark:text-night-text">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-main text-white text-body-4 font-bold flex-shrink-0 mt-0.5">
                      ۳
                    </div>
                    <div className="flex-1">
                      در گوشه بالا سمت راست، روی گزینه{" "}
                      <span className="font-bold text-main px-1">«Add» (افزودن)</span> بزنید.
                    </div>
                  </div>

                  {/* Bottom Indicator for Safari Share button */}
                  <div className="pt-2 flex flex-col items-center justify-center text-center">
                    <div className="animate-bounce flex flex-col items-center text-main font-medium text-body-4">
                      <span>دکمه Share در پایین صفحه 👇</span>
                      <svg className="w-5 h-5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------- Android Specific View ----------------- */}
              {activePlatform === "android" && (
                <div className="space-y-3.5 my-4">
                  {/* Direct 1-Click Install Button */}
                  <button
                    onClick={handleAndroidInstall}
                    disabled={isInstalling}
                    className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-sheypoor bg-main hover:bg-main-darker text-white font-bold text-body-2 shadow-card hover:shadow-card-hover transition-all active:scale-[0.99]"
                  >
                    {isInstalling ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>نصب مستقیم وب‌اپلیکیشن</span>
                      </>
                    )}
                  </button>

                  {/* Manual Steps accordion / fallback */}
                  {(!deferredPrompt || showAndroidManualSteps) && (
                    <div className="bg-light-3 dark:bg-night-card/70 border border-light-1 dark:border-night-border rounded-sheypoor p-3.5 space-y-2.5 text-body-3 text-dark-1 dark:text-night-text">
                      <div className="font-semibold text-dark-0 dark:text-white flex items-center gap-1.5">
                        <span>💡</span>
                        <span>یا از طریق منوی مرورگر:</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-main/20 text-main text-body-4 font-bold">۱</span>
                        <span>روی منوی سه نقطه <strong className="font-mono text-main">⋮</strong> در بالای مرورگر بزنید.</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-main/20 text-main text-body-4 font-bold">۲</span>
                        <span>گزینه <strong>«نصب برنامه» (Install app)</strong> یا <strong>«افزودن به صفحه اصلی»</strong> را انتخاب کنید.</span>
                      </div>
                    </div>
                  )}

                  {!showAndroidManualSteps && deferredPrompt && (
                    <button
                      onClick={() => setShowAndroidManualSteps(true)}
                      className="w-full text-center text-body-4 text-dark-3 dark:text-night-muted hover:underline"
                    >
                      راهنمای نصب دستی از منوی مرورگر
                    </button>
                  )}
                </div>
              )}

              {/* Action Buttons Footer */}
              <div className="flex items-center gap-3 pt-2">
                {activePlatform === "ios" ? (
                  <button
                    onClick={() => handleDismiss(7)}
                    className="flex-1 py-2.5 px-4 rounded-sheypoor bg-main hover:bg-main-darker text-white font-bold text-body-2 shadow-card transition-colors text-center"
                  >
                    متوجه شدم
                  </button>
                ) : null}

                <button
                  onClick={() => handleDismiss(3)}
                  className="flex-1 py-2.5 px-4 rounded-sheypoor bg-light-2 dark:bg-night-card text-dark-2 dark:text-night-muted hover:text-dark-0 dark:hover:text-white hover:bg-light-1 dark:hover:bg-night-hover font-semibold text-body-2 transition-colors text-center"
                >
                  شاید بعداً
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
  );
}
