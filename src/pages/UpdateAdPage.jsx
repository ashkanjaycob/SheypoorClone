import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategory } from "../Services/Admin";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getmySpecificAd, updateMyAd } from "../Services/user";
import { p2e, sp } from "../Utils/Numbers";
import { t, getSavedLanguage } from "../Utils/i18n";
import { translateCategory } from "../Utils/adTranslator";

function UpdateAdPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: categoryData } = useQuery(["get-categories"], getCategory);
  const { data: adData, isLoading: adLoading } = useQuery(
    ["get-ad-id", id],
    () => getmySpecificAd(id)
  );

  const fileInputRef = useRef(null);
  const [selectedImageName, setSelectedImageName] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
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

  // Populate form once ad data is ready
  useEffect(() => {
    if (adData?.post) {
      const p = adData.post;
      setAdform({
        title: p.options?.title || p.title || "",
        content: p.options?.content || p.content || "",
        amount: p.amount ? String(p.amount) : "0",
        city: p.options?.city || p.city || "",
        category: p.category || p.categoryId || "",
        images: null,
      });
    }
  }, [adData]);

  const handleClickChooseFile = () => {
    if (!isSubmitting) fileInputRef.current.click();
  };

  const changeHandler = (event) => {
    const { name, value, type } = event.target;
    if (type === "file") {
      const file = event.target.files[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          toast.error(currentLang === "fa" ? "فایل باید کمتر از ۲ مگابایت باشد" : "File must be under 2MB");
          event.target.value = null;
          setSelectedImageName("");
          setImagePreview(null);
        } else {
          setAdform((prev) => ({ ...prev, images: file }));
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
      setAdform((prev) => ({ ...prev, [name]: finalValue }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!adform.title.trim()) newErrors.title = currentLang === "fa" ? "لطفاً عنوان آگهی را وارد کنید" : "Please enter title";
    if (!adform.content.trim()) newErrors.content = currentLang === "fa" ? "لطفاً توضیحات آگهی را وارد کنید" : "Please enter description";
    if (!adform.amount.toString().trim()) {
      newErrors.amount = currentLang === "fa" ? "لطفاً مبلغ را وارد کنید (یا ۰ برای توافقی)" : "Please enter price (or 0 for negotiable)";
    }
    if (!adform.city.trim()) newErrors.city = currentLang === "fa" ? "لطفاً شهر را وارد کنید" : "Please enter city";
    if (!adform.category) newErrors.category = currentLang === "fa" ? "لطفاً دسته‌بندی را انتخاب کنید" : "Please select category";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitAdformHandler = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

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
      const res = await updateMyAd(id, formData);
      toast.success(res?.message || (currentLang === "fa" ? "آگهی با موفقیت ویرایش شد" : "Listing updated successfully"));
      queryClient.invalidateQueries(["get-all-ads"]);
      queryClient.invalidateQueries(["get-my-ads"]);
      queryClient.invalidateQueries(["get-ad-id", id]);
      setTimeout(() => navigate(`/dashboard/${id}`), 1200);
    } catch (err) {
      const msg = err.response?.data?.message || (currentLang === "fa" ? "خطا در ویرایش آگهی" : "Error updating listing");
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (adLoading) {
    return (
      <div className="min-h-screen bg-light-3 dark:bg-night-bg flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-main dark:border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-3 dark:bg-night-bg text-dark-0 dark:text-white py-8 transition-colors">
      <div className="max-w-2xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-body-3 text-dark-3 dark:text-gray-400 mb-6">
          <Link to="/" className="hover:text-main dark:hover:text-white transition-colors">{t("home", {}, currentLang)}</Link>
          <svg className="w-4 h-4 text-dark-4 dark:text-gray-600 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link to="/dashboard" className="hover:text-main dark:hover:text-white transition-colors">{t("myAds", {}, currentLang)}</Link>
          <svg className="w-4 h-4 text-dark-4 dark:text-gray-600 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-dark-0 dark:text-white font-medium">{currentLang === "fa" ? "ویرایش آگهی" : "Edit Listing"}</span>
        </nav>

        {/* Card Form */}
        <div className="bg-white dark:bg-night-card rounded-sheypoor-xl p-6 laptop:p-8 border border-light-0 dark:border-night-border shadow-card dark:shadow-card-dark">
          <h1 className="text-heading-3 text-dark-0 dark:text-white font-bold mb-6">
            {currentLang === "fa" ? "ویرایش مشخصات آگهی" : "Edit Listing Specifications"}
          </h1>

          <form onSubmit={submitAdformHandler} className="space-y-5">
            {/* Category */}
            <div>
              <label className="block text-body-2 font-medium text-dark-1 dark:text-gray-200 mb-2">
                {t("categories", {}, currentLang)}
              </label>
              <select
                name="category"
                value={adform.category}
                onChange={changeHandler}
                className={`input-sheypoor ${errors.category ? "!border-accent-red" : ""}`}
              >
                <option value="">{currentLang === "fa" ? "انتخاب دسته‌بندی..." : "Select Category..."}</option>
                {categoryData?.map((cat) => (
                  <option key={cat.slug || cat._id || cat.id} value={cat.slug || cat._id || cat.id}>
                    {translateCategory(cat.slug || cat.name, currentLang) || cat.name}
                  </option>
                ))}
              </select>
              {errors.category && <span className="text-accent-red text-body-4 mt-1 block">{errors.category}</span>}
            </div>

            {/* Title */}
            <div>
              <label className="block text-body-2 font-medium text-dark-1 dark:text-gray-200 mb-2">
                {currentLang === "fa" ? "عنوان آگهی" : "Listing Title"}
              </label>
              <input
                type="text"
                name="title"
                value={adform.title}
                onChange={changeHandler}
                className={`input-sheypoor ${errors.title ? "!border-accent-red" : ""}`}
              />
              {errors.title && <span className="text-accent-red text-body-4 mt-1 block">{errors.title}</span>}
            </div>

            {/* City */}
            <div>
              <label className="block text-body-2 font-medium text-dark-1 dark:text-gray-200 mb-2">
                {currentLang === "fa" ? "شهر و محدوده" : "City / Location"}
              </label>
              <input
                type="text"
                name="city"
                value={adform.city}
                onChange={changeHandler}
                className={`input-sheypoor ${errors.city ? "!border-accent-red" : ""}`}
              />
              {errors.city && <span className="text-accent-red text-body-4 mt-1 block">{errors.city}</span>}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-body-2 font-medium text-dark-1 dark:text-gray-200 mb-2">
                {currentLang === "fa" ? "قیمت (تومان)" : "Price (Tomans)"}
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="amount"
                  dir="ltr"
                  value={adform.amount ? sp(adform.amount) : ""}
                  onChange={changeHandler}
                  className={`input-sheypoor rtl:pl-16 ltr:pr-16 text-left font-mono font-bold ${
                    errors.amount ? "!border-accent-red" : ""
                  }`}
                />
                <span className="absolute rtl:left-4 ltr:right-4 top-1/2 -translate-y-1/2 text-body-3 text-dark-3 dark:text-gray-400">
                  {t("currencyToman", {}, currentLang)}
                </span>
              </div>
              {errors.amount && <span className="text-accent-red text-body-4 mt-1 block">{errors.amount}</span>}
            </div>

            {/* Content */}
            <div>
              <label className="block text-body-2 font-medium text-dark-1 dark:text-gray-200 mb-2">
                {t("description", {}, currentLang)}
              </label>
              <textarea
                name="content"
                rows="4"
                value={adform.content}
                onChange={changeHandler}
                className={`input-sheypoor !h-auto ${errors.content ? "!border-accent-red" : ""}`}
              />
              {errors.content && <span className="text-accent-red text-body-4 mt-1 block">{errors.content}</span>}
            </div>

            {/* Image Replacement */}
            <div>
              <label className="block text-body-2 font-medium text-dark-1 dark:text-gray-200 mb-2">
                {currentLang === "fa" ? "تغییر تصویر آگهی (اختیاری)" : "Replace Image (Optional)"}
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
                className="border-2 border-dashed border-light-0 dark:border-night-border hover:border-main dark:hover:border-white rounded-sheypoor-xl p-5 text-center cursor-pointer bg-light-3 dark:bg-night-surface"
              >
                {imagePreview ? (
                  <div className="flex flex-col items-center gap-2">
                    <img src={imagePreview} alt="Preview" className="w-28 h-28 object-cover rounded-sheypoor shadow" />
                    <span className="text-body-3 text-main dark:text-white font-medium">{selectedImageName}</span>
                  </div>
                ) : (
                  <span className="text-body-3 text-dark-3 dark:text-gray-400">
                    {currentLang === "fa" ? "برای انتخاب تصویر جدید کلیک کنید" : "Click to select a new image"}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Link to={`/dashboard/${id}`} className="btn-outline flex-1 text-center">
                {t("cancel", {}, currentLang)}
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex-1"
              >
                {isSubmitting ? (currentLang === "fa" ? "در حال ذخیره..." : "Saving...") : (currentLang === "fa" ? "ذخیره تغییرات" : "Save Changes")}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default UpdateAdPage;
