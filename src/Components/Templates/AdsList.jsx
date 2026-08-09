/* eslint-disable react/no-unknown-property */
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getmyAds } from "../../Services/user";
import { sp } from "../../Utils/Numbers";
import { Link } from "react-router-dom";
import { ThreeCircles } from "react-loader-spinner";

function AdsList() {
  const { data, isLoading } = useQuery(["get-my-ads"], getmyAds);

  const [displayCount, setDisplayCount] = useState(12);

  const handleLoadMore = () => {
    // Increase the display count by 6 each time the user clicks "Load More"
    setDisplayCount(displayCount + 6);
  };

  return (
    <>
      <div>
        {isLoading ? (
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
        ) : !data?.posts || data.posts.length === 0 ? (
          <div className="w-full py-16 flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              شما هنوز هیچ آگهی ثبت نکرده‌اید!
            </h3>
            <p className="text-gray-500">
              اولین آگهی خود را از فرم بالا ثبت کنید.
            </p>
          </div>
        ) : (
          <>
            <div className="w-full grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-4 desktop:grid-cols-4 gap-4">
              {data.posts.slice(0, displayCount).map((post) => (
                <Link
                  key={post._id}
                  to={`/dashboard/${post._id}`}
                  className="block transition-transform hover:-translate-y-1"
                >
                  <div className="flex flex-col h-full rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <div className="relative w-full pt-[75%] bg-gray-100">
                      <img
                        className="absolute top-0 left-0 w-full h-full object-cover"
                        src={post.images[0]?.startsWith("http") ? post.images[0] : `${import.meta.env.VITE_BASE_URL}${post.images[0]}`}
                        alt={post.options.title || "تصویر آگهی"}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/400x300?text=No+Image";
                        }}
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-grow justify-between text-right">
                      <div>
                        <h5
                          className="text-lg font-bold text-gray-800 mb-2 line-clamp-2"
                          title={post.options.title}
                        >
                          {post.options.title}
                        </h5>
                      </div>
                      <div className="mt-4">
                        <p className="flex items-center text-blue-600 font-semibold mb-1">
                          {sp(post.amount)}{" "}
                          <span className="text-sm mr-1 text-gray-500">
                            تومان
                          </span>
                        </p>
                        <p className="text-sm text-gray-500">
                          در {post.options.city}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {data.posts.length > displayCount && (
              <div className="flex justify-center mt-8 w-full">
                <button
                  onClick={handleLoadMore}
                  className="text-blue-600 border-2 border-blue-600 hover:bg-blue-50 font-bold py-3 px-12 rounded-full transition-colors"
                >
                  مشاهده آگهی های بیشتر
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default AdsList;
