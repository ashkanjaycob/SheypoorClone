import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { scrapeDivar, getCategory } from "../../Services/Admin";
import toast, { Toaster } from "react-hot-toast";

function ScraperForm() {
  const [form, setForm] = useState({
    url: "",
    categoryId: "",
  });
  const [errors, setErrors] = useState({});

  const queryClient = useQueryClient();
  const { data: categoriesData } = useQuery(["get-categories"], getCategory);

  const { mutate, isLoading } = useMutation(scrapeDivar, {
    onSuccess: (res) => {
      toast.success(res?.message || "انتقال آگهی‌ها با موفقیت انجام شد! 🎉");
      queryClient.invalidateQueries(["get-categories"]);
      queryClient.invalidateQueries(["get-all-ads"]);
      setForm({ url: "", categoryId: "" });
      setErrors({});
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "خطا در برقراری ارتباط با اسکرپر.");
    },
  });

  const changeHandler = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.url.trim()) errs.url = "آدرس صفحه شیپور الزامی است";
    else if (!form.url.startsWith("http")) errs.url = "آدرس اینترنتی معتبر وارد کنید (با http یا https)";
    if (!form.categoryId) errs.categoryId = "انتخاب دسته‌بندی هدف الزامی است";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (!validate()) return;
    mutate(form);
  };

  return (
    <div className="bg-white dark:bg-night-card rounded-sheypoor-xl p-6 laptop:p-8 border border-light-0 dark:border-night-border shadow-card dark:shadow-card-dark transition-colors">
      <div className="flex flex-col laptop:flex-row gap-8 items-center">
        <form onSubmit={submitHandler} className="w-full laptop:w-3/5 space-y-5">
          <div>
            <h3 className="text-heading-4 text-dark-0 dark:text-white font-bold mb-1">اسکرپر و انتقال خودکار آگهی‌ها</h3>
            <p className="text-body-3 text-dark-3 dark:text-gray-400">
              لینک صفحه‌ی دسته‌بندی شیپور را وارد کنید تا آگهی‌های آن مستقیماً در دیتابیس بارگذاری شوند.
            </p>
          </div>

          <div>
            <label htmlFor="url" className="block text-body-2 font-medium text-dark-1 dark:text-gray-200 mb-2">
              آدرس اینترنتی شیپور *
            </label>
            <input
              type="url"
              name="url"
              id="url"
              disabled={isLoading}
              placeholder="https://www.sheypoor.com/s/iran/vehicles"
              className={`input-sheypoor text-left font-mono ${errors.url ? "!border-accent-red !ring-accent-red/20" : ""}`}
              dir="ltr"
              value={form.url}
              onChange={changeHandler}
            />
            {errors.url && <span className="text-accent-red text-body-4 mt-1 block">{errors.url}</span>}
          </div>

          <div>
            <label htmlFor="categoryId" className="block text-body-2 font-medium text-dark-1 dark:text-gray-200 mb-2">
              دسته‌بندی مقصد در سیستم *
            </label>
            <select
              name="categoryId"
              id="categoryId"
              disabled={isLoading}
              className={`input-sheypoor ${errors.categoryId ? "!border-accent-red !ring-accent-red/20" : ""}`}
              value={form.categoryId}
              onChange={changeHandler}
            >
              <option value="">انتخاب دسته‌بندی...</option>
              {categoriesData?.map((i) => (
                <option key={i.id || i._id} value={i.id || i._id}>
                  {i.name} ({i.slug})
                </option>
              ))}
            </select>
            {errors.categoryId && <span className="text-accent-red text-body-4 mt-1 block">{errors.categoryId}</span>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                در حال پردازش و استخراج آگهی‌ها...
              </span>
            ) : (
              "شروع اسکرپ و استخراج"
            )}
          </button>
        </form>

        <div className="w-full laptop:w-2/5 p-6 bg-light-2 dark:bg-night-surface rounded-sheypoor-lg border border-light-0 dark:border-night-border text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-light-special dark:bg-white/10 flex items-center justify-center text-main dark:text-white mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h4 className="text-heading-5 text-dark-0 dark:text-white font-bold mb-2">انتقال سریع اطلاعات</h4>
          <p className="text-body-3 text-dark-3 dark:text-gray-400 leading-6">
            تمامی تصاویر، عناوین، قیمت‌ها و مشخصات به صورت خودکار دانلود و برای کاربران شما در دسترس قرار می‌گیرند.
          </p>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default ScraperForm;
