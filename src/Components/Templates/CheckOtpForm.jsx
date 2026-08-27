/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { checkOtp, sendOtp } from "../../Services/Auth";
import { setCookie } from "../../Utils/cookie";
import { useNavigate } from "react-router-dom";
import { p2e } from "../../Utils/Numbers";

function CheckOtpForm({ code, setCode, mobile, setStep, otpResponse }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const [error, setError] = useState("");

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
      toast.success("کد تایید مجدداً ارسال شد");
      setCountdown(120);
    } else if (apiErr) {
      toast.error(apiErr.response?.data?.message || "خطا در ارسال مجدد کد");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const clean = p2e(code).trim();
    if (!clean || clean.length < 4) {
      setError("لطفاً کد تایید ۵ رقمی را کامل وارد کنید");
      toast.error("کد وارد شده صحیح نمی‌باشد");
      return;
    }

    setError("");
    setIsLoading(true);
    const { response, error: apiError } = await checkOtp(mobile, clean);
    setIsLoading(false);

    if (response) {
      setCookie(response.data);
      toast.success("با موفقیت وارد شدید! در حال انتقال...");
      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 1000);
    }
    if (apiError) {
      const msg = apiError.response?.data?.message || "کد وارد شده اشتباه یا منقضی شده است";
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
        <h2 className="text-heading-3 text-dark-0 mb-2">تایید شماره موبایل</h2>
        <p className="text-body-2 text-dark-3">
          کد پیامک‌شده به شماره <span className="font-mono text-dark-1 font-semibold" dir="ltr">{mobile}</span> را وارد کنید.
        </p>
      </div>

      {/* Debug Code Simulator Banner (Only if backend returned code) */}
      {otpResponse && (
        <div className="p-4 bg-light-special border border-main/20 rounded-sheypoor text-center">
          <span className="text-body-3 text-dark-2 block mb-1">کد تایید تستی شما:</span>
          <span className="text-heading-4 font-mono font-bold text-main tracking-widest" dir="ltr">
            {otpResponse}
          </span>
        </div>
      )}

      <div>
        <label htmlFor="code" className="block text-body-2 font-medium text-dark-1 mb-2">
          کد تایید
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
      <div className="flex items-center justify-between text-body-3 text-dark-3">
        <button
          type="button"
          onClick={() => setStep(1)}
          disabled={isLoading}
          className="text-main hover:text-main-darker transition-colors"
        >
          ویرایش شماره
        </button>

        {countdown > 0 ? (
          <span className="font-mono text-dark-4">ارسال مجدد ({formatTime(countdown)})</span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || isLoading}
            className="text-main hover:text-main-darker font-medium transition-colors"
          >
            {isResending ? "در حال ارسال..." : "ارسال مجدد کد"}
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
            در حال تایید...
          </span>
        ) : (
          "تایید نهایی و ورود"
        )}
      </button>

      <Toaster />
    </form>
  );
}

export default CheckOtpForm;
