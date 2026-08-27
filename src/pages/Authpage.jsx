import { useState } from "react";
import CheckOtpForm from "../Components/Templates/CheckOtpForm";
import SendOtpForm from "../Components/Templates/SendOtpForm";
import { Link } from "react-router-dom";

function Authpage() {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [code, setCode] = useState("");
  const [otpResponse, setOtpResponse] = useState(null);

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col justify-center items-center px-4 py-12 bg-light-3">
      {/* Brand Header */}
      <Link to="/" className="mb-6 flex items-center gap-2">
        <img src="/sheypoorBlack.svg" alt="شیپور" className="w-10 h-10" />
        <span className="text-heading-3 font-bold text-dark-0">شیپور</span>
      </Link>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-sheypoor-xl p-8 border border-light-0 shadow-card">
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
      <p className="text-body-4 text-dark-4 mt-6 text-center">
        با ورود به شیپور، قوانین و مقررات را می‌پذیرید.
      </p>
    </div>
  );
}

export default Authpage;
