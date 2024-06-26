/* eslint-disable react/prop-types */
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getmySpecificAd, delmySpecificAd } from "../Services/user";
import { sp } from "../Utils/Numbers";
import toast, { Toaster } from "react-hot-toast";
import { ThreeCircles } from "react-loader-spinner";
import { useState } from "react";
import { HeartIcon, ShareIcon } from "@heroicons/react/outline";
import { UserCircleIcon } from "@heroicons/react/solid";

// eslint-disable-next-line react/prop-types
const AdPage = ({ userdata }) => {
  const { id } = useParams(); // Access the ad ID from URL parameters
  const { data, isFetching } = useQuery(["get-ad-id", id], () =>
    getmySpecificAd(id)
  ); // Passing id as a dependency to the query key
  // console.log({ data });
  // console.log({ userdata });

  const [showFullNumber, setShowFullNumber] = useState(false);

  const toggleShowFullNumber = () => {
    setShowFullNumber(!showFullNumber);
  };

  const deleteadHandler = async () => {
    try {
      await delmySpecificAd(id);
      toast.success("آگهی با موفقیت حذف شد.");
      setTimeout(() => {
        window.location.reload();
      }, 2000); // Reload the window after 2 seconds
    } catch (error) {
      console.error("Error while deleting ad:", error);
      toast.error("مشکلی پیش آمده است!!!");
    }
  };

  return (
    <div className="container mx-auto">
      <h2 className="mb-12 font-bold text-blue-600 text-[1rem] pb-2 border-b-2 px-5">
        نمایش آگهی بارگذاری شده شما
      </h2>
      {isFetching ? (
        <div className="w-full h-full flex items-center justify-center mt-44">
          <ThreeCircles
            visible={true}
            height="60"
            width="60"
            color="#1a90ff"
            ariaLabel="three-circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      ) : (
        <div>
          {data ? ( // Check if data exists
            <div>
              <div className="flex gap-8 items-center justify-between rounded-lg p-5">
                <div className="flex w-full flex-col">
                  <div className="relative bg-zinc-50  rounded-xl p-2 w-full items-center justify-center flex mx-auto overflow-hidden bg-cover bg-no-repeat">
                    <img
                      className=" w-[600px] h-[50vh]"
                      src={`${import.meta.env.VITE_BASE_URL}${
                        data.post.images[0]
                      }`}
                      alt={data.post.options.title}
                    />
                  </div>

                  <div className="flex max-desktop:flex-col flex-row mt-8 ">
                    <div className="max-desktop:w-full w-4/6 max-desktop:border-b-4">
                      <div className="flex justify-between">
                        <div
                          style={{
                            maxWidth: "360px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "wrap",
                          }}
                        >
                          <div className="mb-2">
                            <h5 className="mb-2 text-2xl py-2 font-medium leading-tight text-neutral-800 ">
                              {data.post.options.title}
                            </h5>
                            <p className="flex text-[18px]">
                              {sp(data.post.amount)}{" "}
                              <img
                                className="w-[24px] mr-2"
                                src="/Toman.svg"
                                alt="آیکون_تومان"
                              />
                            </p>
                          </div>
                        </div>

                        <div className="w-24">
                          <div className="flex items-center justify-center">
                            <ShareIcon className="bg-slate-50 w-24 p-2 rounded cursor-pointer" />
                            <span className="mx-1">|</span>
                            <HeartIcon className="bg-slate-50 w-24 p-2 rounded cursor-pointer" />
                          </div>
                          <br />
                          <small className="text-base py-4 text-[0.7rem] text-neutral-600 ">
                            در {data.post.options.city}
                          </small>
                        </div>
                      </div>

                      <hr className="my-2" />
                      <div
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "wrap",
                        }}
                      >
                        <h5 className="mb-2 leading-loose text-neutral-800">
                          {data.post.options.content
                            .split("\r\n")
                            .map((line, index) => (
                              <div key={index}>{line}</div>
                            ))}
                        </h5>
                      </div>

                      <div className="flex flex-col">
                        <small className="text-base border-b-2 py-2 text-[0.7rem] text-neutral-600">
                          تاریخ :
                          {new Date(data.post.createdAt)
                            .toLocaleString("fa-IR")
                            .replace(/,/, "|")}
                        </small>
                      </div>

                      <div>
                        <div className="p-4 flex justify-between">
                          <small className="px-6 text-xl">
                            شماره تماس تایید شده :
                          </small>
                          <span
                            onClick={toggleShowFullNumber}
                            className=" hover:text-blue-600 text-[18px] cursor-pointer"
                          >
                            {showFullNumber ? (
                              data.post.userMobile // Display full number if showFullNumber is true
                            ) : (
                              <span>
                                {/* Display partial number and provide onClick handler to toggle showFullNumber */}
                                {data.post.userMobile.replace(
                                  /^(\d{4})(\d{4})/,
                                  "$1********"
                                )}{" "}
                                (نمایش کامل)
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="max-desktop:w-full w-2/6 text-center border-2 border-gray-100 rounded-xl mt-4 mx-2 h-[40vh]">
                      <div className="flex justify-center items-center flex-col pt-6">
                        <UserCircleIcon className="w-[4rem] text-gray-300" />
                        <h3 className="text-gray-500">کاربر شیپور</h3>
                        <br />
                        <Link
                          to="/"
                          className="mt-6 border-2 w-5/6 rounded-full bg-blue-500 text-white py-3"
                        >
                          مشاهده سایر آگهی ها
                        </Link>
                        <button className="mt-6 border-2 w-5/6 rounded-full bg-white text-blue-600 py-3">
                          چت با کاربر شیپور
                        </button>
                      </div>

                      <div className="flex justify-center items-center flex-col py-16">
                        {userdata && userdata.role === "ADMIN" ? (
                          <div>
                            دسترسی ادمین :
                            <button
                              onClick={deleteadHandler}
                              className="bg-red-600 px-10 py-3 rounded-full text-white"
                            >
                              حذف آگهی
                            </button>
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* {userdata.role === "ADMIN" ? (
                <div>
                  <button
                    onClick={deleteadHandler}
                    className="bg-red-600 px-10 py-3 rounded-full text-white"
                  >
                    حذف آگهی
                  </button>
                </div>
              ) : (
                <div></div>
              )} */}
            </div>
          ) : (
            <div className="text-center">
              <p className="mb-12 font-bold text-red-600 text-[1.6rem] py-2">
                آگهی شما یافت نشد . لطفا به صفحه داشبورد خود بازگردید .
              </p>
              <Link
                className="bg-blue-500 px-10 py-3 rounded-full text-white"
                to="/dashboard"
              >
                بازگشت
              </Link>
              <br />
              <br />
            </div>
          )}
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default AdPage;
