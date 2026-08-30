/**
 * Sheypoor AI Notification Service
 * Handles Web Notifications API & Service Worker Push for SPA/PWA on Mobile and Desktop,
 * with graceful in-app toast fallback for browsers with notifications blocked.
 */

import toast from "react-hot-toast";

/**
 * Check if the browser / platform supports Notification API
 */
export function isNotificationSupported() {
  return typeof window !== "undefined" && ("Notification" in window || "serviceWorker" in navigator);
}

/**
 * Get current permission state: 'default' | 'granted' | 'denied' | 'unsupported'
 */
export function getNotificationPermission() {
  if (!isNotificationSupported()) return "unsupported";
  return Notification.permission;
}

/**
 * Request notification permission from the user
 * @returns {Promise<string>} 'granted' | 'denied' | 'default'
 */
export async function requestNotificationPermission() {
  if (!isNotificationSupported()) {
    console.warn("Notifications not supported on this platform.");
    return "unsupported";
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      sendAiNotification({
        title: "✨ دستیار هوشمند شیپور فعال شد",
        body: "از این پس پیشنهادات ویژه و تخفیف‌های آگهی‌ها به شما اطلاع داده می‌شود.",
        icon: "/sheypoor-Logo.png",
      });
    }
    return permission;
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return "denied";
  }
}

/**
 * Send an AI notification (Native System Notification or In-App Toast)
 * @param {Object} options
 * @param {string} options.title - Notification title
 * @param {string} options.body - Notification text body
 * @param {string} [options.icon] - Icon URL
 * @param {string} [options.url] - URL to open when clicked
 * @param {Object} [options.data] - Additional data
 */
export async function sendAiNotification({
  title = "دستیار هوشمند شیپور",
  body = "",
  icon = "/sheypoor-Logo.png",
  url = "/",
  data = {},
}) {
  // If native notifications are supported and granted
  if (isNotificationSupported() && typeof Notification !== "undefined" && Notification.permission === "granted") {
    try {
      // 1. Try Service Worker showNotification if active (works on Android PWA & iOS 16.4+ standalone)
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration && registration.showNotification) {
          await registration.showNotification(title, {
            body,
            icon,
            badge: "/sheypoor-Logo.png",
            vibrate: [100, 50, 100],
            data: { url, ...data },
          });
          return true;
        }
      }

      // 2. Fallback to Window Notification API
      const notif = new Notification(title, {
        body,
        icon,
        data: { url, ...data },
      });

      notif.onclick = () => {
        window.focus();
        if (url && url !== window.location.pathname) {
          window.location.href = url;
        }
        notif.close();
      };
      return true;
    } catch (e) {
      console.warn("Native notification dispatch failed, falling back to toast:", e);
    }
  }

  // 3. Graceful in-app custom toast fallback (Always works 100% on any mobile/desktop browser)
  toast.custom(
    (t) => (
      <div
        onClick={() => {
          toast.dismiss(t.id);
          if (url && url !== "/") window.location.href = url;
        }}
        className={`max-w-md w-full bg-white dark:bg-night-card border border-main/30 shadow-2xl rounded-2xl p-4 flex items-start gap-3 cursor-pointer pointer-events-auto transition-all ${
          t.visible ? "animate-enter" : "animate-leave"
        }`}
        dir="rtl"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-main to-blue-500 flex items-center justify-center text-white text-lg flex-shrink-0 shadow-md">
          🤖
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-main dark:text-main-lighter mb-0.5">
            {title}
          </p>
          <p className="text-xs text-dark-1 dark:text-gray-200 leading-relaxed">
            {body}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toast.dismiss(t.id);
          }}
          className="text-dark-3 hover:text-dark-1 dark:hover:text-white text-xs p-1"
        >
          ✕
        </button>
      </div>
    ),
    { duration: 6000 }
  );

  return true;
}
