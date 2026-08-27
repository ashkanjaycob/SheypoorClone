import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategory } from "../../Services/Admin";
import { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { PostApi } from "../../configs/PostApi";
import { p2e, sp } from "../../Utils/Numbers";

function AddAdvertising() {
  const queryClient = useQueryClient();
  const { data: categories } = useQuery(["get-categories"], getCategory);
  const fileInputRef = useRef(null);
  const [selectedImageName, setSelectedImageName] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  const [adform, setAdform] = useState({
    title: "",
    content: "",
    amount: "",
    city: "",
    category: "",
    images: null,
  });

  const handleClickChooseFile = () => {
    if (!isSubmitting) fileInputRef.current.click();
  };

  const changeHandler = (event) => {
    const { name, value, type } = event.target;
    if (type === "file") {
      const file = event.target.files[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          toast.error("حجم فایل باید کمتر از ۲ مگابایت باشد");
          event.target.value = null;
          setSelectedImageName("");
          setImagePreview(null);
        } else {
          setAdform((prev) => ({ ...prev, images: file }));
          setSelectedImageName(file.name);
          const reader = new FileReader();
          reader.onloadend = () => setImagePreview(reader.result);
          reader.readAsDataURL(file);
          if (errors.images) setErrors((prev) => ({ ...prev, images: "" }));
        }
      }
    } else {
      let finalValue = value;
      if (name === "amount") {
        finalValue = p2e(value).replace(/\D/g, "");
      }
      setAdform((prev) => ({ ...prev, [name]: finalValue }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!adform.title.trim()) {
      newErrors.title = "لطفاً عنوان آگهی را وارد کنید";
    } else if (adform.title.trim().length < 3) {
      newErrors.title = "عنوان باید حداقل ۳ حرف باشد";
    }

    if (!adform.content.trim()) {
      newErrors.content = "لطفاً توضیحات کامل آگهی را وارد کنید";
    } else if (adform.content.trim().length < 5) {
      newErrors.content = "توضیحات باید حداقل ۵ حرف باشد";
    }

    if (!adform.amount.toString().trim()) {
      newErrors.amount = "لطفاً مبلغ را وارد کنید (یا ۰ برای توافقی)";
    }

    if (!adform.city.trim()) {
      newErrors.city = "لطفاً شهر یا محدوده را وارد کنید";
    }

    if (!adform.category) {
      newErrors.category = "لطفاً دسته‌بندی را انتخاب کنید";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextToStep2 = () => {
    if (validateStep1()) setCurrentStep(2);
  };

  const submitAdformHandler = async (event) => {
    event.preventDefault();
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    // Append standard fields and swagger aliases for max compatibility
    formData.append("title", adform.title);
    formData.append("title_post", adform.title);
    formData.append("content", adform.content);
    formData.append("description", adform.content);
    formData.append("amount", adform.amount);
    formData.append("city", adform.city);
    formData.append("category", adform.category);

    if (adform.images) {
      formData.append("images", adform.images);
    }

    try {
      const res = await PostApi.post("post/create", formData);
      if (res.status === 200 || res.status === 201) {
        toast.success(res.data.message || "آگهی شما با موفقیت ثبت و منتشر شد! 🎉");
        queryClient.invalidateQueries(["get-all-ads"]);
        queryClient.invalidateQueries(["get-my-ads"]);
        setAdform({ title: "", content: "", amount: "", city: "", category: "", images: null });
        setSelectedImageName("");
        setImagePreview(null);
        setErrors({});
        setCurrentStep(1);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "خطا در ثبت آگهی. لطفاً از اتصال اینترنت و ورود به حساب اطمینان حاصل کنید.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, label: "اطلاعات آگهی" },
    { num: 2, label: "تصویر آگهی" },
    { num: 3, label: "بازبینی و انتشار" },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-center">
        <form
          onSubmit={submitAdformHandler}
          className="w-full max-w-2xl bg-white rounded-sheypoor-xl p-6 laptop:p-8 border border-light-0 shadow-card"
        >
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-1 mb-8">
            {steps.map((step, i) => (
              <div key={step.num} className="flex items-center">
                <button
                  type="button"
                  onClick={() => !isSubmitting && setCurrentStep(step.num)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-body-3 font-semibold transition-all ${
                    currentStep >= step.num
                      ? "bg-main text-white shadow-sm"
                      : "bg-light-2 text-dark-3"
                  }`}
                >
                  {currentStep > step.num ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.num
                  )}
                </button>
                <span className={`mx-2 text-body-3 hidden tablet:inline ${currentStep >= step.num ? "text-main font-semibold" : "text-dark-3"}`}>
                  {step.label}
                </span>
                {i < steps.length - 1 && (
                  <div className={`w-8 laptop:w-12 h-0.5 mx-1 ${currentStep > step.num ? "bg-main" : "bg-light-0"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Information */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-fade-in">
              <h3 className="text-heading-4 text-dark-0 mb-4">اطلاعات اصلی آگهی</h3>

              <div>
                <label className="block mb-2 text-body-2 font-medium text-dark-1">عنوان آگهی *</label>
                <input
                  className={`input-sheypoor ${errors.title ? "!border-accent-red !ring-accent-red/20" : ""}`}
                  type="text"
                  name="title"
                  disabled={isSubmitting}
                  value={adform.title}
                  onChange={changeHandler}
                  placeholder="مثلاً پژو ۲۰۶ تیپ ۵ مدل ۱۳۹۹"
                />
                {errors.title && <span className="text-accent-red text-body-4 mt-1.5 block">{errors.title}</span>}
              </div>

              <div>
                <label className="block mb-2 text-body-2 font-medium text-dark-1">توضیحات آگهی *</label>
                <textarea
                  className={`input-sheypoor min-h-[120px] ${errors.content ? "!border-accent-red !ring-accent-red/20" : ""}`}
                  name="content"
                  disabled={isSubmitting}
                  value={adform.content}
                  onChange={changeHandler}
                  rows="4"
                  placeholder="جزئیات فنی، شرایط و ویژگی‌های کالا یا خدمت خود را بنویسید..."
                />
                {errors.content && <span className="text-accent-red text-body-4 mt-1.5 block">{errors.content}</span>}
              </div>

              <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-body-2 font-medium text-dark-1">مبلغ (تومان) *</label>
                  <input
                    className={`input-sheypoor text-left font-mono ${errors.amount ? "!border-accent-red !ring-accent-red/20" : ""}`}
                    value={adform.amount ? sp(adform.amount) : ""}
                    onChange={changeHandler}
                    disabled={isSubmitting}
                    type="text"
                    name="amount"
                    placeholder="مثلاً ۲۵۰,۰۰۰,۰۰۰ (۰ برای توافقی)"
                    dir="ltr"
                  />
                  {errors.amount && <span className="text-accent-red text-body-4 mt-1.5 block">{errors.amount}</span>}
                </div>
                <div>
                  <label className="block mb-2 text-body-2 font-medium text-dark-1">شهر / محدوده *</label>
                  <input
                    className={`input-sheypoor ${errors.city ? "!border-accent-red !ring-accent-red/20" : ""}`}
                    type="text"
                    name="city"
                    disabled={isSubmitting}
                    value={adform.city}
                    onChange={changeHandler}
                    placeholder="مثلاً تهران، سعادت‌آباد"
                  />
                  {errors.city && <span className="text-accent-red text-body-4 mt-1.5 block">{errors.city}</span>}
                </div>
              </div>

              <div>
                <label className="block mb-2 text-body-2 font-medium text-dark-1">دسته‌بندی *</label>
                <select
                  className={`input-sheypoor ${errors.category ? "!border-accent-red !ring-accent-red/20" : ""}`}
                  name="category"
                  disabled={isSubmitting}
                  value={adform.category}
                  onChange={changeHandler}
                >
                  <option value="">انتخاب دسته‌بندی...</option>
                  {categories?.map((item) => (
                    <option key={item.id || item._id} value={item.id || item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                {errors.category && <span className="text-accent-red text-body-4 mt-1.5 block">{errors.category}</span>}
              </div>

              <button
                type="button"
                onClick={handleNextToStep2}
                disabled={isSubmitting}
                className="btn-primary w-full mt-4"
              >
                ادامه و انتخاب تصویر →
              </button>
            </div>
          )}

          {/* Step 2: Image */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-fade-in">
              <h3 className="text-heading-4 text-dark-0 mb-2">عکس آگهی</h3>
              <p className="text-body-3 text-dark-3 mb-4">
                آگهی‌های دارای عکس تا ۳ برابر بیشتر بازدید دریافت می‌کنند.
              </p>

              <div>
                <input
                  type="file"
                  name="images"
                  accept="image/jpeg,image/png,image/webp"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={changeHandler}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={handleClickChooseFile}
                  disabled={isSubmitting}
                  className="w-full py-10 border-2 border-dashed border-light-0 rounded-sheypoor-lg bg-light-3 hover:bg-light-2 hover:border-main/40 transition-all flex flex-col items-center justify-center gap-3 text-dark-3"
                >
                  {imagePreview ? (
                    <div className="relative flex flex-col items-center">
                      <img src={imagePreview} alt="preview" className="w-36 h-36 object-cover rounded-sheypoor-lg border border-light-0 shadow-sm" />
                      <span className="text-body-3 text-main font-medium mt-3 block">{selectedImageName}</span>
                      <span className="text-body-4 text-dark-3 mt-1">برای تغییر عکس کلیک کنید</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-full bg-light-2 flex items-center justify-center text-dark-3">
                        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-body-2 font-medium text-dark-1">برای انتخاب عکس کلیک کنید</span>
                      <span className="text-body-4 text-dark-4">فرمت مجاز: JPG, PNG, WEBP — حداکثر ۲ مگابایت</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  disabled={isSubmitting}
                  className="btn-outline flex-1"
                >
                  مرحله قبل
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  disabled={isSubmitting}
                  className="btn-primary flex-1"
                >
                  مرحله بعد (بازبینی) →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-fade-in">
              <h3 className="text-heading-4 text-dark-0 mb-2">بازبینی و تایید نهایی</h3>

              <div className="bg-light-3 rounded-sheypoor-lg p-5 space-y-3.5 border border-light-0">
                <div className="flex justify-between items-center text-body-2 border-b border-light-1 pb-2.5">
                  <span className="text-dark-3">عنوان:</span>
                  <span className="text-dark-0 font-semibold">{adform.title || "—"}</span>
                </div>
                <div className="flex justify-between items-center text-body-2 border-b border-light-1 pb-2.5">
                  <span className="text-dark-3">قیمت:</span>
                  <span className="text-dark-0 font-bold">
                    {adform.amount > 0 ? `${sp(adform.amount)} تومان` : "توافقی"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-body-2 border-b border-light-1 pb-2.5">
                  <span className="text-dark-3">شهر:</span>
                  <span className="text-dark-0 font-medium">{adform.city || "—"}</span>
                </div>
                <div className="flex justify-between items-center text-body-2 border-b border-light-1 pb-2.5">
                  <span className="text-dark-3">دسته‌بندی:</span>
                  <span className="text-dark-0 font-medium">
                    {categories?.find((c) => String(c.id || c._id) === String(adform.category))?.name || "انتخاب شده"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-body-2">
                  <span className="text-dark-3">تصویر پیوست:</span>
                  <span className="text-dark-0 font-medium">{selectedImageName || "ندارد (بدون عکس)"}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  disabled={isSubmitting}
                  className="btn-outline flex-1"
                >
                  ویرایش اطلاعات
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex-1"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      در حال ثبت آگهی...
                    </span>
                  ) : (
                    "انتشار آگهی"
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
      <Toaster />
    </div>
  );
}

export default AddAdvertising;
