/* eslint-disable react/prop-types */
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { checkOtp } from "../../Services/Auth";
import setCookie from "../../Utils/cookie";

function CheckOtpForm({ code, setCode, mobile, setStep }) {
  useEffect(() => {
    toast.success("کد با موفقیت ارسال شد ");
  }, []);


  const submitHandler = async (e) => {
    e.preventDefault();

    if (code.length !== 5) return alert("لطفا کد صحیح را وارد نمایید");

    const { response, error } = await checkOtp(mobile, code);
    if (response) {
      console.log(response);
      toast.success("با موفقیت وارد حساب کاربری شدید");
      setCookie(response.data);
      setCode("");
    }
    if (error) {
      toast.error("خطایی رخ داده است ، مجدد تلاش کنید");
    }
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
      </form>
      <button
          onClick={() => {
            console.log("s");
            setStep(1);
          }}
        >
          تغییر شماره موبایل
        </button>
      <Toaster />
    </>
  );
}

export default CheckOtpForm;
