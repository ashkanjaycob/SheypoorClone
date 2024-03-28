/* eslint-disable react/no-unknown-property */
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getmyAds } from "../../Services/user";
import { sp } from "../../Utils/Numbers";
import { Link } from "react-router-dom";
import { ThreeCircles } from "react-loader-spinner";

function AdsList() {
  const { data, isLoading } = useQuery(["get-my-ads"], getmyAds);
  console.log({ data, isLoading });
  const [displayCount, setDisplayCount] = useState(10); 

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
        ) : (
          <>
            <div className="container mx-auto flex justify-evenly flex-wrap gap-2">
              {data.posts.slice(0, displayCount).map((post) => (
                <Link
                  key={post._id}
                  to={`/dashboard/${post._id}`}
                  className="w-[16%] max-desktop:w-[96%] max-desktop:border-b-2 max-desktop:pb-4"
                >
                  <div className="flex max-desktop:flex-row-reverse flex-col max-desktop:items-start items-center justify-between rounded-lg bg-white cursor-pointer">
                    <div className="relative overflow-hidden bg-cover bg-no-repeat">
                      <img
                        className="rounded-xl w-[180px] h-[180px] max-desktop:w-[120px] max-desktop:h-[120px]" 
                        src={`${import.meta.env.VITE_BASE_URL}${post.images[0]}`}
                        alt="این آگهی فاقد عکس است !"
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
                      <p className="flex text-base max-desktop:mt-8">
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

export default AdsList;
