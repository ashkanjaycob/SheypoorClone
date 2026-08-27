import { useQuery } from "@tanstack/react-query";
import { getCategory } from "../../Services/Admin";
import { Link } from "react-router-dom";

function CategoryList() {
  const { data, isLoading } = useQuery(["get-categories"], getCategory);

  if (isLoading) {
    return (
      <div className="max-w-container mx-auto px-4">
        <div className="grid grid-cols-5 laptop:grid-cols-10 gap-4 py-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 laptop:w-16 laptop:h-16 rounded-full skeleton" />
              <div className="w-12 h-3 skeleton" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section id="categories" className="max-w-container mx-auto px-4 py-6">
      <div className="grid grid-cols-5 laptop:grid-cols-10 gap-y-5 gap-x-2 justify-items-center">
        {data?.map((category) => (
          <Link
            key={category.slug || category._id || category.id}
            to={`/category/${category.slug || category.id || category._id}`}
            className="group flex flex-col items-center gap-2 cursor-pointer"
          >
            <div className="w-14 h-14 laptop:w-16 laptop:h-16 rounded-full bg-light-2 flex items-center justify-center group-hover:bg-light-special group-hover:ring-2 group-hover:ring-main/20 transition-all duration-200">
              <img
                className="w-8 h-8 laptop:w-9 laptop:h-9 object-contain"
                src={`/${category.icon}.svg`}
                alt={category.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/sheypoorBlack.svg";
                }}
              />
            </div>
            <span className="text-body-4 laptop:text-body-3 text-dark-0 font-medium text-center leading-tight group-hover:text-main transition-colors line-clamp-2">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default CategoryList;
