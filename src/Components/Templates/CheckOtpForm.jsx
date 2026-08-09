/* eslint-disable react/prop-types */
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { checkOtp } from "../../Services/Auth";
import { setCookie } from "../../Utils/cookie";
import styles from "../../styles/auth.module.css";
import { useNavigate } from "react-router-dom";

import { useState } from "react";

function CheckOtpForm({ code, setCode, mobile, setStep, otpResponse }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    toast.success("کد با موفقیت ارسال شد ");
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (code.length !== 5) return toast.error("کد وارد شده صحیح نمی باشد !");

    setIsLoading(true);
    const { response, error } = await checkOtp(mobile, code);
    setIsLoading(false);
    
    if (response) {
      console.log(response);
      await toast
        .promise(
          new Promise((resolve) => {
            setTimeout(() => {
              resolve("با موفقیت وارد حساب کاربری شدید");
            }, 2000); 
          }),
          {
            loading: "در حال ورود به حساب کاربری...",
            success: "با موفقیت وارد حساب کاربری شدید",
          }
        )
        .then(() => {
          navigate("/");
          window.location.reload();
        });
      setCookie(response.data);
      setCode("");
    }
    if (error) {
      console.log(error.response.data.message);
      toast.error("خطایی رخ داده است ، مجدد تلاش کنید");
    }
  };

  return (
    <>
      <div className="container mx-auto">
        <form onSubmit={submitHandler} className={styles.checkForm}>
          <h2>تائید شماره موبایل</h2>
          <span>لطفا کد پیامک شده به شماره {mobile} را وارد نمایید .</span>
          <br />
          <br />
          {otpResponse && (
            <div style={{ padding: "15px", marginBottom: "20px", border: "1px dashed #007bff", borderRadius: "8px", backgroundColor: "#f0f8ff", textAlign: "center", color: "#007bff" }}>
              <span>کد تایید شما (شبیه‌ساز پیامک): </span>
              <strong style={{ letterSpacing: "3px", fontSize: "1.2rem" }}>{otpResponse}</strong>
            </div>
          )}
          <label htmlFor="input">کد تایید </label>
          <input
            type="text"
            id="input"
            placeholder="کد تایید"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />{" "}
          <br />
          <button type="submit" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1 }}>
            {isLoading ? "در حال تایید..." : "تایید نهایی و ورود به حساب"}
          </button>
        </form>

        <button
          className={styles.changeNumber}
          onClick={() => {
            setStep(1);
          }}
        >
          تغییر شماره موبایل
        </button>
      </div>

      <Toaster />
    </>
  );
}

export default CheckOtpForm;
