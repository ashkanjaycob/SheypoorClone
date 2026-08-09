import { useState } from 'react';
import { useQuery, useMutation } from "@tanstack/react-query";
import { delCategory , getCategory } from "../../Services/Admin";
import toast, { Toaster } from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner";

function CategoryDeletionForm() {
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { data , refetch  } = useQuery(["get-categories"], getCategory);

  const mutation = useMutation(delCategory, {
    onSuccess: () => {
      // Refetch the getCategory query after successful deletion
      refetch();
    }
  });
  const handleSelectChange = (event) => {
    setSelectedCategoryId(event.target.value);
    console.log(selectedCategoryId);
  };

  const handleDelete = async () => {
    setIsSubmitted(true);
    if (!selectedCategoryId) {
      toast.error("لطفا یک دسته بندی انتخاب نمایید");
      console.error("Please select a category to delete.");
      return;
    }

    try {
      // Call the mutation function with the selected category ID
      await mutation.mutateAsync(selectedCategoryId);
      console.log('Category deleted successfully');
      toast.success("دسته بندی با موفقیت حذف شد .")
      // You can perform additional actions after successful deletion, such as refetching data
      // Example: refetch();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="w-full tablet:w-3/4 laptop:w-1/2 flex flex-col items-start text-right px-6 py-8 bg-white border border-gray-100 shadow-md rounded-2xl">
      <form className="w-full flex flex-col">
        <h2 className="font-bold w-full text-2xl laptop:text-3xl border-b-2 border-gray-100 pb-4 mb-6 text-red-600">حذف دسته بندی</h2>
      <div className="w-full flex flex-col mb-6">
        <label htmlFor="category" className="mb-2 font-semibold text-gray-700 text-sm laptop:text-base">انتخاب دسته بندی</label>
        <select
          className={`py-3 w-full px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 transition-shadow bg-gray-50 ${isSubmitted && !selectedCategoryId ? "border-red-400" : "border-gray-200"}`}
          name="category"
          id="category"
          value={selectedCategoryId}
          onChange={handleSelectChange}
        >
          <option value="">انتخاب دسته بندی</option>
          {/* Map over the categories data to render options */}
          {data && data.map(category => (
            <option className="w-full" key={category._id} value={category._id}>{category.name}</option>
          ))}
        </select>
        {isSubmitted && !selectedCategoryId && <p className="text-red-500 text-sm mt-2">دسته بندی الزامی است</p>}
      </div>
      <button 
        className="mt-2 w-full text-white bg-red-500 hover:bg-red-600 py-4 rounded-xl transition-colors flex justify-center items-center font-bold text-lg disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg" 
        type="button" // Use type="button" to prevent form submission
        onClick={handleDelete} // Call handleDelete onClick
        disabled={mutation.isLoading}
      >
        {mutation.isLoading ? (
            <ThreeDots
              visible={true}
              height="24"
              width="40"
              color="#ffffff"
              ariaLabel="three-dots-loading"
            />
        ) : "حذف دسته بندی"}
      </button>
      <Toaster />
      </form>
    </div>
  );
}

export default CategoryDeletionForm;
