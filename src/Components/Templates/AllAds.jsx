import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getAllAds, delmySpecificAd } from "../../Services/user";
import { ThreeDots } from "react-loader-spinner";
import { sp } from "../../Utils/Numbers";
import toast, { Toaster } from "react-hot-toast";
import PropTypes from 'prop-types';

function AllAds({ isAdmin = false }) {
  const { data, isLoading, refetch } = useQuery(["get-all-ads"], getAllAds);
  const [displayCount, setDisplayCount] = useState(24);

  const deleteMutation = useMutation(delmySpecificAd, {
    onSuccess: () => {
      toast.success("آگهی با موفقیت حذف شد");
      refetch();
    },
    onError: () => {
      toast.error("خطا در حذف آگهی");
    }
  });

  // No longer needed to infinitely refetch in useEffect unless polling is intended, 
  // but keeping it as it was (just removed data from dependency array to prevent infinite loops)
  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleLoadMore = () => {
    setDisplayCount(displayCount + 6);
  };

  const handleDelete = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if(window.confirm("آیا از حذف این آگهی اطمینان دارید؟")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <>
      <div className="w-full">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center mt-44">
            <ThreeDots
              visible={true}
              height="60"
              width="60"
              color="#1a90ff"
              ariaLabel="three-circles-loading"
            />
          </div>
        ) : !data?.posts || data.posts.length === 0 ? (
          <div className="w-full py-16 flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 mt-8">
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
              هیچ آگهی در سیستم یافت نشد!
            </h3>
          </div>
        ) : (
          <>
            <div className="w-full grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-4 desktop:grid-cols-6 gap-4">
              {data.posts.slice(0, displayCount).map((post) => (
                <div key={post._id} className="relative flex flex-col h-full rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <Link
                    to={`/dashboard/${post._id}`}
                    className="block flex-grow transition-transform hover:-translate-y-1"
                  >
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
                    <div className="p-4 flex flex-col justify-between text-right">
                      <div>
                        <h5
                          className="text-lg font-bold text-gray-800 mb-2 line-clamp-2"
                          title={post.options.title}
                        >
                          {post.options.title}
                        </h5>
                      </div>
                      <div className="mt-2">
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
                  </Link>
                  {isAdmin && (
                    <div className="p-4 pt-0 border-t border-gray-100 mt-auto">
                      <button 
                        onClick={(e) => handleDelete(e, post._id)}
                        disabled={deleteMutation.isLoading}
                        className="w-full py-2 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition-colors mt-2"
                      >
                        حذف آگهی
                      </button>
                    </div>
                  )}
                </div>
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
      {isAdmin && <Toaster />}
    </>
  );
}

AllAds.propTypes = {
  isAdmin: PropTypes.bool
};

export default AllAds;
