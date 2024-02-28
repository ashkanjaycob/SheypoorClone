import { useQuery } from "@tanstack/react-query";
import { delCategory } from "../../Services/Admin";

function CategoryDeletionForm() {


  const { data, isLoading } = useQuery(["get-categories"], delCategory);
  console.log({ data, isLoading });


  const handleSelectChange = (event) => {
    setSelectedCategoryId(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Implement category deletion logic here using the selectedCategoryId state
    console.log('Category ID to delete:', selectedCategoryId);
    // You can send an API request to delete the category based on the selectedCategoryId
    // Example: deleteCategory(selectedCategoryId);
  };

  return (
    <form
      onSubmit={handleSubmit}
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
        {categories.map(category => (
          <option key={category._id} value={category._id}>{category.name}</option>
        ))}
      </select>
      <button className="my-4 desktop:w-[50%] text-white bg-red-400 p-4 rounded-full" type="submit">حذف دسته بندی</button>
    </form>
  );
}

export default CategoryDeletionForm;
