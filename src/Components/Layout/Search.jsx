import { useState } from "react";
import { LocationMarkerIcon } from "@heroicons/react/outline"; // Correct import statement

function SearchModal() {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // eslint-disable-next-line no-unused-vars
  const handleSearch = () => {
    // Handle search functionality here
    console.log("Searching for:", searchQuery);
  };

  const handleModalClose = () => setShowModal(false);

  return (
    <div className="relative flex items-center mr-5 xs:m-0">
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
        className="w-full py-3 px-4 border rounded-lg desktop:pl-60 laptop:pl-36 pl-20 focus:outline-none focus:ring focus:border-blue-200"
      />

      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>

            <div className="relative bg-white rounded-lg p-8 max-w-md mx-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">در حال توسعه </h2>
                <button
                  className="text-gray-500 hover:text-gray-600 focus:outline-none"
                  onClick={handleModalClose}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div>
                {/* Display search results here */}
                نمایش نتایج
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchModal;
