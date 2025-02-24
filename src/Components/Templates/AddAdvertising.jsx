/* eslint-disable no-unused-vars */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategory } from "../../Services/Admin";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { PostApi, getAds } from "../../configs/PostApi";
import AdsList from "./AdsList";

function AddAdvertising() {

  const { data, isLoading } = useQuery(["get-category"], getCategory);

  const fileInputRef = useRef(null); 

  const [selectedImageName, setSelectedImageName] = useState(""); 

  const [adform, setAdform] = useState({
    title: "",
    content: "",
    amount: "",
    city: "",
    category: "",
  });

  const handleClickChooseFile = () => {
    fileInputRef.current.click(); 
  };

  const changeHandler = (event) => {
    const { name, value, type } = event.target;
    if (type === "file") {
      const file = event.target.files[0];
      console.log(file);
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          toast.error(
            "فایل انتخاب شده باید حجم کمتری از 2 مگابایت و فرمت jpeg / png داشته باشد."
          );
          event.target.value = null;
          setSelectedImageName("");
        } else {
          setAdform({ ...adform, [name]: file });
          setSelectedImageName(file.name);
        }
      }
    } else {
      setAdform({ ...adform, [name]: value });
    }
  };

  const submitAdformHandler = (event) => {
    event.preventDefault();

    const formData = new FormData();
    for (let i in adform) {
      formData.append(i, adform[i]);
    }

    // ON API DEFINE
    PostApi.post("post/create", formData)
      .then((res) => {
        console.log(res);
        if (res.status === 200) return toast.success(res.data.message);
      })
      .catch((error) => {
        console.log(error);
        toast.error("لطفا فیلد های فرم را پر کنید و مجددا تلاس کنید !!!");
      })
      .finally(() => {
        // Reset form data after submission, regardless of success or failure
        setAdform({
          title: "",
          content: "",
          amount: "",
          city: "",
          category: "",
        });
        setSelectedImageName("");
      });
  };

  return (
    <>
      <div className="container mx-auto px-4">
        <div className="flex justify-center align-middle">
        <form
          onChange={changeHandler}
          onSubmit={submitAdformHandler}
          className="w-full flex flex-col text-right"
        >
          <label htmlFor="title">عنوان آگهی</label>
          <input
            className="py-2 desktop:w-[50%] my-3 px-4 border rounded-lg desktop:pl-60 laptop:pl-36 pl-20 focus:outline-none focus:ring focus:border-blue-200"
            type="text"
            name="title"
            placeholder="مثلا خودرو 206 مدل 1399"
          />
          <label htmlFor="content">توضیحات را وارد نمایید</label>
          <textarea
            className="py-2 desktop:w-[50%] my-3 px-4 border rounded-lg desktop:pl-60 laptop:pl-36 pl-20 focus:outline-none focus:ring focus:border-blue-200"
            name="content"
            cols="20"
            rows="5"
            placeholder="مثلا خودرو کم کارکرد ، بدنه سالم ، دارای بیمه تا یکسال "
          ></textarea>
          <label htmlFor="amount">مبلغ</label>
          <input
            className="py-2 desktop:w-[50%] my-3 px-4 border rounded-lg desktop:pl-60 laptop:pl-36 pl-20 focus:outline-none focus:ring focus:border-blue-200"
            value={adform.amount}
            onInput={changeHandler}
            type="text"
            name="amount"
            placeholder="مثلا 5.000.000 ریال"
          />
          <label htmlFor="city">شهر ایجاد آگهی</label>
          <input
            className="py-2 desktop:w-[50%] my-3 px-4 border rounded-lg desktop:pl-60 laptop:pl-36 pl-20 focus:outline-none focus:ring focus:border-blue-200"
            type="text"
            name="city"
            placeholder="مثلا تهران"
          />
          <label htmlFor="category">دسته بندی</label>

          <select
            className="py-2 desktop:w-[50%] my-3 px-4 border rounded-lg desktop:pl-60 laptop:pl-36 pl-20 focus:outline-none focus:ring focus:border-blue-200"
            name="category"
          >
            <option value="">انتخاب دسته بندی</option>
            {data &&
              data.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
          </select>
          <label htmlFor="images">عکس آگهی (دلخواه)</label>
          <input
            type="file"
            name="images"
            accept="image/*"
            ref={fileInputRef} // Assign the ref to the file input
            style={{ display: "none" }} // Hide the default file input
            onChange={changeHandler}
            className="py-2 desktop:w-[50%] my-3 px-4 border rounded-lg desktop:pl-60 laptop:pl-36 pl-20 focus:outline-none focus:ring focus:border-blue-200"
          />
          <button
            type="button"
            onClick={handleClickChooseFile}
            className="py-2 bg-blue-100 desktop:w-[50%] my-3 px-4 border rounded-lg desktop:pl-60 laptop:pl-36 pl-20 focus:outline-none focus:ring focus:border-blue-200"
          >
            {selectedImageName ? (
              selectedImageName
            ) : (
              <span>
                یک عکس انتخاب کنید
                <small className="px-2">
                  فرمت مجاز عکس - حداکثر حجم 2 مگابایت
                </small>
              </span>
            )}
          </button>

          <button
            type="submit"
            className="my-4 desktop:w-[50%] text-white bg-blue-400 p-4 rounded-full"
          >
            ایجاد آگهی در شیپور
          </button>
        </form>
        </div>
        <hr className="my-8" />
        <div>
          <h2 className="mb-12 font-bold text-blue-600 text-[1.6rem] py-4 border-b-2">
            لیست آگهی های شما
          </h2>
        </div>
        <Toaster />
      </div>
      <div className="container mx-auto">
        <AdsList />
      </div>
    </>
  );
}

export default AddAdvertising;
