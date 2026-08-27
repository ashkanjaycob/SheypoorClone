/* eslint-disable react/prop-types */
import toast, { Toaster } from "react-hot-toast";
import { sendOtp } from "../../Services/Auth";
import { p2e } from "../../Utils/Numbers";
import { useState } from "react";

function SendOtpForm({ mobile, setMobile, setStep, setOtpResponse }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateMobile = (phone) => {
    const clean = p2e(phone).trim();
    if (!clean) return "لطفاً شماره موبایل خود را وارد کنید";
    if (!clean.startsWith("09")) return "شماره موبایل باید با ۰۹ شروع شود";
    if (clean.length !== 11) return "شماره موبایل باید ۱۱ رقم باشد";
    if (!/^\d+$/.test(clean)) return "شماره موبایل فقط باید شامل اعداد باشد";
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
      toast.success(response.data.message || "کد تایید ارسال شد");
      setStep(2);
    }
    if (apiError) {
      const msg = apiError.response?.data?.message || "خطا در ارسال کد تایید، لطفاً مجدداً تلاش کنید";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={submitHandler} className="space-y-6">
      <div>
        <h2 className="text-heading-3 text-dark-0 mb-2">ورود یا ثبت‌نام</h2>
        <p className="text-body-2 text-dark-3">
          برای ورود یا ساخت حساب در شیپور، شماره موبایل خود را وارد کنید.
        </p>
      </div>

      <div>
        <label htmlFor="mobile" className="block text-body-2 font-medium text-dark-1 mb-2">
          شماره موبایل
        </label>
        <input
          type="tel"
          id="mobile"
          name="mobile"
          disabled={isLoading}
          dir="ltr"
          placeholder="۰۹۱۲۳۴۵۶۷۸۹"
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

      <div className="bg-light-2 rounded-sheypoor p-3.5 text-body-4 text-dark-3 leading-6">
        ℹ️ با ورود به حساب، کد تایید ۵ رقمی به صورت پیامک برای شما ارسال می‌شود.
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
            در حال ارسال کد...
          </span>
        ) : (
          "دریافت کد تایید"
        )}
      </button>

      <Toaster />
    </form>
  );
}

export default SendOtpForm;
