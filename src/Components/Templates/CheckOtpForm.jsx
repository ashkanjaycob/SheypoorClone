import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

function CheckOtpForm({ code, setCode, mobile, setStep }) {
  useEffect(() => {
    toast.success("کد با موفقیت ارسال شد ");
  }, [mobile]);

  const changemobileHandler = () => {
    setStep(1);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    console.log({code , mobile});
  };


  return (
    <>
      <form onSubmit={submitHandler}>
        <p>تایید کد ارسال شده برای شما </p>
        <span>لطفا کد پیامک شده به شماره {mobile} را وارد نمایید .</span>
        <label htmlFor="input">کد تایید را وارد نمایید</label>
        <input
          type="text"
          id="input"
          placeholder="کد تایید"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />{" "}
        <br />
        <button type="submit">ورود به حساب</button>
        <button onClick={changemobileHandler}>تغییر شماره موبایل</button>
      </form>
      <Toaster />
    </>
  );
}

export default CheckOtpForm;
