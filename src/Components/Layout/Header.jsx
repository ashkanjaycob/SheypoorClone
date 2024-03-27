import navLogo from "../../assets/LogosSheypoor/sheypoor-Logo.png";
import SearchModal from "./Search";
import NavIcons from "./NavIcons";
import { Link } from "react-router-dom";
function Header() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full bg-white z-50">
        <div className="container md:w-full lg:w-3/4 mx-auto border-b-[1px] p-2 mt-3">
          <div className="flex justify-between items-center">
            <div className="hidden laptop:block">
              <Link to="/">
                <img
                  className={`w-[120px] cursor-pointer`}
                  src={navLogo}
                  alt="sheypoor-logo"
                />
              </Link>
            </div>
            <SearchModal className="hidden sm:block flex-grow ml-4" />
            <div className="hidden laptop:block">
              <NavIcons />
            </div>

            <Link to="/dashboard">
              <button className="hidden tablet:flex left-0 py-3 px-4 bg-blue-500 text-white rounded-full">
                <span className="text-gray-400 cursor-pointer"></span>
                ثبت آگهی رایگان +
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
