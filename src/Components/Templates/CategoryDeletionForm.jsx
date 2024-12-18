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
      className="w-full desktop:w-1/2 flex flex-col items-start text-right p-4"
    >
      <h2 className="font-bold w-full text-[2rem] border-b-4 m-4 py-2">حذف دسته بندی</h2>
      <label htmlFor="category">انتخاب دسته بندی</label>
      <select
        className="py-2 w-full my-3 px-4 border rounded-lg desktop:pl-60 laptop:pl-36 pl-20 focus:outline-none focus:ring focus:border-blue-200"
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
      <button 
        className="my-4 w-full text-white bg-red-400 p-4 rounded-full" 
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
