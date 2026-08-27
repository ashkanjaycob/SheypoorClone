import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSavedLanguage, LANGUAGES } from "../../Utils/i18n";

const HUBS_DATA = {
  vehicles: {
    title: {
      [LANGUAGES.FA]: "از خودرو کلاسیک تا ماشین سنگین",
      [LANGUAGES.EN]: "From Classic Cars to Heavy Vehicles",
      [LANGUAGES.DE]: "Vom Oldtimer bis zum Nutzfahrzeug",
    },
    items: [
      {
        icon: "🚗",
        path: "/category/vehicles",
        label: {
          [LANGUAGES.FA]: "خودرو سواری",
          [LANGUAGES.EN]: "Passenger Cars",
          [LANGUAGES.DE]: "Personenwagen (PKW)",
        },
      },
      {
        icon: "🏍️",
        path: "/category/vehicles",
        label: {
          [LANGUAGES.FA]: "موتورسیکلت",
          [LANGUAGES.EN]: "Motorcycles",
          [LANGUAGES.DE]: "Motorräder & Roller",
        },
      },
      {
        icon: "📊",
        path: "/category/vehicles",
        label: {
          [LANGUAGES.FA]: "قیمت روز خودرو",
          [LANGUAGES.EN]: "Daily Car Prices",
          [LANGUAGES.DE]: "Aktuelle Fahrzeugpreise",
        },
      },
      {
        icon: "💳",
        path: "/category/vehicles",
        label: {
          [LANGUAGES.FA]: "خودرو اقساطی",
          [LANGUAGES.EN]: "Installment Financing",
          [LANGUAGES.DE]: "Ratenkauf & Leasing",
        },
      },
    ],
  },
  realEstate: {
    title: {
      [LANGUAGES.FA]: "املاک و مستغلات",
      [LANGUAGES.EN]: "Real Estate & Properties",
      [LANGUAGES.DE]: "Immobilien & Grundstücke",
    },
    items: [
      {
        icon: "🏠",
        path: "/category/realstate",
        label: {
          [LANGUAGES.FA]: "خرید مسکونی",
          [LANGUAGES.EN]: "Buy Residential",
          [LANGUAGES.DE]: "Wohnung kaufen",
        },
      },
      {
        icon: "🔑",
        path: "/category/realstate",
        label: {
          [LANGUAGES.FA]: "اجاره مسکونی",
          [LANGUAGES.EN]: "Rent Residential",
          [LANGUAGES.DE]: "Wohnung mieten",
        },
      },
      {
        icon: "🏡",
        path: "/category/realstate",
        label: {
          [LANGUAGES.FA]: "خرید ویلا",
          [LANGUAGES.EN]: "Buy Villa",
          [LANGUAGES.DE]: "Villa kaufen",
        },
      },
      {
        icon: "🏗️",
        path: "/category/realstate",
        label: {
          [LANGUAGES.FA]: "زمین و کلنگی",
          [LANGUAGES.EN]: "Land & Plots",
          [LANGUAGES.DE]: "Grundstücke",
        },
      },
    ],
  },
};

function SpecialtyHubs() {
  const [currentLang, setCurrentLang] = useState(getSavedLanguage());

  useEffect(() => {
    const handleLangChange = (e) => setCurrentLang(e.detail || getSavedLanguage());
    window.addEventListener("sheypoor_lang_changed", handleLangChange);
    return () => window.removeEventListener("sheypoor_lang_changed", handleLangChange);
  }, []);

  return (
    <section className="max-w-container mx-auto px-4 py-6">
      {/* Vehicle Hub */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🚘</span>
          <h3 className="text-heading-5 text-dark-0 dark:text-white font-bold">
            {HUBS_DATA.vehicles.title[currentLang] || HUBS_DATA.vehicles.title[LANGUAGES.FA]}
          </h3>
        </div>
        <div className="grid grid-cols-2 laptop:grid-cols-4 gap-3">
          {HUBS_DATA.vehicles.items.map((hub, i) => (
            <Link
              key={i}
              to={hub.path}
              className="bg-white dark:bg-night-card border border-light-0 dark:border-night-border/80 rounded-sheypoor-lg p-4 flex items-center gap-3 hover:border-main/40 dark:hover:border-white/40 hover:shadow-card-hover dark:hover:shadow-card-hover-dark transition-all duration-200 group"
            >
              <div className="w-10 h-10 bg-light-2 dark:bg-white/10 rounded-full flex items-center justify-center text-lg group-hover:bg-light-special dark:group-hover:bg-white/20 group-hover:scale-110 transition-all">
                {hub.icon}
              </div>
              <span className="text-body-2 font-medium text-dark-1 dark:text-gray-100 group-hover:text-main dark:group-hover:text-white transition-colors">
                {hub.label[currentLang] || hub.label[LANGUAGES.FA]}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Real Estate Hub */}
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🏢</span>
          <h3 className="text-heading-5 text-dark-0 dark:text-white font-bold">
            {HUBS_DATA.realEstate.title[currentLang] || HUBS_DATA.realEstate.title[LANGUAGES.FA]}
          </h3>
        </div>
        <div className="grid grid-cols-2 laptop:grid-cols-4 gap-3">
          {HUBS_DATA.realEstate.items.map((hub, i) => (
            <Link
              key={i}
              to={hub.path}
              className="bg-white dark:bg-night-card border border-light-0 dark:border-night-border/80 rounded-sheypoor-lg p-4 flex items-center gap-3 hover:border-main/40 dark:hover:border-white/40 hover:shadow-card-hover dark:hover:shadow-card-hover-dark transition-all duration-200 group"
            >
              <div className="w-10 h-10 bg-light-2 dark:bg-white/10 rounded-full flex items-center justify-center text-lg group-hover:bg-light-special dark:group-hover:bg-white/20 group-hover:scale-110 transition-all">
                {hub.icon}
              </div>
              <span className="text-body-2 font-medium text-dark-1 dark:text-gray-100 group-hover:text-main dark:group-hover:text-white transition-colors">
                {hub.label[currentLang] || hub.label[LANGUAGES.FA]}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SpecialtyHubs;
