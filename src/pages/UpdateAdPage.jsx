import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategory } from "../Services/Admin";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getmySpecificAd, updateMyAd } from "../Services/user";
import { p2e, sp } from "../Utils/Numbers";
import { ThreeCircles } from "react-loader-spinner";

function UpdateAdPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: categoryData, isLoading: categoryLoading } = useQuery(["get-category"], getCategory);
  
  const { data: adData, isFetching: adLoading } = useQuery(["get-ad-id", id], () => getmySpecificAd(id), {
    staleTime: 0,
    cacheTime: 0
  });

  const fileInputRef = useRef(null); 
  const [selectedImageName, setSelectedImageName] = useState(""); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [adform, setAdform] = useState({
    title: "",
    content: "",
    amount: "",
    city: "",
    category: "",
  });

  // Populate form when ad data is loaded
  useEffect(() => {
    if (adData && adData.post) {
      setAdform({
        title: adData.post.options.title || "",
        content: adData.post.options.content || "",
        amount: adData.post.amount ? adData.post.amount.toString() : "",
        city: adData.post.options.city || "",
        category: adData.post.category || "",
      });
    }
  }, [adData]);

  const handleClickChooseFile = () => {
    fileInputRef.current.click(); 
  };

  const changeHandler = (event) => {
    const { name, value, type } = event.target;
    if (type === "file") {
      const file = event.target.files[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          toast.error(
            "فایل انتخاب شده باید حجم کمتری از 2 مگابایت و فرمت jpeg / png داشته باشد."
          );
          event.target.value = null;
          setSelectedImageName("");
        } else {
          setAdform({ ...adform, [name]: file });
          setSelectedImageName(file.name);
        }
      }
    } else {
      let finalValue = value;
      if (name === "amount") {
        // Convert to english digits and strip all non-digit characters (like commas)
        finalValue = p2e(value).replace(/\D/g, "");
      }
      setAdform({ ...adform, [name]: finalValue });
      // Clear error for this field when user types
      if (errors[name]) {
        setErrors({ ...errors, [name]: "" });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!adform.title.trim()) newErrors.title = "لطفا عنوان آگهی را وارد کنید";
    if (!adform.content.trim()) newErrors.content = "لطفا توضیحات آگهی را وارد کنید";
    if (!adform.amount.toString().trim()) {
      newErrors.amount = "لطفا مبلغ را وارد کنید";
    } else if (isNaN(adform.amount.toString().replace(/,/g, ''))) {
      newErrors.amount = "مبلغ باید به صورت عددی باشد";
    }
    if (!adform.city.trim()) newErrors.city = "لطفا شهر را وارد کنید";
    if (!adform.category) newErrors.category = "لطفا یک دسته‌بندی انتخاب کنید";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitAdformHandler = (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const formData = new FormData();
    for (let i in adform) {
      if (adform[i] !== undefined && adform[i] !== null && adform[i] !== "") {
          formData.append(i, adform[i]);
      }
    }

    updateMyAd(id, formData)
      .then((res) => {
        toast.success(res?.message || "آگهی با موفقیت بروزرسانی شد!");
        // Invalidate queries so that lists update
        queryClient.invalidateQueries(["get-my-ads"]);
        queryClient.invalidateQueries(["get-ad-id", id]);
        
        setTimeout(() => {
          navigate(`/dashboard/${id}`);
        }, 1500);
      })
      .catch((error) => {
        toast.error("خطا در بروزرسانی آگهی، لطفا مجددا تلاش کنید");
        console.error(error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (adLoading || categoryLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center mt-44">
        <ThreeCircles
          visible={true}
          height="60"
          width="60"
          color="#1a90ff"
          ariaLabel="three-circles-loading"
        />
      </div>
    );
  }

  if (!adData || !adData.post) {
    return (
      <div className="container mx-auto">
        <div className="text-center mt-32">
          <p className="mb-12 font-bold text-red-600 text-[1.6rem] py-2">
            آگهی یافت نشد.
          </p>
          <Link
            className="bg-blue-500 px-10 py-3 rounded-full text-white"
            to="/dashboard"
          >
            بازگشت به داشبورد
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 border-b-2 pb-4">
        <h2 className="font-bold text-blue-600 text-xl laptop:text-2xl">
          ویرایش آگهی
        </h2>
        <Link
          className="text-blue-500 hover:text-blue-700 font-bold"
          to={`/dashboard/${id}`}
        >
          بازگشت به آگهی
        </Link>
      </div>

      <div className="flex justify-center align-middle">
        <form
          onChange={changeHandler}
          onSubmit={submitAdformHandler}
          className="w-full max-w-2xl flex flex-col text-right bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2 font-medium text-gray-700">عنوان آگهی</label>
            <input
              className={`w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              type="text"
              name="title"
              value={adform.title}
              onChange={changeHandler}
              placeholder="مثلا خودرو 206 مدل 1399"
            />
            {errors.title && <span className="text-red-500 text-sm mt-1 block">{errors.title}</span>}
          </div>

          <div className="mb-4">
            <label htmlFor="content" className="block mb-2 font-medium text-gray-700">توضیحات</label>
            <textarea
              className={`w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors ${errors.content ? 'border-red-500' : 'border-gray-300'}`}
              name="content"
              value={adform.content}
              onChange={changeHandler}
              rows="4"
              placeholder="مثلا خودرو کم کارکرد ، بدنه سالم ، دارای بیمه تا یکسال"
            ></textarea>
            {errors.content && <span className="text-red-500 text-sm mt-1 block">{errors.content}</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="amount" className="block mb-2 font-medium text-gray-700">مبلغ (تومان)</label>
              <input
                className={`w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors ${errors.amount ? 'border-red-500' : 'border-gray-300'} text-left dir-ltr`}
                value={adform.amount ? sp(adform.amount.toString()) : ""}
                onChange={changeHandler}
                type="text"
                name="amount"
                placeholder="مثلا 5,000,000"
                dir="ltr"
              />
              {errors.amount && <span className="text-red-500 text-sm mt-1 block">{errors.amount}</span>}
            </div>
            
            <div>
              <label htmlFor="city" className="block mb-2 font-medium text-gray-700">شهر</label>
              <input
                className={`w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                type="text"
                name="city"
                value={adform.city}
                onChange={changeHandler}
                placeholder="مثلا تهران"
              />
              {errors.city && <span className="text-red-500 text-sm mt-1 block">{errors.city}</span>}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="block mb-2 font-medium text-gray-700">دسته بندی</label>
            <select
              className={`w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors ${errors.category ? 'border-red-500' : 'border-gray-300'} bg-white`}
              name="category"
              value={adform.category}
              onChange={changeHandler}
            >
              <option value="">انتخاب دسته‌بندی...</option>
              {categoryData &&
                categoryData.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
            </select>
            {errors.category && <span className="text-red-500 text-sm mt-1 block">{errors.category}</span>}
          </div>

          <div className="mb-6">
            <label htmlFor="images" className="block mb-2 font-medium text-gray-700">عکس آگهی (در صورت انتخاب عکس جدید، جایگزین عکس قبلی می‌شود)</label>
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
              className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center gap-2 text-gray-600"
            >
              {selectedImageName ? (
                <span className="font-medium text-blue-600">{selectedImageName}</span>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>برای انتخاب عکس جدید کلیک کنید</span>
                  <small className="text-gray-400">در صورت عدم انتخاب، عکس قبلی حفظ می‌شود.</small>
                </>
              )}
            </button>
            {adData.post.images && adData.post.images[0] && !selectedImageName && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">عکس فعلی:</p>
                <img 
                  src={adData.post.images[0]?.startsWith("http") ? adData.post.images[0] : `${import.meta.env.VITE_BASE_URL}${adData.post.images[0]}`}
                  alt="عکس فعلی آگهی" 
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all ${isSubmitting ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'}`}
          >
            {isSubmitting ? "در حال بروزرسانی..." : "بروزرسانی آگهی"}
          </button>
        </form>
      </div>
      <Toaster />
    </div>
  );
}

export default UpdateAdPage;
