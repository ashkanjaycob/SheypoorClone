/* eslint-disable react/no-unknown-property */
import { useQuery } from "@tanstack/react-query";
import { getmyAds } from "../../Services/user";
import { sp } from "../../Utils/Numbers";
import { Link } from "react-router-dom";
import { ThreeCircles } from "react-loader-spinner";

function AdsList() {
  const { data, isLoading } = useQuery(["get-my-ads"], getmyAds);
  console.log({ data, isLoading });

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
            <h2 className="mb-12 font-bold text-blue-600 text-[1.6rem] py-4 border-b-2">
              لیست آگهی های شما
            </h2>
            <div className="container mx-auto flex justify-evenly flex-wrap gap-8">
              {data.posts.map((post) => (
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
                        alt={post.options.title}
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
                      <small className="text-base text-[0.7rem] text-neutral-600 dark:text-neutral-200">
                        {new Date(post.createdAt)
                          .toLocaleString("fa-IR")
                          .replace(/,/, "در ساعت")}
                      </small>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default AdsList;
