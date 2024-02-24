/* eslint-disable react/prop-types */
import toast, { Toaster } from "react-hot-toast";
import { sendOtp } from "../../Services/Auth";

function SendOtpForm({ mobile, setMobile, setStep }) {
  const submitHandler = async (e) => {
    e.preventDefault();
    if (mobile.length !== 11)
      return alert("لطفا شماره موبایل 11 رقمی را وارد نمایید");

    const { response, error } = await sendOtp(mobile);
    if (response) {
      setStep(2);
    }
    if (error) {
      console.log(error.response.data.message);
      toast.error("خطا در برقراری ارتباط ، مجدد تلاش کنید"); // Display error message as a toast
    }
  };

  return (
    <>
      <form onSubmit={submitHandler}>
        <span>
          لطفا برای ورود یا ثبت نام شماره تلفن همراه خود را وارد کنید.
        </span>
        <br />
        <label htmlFor="input">شماره موبایل</label>
        <input
          type="text"
          id="input"
          placeholder="شماره موبایل"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
        <button type="submit">ورود یا ثبت نام در شیپور</button>
      </form>
      <small>
        توجه: لطفا پس از ثبت آگهی، از طریق هیچ پیامکی برای پرداخت وجه جهت انتشار
        آگهی اقدام نکنید.
      </small>
      <Toaster />
    </>
  );
}

export default SendOtpForm;
