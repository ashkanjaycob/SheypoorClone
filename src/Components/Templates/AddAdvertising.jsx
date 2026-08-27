/* eslint-disable no-unused-vars */
import { useQuery } from "@tanstack/react-query";
import { getCategory } from "../../Services/Admin";
import { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { PostApi } from "../../configs/PostApi";
import AdsList from "./AdsList";
import { p2e, sp } from "../../Utils/Numbers";

function AddAdvertising() {
  const { data } = useQuery(["get-category"], getCategory);
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
  });

  const handleClickChooseFile = () => fileInputRef.current.click();

  const changeHandler = (event) => {
    const { name, value, type } = event.target;
    if (type === "file") {
      const file = event.target.files[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          toast.error("فایل باید کمتر از ۲ مگابایت باشد");
          event.target.value = null;
          setSelectedImageName("");
          setImagePreview(null);
        } else {
          setAdform({ ...adform, [name]: file });
          setSelectedImageName(file.name);
          const reader = new FileReader();
          reader.onloadend = () => setImagePreview(reader.result);
          reader.readAsDataURL(file);
        }
      }
    } else {
      let finalValue = value;
      if (name === "amount") {
        finalValue = p2e(value).replace(/\D/g, "");
      }
      setAdform({ ...adform, [name]: finalValue });
      if (errors[name]) setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!adform.title.trim()) newErrors.title = "لطفا عنوان آگهی را وارد کنید";
    if (!adform.content.trim()) newErrors.content = "لطفا توضیحات آگهی را وارد کنید";
    if (!adform.amount.trim()) newErrors.amount = "لطفا مبلغ را وارد کنید";
    else if (isNaN(adform.amount.replace(/,/g, ""))) newErrors.amount = "مبلغ باید عددی باشد";
    if (!adform.city.trim()) newErrors.city = "لطفا شهر را وارد کنید";
    if (!adform.category) newErrors.category = "لطفا دسته‌بندی را انتخاب کنید";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitAdformHandler = (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    const formData = new FormData();
    for (let i in adform) formData.append(i, adform[i]);

    PostApi.post("post/create", formData)
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message || "آگهی با موفقیت ثبت شد!");
          setAdform({ title: "", content: "", amount: "", city: "", category: "" });
          setSelectedImageName("");
          setImagePreview(null);
          setErrors({});
          setCurrentStep(1);
        }
      })
      .catch(() => toast.error("خطا در ثبت آگهی"))
      .finally(() => setIsSubmitting(false));
  };

  const steps = [
    { num: 1, label: "اطلاعات" },
    { num: 2, label: "تصاویر" },
    { num: 3, label: "انتشار" },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-center">
        <form
          onChange={changeHandler}
          onSubmit={submitAdformHandler}
          className="w-full max-w-2xl bg-white rounded-sheypoor-lg p-6 border border-light-0 shadow-card"
        >
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-1 mb-8">
            {steps.map((step, i) => (
              <div key={step.num} className="flex items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(step.num)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-body-3 font-semibold transition-all ${
                    currentStep >= step.num
                      ? "bg-main text-white"
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
                <span className={`mx-2 text-body-4 ${currentStep >= step.num ? "text-main font-medium" : "text-dark-3"}`}>
                  {step.label}
                </span>
                {i < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-1 ${currentStep > step.num ? "bg-main" : "bg-light-0"}`} />
                )}
              </div>
            ))}
          </div>

          <h3 className="text-heading-4 text-dark-0 mb-6">ثبت آگهی جدید</h3>

          {/* Step 1: Info */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="block mb-2 text-body-2 font-medium text-dark-1">عنوان آگهی</label>
                <input
                  className={`input-sheypoor ${errors.title ? "!border-accent-red !ring-accent-red/20" : ""}`}
                  type="text"
                  name="title"
                  value={adform.title}
                  onChange={changeHandler}
                  placeholder="مثلاً خودرو ۲۰۶ مدل ۱۳۹۹"
                />
                {errors.title && <span className="text-accent-red text-body-4 mt-1 block">{errors.title}</span>}
              </div>
              <div>
                <label className="block mb-2 text-body-2 font-medium text-dark-1">توضیحات</label>
                <textarea
                  className={`input-sheypoor min-h-[120px] ${errors.content ? "!border-accent-red" : ""}`}
                  name="content"
                  value={adform.content}
                  onChange={changeHandler}
                  rows="4"
                  placeholder="مثلاً خودرو کم‌کارکرد، بدنه سالم"
                />
                {errors.content && <span className="text-accent-red text-body-4 mt-1 block">{errors.content}</span>}
              </div>
              <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-body-2 font-medium text-dark-1">مبلغ (تومان)</label>
                  <input
                    className={`input-sheypoor text-left ${errors.amount ? "!border-accent-red" : ""}`}
                    value={adform.amount ? sp(adform.amount) : ""}
                    onChange={changeHandler}
                    type="text"
                    name="amount"
                    placeholder="مثلاً ۵,۰۰۰,۰۰۰"
                    dir="ltr"
                  />
                  {errors.amount && <span className="text-accent-red text-body-4 mt-1 block">{errors.amount}</span>}
                </div>
                <div>
                  <label className="block mb-2 text-body-2 font-medium text-dark-1">شهر</label>
                  <input
                    className={`input-sheypoor ${errors.city ? "!border-accent-red" : ""}`}
                    type="text"
                    name="city"
                    value={adform.city}
                    onChange={changeHandler}
                    placeholder="مثلاً تهران"
                  />
                  {errors.city && <span className="text-accent-red text-body-4 mt-1 block">{errors.city}</span>}
                </div>
              </div>
              <div>
                <label className="block mb-2 text-body-2 font-medium text-dark-1">دسته‌بندی</label>
                <select
                  className={`input-sheypoor ${errors.category ? "!border-accent-red" : ""}`}
                  name="category"
                  value={adform.category}
                  onChange={changeHandler}
                >
                  <option value="">انتخاب دسته‌بندی...</option>
                  {data?.map((item) => (
                    <option key={item._id} value={item._id}>{item.name}</option>
                  ))}
                </select>
                {errors.category && <span className="text-accent-red text-body-4 mt-1 block">{errors.category}</span>}
              </div>
              <button type="button" onClick={() => setCurrentStep(2)} className="btn-primary w-full">
                مرحله بعد
              </button>
            </div>
          )}

          {/* Step 2: Image */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="block mb-2 text-body-2 font-medium text-dark-1">عکس آگهی</label>
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={changeHandler}
                />
                <button
                  type="button"
                  onClick={handleClickChooseFile}
                  className="w-full py-8 border-2 border-dashed border-light-0 rounded-sheypoor-lg bg-light-3 hover:bg-light-2 transition-colors flex flex-col items-center justify-center gap-3 text-dark-3"
                >
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="preview" className="w-32 h-32 object-cover rounded-sheypoor" />
                      <span className="text-body-3 text-main font-medium mt-2 block">{selectedImageName}</span>
                    </div>
                  ) : (
                    <>
                      <svg className="h-10 w-10 text-dark-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-body-2">برای انتخاب عکس کلیک کنید</span>
                      <span className="text-body-4 text-dark-4">فرمت مجاز: JPG, PNG - حداکثر ۲ مگابایت</span>
                    </>
                  )}
                </button>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setCurrentStep(1)} className="btn-ghost flex-1 border border-light-0">
                  مرحله قبل
                </button>
                <button type="button" onClick={() => setCurrentStep(3)} className="btn-primary flex-1">
                  مرحله بعد
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-light-3 rounded-sheypoor p-4 space-y-3">
                <h4 className="text-heading-6 text-dark-2 mb-2">خلاصه آگهی شما</h4>
                <div className="flex justify-between text-body-3">
                  <span className="text-dark-3">عنوان:</span>
                  <span className="text-dark-0 font-medium">{adform.title || "—"}</span>
                </div>
                <div className="flex justify-between text-body-3">
                  <span className="text-dark-3">شهر:</span>
                  <span className="text-dark-0 font-medium">{adform.city || "—"}</span>
                </div>
                <div className="flex justify-between text-body-3">
                  <span className="text-dark-3">قیمت:</span>
                  <span className="text-dark-0 font-medium">{adform.amount ? `${sp(adform.amount)} تومان` : "—"}</span>
                </div>
                <div className="flex justify-between text-body-3">
                  <span className="text-dark-3">تصویر:</span>
                  <span className="text-dark-0 font-medium">{selectedImageName || "ندارد"}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setCurrentStep(2)} className="btn-ghost flex-1 border border-light-0">
                  مرحله قبل
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 btn-primary ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      در حال ثبت...
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
