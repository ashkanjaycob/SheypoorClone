import { useState } from 'react';
import { useQuery, useMutation } from "@tanstack/react-query";
import { delCategory , getCategory } from "../../Services/Admin";
import toast, { Toaster } from "react-hot-toast";

function CategoryDeletionForm() {
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
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
    <form
      className="w-full flex flex-col items-center text-right"
    >
      <h2 className="font-bold desktop:w-[50%] text-[2rem] border-b-4 m-4 py-2">حذف دسته بندی</h2>
      <label htmlFor="category">انتخاب دسته بندی</label>
      <select
        className="py-2 desktop:w-[50%] my-3 px-4 border rounded-lg desktop:pl-60 laptop:pl-36 pl-20 focus:outline-none focus:ring focus:border-blue-200"
        name="category"
        id="category"
        value={selectedCategoryId}
        onChange={handleSelectChange}
      >
        <option value="">انتخاب دسته بندی</option>
        {/* Map over the categories data to render options */}
        {data && data.map(category => (
          <option key={category._id} value={category._id}>{category.name}</option>
        ))}
      </select>
      <button 
        className="my-4 desktop:w-[50%] text-white bg-red-400 p-4 rounded-full" 
        type="button" // Use type="button" to prevent form submission
        onClick={handleDelete} // Call handleDelete onClick
      >
        حذف دسته بندی
      </button>
      <Toaster />
    </form>
  );
}

export default CategoryDeletionForm;
