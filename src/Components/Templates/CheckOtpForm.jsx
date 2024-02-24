import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

function CheckOtpForm() {
  useEffect(() => {
    toast.success("کد با موفقیت ارسال شد ");
  }, []);

  return (
    <>
      <div>CheckOtpForm</div>
      <Toaster />
    </>
  );
}

export default CheckOtpForm;
