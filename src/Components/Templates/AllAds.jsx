import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllAds } from "../../Services/user";
import { ThreeDots } from "react-loader-spinner";
import { sp } from "../../Utils/Numbers";

function AllAds() {
  const { data, isLoading } = useQuery(["get-all-ads"], getAllAds);
  const [displayCount, setDisplayCount] = useState(24); // Initial number of ads to display

  const handleLoadMore = () => {
    // Increase the display count by 6 each time the user clicks "Load More"
    setDisplayCount(displayCount + 6);
  };

  return (
    <>
      <div>
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center mt-44">
            <ThreeDots
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
          <>
            <div className="container mx-auto flex justify-evenly flex-wrap gap-2">
              {data.posts.slice(0, displayCount).map((post) => (
                <Link
                  key={post._id}
                  to={`/dashboard/${post._id}`}
                  className="w-[16%]"
                >
                  <div className="flex flex-col items-center rounded-lg bg-white cursor-pointer">
                    <div className="relative overflow-hidden bg-cover bg-no-repeat">
                      <img
                        className="rounded-xl w-[180px] h-[180px]"
                        src={`${import.meta.env.VITE_BASE_URL}${post.images[0]}`}
                        alt="عکس آگهی"
                      />
                    </div>
                    <div className="p-6">
                      <div
                        style={{
                          maxWidth: "200px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <h5 className="mb-2 font-medium leading-tight text-neutral-800 dark:text-neutral-50">
                          {post.options.title}
                        </h5>
                      </div>
                      <p className="flex text-base dark:text-neutral-200">
                        {sp(post.amount)}{" "}
                        <img
                          className="w-[22px] mr-2"
                          src="Toman.svg"
                          alt="آیکون_تومان"
                        />
                      </p>
                      <small>در {post.options.city}</small>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {data.posts.length > displayCount && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleLoadMore}
                  className="text-blue-500 border-2 border-blue-500 font-bold py-2 px-16 rounded-full"
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

export default AllAds;
