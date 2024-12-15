import navLogo from "../../assets/LogosSheypoor/sheypoor-Logo.png";
import SearchModal from "./Search";
import NavIcons from "./NavIcons";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Header() {
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.matchMedia("(max-width: 768px)").matches);
    };

    handleResize(); // Check initial screen size
    window.addEventListener("resize", handleResize); // Listen for resize events

    return () => window.removeEventListener("resize", handleResize); // Cleanup on component unmount
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 w-full bg-white z-50">
        <div className="container mx-auto border-b-[1px] p-2">
          <div className="flex justify-between items-center max-desktop:py-2 py-4">
            <div className="size-min:w-1/4 max-desktop::w-auto max-w-lg:w-1/4 mx-2">
              <Link to="/">
                <img
                  className={`w-[120px] cursor-pointer`}
                  src={navLogo}
                  alt="sheypoor-logo"
                />
              </Link>
            </div>
            <div className="flex-grow ml-4 flex-shrink max-w-[500px]">
              {/* Adjusted the max width of SearchModal */}
              <SearchModal className="w-full hidden size-min:block" />
            </div>
            {isMobileView ? (
              <div></div>
            ) : (
              <div className="w-[500px] flex justify-between items-center">
                {/* Adjusted the max width of NavIcons and the button container */}
                <div className="w-[300px]">
                <NavIcons />
                </div>
                <div>
                  <Link to="/dashboard">
                    <button className="py-2 px-4 bg-blue-500 text-white text-sm rounded-full">
                      ثبت آگهی رایگان +
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isMobileView && ( // Render only in mobile view
        <div className="fixed bottom-0 left-0 w-full h-[10vh] flex items-center bg-white z-50 border-t-[1px] px-6 shadow-xl">
          <div className="container mx-auto">
            <div className="flex justify-evenly items-center">
              {isMobileView && (
                <div className="flex w-full justify-between items-center">
                  <div className="w-2/6 text-right">
                    {" "}
                    {/* 25% width */}
                    <Link to="/dashboard">
                      <button className="text-[12px] py-3 px-4 bg-blue-500 text-white rounded-full">
                        ثبت آگهی رایگان +
                      </button>
                    </Link>
                  </div>
                  <div className="w-4/6">
                    {" "}
                    {/* 75% width */}
                    <NavIcons />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
