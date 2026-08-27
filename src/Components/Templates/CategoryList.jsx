import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategory } from "../../Services/Admin";
import { Link } from "react-router-dom";
import { getSavedLanguage } from "../../Utils/i18n";
import { translateCategory } from "../../Utils/adTranslator";

function CategoryList() {
  const { data, isLoading } = useQuery(["get-categories"], getCategory);
  const [currentLang, setCurrentLang] = useState(getSavedLanguage());

  useEffect(() => {
    const handleLangChange = (e) => setCurrentLang(e.detail || getSavedLanguage());
    window.addEventListener("sheypoor_lang_changed", handleLangChange);
    return () => window.removeEventListener("sheypoor_lang_changed", handleLangChange);
  }, []);

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
        {data?.map((category) => {
          const catName = translateCategory(category.slug || category.name, currentLang) || category.name;
          return (
            <Link
              key={category.slug || category._id || category.id}
              to={`/category/${category.slug || category.id || category._id}`}
              className="group flex flex-col items-center gap-2 cursor-pointer"
            >
              <div className="w-14 h-14 laptop:w-16 laptop:h-16 rounded-full bg-light-2 dark:bg-night-card border border-transparent dark:border-night-border flex items-center justify-center group-hover:bg-light-special dark:group-hover:bg-night-surface group-hover:ring-2 group-hover:ring-main/20 dark:group-hover:ring-white/20 transition-all duration-200">
                <img
                  className="w-8 h-8 laptop:w-9 laptop:h-9 object-contain dark:brightness-110"
                  src={`/${category.icon}.svg`}
                  alt={catName}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/sheypoorBlack.svg";
                  }}
                />
              </div>
              <span className="text-body-4 laptop:text-body-3 text-dark-0 dark:text-gray-200 font-medium text-center leading-tight group-hover:text-main dark:group-hover:text-white transition-colors line-clamp-2">
                {catName}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default CategoryList;
