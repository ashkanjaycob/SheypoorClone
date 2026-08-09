import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { scrapeDivar, getCategory } from "../../Services/Admin";
import toast, { Toaster } from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner";

function ScraperForm() {
  const [form, setForm] = useState({
    url: "",
    categoryId: "",
  });

  const queryClient = useQueryClient();
  const { data: categoriesData } = useQuery(["get-category"], getCategory);

  const { mutate, isLoading } = useMutation(scrapeDivar, {
    onSuccess: (res) => {
      toast.success(res?.message || "اسکرپ با موفقیت انجام شد.");
      queryClient.invalidateQueries("get-category");
      queryClient.invalidateQueries("get-all-ads");
      setForm({ url: "", categoryId: "" });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "مشکلی پیش آمده است.");
    },
  });

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (!form.url || !form.categoryId) {
      toast.error("لطفا آدرس شیپور و دسته‌بندی را وارد کنید.");
      return;
    }
    mutate(form);
  };

  return (
    <div className="w-full flex flex-col md:flex-row mt-12 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <form
        onSubmit={submitHandler}
        className="w-full md:w-1/2 p-8 flex flex-col justify-center"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-6">اسکرپر شیپور</h3>
        <p className="text-sm text-gray-500 mb-6">آدرس صفحه دسته‌بندی شیپور را وارد کنید تا ۲۰ آگهی آخر اسکرپ شود.</p>

        <div className="mb-5">
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            آدرس شیپور
          </label>
          <input
            type="url"
            name="url"
            id="url"
            placeholder="مثال: https://www.sheypoor.com/s/iran/vehicles"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dir-ltr text-left"
            value={form.url}
            onChange={changeHandler}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
            دسته‌بندی هدف
          </label>
          <select
            name="categoryId"
            id="categoryId"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
            value={form.categoryId}
            onChange={changeHandler}
          >
            <option value="">انتخاب کنید...</option>
            {categoriesData?.map((i) => (
              <option key={i.id || i._id} value={i.id || i._id}>
                {i.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center h-[52px]"
        >
          {isLoading ? (
            <ThreeDots
              visible={true}
              height="40"
              width="40"
              color="#ffffff"
              ariaLabel="three-dots-loading"
            />
          ) : (
            "شروع اسکرپ"
          )}
        </button>
        <Toaster />
      </form>

      <div className="hidden md:flex w-1/2 bg-gray-50 p-8 items-center justify-center border-r border-gray-100">
        <div className="text-center">
          <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
          <h4 className="text-lg font-bold text-gray-700 mb-2">انتقال خودکار آگهی‌ها</h4>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
            با وارد کردن لینک شیپور، آخرین آگهی‌های آن دسته به همراه عکس و مشخصات مستقیما وارد سایت شما می‌شود.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ScraperForm;
