/* eslint-disable no-unused-vars */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { addCategory } from "../../Services/Admin";
import toast, { Toaster } from "react-hot-toast";
import CtegoryList from "./CategoryList";
import CategoryDeletionForm from "./CategoryDeletionForm";


function CategoryForm() {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    icon: "",
  });

  const queryClient = useQueryClient();

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const { mutate, isLoading, error, data } = useMutation(addCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries(["get-categories"]);
    },
  });

  const submitHandler = (event) => {
    event.preventDefault();

    if (!form.name || !form.slug || !form.icon) return toast.error("لطفاً همه مقادیر صحیح را وارد کنید");
    mutate(form);

    if (data?.message === "category created successfully") return toast.success("دسته بندی با موفقیت اضافه شد.");

    setForm({
      name: "",
      slug: "",
      icon: "",
    });
  };

  return (
    <>
      <CtegoryList />
      <div className="container my-14">
        <form
          onSubmit={submitHandler}
          onChange={changeHandler}
          className="w-full desktop:w-1/2 flex flex-col items-start text-right px-4 border-b-2 pb-10"
        >
          <h2 className="font-bold w-full text-[2rem] border-b-4 m-4 py-2">ایجاد دسته بندی</h2>
          {/* Name Input */}
          <div className="relative w-full">
            <label htmlFor="name">نام دسته بندی</label>
            <input
              className="py-2 w-full my-3 px-4 border rounded-lg desktop:pl-60 laptop:pl-36 pl-20 focus:outline-none focus:ring focus:border-blue-200"
              type="text"
              name="name"
              id="name"
            />
            {form.name === "" && <p className="text-red-500 text-sm absolute bottom-5 left-5">نام دسته بندی الزامی است</p>}
          </div>
          {/* Slug Input */}
          <div className="relative w-full">
            <label htmlFor="slug">اسلاگ</label>
            <input
              className="py-2 w-full my-3 px-4 border rounded-lg desktop:pl-60 laptop:pl-36 pl-20 focus:outline-none focus:ring focus:border-blue-200"
              type="text"
              name="slug"
              id="slug"
            />
            {form.slug === "" && <p className="text-red-500 text-sm absolute bottom-5 left-5">اسلاگ الزامی است</p>}
          </div>
          {/* Icon Input */}
          <div className="relative w-full">
            <label htmlFor="icon">آیکون</label>
            <input
              className="py-2 w-full my-3 px-4 border rounded-lg desktop:pl-60 laptop:pl-36 pl-20 focus:outline-none focus:ring focus:border-blue-200"
              type="text"
              name="icon"
              id="icon"
            />
            {form.icon === "" && <p className="text-red-500 text-sm absolute bottom-5 left-5">آیکون الزامی است</p>}
          </div>
          <button className="my-4 w-full text-white bg-blue-400 p-4 rounded-full" type="submit">ایجاد دسته بندی</button>
        </form>

        <CategoryDeletionForm />

      </div>
      <Toaster />
    </>
  );
}

export default CategoryForm;

