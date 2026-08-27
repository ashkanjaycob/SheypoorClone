import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { delCategory, getCategory } from "../../Services/Admin";
import toast, { Toaster } from "react-hot-toast";

function CategoryDeletionForm() {
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const { data: categories } = useQuery(["get-categories"], getCategory);

  const mutation = useMutation(delCategory, {
    onSuccess: () => {
      toast.success("دسته‌بندی با موفقیت حذف شد");
      queryClient.invalidateQueries(["get-categories"]);
      setSelectedCategoryId("");
      setError("");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "خطا در حذف دسته‌بندی");
    },
  });

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!selectedCategoryId) {
      setError("لطفاً یک دسته‌بندی را انتخاب کنید");
      toast.error("دسته‌بندی انتخاب نشده است");
      return;
    }

    if (!window.confirm("آیا از حذف این دسته‌بندی اطمینان دارید؟ تمامی آگهی‌های آن ممکن است تحت تاثیر قرار گیرند.")) {
      return;
    }

    mutation.mutate(selectedCategoryId);
  };

  return (
    <div className="bg-white dark:bg-night-card rounded-sheypoor-xl p-6 laptop:p-8 border border-light-0 dark:border-night-border shadow-card dark:shadow-card-dark transition-colors">
      <h2 className="text-heading-4 text-accent-red mb-6 pb-4 border-b border-light-1 dark:border-night-border">
        حذف دسته‌بندی
      </h2>

      <form onSubmit={handleDelete} className="space-y-5">
        <div>
          <label htmlFor="delete-category" className="block mb-2 text-body-2 font-medium text-dark-1 dark:text-gray-200">
            انتخاب دسته‌بندی مورد نظر *
          </label>
          <select
            className={`input-sheypoor ${error ? "!border-accent-red !ring-accent-red/20" : ""}`}
            name="category"
            id="delete-category"
            disabled={mutation.isLoading}
            value={selectedCategoryId}
            onChange={(e) => {
              setSelectedCategoryId(e.target.value);
              if (error) setError("");
            }}
          >
            <option value="">انتخاب دسته‌بندی...</option>
            {categories?.map((category) => (
              <option key={category.id || category._id} value={category.id || category._id}>
                {category.name} ({category.slug})
              </option>
            ))}
          </select>
          {error && <span className="text-accent-red text-body-4 mt-1 block">{error}</span>}
        </div>

        <button
          className="btn-danger w-full mt-2"
          type="submit"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              در حال حذف...
            </span>
          ) : (
            "حذف دسته‌بندی"
          )}
        </button>
      </form>
      <Toaster />
    </div>
  );
}

export default CategoryDeletionForm;
