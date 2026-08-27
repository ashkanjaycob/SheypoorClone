import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategory } from "../Services/Admin";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getmySpecificAd, updateMyAd } from "../Services/user";
import { p2e, sp } from "../Utils/Numbers";

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
          toast.error("فایل باید کمتر از ۲ مگابایت باشد");
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
    if (!adform.title.trim()) newErrors.title = "لطفاً عنوان آگهی را وارد کنید";
    if (!adform.content.trim()) newErrors.content = "لطفاً توضیحات آگهی را وارد کنید";
    if (!adform.amount.toString().trim()) {
      newErrors.amount = "لطفاً مبلغ را وارد کنید (یا ۰ برای توافقی)";
    }
    if (!adform.city.trim()) newErrors.city = "لطفاً شهر را وارد کنید";
    if (!adform.category) newErrors.category = "لطفاً دسته‌بندی را انتخاب کنید";

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
      toast.success(res?.message || "آگهی با موفقیت ویرایش شد");
      queryClient.invalidateQueries(["get-all-ads"]);
      queryClient.invalidateQueries(["get-my-ads"]);
      queryClient.invalidateQueries(["get-ad-id", id]);
      setTimeout(() => navigate(`/dashboard/${id}`), 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || "خطا در بروزرسانی آگهی");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (adLoading) {
    return (
      <div className="min-h-screen bg-light-3 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-8 h-8 text-main" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-body-2 text-dark-3">در حال بارگذاری اطلاعات آگهی...</span>
        </div>
      </div>
    );
  }

  if (!adData?.post) {
    return (
      <div className="min-h-[70vh] bg-light-3 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-heading-4 text-dark-1 mb-3">آگهی یافت نشد</h2>
        <Link to="/dashboard" className="btn-primary">بازگشت به داشبورد</Link>
      </div>
    );
  }

  const existingImage = adData.post.images?.[0];

  return (
    <div className="min-h-screen bg-light-3 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-heading-3 text-dark-0">ویرایش آگهی</h1>
          <Link to={`/dashboard/${id}`} className="text-body-2 text-main hover:text-main-darker font-medium transition-colors">
            ← بازگشت به آگهی
          </Link>
        </div>

        <form
          onSubmit={submitAdformHandler}
          className="bg-white rounded-sheypoor-xl p-6 laptop:p-8 border border-light-0 shadow-card space-y-5"
        >
          <div>
            <label className="block mb-2 text-body-2 font-medium text-dark-1">عنوان آگهی *</label>
            <input
              className={`input-sheypoor ${errors.title ? "!border-accent-red !ring-accent-red/20" : ""}`}
              type="text"
              name="title"
              disabled={isSubmitting}
              value={adform.title}
              onChange={changeHandler}
              placeholder="عنوان آگهی"
            />
            {errors.title && <span className="text-accent-red text-body-4 mt-1 block">{errors.title}</span>}
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
              placeholder="توضیحات آگهی..."
            />
            {errors.content && <span className="text-accent-red text-body-4 mt-1 block">{errors.content}</span>}
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
                placeholder="مبلغ به تومان"
                dir="ltr"
              />
              {errors.amount && <span className="text-accent-red text-body-4 mt-1 block">{errors.amount}</span>}
            </div>

            <div>
              <label className="block mb-2 text-body-2 font-medium text-dark-1">شهر *</label>
              <input
                className={`input-sheypoor ${errors.city ? "!border-accent-red !ring-accent-red/20" : ""}`}
                type="text"
                name="city"
                disabled={isSubmitting}
                value={adform.city}
                onChange={changeHandler}
                placeholder="شهر / محدوده"
              />
              {errors.city && <span className="text-accent-red text-body-4 mt-1 block">{errors.city}</span>}
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
              {categoryData?.map((item) => (
                <option key={item.id || item._id} value={item.id || item._id}>
                  {item.name}
                </option>
              ))}
            </select>
            {errors.category && <span className="text-accent-red text-body-4 mt-1 block">{errors.category}</span>}
          </div>

          {/* Image Replacement */}
          <div>
            <label className="block mb-2 text-body-2 font-medium text-dark-1">تصویر آگهی</label>
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
              className="w-full py-6 border-2 border-dashed border-light-0 rounded-sheypoor-lg bg-light-3 hover:bg-light-2 hover:border-main/40 transition-all flex flex-col items-center justify-center gap-2 text-dark-3"
            >
              {imagePreview ? (
                <div className="flex flex-col items-center">
                  <img src={imagePreview} alt="new-preview" className="w-28 h-28 object-cover rounded-sheypoor border" />
                  <span className="text-body-3 text-main font-medium mt-2">{selectedImageName}</span>
                </div>
              ) : existingImage ? (
                <div className="flex flex-col items-center">
                  <img
                    src={existingImage.startsWith("http") ? existingImage : `${import.meta.env.VITE_BASE_URL}${existingImage}`}
                    alt="current"
                    className="w-28 h-28 object-cover rounded-sheypoor border"
                  />
                  <span className="text-body-4 text-dark-3 mt-2">برای تغییر عکس کلیک کنید</span>
                </div>
              ) : (
                <>
                  <svg className="h-8 w-8 text-dark-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-body-2">انتخاب عکس جدید</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  در حال ذخیره تغییرات...
                </span>
              ) : (
                "ذخیره تغییرات"
              )}
            </button>
          </div>
        </form>
      </div>
      <Toaster />
    </div>
  );
}

export default UpdateAdPage;
