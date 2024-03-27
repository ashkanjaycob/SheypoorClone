import navLogo from "../../assets/LogosSheypoor/sheypoor-Logo.png";
import SearchModal from "./Search";
import NavIcons from "./NavIcons";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Header() {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.matchMedia("(max-width: 768px)").matches);
    };

    handleResize(); // Check initial screen size
    window.addEventListener("resize", handleResize); // Listen for resize events

    return () => window.removeEventListener("resize", handleResize); // Cleanup on component unmount
  }, []);

  const toggleAccordion = () => {
    setIsAccordionOpen((prevState) => !prevState);
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full bg-white z-50">
        <div className="container mx-auto border-b-[1px] p-2">
          <div className="flex justify-between items-center">
            <div className="size-min:w-1/4 max-desktop::w-auto max-w-lg:w-1/4">
              <Link to="/">
                <img
                  className={`w-[120px] cursor-pointer`}
                  src={navLogo}
                  alt="sheypoor-logo"
                />
              </Link>
            </div>
            <div className="flex-grow ml-4 flex-shrink ">
              <SearchModal className="hidden size-min:block" />
            </div>
            {isMobileView ? (
              <div className="max-w-lg:w-auto max-w-lg:flex max-w-lg:items-center max-w-lg:ml-4 max-w-lg:mr-0">
                <button
                  className="focus:outline-none max-w-lg:hidden"
                  onClick={toggleAccordion}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {isAccordionOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16m-7 6h7"
                      />
                    )}
                  </svg>
                </button>
              </div>
            ) : (
              <div className="max-w-lg:w-auto max-w-lg:flex max-w-lg:items-center max-w-lg:ml-4 max-w-lg:mr-0">
                <NavIcons />
                <div className="size-min:w-1/4 max-desktop::w-auto max-w-lg:w-1/4">
                  <Link to="/dashboard">
                    <button className="py-3 px-4 bg-blue-500 text-white rounded-full">
                      ثبت آگهی رایگان +
                    </button>
                  </Link>
                </div>
              </div>
            )}
            {isMobileView && isAccordionOpen && (
              <div className="max-w-lg:w-auto max-w-lg:flex max-w-lg:items-center max-w-lg:ml-4 max-w-lg:mr-0">
                <NavIcons />
                <div className="size-min:w-1/4 max-desktop::w-auto max-w-lg:w-1/4">
                  <Link to="/dashboard">
                    <button className="py-3 px-4 bg-blue-500 text-white rounded-full">
                      ثبت آگهی رایگان +
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
