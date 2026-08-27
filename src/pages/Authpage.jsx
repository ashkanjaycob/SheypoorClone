import { useState, useEffect } from "react";
import CheckOtpForm from "../Components/Templates/CheckOtpForm";
import SendOtpForm from "../Components/Templates/SendOtpForm";
import { Link } from "react-router-dom";
import { t, getSavedLanguage } from "../Utils/i18n";

function Authpage() {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [code, setCode] = useState("");
  const [otpResponse, setOtpResponse] = useState(null);
  const [currentLang, setCurrentLang] = useState(getSavedLanguage());

  useEffect(() => {
    const handleLangChange = (e) => setCurrentLang(e.detail || getSavedLanguage());
    window.addEventListener("sheypoor_lang_changed", handleLangChange);
    return () => window.removeEventListener("sheypoor_lang_changed", handleLangChange);
  }, []);

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col justify-center items-center px-4 py-12 bg-light-3 dark:bg-night-bg text-dark-0 dark:text-white transition-colors">
      {/* Brand Header */}
      <Link to="/" className="mb-6 flex items-center gap-2">
        <img src="/sheypoorBlack.svg" alt="Sheypoor" className="w-10 h-10 dark:invert" />
        <span className="text-heading-3 font-bold text-dark-0 dark:text-white">{t("appName", {}, currentLang)}</span>
      </Link>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white dark:bg-night-card rounded-sheypoor-xl p-8 border border-light-0 dark:border-night-border shadow-card dark:shadow-card-dark">
        {step === 1 && (
          <SendOtpForm
            setStep={setStep}
            mobile={mobile}
            setMobile={setMobile}
            setOtpResponse={setOtpResponse}
          />
        )}
        {step === 2 && (
          <CheckOtpForm
            code={code}
            setCode={setCode}
            mobile={mobile}
            setStep={setStep}
            otpResponse={otpResponse}
          />
        )}
      </div>

      {/* Footer text */}
      <p className="text-body-4 text-dark-4 dark:text-gray-500 mt-6 text-center">
        {currentLang === "fa"
          ? "با ورود به شیپور، قوانین و مقررات را می‌پذیرید."
          : "By logging in, you accept the terms and conditions."}
      </p>
    </div>
  );
}

export default Authpage;
