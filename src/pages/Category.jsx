import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom"; // Import useLocation hook
import { useQuery } from "@tanstack/react-query";
import { getAllAds } from "../Services/user";
import { ThreeDots } from "react-loader-spinner";
import { sp } from "../Utils/Numbers";

function Category() {
  // State to hold the current URL
  const [currentUrl, setCurrentUrl] = useState("");

  // Use useLocation to get current URL
  const location = useLocation();
  const categorySlug = location.pathname.split("/").pop(); // Extract the last segment of the URL

  // Update current URL state on component mount and category slug change
  useEffect(() => {
    setCurrentUrl(categorySlug);
  }, [categorySlug]);

  // Query to fetch data based on the current URL
  const { data, isLoading } = useQuery(["get-all-ads", currentUrl], () =>
    getAllAds(currentUrl)
  );
  console.log(data);

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
            <div className="container mx-auto">
              <div className="flex mb-16">
                <img
                  className="w-[30px] ml-4"
                  src="/sheypoorBlack.svg"
                  alt=""
                />
                <h2 className="font-bold text-[1.2rem]">
                  دسته بندی فیلتر شده 
                </h2>
              </div>
            </div>
            <div className="container mx-auto flex justify-evenly flex-wrap gap-2">
              {data.posts
                .filter((post) => post.category === categorySlug) // Filter ads based on category slug
                .slice(0, displayCount)
                .map((post) => (
                  <Link
                    key={post._id}
                    to={`/dashboard/${post._id}`}
                    className="w-[16%]"
                  >
                    <div className="flex flex-col items-center rounded-lg bg-white cursor-pointer">
                      <div className="relative overflow-hidden bg-cover bg-no-repeat">
                        <img
                          className="rounded-xl w-[180px] h-[180px]"
                          src={`${import.meta.env.VITE_BASE_URL}${
                            post.images[0]
                          }`}
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
                            src="../Toman.svg"
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

export default Category;
