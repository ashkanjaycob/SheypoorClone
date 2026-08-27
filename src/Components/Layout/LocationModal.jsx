/* eslint-disable react/prop-types */
import { useState, useMemo, useEffect } from "react";
import {
  ALL_IRAN,
  ALL_CITIES,
  POPULAR_CITIES,
  getSelectedCity,
  setSelectedCity,
} from "../../Utils/location";
import { t, getSavedLanguage } from "../../Utils/i18n";
import { translateCity } from "../../Utils/adTranslator";

function LocationModal({ isOpen, onClose }) {
  const [search, setSearch] = useState("");
  const [currentLang, setCurrentLang] = useState(getSavedLanguage());
  const currentCity = getSelectedCity();

  useEffect(() => {
    const handleLangChange = (e) => setCurrentLang(e.detail || getSavedLanguage());
    window.addEventListener("sheypoor_lang_changed", handleLangChange);
    return () => window.removeEventListener("sheypoor_lang_changed", handleLangChange);
  }, []);

  // Filter cities by search term
  const filteredProvinces = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return ALL_CITIES;

    return ALL_CITIES.map((p) => {
      const matchCities = p.cities.filter((c) => {
        const translated = translateCity(c, currentLang).toLowerCase();
        return c.toLowerCase().includes(term) || translated.includes(term);
      });
      const translatedProvince = translateCity(p.province, currentLang).toLowerCase();
      const matchProvince =
        p.province.toLowerCase().includes(term) || translatedProvince.includes(term);

      if (matchProvince) return p;
      if (matchCities.length > 0) return { ...p, cities: matchCities };
      return null;
    }).filter(Boolean);
  }, [search, currentLang]);

  if (!isOpen) return null;

  const handleSelectCity = (cityName) => {
    setSelectedCity(cityName);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-dark-0/60 dark:bg-black/75 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div
        className="bg-white dark:bg-night-card rounded-sheypoor-xl shadow-modal dark:shadow-modal-dark border border-light-0 dark:border-night-border w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-light-1 dark:border-night-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-main dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="text-heading-4 text-dark-0 dark:text-white font-bold">{t("selectCity", {}, currentLang)}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-light-2 dark:bg-night-surface hover:bg-light-1 dark:hover:bg-night-border flex items-center justify-center text-dark-3 dark:text-gray-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search Bar inside Modal */}
        <div className="p-4 border-b border-light-1 dark:border-night-border bg-light-3 dark:bg-night-surface">
          <div className="relative">
            <input
              type="text"
              placeholder={t("searchCityPlaceholder", {}, currentLang)}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-sheypoor rtl:pr-10 rtl:pl-4 ltr:pl-10 ltr:pr-4 !h-11 !rounded-full text-body-2"
              autoFocus
            />
            <svg className="absolute rtl:right-3.5 ltr:left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-3 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute rtl:left-3.5 ltr:right-3.5 top-1/2 -translate-y-1/2 text-dark-3 dark:text-gray-400 hover:text-dark-1 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 space-y-6 flex-grow">
          {/* Quick Option: All Iran */}
          <div>
            <button
              onClick={() => handleSelectCity(ALL_IRAN)}
              className={`w-full p-3.5 rounded-sheypoor-lg flex items-center justify-between border transition-all ${
                currentCity === ALL_IRAN
                  ? "bg-light-special dark:bg-white/10 border-main dark:border-white text-main dark:text-white font-bold"
                  : "bg-light-2 dark:bg-night-surface border-transparent hover:border-light-0 text-dark-1 dark:text-gray-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🇮🇷</span>
                <span className="text-body-2">{t("allIran", {}, currentLang)}</span>
              </div>
              {currentCity === ALL_IRAN && (
                <span className="text-main dark:text-white text-body-2">✓</span>
              )}
            </button>
          </div>

          {/* Popular Cities */}
          {!search && (
            <div>
              <h4 className="text-body-3 font-semibold text-dark-3 dark:text-gray-400 mb-3">
                {t("popularCities", {}, currentLang)}
              </h4>
              <div className="flex flex-wrap gap-2">
                {POPULAR_CITIES.map((c) => {
                  const translatedCity = translateCity(c, currentLang);
                  const isSelected = currentCity === c;
                  return (
                    <button
                      key={c}
                      onClick={() => handleSelectCity(c)}
                      className={`px-3.5 py-1.5 rounded-full text-body-3 transition-all ${
                        isSelected
                          ? "bg-main dark:bg-white text-white dark:text-black font-semibold shadow-sm"
                          : "bg-light-2 dark:bg-night-surface text-dark-1 dark:text-gray-300 hover:bg-light-1 dark:hover:bg-night-border"
                      }`}
                    >
                      {translatedCity}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* All Provinces & Sub-Cities */}
          <div>
            <h4 className="text-body-3 font-semibold text-dark-3 dark:text-gray-400 mb-3">
              {t("allProvinces", {}, currentLang)}
            </h4>
            <div className="space-y-4">
              {filteredProvinces.length === 0 ? (
                <div className="text-center py-8 text-body-2 text-dark-3 dark:text-gray-400">
                  {currentLang === "fa" ? "هیچ شهری با این نام یافت نشد" : "No city found matching this search"}
                </div>
              ) : (
                filteredProvinces.map((prov) => {
                  const provinceName = translateCity(prov.province, currentLang);
                  return (
                    <div key={prov.province} className="border border-light-1 dark:border-night-border rounded-sheypoor p-3.5 bg-white dark:bg-night-surface">
                      <div className="font-semibold text-body-2 text-dark-0 dark:text-white mb-2.5 flex items-center justify-between">
                        <span>{provinceName}</span>
                        <button
                          onClick={() => handleSelectCity(`استان ${prov.province}`)}
                          className="text-body-4 text-main dark:text-gray-300 hover:underline"
                        >
                          {currentLang === "fa" ? `کل استان ${prov.province}` : `All ${provinceName}`}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {prov.cities.map((city) => {
                          const isSelected = currentCity === city;
                          const translatedCityName = translateCity(city, currentLang);
                          return (
                            <button
                              key={city}
                              onClick={() => handleSelectCity(city)}
                              className={`px-3 py-1 text-body-3 rounded-full border transition-all ${
                                isSelected
                                  ? "bg-main dark:bg-white text-white dark:text-black border-main dark:border-white font-semibold"
                                  : "border-light-0 dark:border-night-border text-dark-2 dark:text-gray-300 hover:border-main dark:hover:border-white"
                              }`}
                            >
                              {translatedCityName}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocationModal;
