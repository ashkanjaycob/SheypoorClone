import { useQuery } from "@tanstack/react-query";
import { getCategory } from "../../Services/Admin";
import { ThreeDots } from "react-loader-spinner";
import styles from "../../router/loader.module.css";
import { Link } from "react-router-dom";

function CtegoryList() {
  
  const { data, isLoading } = useQuery(["get-categories"], getCategory);

  return (
    <div className="container mx-auto">
      {isLoading ? (
        <div className={styles.loader}>
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
        <ul className="grid grid-cols-10 gap-y-4 justify-items-center desktop:px-6  max-desktop:grid-cols-5">
          {data.map((category) => (
            <Link key={category._id} to={`/category/${category._id}`}>
              <li className="cursor-pointer m-2 text-center flex flex-col items-center">
                <img
                  className="bg-gray-100 p-2 w-[60px] h-[60px] md:w-[100px] md:h-[100px] rounded-full"
                  src={`${category.icon}.svg`}
                  alt=""
                />
                <span className="mt-2 text-sm md:text-lg">{category.name}</span>
              </li>
            </Link>
          ))}
        </ul>
      )}
      <hr className="my-4" />
    </div>
  );
}

export default CtegoryList;
