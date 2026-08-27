/* eslint-disable no-unused-vars */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { addCategory } from "../../Services/Admin";
import toast, { Toaster } from "react-hot-toast";

function CategoryForm() {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    icon: "",
  });
  const [errors, setErrors] = useState({});

  const queryClient = useQueryClient();

  const changeHandler = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const { mutate, isLoading } = useMutation(addCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries(["get-categories"]);
      toast.success("دسته‌بندی با موفقیت افزوده شد");
      setForm({ name: "", slug: "", icon: "" });
      setErrors({});
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "خطا در ایجاد دسته‌بندی");
    },
  });

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "نام دسته‌بندی الزامی است";
    if (!form.slug.trim()) errs.slug = "اسلاگ انگلیسی الزامی است";
    else if (!/^[a-z0-9-]+$/.test(form.slug.trim())) errs.slug = "اسلاگ فقط حروف کوچک انگلیسی و خط تیره مجاز است";
    if (!form.icon.trim()) errs.icon = "نام آیکون الزامی است";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (!validate()) return;
    mutate(form);
  };

  return (
    <div className="bg-white rounded-sheypoor-xl p-6 laptop:p-8 border border-light-0 shadow-card">
      <h2 className="text-heading-4 text-dark-0 mb-6 pb-4 border-b border-light-1">
        ایجاد دسته‌بندی جدید
      </h2>

      <form onSubmit={submitHandler} className="space-y-5">
        <div>
          <label htmlFor="name" className="block mb-2 text-body-2 font-medium text-dark-1">
            نام دسته‌بندی (فارسی) *
          </label>
          <input
            className={`input-sheypoor ${errors.name ? "!border-accent-red !ring-accent-red/20" : ""}`}
            type="text"
            name="name"
            id="name"
            disabled={isLoading}
            value={form.name}
            onChange={changeHandler}
            placeholder="مثال: املاک و مستغلات"
          />
          {errors.name && <span className="text-accent-red text-body-4 mt-1 block">{errors.name}</span>}
        </div>

        <div>
          <label htmlFor="slug" className="block mb-2 text-body-2 font-medium text-dark-1">
            اسلاگ انگلیسی (Slug) *
          </label>
          <input
            className={`input-sheypoor text-left font-mono ${errors.slug ? "!border-accent-red !ring-accent-red/20" : ""}`}
            type="text"
            name="slug"
            id="slug"
            disabled={isLoading}
            value={form.slug}
            onChange={changeHandler}
            placeholder="e.g. real-estate"
            dir="ltr"
          />
          {errors.slug && <span className="text-accent-red text-body-4 mt-1 block">{errors.slug}</span>}
        </div>

        <div>
          <label htmlFor="icon" className="block mb-2 text-body-2 font-medium text-dark-1">
            نام فایل آیکون (SVG) *
          </label>
          <input
            className={`input-sheypoor text-left font-mono ${errors.icon ? "!border-accent-red !ring-accent-red/20" : ""}`}
            type="text"
            name="icon"
            id="icon"
            disabled={isLoading}
            value={form.icon}
            onChange={changeHandler}
            placeholder="e.g. home"
            dir="ltr"
          />
          {errors.icon && <span className="text-accent-red text-body-4 mt-1 block">{errors.icon}</span>}
        </div>

        <button
          className="btn-primary w-full mt-2"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              در حال ایجاد...
            </span>
          ) : (
            "ایجاد دسته‌بندی"
          )}
        </button>
      </form>
      <Toaster />
    </div>
  );
}

export default CategoryForm;
