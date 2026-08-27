import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategory } from "../../Services/Admin";
import { useRef, useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { PostApi } from "../../configs/PostApi";
import { p2e, sp } from "../../Utils/Numbers";
import { t, getSavedLanguage } from "../../Utils/i18n";
import { translateCategory } from "../../Utils/adTranslator";

function AddAdvertising() {
  const queryClient = useQueryClient();
  const { data: categories } = useQuery(["get-categories"], getCategory);
  const fileInputRef = useRef(null);
  const [selectedImageName, setSelectedImageName] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [currentLang, setCurrentLang] = useState(getSavedLanguage());

  useEffect(() => {
    const handleLangChange = (e) => setCurrentLang(e.detail || getSavedLanguage());
    window.addEventListener("sheypoor_lang_changed", handleLangChange);
    return () => window.removeEventListener("sheypoor_lang_changed", handleLangChange);
  }, []);

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
          toast.error(currentLang === "fa" ? "حجم فایل باید کمتر از ۲ مگابایت باشد" : "File size must be under 2MB");
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
      newErrors.title = currentLang === "fa" ? "لطفاً عنوان آگهی را وارد کنید" : "Please enter listing title";
    } else if (adform.title.trim().length < 3) {
      newErrors.title = currentLang === "fa" ? "عنوان باید حداقل ۳ حرف باشد" : "Title must be at least 3 chars";
    }

    if (!adform.content.trim()) {
      newErrors.content = currentLang === "fa" ? "لطفاً توضیحات کامل آگهی را وارد کنید" : "Please enter listing description";
    } else if (adform.content.trim().length < 5) {
      newErrors.content = currentLang === "fa" ? "توضیحات باید حداقل ۵ حرف باشد" : "Description must be at least 5 chars";
    }

    if (!adform.amount.toString().trim()) {
      newErrors.amount = currentLang === "fa" ? "لطفاً مبلغ را وارد کنید (یا ۰ برای توافقی)" : "Please enter price (or 0 for negotiable)";
    }

    if (!adform.city.trim()) {
      newErrors.city = currentLang === "fa" ? "لطفاً شهر یا محدوده را وارد کنید" : "Please enter city / location";
    }

    if (!adform.category) {
      newErrors.category = currentLang === "fa" ? "لطفاً دسته‌بندی را انتخاب کنید" : "Please select category";
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
        toast.success(res.data.message || (currentLang === "fa" ? "آگهی شما با موفقیت ثبت شد! 🎉" : "Listing published successfully! 🎉"));
        queryClient.invalidateQueries(["get-all-ads"]);
        queryClient.invalidateQueries(["get-my-ads"]);
        // Reset form
        setAdform({
          title: "",
          content: "",
          amount: "",
          city: "",
          category: "",
          images: null,
        });
        setSelectedImageName("");
        setImagePreview(null);
        setCurrentStep(1);
      }
    } catch (err) {
      const msg = err.response?.data?.message || (currentLang === "fa" ? "خطا در ثبت آگهی، لطفاً مجدداً تلاش کنید" : "Error publishing listing");
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-night-card rounded-sheypoor-xl p-6 laptop:p-8 border border-light-0 dark:border-night-border shadow-card dark:shadow-card-dark transition-colors">
      {/* Title & Progress Bar */}
      <div className="mb-8">
        <h2 className="text-heading-3 text-dark-0 dark:text-white font-bold mb-2">
          {t("postAd", {}, currentLang)}
        </h2>
        <p className="text-body-3 text-dark-3 dark:text-gray-400">
          {currentLang === "fa"
            ? "آگهی شما پس از بررسی در کوتاه‌ترین زمان در شیپور منتشر خواهد شد."
            : "Your listing will be published immediately after review."}
        </p>

        {/* 2-Step Progress Indicator */}
        <div className="flex items-center gap-3 mt-6">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-body-3 transition-colors ${
              currentStep === 1 ? "bg-main dark:bg-white text-white dark:text-black shadow-sm" : "bg-accent-green text-white"
            }`}>
              {currentStep > 1 ? "✓" : "۱"}
            </div>
            <span className={`text-body-3 font-medium ${currentStep === 1 ? "text-dark-0 dark:text-white font-semibold" : "text-dark-3 dark:text-gray-400"}`}>
              {currentLang === "fa" ? "اطلاعات اصلی آگهی" : "Main Details"}
            </span>
          </div>

          <div className="flex-grow h-0.5 bg-light-1 dark:bg-night-border max-w-[80px]" />

          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-body-3 transition-colors ${
              currentStep === 2 ? "bg-main dark:bg-white text-white dark:text-black shadow-sm" : "bg-light-2 dark:bg-night-surface text-dark-3 dark:text-gray-400"
            }`}>
              ۲
            </div>
            <span className={`text-body-3 font-medium ${currentStep === 2 ? "text-dark-0 dark:text-white font-semibold" : "text-dark-3 dark:text-gray-400"}`}>
              {currentLang === "fa" ? "تصویر و انتشار" : "Image & Publish"}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={submitAdformHandler} className="space-y-6">
        {/* ===== STEP 1: Main Details ===== */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-fade-in">
            {/* Category Select */}
            <div>
              <label htmlFor="category" className="block text-body-2 font-medium text-dark-1 dark:text-gray-200 mb-2">
                {t("categories", {}, currentLang)} <span className="text-accent-red">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={adform.category}
                onChange={changeHandler}
                className={`input-sheypoor ${errors.category ? "!border-accent-red !ring-accent-red/20" : ""}`}
              >
                <option value="">{currentLang === "fa" ? "انتخاب دسته‌بندی..." : "Select Category..."}</option>
                {categories?.map((cat) => (
                  <option key={cat.slug || cat._id || cat.id} value={cat.slug || cat._id || cat.id}>
                    {translateCategory(cat.slug || cat.name, currentLang) || cat.name}
                  </option>
                ))}
              </select>
              {errors.category && <span className="text-accent-red text-body-4 mt-1.5 block">{errors.category}</span>}
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-body-2 font-medium text-dark-1 dark:text-gray-200 mb-2">
                {currentLang === "fa" ? "عنوان آگهی" : "Listing Title"} <span className="text-accent-red">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder={currentLang === "fa" ? "مثال: پژو ۲۰۶ تیپ ۵ مدل ۱۳۹۹ تمیز" : "Example: iPhone 15 Pro Max 256GB Like New"}
                value={adform.title}
                onChange={changeHandler}
                className={`input-sheypoor ${errors.title ? "!border-accent-red !ring-accent-red/20" : ""}`}
              />
              {errors.title && <span className="text-accent-red text-body-4 mt-1.5 block">{errors.title}</span>}
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="block text-body-2 font-medium text-dark-1 dark:text-gray-200 mb-2">
                {currentLang === "fa" ? "شهر و محدوده" : "City / Location"} <span className="text-accent-red">*</span>
              </label>
              <input
                type="text"
                id="city"
                name="city"
                placeholder={currentLang === "fa" ? "مثال: تهران، سعادت آباد" : "Example: Tehran, Saadat Abad"}
                value={adform.city}
                onChange={changeHandler}
                className={`input-sheypoor ${errors.city ? "!border-accent-red !ring-accent-red/20" : ""}`}
              />
              {errors.city && <span className="text-accent-red text-body-4 mt-1.5 block">{errors.city}</span>}
            </div>

            {/* Amount / Price */}
            <div>
              <label htmlFor="amount" className="block text-body-2 font-medium text-dark-1 dark:text-gray-200 mb-2">
                {currentLang === "fa" ? "قیمت (تومان)" : "Price (Tomans)"} <span className="text-accent-red">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="amount"
                  name="amount"
                  placeholder="0"
                  dir="ltr"
                  value={adform.amount ? sp(adform.amount) : ""}
                  onChange={changeHandler}
                  className={`input-sheypoor rtl:pl-16 ltr:pr-16 text-left font-mono font-bold ${
                    errors.amount ? "!border-accent-red !ring-accent-red/20" : ""
                  }`}
                />
                <span className="absolute rtl:left-4 ltr:right-4 top-1/2 -translate-y-1/2 text-body-3 text-dark-3 dark:text-gray-400 font-sans">
                  {t("currencyToman", {}, currentLang)}
                </span>
              </div>
              {errors.amount && <span className="text-accent-red text-body-4 mt-1.5 block">{errors.amount}</span>}
            </div>

            {/* Content / Description */}
            <div>
              <label htmlFor="content" className="block text-body-2 font-medium text-dark-1 dark:text-gray-200 mb-2">
                {t("description", {}, currentLang)} <span className="text-accent-red">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                rows="4"
                placeholder={currentLang === "fa" ? "جزییات، مشخصات فنی و شرایط معامله را شرح دهید..." : "Describe the item specifications and condition..."}
                value={adform.content}
                onChange={changeHandler}
                className={`input-sheypoor !h-auto ${errors.content ? "!border-accent-red !ring-accent-red/20" : ""}`}
              />
              {errors.content && <span className="text-accent-red text-body-4 mt-1.5 block">{errors.content}</span>}
            </div>

            <button
              type="button"
              onClick={handleNextToStep2}
              className="btn-primary w-full"
            >
              {currentLang === "fa" ? "ادامه و افزودن تصویر ←" : "Continue to Photos →"}
            </button>
          </div>
        )}

        {/* ===== STEP 2: Image & Review ===== */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            {/* File Upload Box */}
            <div>
              <label className="block text-body-2 font-medium text-dark-1 dark:text-gray-200 mb-2">
                {currentLang === "fa" ? "تصویر آگهی (اختیاری)" : "Listing Image (Optional)"}
              </label>
              <input
                ref={fileInputRef}
                type="file"
                name="images"
                accept="image/png, image/jpeg, image/webp"
                onChange={changeHandler}
                className="hidden"
              />

              <div
                onClick={handleClickChooseFile}
                className={`border-2 border-dashed rounded-sheypoor-xl p-6 text-center cursor-pointer transition-all ${
                  imagePreview
                    ? "border-main dark:border-white bg-light-special dark:bg-night-surface"
                    : "border-light-0 dark:border-night-border hover:border-main dark:hover:border-white bg-light-3 dark:bg-night-surface"
                }`}
              >
                {imagePreview ? (
                  <div className="flex flex-col items-center gap-3">
                    <img src={imagePreview} alt="Preview" className="w-36 h-36 object-cover rounded-sheypoor shadow-md" />
                    <span className="text-body-3 text-main dark:text-white font-medium">
                      {selectedImageName} (برای تغییر کلیک کنید)
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-light-2 dark:bg-night-card flex items-center justify-center text-dark-3 dark:text-gray-400">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-body-2 font-medium text-dark-1 dark:text-white">
                      {currentLang === "fa" ? "انتخاب تصویر برای آگهی" : "Select image for listing"}
                    </span>
                    <span className="text-body-4 text-dark-3 dark:text-gray-400">
                      PNG, JPG, WEBP (Max 2MB)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Summary Review */}
            <div className="bg-light-2 dark:bg-night-surface rounded-sheypoor p-4 space-y-2 text-body-3 border border-light-1 dark:border-night-border">
              <div className="flex justify-between">
                <span className="text-dark-3 dark:text-gray-400">{currentLang === "fa" ? "عنوان:" : "Title:"}</span>
                <span className="font-semibold text-dark-0 dark:text-white">{adform.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-3 dark:text-gray-400">{currentLang === "fa" ? "قیمت:" : "Price:"}</span>
                <span className="font-semibold text-dark-0 dark:text-white">{adform.amount ? sp(adform.amount) : "0"} {t("currencyToman", {}, currentLang)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-3 dark:text-gray-400">{currentLang === "fa" ? "شهر:" : "Location:"}</span>
                <span className="font-semibold text-dark-0 dark:text-white">{adform.city}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                disabled={isSubmitting}
                className="btn-outline flex-1"
              >
                {currentLang === "fa" ? "← ویرایش اطلاعات" : "← Edit Details"}
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
                    {currentLang === "fa" ? "در حال ثبت..." : "Publishing..."}
                  </span>
                ) : (
                  currentLang === "fa" ? "ثبت و انتشار آگهی 🎉" : "Publish Listing 🎉"
                )}
              </button>
            </div>
          </div>
        )}
      </form>
      <Toaster />
    </div>
  );
}

export default AddAdvertising;
