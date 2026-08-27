/* eslint-disable react/prop-types */
import toast, { Toaster } from "react-hot-toast";
import { sendOtp } from "../../Services/Auth";
import { p2e } from "../../Utils/Numbers";
import { useState, useEffect } from "react";
import { t, getSavedLanguage } from "../../Utils/i18n";

function SendOtpForm({ mobile, setMobile, setStep, setOtpResponse }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentLang, setCurrentLang] = useState(getSavedLanguage());

  useEffect(() => {
    const handleLangChange = (e) => setCurrentLang(e.detail || getSavedLanguage());
    window.addEventListener("sheypoor_lang_changed", handleLangChange);
    return () => window.removeEventListener("sheypoor_lang_changed", handleLangChange);
  }, []);

  const validateMobile = (phone) => {
    const clean = p2e(phone).trim();
    if (!clean) {
      return currentLang === "fa" ? "لطفاً شماره موبایل خود را وارد کنید" : "Please enter your mobile number";
    }
    if (!clean.startsWith("09")) {
      return currentLang === "fa" ? "شماره موبایل باید با ۰۹ شروع شود" : "Mobile number must start with 09";
    }
    if (clean.length !== 11) {
      return currentLang === "fa" ? "شماره موبایل باید ۱۱ رقم باشد" : "Mobile number must be 11 digits";
    }
    if (!/^\d+$/.test(clean)) {
      return currentLang === "fa" ? "شماره موبایل فقط باید شامل اعداد باشد" : "Mobile number must contain digits only";
    }
    return "";
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const err = validateMobile(mobile);
    if (err) {
      setError(err);
      toast.error(err);
      return;
    }

    setError("");
    setIsLoading(true);
    const { response, error: apiError } = await sendOtp(mobile);
    setIsLoading(false);

    if (response) {
      if (response.data.code) {
        setOtpResponse(response.data.code);
      }
      toast.success(response.data.message || (currentLang === "fa" ? "کد تایید ارسال شد" : "Verification code sent"));
      setStep(2);
    }
    if (apiError) {
      const msg = apiError.response?.data?.message || (currentLang === "fa" ? "خطا در ارسال کد تایید" : "Error sending verification code");
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={submitHandler} className="space-y-6">
      <div>
        <h2 className="text-heading-3 text-dark-0 dark:text-white font-bold mb-2">
          {t("login", {}, currentLang)}
        </h2>
        <p className="text-body-2 text-dark-3 dark:text-gray-300">
          {t("loginSubtitle", {}, currentLang)}
        </p>
      </div>

      <div>
        <label htmlFor="mobile" className="block text-body-2 font-medium text-dark-1 dark:text-gray-200 mb-2">
          {currentLang === "fa" ? "شماره موبایل" : "Mobile Number"}
        </label>
        <input
          type="tel"
          id="mobile"
          name="mobile"
          disabled={isLoading}
          dir="ltr"
          placeholder="09123456789"
          value={mobile}
          onChange={(e) => {
            setMobile(p2e(e.target.value));
            if (error) setError("");
          }}
          className={`input-sheypoor text-left font-mono tracking-wider ${
            error ? "!border-accent-red !ring-accent-red/20" : ""
          }`}
          maxLength={11}
          autoFocus
        />
        {error && <span className="text-accent-red text-body-4 mt-1.5 block">{error}</span>}
      </div>

      <div className="bg-light-2 dark:bg-night-surface rounded-sheypoor p-3.5 text-body-4 text-dark-3 dark:text-gray-400 leading-6 border border-light-1 dark:border-night-border">
        ℹ️ {currentLang === "fa"
          ? "با ورود به حساب، کد تایید ۵ رقمی به صورت پیامک برای شما ارسال می‌شود."
          : "A 5-digit verification code will be sent to your phone via SMS."}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {currentLang === "fa" ? "در حال ارسال کد..." : "Sending Code..."}
          </span>
        ) : (
          currentLang === "fa" ? "دریافت کد تایید" : "Get Verification Code"
        )}
      </button>

      <Toaster />
    </form>
  );
}

export default SendOtpForm;
