import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllAds } from "../Services/user";
import { ThreeDots } from "react-loader-spinner";
import { sp } from "../Utils/Numbers";

function Category() {
  const [currentUrl, setCurrentUrl] = useState("");
  const location = useLocation();
  const categorySlug = location.pathname.split("/").pop();

  useEffect(() => {
    setCurrentUrl(categorySlug);
  }, [categorySlug]);

  const { data, isLoading } = useQuery(["get-all-ads", currentUrl], () =>
    getAllAds(currentUrl)
  );

  const [displayCount, setDisplayCount] = useState(6);

  const handleLoadMore = () => {
    setDisplayCount(displayCount + 6);
  };

  return (
    <div className="container mx-auto">
      <div className="flex mb-4 items-center border-b-2 pb-8">
        <img className="w-6 h-6 ml-2" src="/sheypoorBlack.svg" alt="" />
        <h2 className="font-bold text-lg">دسته بندی فیلتر شده</h2>
      </div>
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center mt-20">
          <ThreeDots
            visible={true}
            height="60"
            width="60"
            color="#1a90ff"
            ariaLabel="three-circles-loading"
          />
        </div>
      ) : (
        <>
          <div className="container mx-auto flex justify-evenly flex-wrap gap-2">
            {data &&
              data.posts
                .filter((post) => post.category === categorySlug)
                .slice(0, displayCount)
                .map((post) => (
                  <Link
                    key={post._id}
                    to={`/dashboard/${post._id}`}
                    className="w-[16%] max-desktop:w-[96%] max-desktop:border-b-2 max-desktop:pb-4"
                  >
                    <div className="flex max-desktop:flex-row-reverse flex-col max-desktop:items-start items-center justify-between rounded-lg bg-white cursor-pointer">
                      <div className="relative overflow-hidden bg-cover bg-no-repeat">
                        <img
                          className="rounded-xl w-[180px] h-[180px] max-desktop:w-[120px] max-desktop:h-[120px]"
                          src={`${import.meta.env.VITE_BASE_URL}${
                            post.images[0]
                          }`}
                          alt="عکس آگهی"
                        />
                      </div>
                      <div className="max-desktop:p-2 p-6 text-start">
                        <div
                          style={{
                            maxWidth: "200px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          className="mb-2 font-medium leading-tight text-neutral-800 md:max-w-[200px]"
                        >
                          <h5 className="text-base max-desktop:text-lg">
                            {post.options.title}
                          </h5>
                        </div>
                        <p className="flex text-base max-desktop:mt-8 ">
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
          {data && data.posts.length > displayCount && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleLoadMore}
                className="text-blue-500 border-2 border-blue-500 font-bold py-2 px-6 rounded-full"
              >
                مشاهده آگهی های بیشتر
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Category;
