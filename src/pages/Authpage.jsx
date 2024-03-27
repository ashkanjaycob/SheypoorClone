import { useState } from "react";
import CheckOtpForm from "../Components/Templates/CheckOtpForm";
import SendOtpForm from "../Components/Templates/SendOtpForm";
import styles from "../styles/auth.module.css";

function Authpage() {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [code, setCode] = useState("");

  return (
    <>
      <div className='container md:w-full lg:w-3/4 mx-auto p-2 mt-3'>
        <div className={styles.childs}>
        {step === 1 && (
          <SendOtpForm
            setStep={setStep}
            mobile={mobile}
            setMobile={setMobile}
          />
        )}
        {step === 2 && (
          <CheckOtpForm
            code={code}
            setCode={setCode}
            mobile={mobile}
            setStep={setStep}
          />
        )}
        </div>
      </div>
    </>
  );
}

export default Authpage;
