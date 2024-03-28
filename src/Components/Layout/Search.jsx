import { useState } from "react";
import { LocationMarkerIcon } from "@heroicons/react/outline";
import { useQuery } from "@tanstack/react-query";
import { getAllAds } from "../../Services/user";
import { Link } from "react-router-dom";
import styles from "../../styles/auth.module.css";

function SearchModal() {
  const { data } = useQuery(["get-all-ads"], getAllAds);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = () => {
    if (!data) return; // Check if data is available
    const filteredResults = data.posts.filter((item) =>
      item.options.title.includes(searchQuery)
    );
    setSearchResults(filteredResults);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSearchQuery(""); // Clear search query
  };

  const handleSearchResultClick = () => {
    setSearchQuery(""); // Clear search query
  };

  return (
    <div className="relative flex items-center xs:m-0">
      <button
        className="absolute text-sm flex left-0 py-3 px-4 bg-secondary-500  rounded-l-lg hover:bg-slate-200 focus:outline-none focus:ring focus:bg-slate-600 focus:text-white"
        onClick={() => setShowModal(true)}
      >
        سراسر ایران
        <LocationMarkerIcon className="h-4 w-4 mr-2" />
      </button>
      <input
        type="text"
        placeholder="جست و جو در شیپور"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyUp={handleSearch} // Call handleSearch on each key press
        className={`w-full py-3 px-4 border rounded-lg desktop:pl-60 laptop:pl-36 pl-20 focus:outline-none focus:ring focus:border-blue-200 ${styles["placeholder-text"]}`}
      />

      {searchQuery && (
        <div className="absolute left-0 right-0 top-14">
          <div className="rounded-md bg-slate-100 shadow-xs overflow-hidden">
            <div
              className="py-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
              tabIndex="-1"
            >
              {searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <Link
                    to={`/dashboard/${result._id}`}
                    className="block px-4 py-2 text-sm text-gray-500 hover:bg-blue-100"
                    role="menuitem"
                    tabIndex="-1"
                    id="menu-item-0"
                    key={result._id}
                    onClick={handleSearchResultClick} // Clear search query on result click
                  >
                    {result.options.title}
                  </Link>
                ))
              ) : (
                <p className="px-4 py-2 text-sm text-gray-700">
                  چیزی با این عنوان یافت نشد !
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>

            <div className="relative bg-white rounded-lg p-8 max-w-md mx-auto">
              <div className="flex flex-col justify-between items-center mb-4">
                <button
                  className="text-gray-500 hover:text-gray-600 focus:outline-none"
                  onClick={handleModalClose}
                >
                  <h2 className="text-xl font-semibold">در حال توسعه </h2>
                  <br />
                  <small>لطفا بعدا سعی کنید !!!</small>
                  <br />
                  <h2 className="text-red-800 mt-8">اینجا کلیک کنید </h2>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchModal;
