/* eslint-disable react/prop-types */
import toast, { Toaster } from "react-hot-toast";
import { sendOtp } from "../../Services/Auth";
import styles from "../../styles/auth.module.css";

function SendOtpForm({ mobile, setMobile, setStep }) {
  const submitHandler = async (e) => {
    e.preventDefault();
    if (mobile.length !== 11)
      return alert("لطفا شماره موبایل 11 رقمی را وارد نمایید");

    const { response, error } = await sendOtp(mobile);
    if (response) {
      toast(`کد ورود شما به کپی شیپور اشکان یعقوبی : ${response.data.otpCode.otp.code} `, {
        icon: "👏",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      setStep(2);
    }
    if (error) {
      console.log(error.response.data.message);
      toast.error("خطا در برقراری ارتباط ، مجدد تلاش کنید"); // Display error message as a toast
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
          onChange={(e) => setMobile(e.target.value)}
        />
        <br />
        <br />
        <span>
          توجه: لطفا پس از ثبت آگهی، از طریق هیچ پیامکی برای پرداخت وجه جهت
          انتشار آگهی اقدام نکنید.
        </span>
        <br />
        <button type="submit">ورود یا ثبت نام در شیپور</button>
      </form>

      <Toaster />
    </>
  );
}

export default SendOtpForm;
