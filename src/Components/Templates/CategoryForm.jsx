import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { addCategory } from "../../Services/Admin";
import toast, { Toaster } from "react-hot-toast";

function CategoryForm() {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    icon: "",
  });

  const changeHandler = (event) => {
    setForm( {...form , [event.target.name] : event.target.value})
  };


  const { mutate ,  isLoading , error , data} = useMutation(addCategory);
  console.log({isLoading , error , data});


  const submitHandler = (event) => {
    event.preventDefault();

    if ( !form.name || !form.icon || !form.icon) return alert("لطفا مقادیر صحیح وارد کنید") ;
    mutate(form);

    // if ( data.status === 201 ) return toast.success("دسته بندی با موفیقت اضافه شد .")

    console.log(form);    
  };


  return (
    <>
    <div className="container mx-auto">
      <form
      onSubmit={submitHandler}
        onChange={changeHandler}
        className="w-full flex flex-col text-right"
      >
        <h2 className="font-bold desktop:w-[50%] text-[2rem] border-b-4 m-4 py-2">ایجاد دسته بندی</h2>
        <label htmlFor="name">نام دسته بندی</label>
        <input
          className="py-2 desktop:w-[50%] my-3 px-4 border rounded-lg desktop:pl-60 laptop:pl-36 pl-20 focus:outline-none focus:ring focus:border-blue-200"
          type="text"
          name="name"
          id="name"
        />
        <label htmlFor="slug">اسلاگ</label>
        <input
          className="py-2 desktop:w-[50%] my-3 px-4 border rounded-lg desktop:pl-60 laptop:pl-36 pl-20 focus:outline-none focus:ring focus:border-blue-200"
          type="text"
          name="slug"
          id="slug"
        />
        <label htmlFor="icon">آیکون</label>
        <input
          className="py-2 desktop:w-[50%] my-3 px-4 border rounded-lg desktop:pl-60 laptop:pl-36 pl-20 focus:outline-none focus:ring focus:border-blue-200"
          type="text"
          name="icon"
          id="icon"
        />
        <button className="my-4 desktop:w-[50%] text-white bg-blue-400 p-4 rounded-full" type="submit">ایجاد دسته بندی</button>
      </form>
      </div>
      <Toaster />
    </>
  );
}

export default CategoryForm;
