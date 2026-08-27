import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllAds } from "../../Services/user";
import { getProfile } from "../../Services/user";
import { delCookie } from "../../Utils/cookie";
import navLogo from "../../assets/LogosSheypoor/sheypoor-Logo.png";
import MobileBottomNav from "./MobileBottomNav";

function Header() {
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { data: profileData } = useQuery(["profile"], getProfile);
  const { data: adsData } = useQuery(["get-all-ads"], getAllAds);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim() || !adsData?.posts) {
      setSearchResults([]);
      return;
    }
    const filtered = adsData.posts.filter((p) =>
      p.options.title.includes(query)
    );
    setSearchResults(filtered.slice(0, 8));
  };

  const handleLogout = () => {
    delCookie("accessToken");
    delCookie("refreshToken");
    window.location.reload();
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest(".user-menu-container")) setShowUserMenu(false);
      if (!e.target.closest(".search-container")) {
        setSearchResults([]);
        if (isMobile) setShowSearch(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [isMobile]);

  return (
    <>
      {/* ===== DESKTOP HEADER ===== */}
      <header className="fixed top-0 left-0 w-full bg-white z-50 shadow-header">
        <div className="max-w-container mx-auto px-4">
          <div className="flex items-center justify-between h-header-mobile laptop:h-header-desktop gap-3">
            
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img
                className="w-[100px] laptop:w-[120px] cursor-pointer"
                src={navLogo}
                alt="شیپور"
              />
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden laptop:flex flex-grow max-w-[520px] search-container relative">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="جست‌وجو در همه آگهی‌ها"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="input-sheypoor pr-12 pl-28 !rounded-full"
                />
                {/* Search Icon */}
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {/* Location Trigger */}
                <button className="absolute left-1 top-1/2 -translate-y-1/2 flex items-center gap-1 px-3 py-1.5 text-body-3 text-dark-2 bg-light-2 rounded-full hover:bg-light-1 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>همه‌ی ایران</span>
                </button>
              </div>

              {/* Search Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-sheypoor shadow-modal border border-light-0 overflow-hidden z-50 animate-fade-in">
                  {searchResults.map((result) => (
                    <Link
                      key={result._id}
                      to={`/dashboard/${result._id}`}
                      onClick={() => { setSearchQuery(""); setSearchResults([]); }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-light-3 transition-colors border-b border-light-1 last:border-0"
                    >
                      <svg className="w-4 h-4 text-dark-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="text-body-2 text-dark-1 line-clamp-1">{result.options.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Search Icon */}
            {isMobile && (
              <button
                onClick={(e) => { e.stopPropagation(); setShowSearch(!showSearch); }}
                className="p-2 rounded-full hover:bg-light-2 transition-colors"
              >
                <svg className="w-6 h-6 text-dark-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}

            {/* Desktop Nav Actions */}
            <div className="hidden laptop:flex items-center gap-2">
              {/* Bookmarks */}
              <Link to="/dashboard" className="btn-ghost flex items-center gap-1.5 text-body-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span>ذخیره‌ها</span>
              </Link>

              {/* Chat */}
              <Link to="/dashboard" className="btn-ghost flex items-center gap-1.5 text-body-3 relative">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>پیام‌ها</span>
              </Link>

              {/* User Account */}
              <div className="relative user-menu-container">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowUserMenu(!showUserMenu); }}
                  className="btn-ghost flex items-center gap-1.5 text-body-3"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>حساب من</span>
                </button>

                {showUserMenu && (
                  <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-sheypoor shadow-modal border border-light-0 py-1 z-50 animate-fade-in">
                    <Link to="/dashboard" className="block px-4 py-2.5 text-body-2 text-dark-1 hover:bg-light-3 transition-colors">
                      داشبورد
                    </Link>
                    {profileData?.role === "ADMIN" && (
                      <Link to="/admin" className="block px-4 py-2.5 text-body-2 text-dark-1 hover:bg-light-3 transition-colors">
                        پنل ادمین
                      </Link>
                    )}
                    {profileData && (
                      <>
                        <div className="border-t border-light-1 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-right px-4 py-2.5 text-body-2 text-accent-red hover:bg-accent-red-bg transition-colors"
                        >
                          خروج از حساب
                        </button>
                      </>
                    )}
                    {!profileData && (
                      <Link to="/auth" className="block px-4 py-2.5 text-body-2 text-main hover:bg-light-special transition-colors">
                        ورود / ثبت‌نام
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Post Ad CTA */}
              <Link to="/dashboard" className="mr-2">
                <button className="btn-primary flex items-center gap-1.5 text-body-3 !py-2.5 !px-5">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>ثبت آگهی رایگان</span>
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Search Expanded */}
        {isMobile && showSearch && (
          <div className="search-container px-4 pb-3 bg-white animate-slide-up">
            <div className="relative">
              <input
                type="text"
                placeholder="جست‌وجو در همه آگهی‌ها"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="input-sheypoor pr-10 !rounded-full text-body-2"
                autoFocus
              />
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchResults.length > 0 && (
              <div className="mt-2 bg-white rounded-sheypoor shadow-modal border border-light-0 overflow-hidden animate-fade-in">
                {searchResults.map((result) => (
                  <Link
                    key={result._id}
                    to={`/dashboard/${result._id}`}
                    onClick={() => { setSearchQuery(""); setSearchResults([]); setShowSearch(false); }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-light-3 transition-colors border-b border-light-1 last:border-0"
                  >
                    <span className="text-body-2 text-dark-1 line-clamp-1">{result.options.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </header>

      {/* Mobile Bottom Nav */}
      {isMobile && <MobileBottomNav profileData={profileData} />}
    </>
  );
}

export default Header;
