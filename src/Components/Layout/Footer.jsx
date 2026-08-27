import { useState, useEffect } from "react";
import { t, getSavedLanguage } from "../../Utils/i18n";

function Footer() {
  const [currentLang, setCurrentLang] = useState(getSavedLanguage());

  useEffect(() => {
    const handleLangChange = (e) => setCurrentLang(e.detail || getSavedLanguage());
    window.addEventListener("sheypoor_lang_changed", handleLangChange);
    return () => window.removeEventListener("sheypoor_lang_changed", handleLangChange);
  }, []);

  return (
    <footer className="bg-light-2 dark:bg-night-surface border-t border-light-0 dark:border-night-border laptop:block hidden transition-colors">
      {/* Main Footer Content */}
      <div className="max-w-container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 laptop:grid-cols-4 gap-8">
          {/* Column 1: Sheypoor */}
          <div>
            <h4 className="text-heading-5 text-dark-0 dark:text-white font-bold mb-4">
              {t("appName", {}, currentLang)}
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-body-2 text-dark-3 dark:text-gray-400 hover:text-main dark:hover:text-white transition-colors">
                  {currentLang === "fa" ? "درباره شیپور" : "About Sheypoor"}
                </a>
              </li>
              <li>
                <a href="#" className="text-body-2 text-dark-3 dark:text-gray-400 hover:text-main dark:hover:text-white transition-colors">
                  {currentLang === "fa" ? "بلاگ و اخبار" : "Blog & News"}
                </a>
              </li>
              <li>
                <a href="#" className="text-body-2 text-dark-3 dark:text-gray-400 hover:text-main dark:hover:text-white transition-colors">
                  {currentLang === "fa" ? "فرصت‌های شغلی" : "Careers"}
                </a>
              </li>
              <li>
                <a href="#" className="text-body-2 text-dark-3 dark:text-gray-400 hover:text-main dark:hover:text-white transition-colors">
                  {currentLang === "fa" ? "نقشه سایت" : "Sitemap"}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Customer Guide */}
          <div>
            <h4 className="text-heading-5 text-dark-0 dark:text-white font-bold mb-4">
              {currentLang === "fa" ? "راهنمای مشتریان" : currentLang === "de" ? "Hilfe & Support" : "Help & Support"}
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-body-2 text-dark-3 dark:text-gray-400 hover:text-main dark:hover:text-white transition-colors">
                  {currentLang === "fa" ? "سوالات متداول" : "FAQ"}
                </a>
              </li>
              <li>
                <a href="#" className="text-body-2 text-dark-3 dark:text-gray-400 hover:text-main dark:hover:text-white transition-colors">
                  {currentLang === "fa" ? "تماس با پشتیبانی" : "Contact Support"}
                </a>
              </li>
              <li>
                <a href="#" className="text-body-2 text-dark-3 dark:text-gray-400 hover:text-main dark:hover:text-white transition-colors">
                  {currentLang === "fa" ? "راهنمای خرید امن" : "Safe Trading Tips"}
                </a>
              </li>
              <li>
                <a href="#" className="text-body-2 text-dark-3 dark:text-gray-400 hover:text-main dark:hover:text-white transition-colors">
                  {currentLang === "fa" ? "قوانین و مقررات" : "Terms & Privacy"}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h4 className="text-heading-5 text-dark-0 dark:text-white font-bold mb-4">
              {currentLang === "fa" ? "خدمات و امکانات" : currentLang === "de" ? "Dienstleistungen" : "Services"}
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-body-2 text-dark-3 dark:text-gray-400 hover:text-main dark:hover:text-white transition-colors">
                  {currentLang === "fa" ? "همه فروشگاه‌ها" : "All Stores"}
                </a>
              </li>
              <li>
                <a href="#" className="text-body-2 text-dark-3 dark:text-gray-400 hover:text-main dark:hover:text-white transition-colors">
                  {currentLang === "fa" ? "مشاوران املاک" : "Real Estate Agents"}
                </a>
              </li>
              <li>
                <a href="#" className="text-body-2 text-dark-3 dark:text-gray-400 hover:text-main dark:hover:text-white transition-colors">
                  {currentLang === "fa" ? "قیمت روز خودرو" : "Car Price Valuation"}
                </a>
              </li>
              <li>
                <a href="#" className="text-body-2 text-dark-3 dark:text-gray-400 hover:text-main dark:hover:text-white transition-colors">
                  {currentLang === "fa" ? "قیمت روز مسکن" : "Property Price Index"}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: App Download */}
          <div>
            <h4 className="text-heading-5 text-dark-0 dark:text-white font-bold mb-4">
              {currentLang === "fa" ? "دانلود اپلیکیشن شیپور" : "Download Sheypoor App"}
            </h4>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-white dark:bg-night-card rounded-sheypoor border border-light-0 dark:border-night-border hover:border-main dark:hover:border-white transition-all group">
                <svg className="w-8 h-8 text-main dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <div className="rtl:text-right ltr:text-left">
                  <span className="text-body-4 text-dark-3 dark:text-gray-400 block">
                    {currentLang === "fa" ? "دانلود مستقیم" : "Direct Download"}
                  </span>
                  <span className="text-body-2 font-semibold text-dark-0 dark:text-white group-hover:text-main dark:group-hover:text-white transition-colors">
                    Android APK
                  </span>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-3 bg-white dark:bg-night-card rounded-sheypoor border border-light-0 dark:border-night-border hover:border-main dark:hover:border-white transition-all group">
                <svg className="w-8 h-8 text-dark-2 dark:text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="rtl:text-right ltr:text-left">
                  <span className="text-body-4 text-dark-3 dark:text-gray-400 block">
                    {currentLang === "fa" ? "دانلود از" : "Download on"}
                  </span>
                  <span className="text-body-2 font-semibold text-dark-0 dark:text-white group-hover:text-main dark:group-hover:text-white transition-colors">
                    App Store
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-light-1 dark:bg-night-bg border-t border-light-0 dark:border-night-border transition-colors">
        <div className="max-w-container mx-auto px-4 py-4">
          <div className="flex flex-col laptop:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center justify-center laptop:justify-start gap-2 text-body-3 text-dark-3 dark:text-gray-400 text-center laptop:text-right">
              <span>
                {currentLang === "fa"
                  ? "کلیه حقوق این سایت متعلق به شیپور است."
                  : "All rights reserved. Sheypoor Inc."}
              </span>
              <span className="hidden laptop:inline">|</span>
              <div className="flex items-center gap-1.5 font-medium">
                <span>
                  {currentLang === "fa"
                    ? "توسعه دهنده :"
                    : currentLang === "de"
                    ? "Entwickelt von:"
                    : "Developed by:"}
                </span>
                <a
                  href="https://linkedin.com/in/ashkanyaghobi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-main hover:text-main-darker dark:hover:text-main-lighter font-bold underline flex items-center gap-1 transition-colors"
                >
                  <span>اشکان یعقوبی (Ashkan Yaghoobi)</span>
                  <svg className="w-3.5 h-3.5 fill-current inline-block" viewBox="0 0 24 24">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 text-dark-3 dark:text-gray-400">
              <a
                href="https://linkedin.com/in/ashkanyaghobi"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-main dark:hover:text-main-lighter transition-colors p-1"
                aria-label="LinkedIn"
                title="LinkedIn: Ashkan Yaghoobi"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                </svg>
              </a>
              <a href="#" className="hover:text-main dark:hover:text-main-lighter transition-colors p-1" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
