/* eslint-disable react/prop-types */
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { checkOtp } from "../../Services/Auth";
import { setCookie } from "../../Utils/cookie";
import styles from "../../styles/auth.module.css";
import { useNavigate } from "react-router-dom";

function CheckOtpForm({ code, setCode, mobile, setStep }) {
  const navigate = useNavigate();

  useEffect(() => {
    toast.success("کد با موفقیت ارسال شد ");
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (code.length !== 5) return toast.error("کد وارد شده صحیح نمی باشد !");

    const { response, error } = await checkOtp(mobile, code);
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
          <label htmlFor="input">کد تایید </label>
          <input
            type="text"
            id="input"
            placeholder="کد تایید"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />{" "}
          <br />
          <button type="submit">تایید نهایی و ورود به حساب</button>
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
