/* eslint-disable react/prop-types */
import { useState, useMemo } from "react";
import {
  ALL_IRAN,
  ALL_CITIES,
  POPULAR_CITIES,
  getSelectedCity,
  setSelectedCity,
} from "../../Utils/location";

function LocationModal({ isOpen, onClose }) {
  const [search, setSearch] = useState("");
  const currentCity = getSelectedCity();

  // Filter cities by search term
  const filteredProvinces = useMemo(() => {
    const term = search.trim();
    if (!term) return ALL_CITIES;

    return ALL_CITIES.map((p) => {
      const matchCities = p.cities.filter((c) => c.includes(term));
      const matchProvince = p.province.includes(term);
      if (matchProvince) return p;
      if (matchCities.length > 0) return { ...p, cities: matchCities };
      return null;
    }).filter(Boolean);
  }, [search]);

  if (!isOpen) return null;

  const handleSelectCity = (cityName) => {
    setSelectedCity(cityName);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-dark-0/40 backdrop-blur-sm p-4"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div
        className="bg-white rounded-sheypoor-xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-light-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-main" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="text-heading-4 text-dark-0">انتخاب شهر یا استان</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-light-2 hover:bg-light-1 flex items-center justify-center text-dark-3 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-light-1 bg-light-3">
          <div className="relative">
            <input
              type="text"
              placeholder="جست‌وجوی نام شهر یا استان..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-sheypoor pr-10 pl-10 text-body-2 !rounded-full !bg-white"
              autoFocus
            />
            <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-3 hover:text-dark-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto p-5 space-y-6">
          {/* Option: All Iran */}
          <div>
            <button
              onClick={() => handleSelectCity(ALL_IRAN)}
              className={`w-full p-3.5 rounded-sheypoor-lg flex items-center justify-between border transition-all ${
                currentCity === ALL_IRAN
                  ? "bg-light-special border-main text-main font-semibold shadow-xs"
                  : "bg-light-3 border-light-0 hover:bg-light-2 text-dark-0"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🗺️</span>
                <span className="text-body-2 font-medium">همه‌ی ایران (نمایش آگهی‌های سراسر کشور)</span>
              </div>
              {currentCity === ALL_IRAN && (
                <svg className="w-5 h-5 text-main" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          </div>

          {/* Popular Cities Chips */}
          {!search && (
            <div>
              <h4 className="text-body-3 font-semibold text-dark-2 mb-3">شهرهای پربازدید</h4>
              <div className="flex flex-wrap gap-2">
                {POPULAR_CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleSelectCity(city)}
                    className={`px-3.5 py-1.5 rounded-full text-body-3 transition-all ${
                      currentCity === city
                        ? "bg-main text-white font-semibold shadow-xs"
                        : "bg-light-2 text-dark-1 hover:bg-light-1 hover:text-main"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Grouped Provinces & Cities */}
          <div>
            <h4 className="text-body-3 font-semibold text-dark-2 mb-3">
              {search ? "نتایج جست‌وجو" : "تمامی استان‌ها و شهرها"}
            </h4>

            {filteredProvinces.length === 0 ? (
              <div className="text-center py-8 text-body-3 text-dark-3">
                شهری با عبارت «{search}» یافت نشد.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProvinces.map((prov) => (
                  <div key={prov.province} className="border border-light-0 rounded-sheypoor p-3 bg-white">
                    {/* Province Name */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-light-1">
                      <button
                        onClick={() => handleSelectCity(prov.province)}
                        className="text-body-2 font-bold text-dark-0 hover:text-main text-right flex items-center gap-1.5"
                      >
                        <span>استان {prov.province}</span>
                        <span className="text-[11px] font-normal text-dark-3">(کل استان)</span>
                      </button>
                      {currentCity === prov.province && (
                        <span className="text-xs text-main font-semibold">انتخاب‌شده ✓</span>
                      )}
                    </div>

                    {/* Cities in Province */}
                    <div className="flex flex-wrap gap-1.5">
                      {prov.cities.map((city) => (
                        <button
                          key={city}
                          onClick={() => handleSelectCity(city)}
                          className={`px-2.5 py-1 rounded text-body-4 transition-colors ${
                            currentCity === city
                              ? "bg-main text-white font-semibold"
                              : "text-dark-2 hover:bg-light-special hover:text-main"
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-light-1 bg-light-3 flex items-center justify-between text-body-4 text-dark-3">
          <span>شهر انتخابی شما در مرورگر ذخیره می‌شود.</span>
          {currentCity !== ALL_IRAN && (
            <button
              onClick={() => handleSelectCity(ALL_IRAN)}
              className="text-main hover:text-main-darker font-semibold transition-colors"
            >
              پاک کردن فیلتر شهر
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LocationModal;
