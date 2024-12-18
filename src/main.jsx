import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/index.css";
import "./styles/fonts.css";

// لودینگ صفحه
function SplashScreen() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <img
        src="/icons/icon-512x512.png"
        alt="App Icon"
        style={{ width: "100px" }}
      />
      <h1>در حال بارگذاری...</h1>
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
      // نمایش لودینگ فقط برای موبایل
      const timer = setTimeout(() => setIsLoading(false), 3000); // مدت زمان لودینگ
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
