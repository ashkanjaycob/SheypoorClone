/* eslint-disable no-unused-vars */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { addCategory } from "../../Services/Admin";
import toast, { Toaster } from "react-hot-toast";
import CtegoryList from "./CategoryList";
import CategoryDeletionForm from "./CategoryDeletionForm";
import { ThreeDots } from "react-loader-spinner";


function CategoryForm() {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    icon: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const queryClient = useQueryClient();

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const { mutate, isLoading, error, data } = useMutation(addCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries(["get-categories"]);
      toast.success("دسته بندی با موفقیت اضافه شد.");
      setForm({
        name: "",
        slug: "",
        icon: "",
      });
      setIsSubmitted(false);
    },
  });

  const submitHandler = (event) => {
    event.preventDefault();
    setIsSubmitted(true);

    if (!form.name || !form.slug || !form.icon) return toast.error("لطفاً همه مقادیر صحیح را وارد کنید");
    mutate(form);
  };

  return (
    <>
      <CtegoryList />
      <div className="container mx-auto my-14 flex flex-col items-center">
        <form
          onSubmit={submitHandler}
          onChange={changeHandler}
          className="w-full tablet:w-3/4 laptop:w-1/2 flex flex-col items-start text-right px-6 py-8 bg-white border border-gray-100 shadow-md rounded-2xl mb-10"
        >
          <h2 className="font-bold w-full text-2xl laptop:text-3xl border-b-2 border-gray-100 pb-4 mb-6 text-blue-600">ایجاد دسته بندی</h2>
          {/* Name Input */}
          <div className="w-full flex flex-col mb-5">
            <label htmlFor="name" className="mb-2 font-semibold text-gray-700 text-sm laptop:text-base">نام دسته بندی</label>
            <input
              className={`py-3 w-full px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow bg-gray-50 ${isSubmitted && form.name === "" ? "border-red-400" : "border-gray-200"}`}
              type="text"
              name="name"
              id="name"
              value={form.name}
              placeholder="مثال: املاک"
            />
            {isSubmitted && form.name === "" && <p className="text-red-500 text-sm mt-2">نام دسته بندی الزامی است</p>}
          </div>
          {/* Slug Input */}
          <div className="w-full flex flex-col mb-5">
            <label htmlFor="slug" className="mb-2 font-semibold text-gray-700 text-sm laptop:text-base">اسلاگ (انگلیسی)</label>
            <input
              className={`py-3 w-full px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow bg-gray-50 text-left ${isSubmitted && form.slug === "" ? "border-red-400" : "border-gray-200"}`}
              type="text"
              name="slug"
              id="slug"
              value={form.slug}
              placeholder="e.g. real-estate"
              dir="ltr"
            />
            {isSubmitted && form.slug === "" && <p className="text-red-500 text-sm mt-2">اسلاگ الزامی است</p>}
          </div>
          {/* Icon Input */}
          <div className="w-full flex flex-col mb-6">
            <label htmlFor="icon" className="mb-2 font-semibold text-gray-700 text-sm laptop:text-base">نام آیکون</label>
            <input
              className={`py-3 w-full px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow bg-gray-50 text-left ${isSubmitted && form.icon === "" ? "border-red-400" : "border-gray-200"}`}
              type="text"
              name="icon"
              id="icon"
              value={form.icon}
              placeholder="e.g. home"
              dir="ltr"
            />
            {isSubmitted && form.icon === "" && <p className="text-red-500 text-sm mt-2">آیکون الزامی است</p>}
          </div>
          <button 
            className="mt-2 w-full text-white bg-blue-600 hover:bg-blue-700 py-4 rounded-xl transition-colors flex justify-center items-center font-bold text-lg disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
               <ThreeDots
                 visible={true}
                 height="24"
                 width="40"
                 color="#ffffff"
                 ariaLabel="three-dots-loading"
               />
            ) : "ایجاد دسته بندی"}
          </button>
        </form>

        <CategoryDeletionForm />

      </div>
      <Toaster />
    </>
  );
}

export default CategoryForm;

