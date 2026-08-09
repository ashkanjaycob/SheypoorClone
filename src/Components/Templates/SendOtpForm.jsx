/* eslint-disable react/prop-types */
import toast, { Toaster } from "react-hot-toast";
import { sendOtp } from "../../Services/Auth";
import styles from "../../styles/auth.module.css";
import { p2e } from "../../Utils/Numbers";

import { useState } from "react";

function SendOtpForm({ mobile, setMobile, setStep, setOtpResponse }) {
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (mobile.length !== 11)
      return toast.error("لطفا شماره موبایل 11 رقمی را وارد نمایید"); 

    setIsLoading(true);
    const { response, error } = await sendOtp(mobile);
    setIsLoading(false);
    
    if (response) {
      toast(`کد ورود شما به کپی شیپور اشکان یعقوبی : ${response.data.code} `, {
        icon: "👏",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      setOtpResponse(response.data.code);
      setStep(2);
    }
    if (error) {
      console.log(error.response.data.message);
      toast.error("خطا در برقراری ارتباط ، مجدد تلاش کنید"); 
    }
  };

  return (
    <>
      <form onSubmit={submitHandler} className={styles.sendform}>
        <h2>ورود / ثبت نام</h2>
        <p>لطفا برای ورود یا ثبت نام شماره تلفن همراه خود را وارد کنید.</p>
        <br />
        <label htmlFor="input">شماره موبایل</label>
        <input
          type="text"
          id="input"
          placeholder="شماره موبایل"
          value={mobile}
          onChange={(e) => setMobile(p2e(e.target.value))}
        />
        <br />
        <br />
        <span>
          توجه: لطفا پس از ثبت آگهی، از طریق هیچ پیامکی برای پرداخت وجه جهت
          انتشار آگهی اقدام نکنید.
        </span>
        <br />
        <button type="submit" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1 }}>
          {isLoading ? "در حال ارسال..." : "ورود یا ثبت نام در شیپور"}
        </button>
      </form>

      <Toaster />
    </>
  );
}

export default SendOtpForm;
