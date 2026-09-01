/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/index.css";
import "./styles/fonts.css";

// لودینگ صفحه
function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-light-3 dark:bg-night-bg p-8 transition-colors duration-200">
      <img
        src="/Sheypoor-192.png"
        alt="شیپور"
        className="w-20 h-20 rounded-sheypoor shadow-card mb-4 animate-pulse-soft object-cover"
      />
      <h1 className="text-heading-4 font-bold text-dark-0 dark:text-night-text">شیپور</h1>
      <p className="text-body-3 text-dark-3 dark:text-night-muted mt-2">در حال بارگذاری...</p>
    </div>
  );
}

function MainApp() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // بررسی موبایل بودن دستگاه
    const checkIsMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileDevice =
        /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent
        );
      setIsMobile(isMobileDevice);
    };

    checkIsMobile();

    if (isMobile) {
      // نمایش لودینگ کوتاه و روان فقط برای موبایل
      const timer = setTimeout(() => setIsLoading(false), 900); // مدت زمان لودینگ کوتاه و سریع
      return () => clearTimeout(timer);
    } else {
      // اگر دستگاه موبایل نیست
      setIsLoading(false);
    }
  }, [isMobile]);

  // نمایش لودینگ یا محتوای اصلی
  return isLoading && isMobile ? <SplashScreen /> : <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <MainApp />
);
