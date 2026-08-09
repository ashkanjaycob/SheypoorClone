/* eslint-disable no-unused-vars */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategory } from "../../Services/Admin";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { PostApi, getAds } from "../../configs/PostApi";
import AdsList from "./AdsList";

function AddAdvertising() {

  const { data, isLoading } = useQuery(["get-category"], getCategory);
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

  const handleClickChooseFile = () => {
    fileInputRef.current.click(); 
  };

  const changeHandler = (event) => {
    const { name, value, type } = event.target;
    if (type === "file") {
      const file = event.target.files[0];
      console.log(file);
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
      setAdform({ ...adform, [name]: value });
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
    if (!adform.amount.trim()) {
      newErrors.amount = "لطفا مبلغ را وارد کنید";
    } else if (isNaN(adform.amount.replace(/,/g, ''))) {
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
      formData.append(i, adform[i]);
    }

    PostApi.post("post/create", formData)
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message || "آگهی با موفقیت ثبت شد!");
          setAdform({
            title: "",
            content: "",
            amount: "",
            city: "",
            category: "",
          });
          setSelectedImageName("");
          setErrors({});
        }
      })
      .catch((error) => {
        toast.error("خطا در ثبت آگهی، لطفا مجددا تلاش کنید");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <>
      <div className="w-full">
        <div className="flex justify-center align-middle">
          <form
            onChange={changeHandler}
            onSubmit={submitAdformHandler}
            className="w-full max-w-2xl flex flex-col text-right bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <h3 className="text-xl font-bold mb-6 text-gray-800">ثبت آگهی جدید</h3>
            
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
                  className={`w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors ${errors.amount ? 'border-red-500' : 'border-gray-300'}`}
                  value={adform.amount}
                  onChange={changeHandler}
                  type="text"
                  name="amount"
                  placeholder="مثلا 5000000"
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
                {data &&
                  data.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
              </select>
              {errors.category && <span className="text-red-500 text-sm mt-1 block">{errors.category}</span>}
            </div>

            <div className="mb-6">
              <label htmlFor="images" className="block mb-2 font-medium text-gray-700">عکس آگهی (اختیاری)</label>
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
                    <span>برای انتخاب عکس کلیک کنید</span>
                    <small className="text-gray-400">فرمت مجاز عکس - حداکثر حجم 2 مگابایت</small>
                  </>
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all ${isSubmitting ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'}`}
            >
              {isSubmitting ? "در حال ثبت آگهی..." : "ایجاد آگهی در شیپور"}
            </button>
          </form>
        </div>
        <Toaster />
      </div>
    </>
  );
}

export default AddAdvertising;
