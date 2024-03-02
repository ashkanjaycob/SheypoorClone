import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getmySpecificAd, delmySpecificAd } from "../Services/user";
import { sp } from "../Utils/Numbers";
import toast, { Toaster } from "react-hot-toast";
import { ThreeCircles } from "react-loader-spinner";

const AdPage = () => {
  const { id } = useParams(); // Access the ad ID from URL parameters
  const { data, isFetching } = useQuery(["get-ad-id", id], () =>
    getmySpecificAd(id)
  ); // Passing id as a dependency to the query key
  console.log({ data });

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
      <h2 className="mb-12 font-bold text-blue-600 text-[1.6rem] py-4 border-b-2">
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
              <div className="flex gap-8  items-center justify-between rounded-lg bg-slate-100 p-5 cursor-pointer">
                <div className="flex">
                  <div className="relative overflow-hidden bg-cover bg-no-repeat">
                    <img
                      className="rounded-xl w-[180px] h-[180px]"
                      src={`${import.meta.env.VITE_BASE_URL}${
                        data.post.images[0]
                      }`}
                      alt={data.post.options.title}
                    />
                  </div>
                  <div className="p-6">
                    <div
                      style={{
                        maxWidth: "360px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "wrap",
                      }}
                    >
                      <h5 className="mb-2 text-3xl border-b-2 py-2 font-medium leading-tight text-neutral-800 dark:text-neutral-50">
                        {data.post.options.title}
                      </h5>
                    </div>
                    <div className="flex flex-col">
                      <small className="text-base text-[0.7rem] text-neutral-600 dark:text-neutral-200">
                        {new Date(data.post.createdAt)
                          .toLocaleString("fa-IR")
                          .replace(/,/, "در ساعت")}
                      </small>

                      <small className="text-base text-[0.7rem] text-neutral-600 dark:text-neutral-200">
                        در {data.post.options.city}
                      </small>
                    </div>

                    <p className="flex text-base dark:text-neutral-200">
                      {sp(data.post.amount)}{" "}
                      <img
                        className="w-[22px] mr-2"
                        src="/Toman.svg"
                        alt="آیکون_تومان"
                      />
                    </p>
                  </div>
                </div>

                <div>
                  <button
                    onClick={deleteadHandler}
                    className="bg-red-600 px-10 py-3 rounded-full text-white"
                  >
                    حذف آگهی
                  </button>
                </div>
              </div>
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
