import { useState } from "react";
import CheckOtpForm from "../Components/Templates/CheckOtpForm";
import SendOtpForm from "../Components/Templates/SendOtpForm";

function Authpage() {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [code, setCode] = useState("");

  return (
    <>
      {step === 1 && <SendOtpForm setStep={setStep} mobile={mobile} setMobile={setMobile} />}
      {step === 2 && <CheckOtpForm />}
    </>
  );
}

export default Authpage;
