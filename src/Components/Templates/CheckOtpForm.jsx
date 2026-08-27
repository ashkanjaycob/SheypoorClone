/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { checkOtp, sendOtp } from "../../Services/Auth";
import { setCookie } from "../../Utils/cookie";
import { useNavigate } from "react-router-dom";
import { p2e } from "../../Utils/Numbers";
import { getSavedLanguage } from "../../Utils/i18n";

function CheckOtpForm({ code, setCode, mobile, setStep, otpResponse }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const [error, setError] = useState("");
  const [currentLang, setCurrentLang] = useState(getSavedLanguage());

  useEffect(() => {
    const handleLangChange = (e) => setCurrentLang(e.detail || getSavedLanguage());
    window.addEventListener("sheypoor_lang_changed", handleLangChange);
    return () => window.removeEventListener("sheypoor_lang_changed", handleLangChange);
  }, []);

  // Countdown timer for resending OTP
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResend = async () => {
    if (countdown > 0 || isResending) return;
    setIsResending(true);
    const { response, error: apiErr } = await sendOtp(mobile);
    setIsResending(false);

    if (response) {
      toast.success(currentLang === "fa" ? "کد تایید مجدداً ارسال شد" : "Code resent successfully");
      setCountdown(120);
    } else if (apiErr) {
      toast.error(apiErr.response?.data?.message || (currentLang === "fa" ? "خطا در ارسال مجدد کد" : "Error resending code"));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const clean = p2e(code).trim();
    if (!clean || clean.length < 4) {
      const err = currentLang === "fa" ? "لطفاً کد تایید را کامل وارد کنید" : "Please enter the full verification code";
      setError(err);
      toast.error(err);
      return;
    }

    setError("");
    setIsLoading(true);
    const { response, error: apiError } = await checkOtp(mobile, clean);
    setIsLoading(false);

    if (response) {
      setCookie(response.data);
      toast.success(currentLang === "fa" ? "با موفقیت وارد شدید! در حال انتقال..." : "Logged in successfully! Redirecting...");
      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 1000);
    }
    if (apiError) {
      const msg = apiError.response?.data?.message || (currentLang === "fa" ? "کد وارد شده اشتباه یا منقضی شده است" : "Invalid or expired code");
      setError(msg);
      toast.error(msg);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <form onSubmit={submitHandler} className="space-y-6">
      <div>
        <h2 className="text-heading-3 text-dark-0 dark:text-white font-bold mb-2">
          {currentLang === "fa" ? "تایید شماره موبایل" : "Verify Mobile Number"}
        </h2>
        <p className="text-body-2 text-dark-3 dark:text-gray-300">
          {currentLang === "fa" ? (
            <>کد پیامک‌شده به شماره <span className="font-mono text-dark-1 dark:text-white font-semibold" dir="ltr">{mobile}</span> را وارد کنید.</>
          ) : (
            <>Enter the code sent to <span className="font-mono text-dark-1 dark:text-white font-semibold" dir="ltr">{mobile}</span>.</>
          )}
        </p>
      </div>

      {/* Debug Code Simulator Banner */}
      {otpResponse && (
        <div className="p-4 bg-light-special dark:bg-night-surface border border-main/20 dark:border-night-border rounded-sheypoor text-center">
          <span className="text-body-3 text-dark-2 dark:text-gray-300 block mb-1">
            {currentLang === "fa" ? "کد تایید تستی شما:" : "Test Verification Code:"}
          </span>
          <span className="text-heading-4 font-mono font-bold text-main dark:text-white tracking-widest" dir="ltr">
            {otpResponse}
          </span>
        </div>
      )}

      <div>
        <label htmlFor="code" className="block text-body-2 font-medium text-dark-1 dark:text-gray-200 mb-2">
          {currentLang === "fa" ? "کد تایید" : "Verification Code"}
        </label>
        <input
          type="text"
          id="code"
          disabled={isLoading}
          dir="ltr"
          placeholder="— — — — —"
          value={code}
          onChange={(e) => {
            setCode(p2e(e.target.value));
            if (error) setError("");
          }}
          className={`input-sheypoor text-center font-mono text-xl tracking-[0.4em] font-bold ${
            error ? "!border-accent-red !ring-accent-red/20" : ""
          }`}
          maxLength={6}
          autoFocus
        />
        {error && <span className="text-accent-red text-body-4 mt-1.5 block">{error}</span>}
      </div>

      {/* Resend Countdown */}
      <div className="flex items-center justify-between text-body-3 text-dark-3 dark:text-gray-400">
        <button
          type="button"
          onClick={() => setStep(1)}
          disabled={isLoading}
          className="text-main dark:text-white hover:underline transition-colors"
        >
          {currentLang === "fa" ? "ویرایش شماره" : "Edit Number"}
        </button>

        {countdown > 0 ? (
          <span className="font-mono text-dark-4 dark:text-gray-500">
            {currentLang === "fa" ? `ارسال مجدد (${formatTime(countdown)})` : `Resend in (${formatTime(countdown)})`}
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || isLoading}
            className="text-main dark:text-white hover:underline font-medium transition-colors"
          >
            {isResending ? (currentLang === "fa" ? "در حال ارسال..." : "Sending...") : (currentLang === "fa" ? "ارسال مجدد کد" : "Resend Code")}
          </button>
        )}
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
            {currentLang === "fa" ? "در حال تایید..." : "Verifying..."}
          </span>
        ) : (
          currentLang === "fa" ? "تایید نهایی و ورود" : "Verify & Sign In"
        )}
      </button>

      <Toaster />
    </form>
  );
}

export default CheckOtpForm;
