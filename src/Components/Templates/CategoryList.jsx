import { useQuery } from "@tanstack/react-query";
import { getCategory } from "../../Services/Admin";
import { ThreeCircles } from "react-loader-spinner";
import styles from "../../router/loader.module.css";

function CtegoryList() {
  const { data, isLoading } = useQuery(["get-categories"], getCategory);
  console.log({ data, isLoading });

  return (
    <div className="container mx-auto">
      {isLoading ? (
        <div className={styles.loader}>
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
        <ul className="flex items-center justify-evenly">
          {data.map((category) => (
            <li
              className="cursor-pointer mx-4 text-center flex flex-col items-center justify-center"
              key={category._id}
            >
              <img className="bg-gray-100 p-3 w-[70px] rounded-full" src={`${category.icon}.svg`} alt="" />
              <span className="m-2 text-[14px]">{category.name}</span>
            </li>
          ))}
        </ul>
      )}
      <hr className="my-4" />
    </div>
  );
}

export default CtegoryList;
