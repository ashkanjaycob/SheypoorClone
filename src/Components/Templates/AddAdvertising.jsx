import { useQuery } from "@tanstack/react-query";
import { getCategory } from "../../Services/Admin";
import { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function AddAdvertising() {
  const { data, isLoading } = useQuery(["get-category"], getCategory);

  const fileInputRef = useRef(null); // Reference to the file input

  const [selectedImageName, setSelectedImageName] = useState(""); // State to hold the name of the selected image
  const [adform, setAdform] = useState({
    title: "",
    description: "",
    price: "",
    city: "",
    category: "",
  });

  const handleClickChooseFile = () => {
    fileInputRef.current.click(); // Trigger the file input click event when custom button is clicked
  };

  const formatPrice = (value) => {
    // Remove non-digit characters
    let formattedValue = value.replace(/\D/g, "");
    // Remove leading zeros
    formattedValue = formattedValue.replace(/^0+/, "");
    // Prevent negative numbers
    if (formattedValue.length > 0 && formattedValue[0] === "-") {
      formattedValue = formattedValue.substring(1);
    }
    // Separate numbers into groups of three digits
    let parts = [];
    while (formattedValue.length > 3) {
      parts.unshift(formattedValue.slice(-3));
      formattedValue = formattedValue.slice(0, -3);
    }
    parts.unshift(formattedValue);
    // Join parts with Persian thousand separator
    return parts.join(".");
  };

  const changeHandler = (event) => {
    const { name, type } = event.target;
    if (type === "file") {
      const file = event.target.files[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          // If file size exceeds 2MB, display an alert
          toast.error(
            "فایل انتخاب شده باید حجم کمتری از 2 مگابایت و فرمت jpeg / png داشته باشد."
          );
          event.target.value = null; // Reset the file input
          setSelectedImageName(""); // Reset selected image name
        } else {
          // Set the selected file to the state
          setAdform({ ...adform, [name]: file });
          setSelectedImageName(file.name); // Set selected image name
        }
      }
    } else {
      // For other input types, update the state normally
      const { value } = event.target;
      setAdform({ ...adform, [name]: value });
    }
  };

  const submitAdformHandler = (event) => {
    event.preventDefault();
    console.log(adform);
    setAdform({
      title: "",
      description: "",
      price: "",
      city: "null",
      category: "",
      image: null,
    });
  };

  return (
    <>
      <div className="container mx-auto">
        <form
          onChange={changeHandler}
          onSubmit={submitAdformHandler}
          className="w-full flex flex-col  text-right"
        >
          <label htmlFor="title">عنوان آگهی</label>
          <input
            className="py-2 desktop:w-[50%] my-3 px-4 border rounded-lg desktop:pl-60 laptop:pl-36 pl-20 focus:outline-none focus:ring focus:border-blue-200"
            type="text"
            name="title"
            placeholder="مثلا خودرو 206 مدل 1399"
          />
          <label htmlFor="description">توضیحات را وارد نمایید</label>
          <textarea
            className="py-2 desktop:w-[50%] my-3 px-4 border rounded-lg desktop:pl-60 laptop:pl-36 pl-20 focus:outline-none focus:ring focus:border-blue-200"
            name="description"
            cols="20"
            rows="5"
            placeholder="مثلا خودرو کم کارکرد ، بدنه سالم ، دارای بیمه تا یکسال "
          ></textarea>
          <label htmlFor="price">مبلغ</label>
          <input
            className="py-2 desktop:w-[50%] my-3 px-4 border rounded-lg desktop:pl-60 laptop:pl-36 pl-20 focus:outline-none focus:ring focus:border-blue-200"
            value={adform.price}
            onInput={changeHandler}
            type="text"
            name="price"
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
          <label htmlFor="image">عکس آگهی</label>
          <input
            type="file"
            name="image"
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
        <Toaster />
      </div>
    </>
  );
}

export default AddAdvertising;
