/**
 * Sheypoor Dynamic Ad Content Translation Engine
 * Translates ad titles, descriptions, categories, cities, pricing, and specs into Persian (fa), English (en), and German (de).
 */

import { getSavedLanguage, LANGUAGES } from "./i18n.js";
import { sp } from "./Numbers.js";

// Dictionary of Persian terms to EN & DE
const TERM_DICTIONARY = {
  // Cars & Vehicles
  "پژو": { en: "Peugeot", de: "Peugeot" },
  "پژو 206": { en: "Peugeot 206", de: "Peugeot 206" },
  "پژو ۲۰۶": { en: "Peugeot 206", de: "Peugeot 206" },
  "پژو 207": { en: "Peugeot 207", de: "Peugeot 207" },
  "پژو ۲۰۷": { en: "Peugeot 207", de: "Peugeot 207" },
  "پژو پارس": { en: "Peugeot Pars", de: "Peugeot Pars" },
  "پژو 405": { en: "Peugeot 405", de: "Peugeot 405" },
  "پراید": { en: "Pride (Saipa)", de: "Pride (Saipa)" },
  "پراید 131": { en: "Saipa Pride 131", de: "Saipa Pride 131" },
  "پراید 111": { en: "Saipa Pride 111", de: "Saipa Pride 111" },
  "تیبا": { en: "Saipa Tiba", de: "Saipa Tiba" },
  "کوییک": { en: "Saipa Quick", de: "Saipa Quick" },
  "ساینا": { en: "Saipa Saina", de: "Saipa Saina" },
  "دنا": { en: "IKCO Dena", de: "IKCO Dena" },
  "دنا پلاس": { en: "IKCO Dena Plus", de: "IKCO Dena Plus" },
  "دنا پلاس توربو": { en: "IKCO Dena Plus Turbo", de: "IKCO Dena Plus Turbo" },
  "تارا": { en: "IKCO Tara", de: "IKCO Tara" },
  "سمند": { en: "IKCO Samand", de: "IKCO Samand" },
  "شاهین": { en: "Saipa Shahin", de: "Saipa Shahin" },
  "جک": { en: "JAC", de: "JAC" },
  "هایما": { en: "Haima", de: "Haima" },
  "هیوندای": { en: "Hyundai", de: "Hyundai" },
  "سانتافه": { en: "Santa Fe", de: "Santa Fe" },
  "سوناتا": { en: "Sonata", de: "Sonata" },
  "تویوتا": { en: "Toyota", de: "Toyota" },
  "بنز": { en: "Mercedes-Benz", de: "Mercedes-Benz" },
  "بی ام و": { en: "BMW", de: "BMW" },
  "تیپ 2": { en: "Trim 2", de: "Ausstattung 2" },
  "تیپ 5": { en: "Trim 5", de: "Ausstattung 5" },
  "تیپ ۵": { en: "Trim 5", de: "Ausstattung 5" },
  "مدل 1400": { en: "Model 2021", de: "Modell 2021" },
  "مدل 1401": { en: "Model 2022", de: "Modell 2022" },
  "مدل 1402": { en: "Model 2023", de: "Modell 2023" },
  "مدل 1403": { en: "Model 2024", de: "Modell 2024" },
  "مدل 1399": { en: "Model 2020", de: "Modell 2020" },
  "مدل 1398": { en: "Model 2019", de: "Modell 2019" },
  "مدل 1397": { en: "Model 2018", de: "Modell 2018" },
  "بدون رنگ": { en: "No Accident / Original Paint", de: "Unfallfrei / Originallack" },
  "بی رنگ": { en: "Original Paint (No Accident)", de: "Originallack (Unfallfrei)" },
  "بسیار تمیز": { en: "Very Clean Condition", de: "Sehr sauberer Zustand" },
  "فنی سالم": { en: "Engine in Perfect Condition", de: "Motor in einwandfreiem Zustand" },
  "فنی به شرط": { en: "Engine Guaranteed", de: "Motor garantiert" },
  "سند تک برگ": { en: "Single Owner Title", de: "Aus erster Hand" },
  "کارکرد": { en: "Mileage", de: "Kilometerstand" },
  "بیمه 6 ماه": { en: "6 Months Insurance", de: "6 Monate Versicherung" },
  "بیمه ۱ سال": { en: "1 Year Full Insurance", de: "1 Jahr Vollversicherung" },
  "فول آپشن": { en: "Full Options", de: "Vollausstattung" },
  "دنده‌ای": { en: "Manual Transmission", de: "Schaltgetriebe" },
  "اتومات": { en: "Automatic Transmission", de: "Automatikgetriebe" },
  "اتوماتیک": { en: "Automatic", de: "Automatik" },

  // Real Estate
  "آپارتمان": { en: "Apartment", de: "Wohnung" },
  "آپارتمان 95 متری": { en: "95 sqm Modern Apartment", de: "95 qm moderne Wohnung" },
  "باغ ویلا": { en: "Garden Villa", de: "Gartenvilla" },
  "باغ ویلا در بافت مسکونی": { en: "Residential Garden Villa with Pool", de: "Wohn-Gartenvilla mit Pool" },
  "تبدیل عکس شما به تابلوفرش": { en: "Custom Woven Photo Tapestry & Rug", de: "Individueller Fototeppich nach Wunsch" },
  "ویلا": { en: "Villa", de: "Villa" },
  "زمین": { en: "Land / Plot", de: "Grundstück" },
  "خانه و ویلا": { en: "House & Villa", de: "Haus & Villa" },
  "رهن و اجاره": { en: "Mortgage & Rent", de: "Miete & Kaution" },
  "خرید و فروش": { en: "Buy & Sell", de: "Kauf & Verkauf" },
  "خرید مسکونی": { en: "Residential Purchase", de: "Wohnungskauf" },
  "اجاره مسکونی": { en: "Residential Rent", de: "Wohnungsmiete" },
  "خرید اداری و تجاری": { en: "Commercial Purchase", de: "Gewerbekauf" },
  "اجاره اداری و تجاری": { en: "Commercial Rent", de: "Gewerbemiete" },
  "نوساز": { en: "Newly Built", de: "Neubau" },
  "کلید نخورده": { en: "Brand New / Unoccupied", de: "Erstbezug" },
  "فول امکانات": { en: "Full Amenities (Elevator, Parking, Storage)", de: "Vollausstattung (Aufzug, Parkplatz, Keller)" },
  "پارکینگ": { en: "Dedicated Parking", de: "Privatparkplatz" },
  "انباری": { en: "Storage Room", de: "Abstellraum" },
  "آسانسور": { en: "Elevator", de: "Aufzug" },
  "بالکن": { en: "Balcony", de: "Balkon" },
  "سند شش دانگ": { en: "Official Legal Deed", de: "Amtlicher Grundbucheintrag" },
  "متراژ": { en: "Area / Size", de: "Wohnfläche" },
  "متر": { en: "sqm", de: "qm" },
  "طبقه": { en: "Floor", de: "Etage" },
  "تک واحدی": { en: "Single Unit per Floor", de: "Einzelwohnung pro Etage" },

  // Jobs & Employment
  "استخدام": { en: "Hiring / Job Opening", de: "Stellenangebot / Gesucht" },
  "نیازمندیم": { en: "Urgent Requirement", de: "Dringend gesucht" },
  "کاریابی": { en: "Job Opportunity", de: "Karrierechance" },
  "برنامه‌نویس": { en: "Software Developer", de: "Softwareentwickler" },
  "طراح وب": { en: "Web Designer", de: "Webdesigner" },
  "حسابدار": { en: "Accountant", de: "Buchhalter" },
  "فروشنده": { en: "Sales Specialist", de: "Verkaufsspezialist" },
  "بازاریاب": { en: "Marketing Expert", de: "Marketingexperte" },
  "ادمین اینستاگرام": { en: "Social Media Manager", de: "Social-Media-Manager" },
  "منشی": { en: "Office Assistant / Secretary", de: "Bürokraft / Sekretärin" },
  "کارشناس فروش": { en: "Sales Executive", de: "Vertriebsmitarbeiter" },
  "راننده": { en: "Driver", de: "Fahrer" },
  "کارگر ساده": { en: "General Worker", de: "Hilfskraft" },
  "حقوق ثابت": { en: "Fixed Salary", de: "Festgehalt" },
  "پورسانت": { en: "Commission", de: "Provision" },
  "بیمه": { en: "Health Insurance Included", de: "Inklusive Krankenversicherung" },
  "تمام وقت": { en: "Full-Time", de: "Vollzeit" },
  "پاره وقت": { en: "Part-Time", de: "Teilzeit" },
  "دورکاری": { en: "Remote / Work from Home", de: "Homeoffice / Remote" },

  // Electronics & Gadgets
  "گوشی": { en: "Smartphone", de: "Smartphone" },
  "موبایل": { en: "Mobile Phone", de: "Mobiltelefon" },
  "آیفون": { en: "Apple iPhone", de: "Apple iPhone" },
  "سامسونگ": { en: "Samsung Galaxy", de: "Samsung Galaxy" },
  "شیائومی": { en: "Xiaomi", de: "Xiaomi" },
  "لپ‌تاپ": { en: "Laptop / Notebook", de: "Laptop / Notebook" },
  "لپ تاپ": { en: "Laptop", de: "Laptop" },
  "تبلت": { en: "Tablet", de: "Tablet" },
  "پلی استیشن": { en: "PlayStation", de: "PlayStation" },
  "ایکس باکس": { en: "Xbox", de: "Xbox" },
  "تلویزیون": { en: "Smart TV", de: "Smart-TV" },
  "اصل": { en: "100% Genuine", de: "100% Original" },
  "اورجینال": { en: "Original", de: "Original" },
  "در حد نو": { en: "Like New Condition", de: "Wie neu" },
  "سالم": { en: "Fully Functional", de: "Einwandfrei funktionstüchtig" },
  "با کارتن": { en: "With Original Box & Accessories", de: "Mit Originalverpackung" },
  "گارانتی": { en: "Warranty Included", de: "Inklusive Garantie" },
};

// Cities dictionary
const CITY_DICTIONARY = {
  "تهران": { en: "Tehran", de: "Teheran" },
  "تهران، سعادت آباد": { en: "Tehran, Saadat Abad", de: "Teheran, Saadat Abad" },
  "تهران، پونک": { en: "Tehran, Punak", de: "Teheran, Punak" },
  "تهران، نارمک": { en: "Tehran, Narmak", de: "Teheran, Narmak" },
  "تهران، فرمانیه": { en: "Tehran, Farmaniyeh", de: "Teheran, Farmaniyeh" },
  "تهران، تجریش": { en: "Tehran, Tajrish", de: "Teheran, Tajrish" },
  "تهران، بلوار کشاورز": { en: "Tehran, Keshavarz Blvd", de: "Teheran, Keshavarz-Boulevard" },
  "تهران، جنت آباد جنوبی": { en: "Tehran, South Jannat Abad", de: "Teheran, Süd-Jannat Abad" },
  "سراسر استان تهران": { en: "Tehran Province", de: "Provinz Teheran" },
  "مشهد": { en: "Mashhad", de: "Maschhad" },
  "اصفهان": { en: "Isfahan", de: "Isfahan" },
  "شیراز": { en: "Shiraz", de: "Schiras" },
  "تبریز": { en: "Tabriz", de: "Täbris" },
  "کرج": { en: "Karaj", de: "Karadsch" },
  "قم": { en: "Qom", de: "Ghom" },
  "اهواز": { en: "Ahvaz", de: "Ahwas" },
  "رشت": { en: "Rasht", de: "Rascht" },
  "رشت، مسکن مهر": { en: "Rasht, Maskane Mehr", de: "Rascht, Maskane Mehr" },
  "بابل": { en: "Babol", de: "Babol" },
  "بابل، امیرکبیر": { en: "Babol, Amirkabir", de: "Babol, Amirkabir" },
  "آمل": { en: "Amol", de: "Amol" },
  "آمل، امام رضا": { en: "Amol, Imam Reza", de: "Amol, Imam Reza" },
  "ساری": { en: "Sari", de: "Sari" },
  "سراسر ایران": { en: "All Regions (Iran)", de: "Ganz Iran" },
  "ایران": { en: "Iran", de: "Iran" },
  "همه‌ی ایران": { en: "All Regions", de: "Ganzes Land" },
};

// Comprehensive 3-language category dictionary
export const CATEGORY_MAP = {
  // 1. Vehicles
  vehicles: { fa: "وسایل نقلیه", en: "Vehicles", de: "Fahrzeuge" },
  "vehicles & cars": { fa: "وسایل نقلیه و خودرو", en: "Vehicles & Cars", de: "Fahrzeuge & Autos" },
  "وسایل نقلیه": { fa: "وسایل نقلیه", en: "Vehicles", de: "Fahrzeuge" },
  "وسایل نقلیه و خودرو": { fa: "وسایل نقلیه و خودرو", en: "Vehicles & Cars", de: "Fahrzeuge & Autos" },
  "خودرو": { fa: "خودرو", en: "Cars", de: "Autos" },

  // 2. Real Estate
  realstate: { fa: "املاک", en: "Real Estate", de: "Immobilien" },
  "real-state": { fa: "املاک", en: "Real Estate", de: "Immobilien" },
  "real-estate": { fa: "املاک", en: "Real Estate", de: "Immobilien" },
  "real estate": { fa: "املاک", en: "Real Estate", de: "Immobilien" },
  "املاک": { fa: "املاک", en: "Real Estate", de: "Immobilien" },
  "املاک و مسکن": { fa: "املاک و مسکن", en: "Real Estate & Housing", de: "Immobilien & Wohnen" },

  // 3. Digital & Electronics
  digital: { fa: "لوازم الکترونیکی", en: "Digital & Tech", de: "Digitale Elektronik" },
  "لوازم الکترونیکی": { fa: "لوازم الکترونیکی", en: "Electronics & Tech", de: "Elektronik & Technik" },
  "موبایل و تبلت": { fa: "موبایل و تبلت", en: "Mobiles & Tablets", de: "Handys & Tablets" },

  // 4. Electronics & Home Appliances
  electronic: { fa: "لوازم برقی و خانگی", en: "Appliances & Electronics", de: "Haushaltsgeräte" },
  electronics: { fa: "لوازم برقی و خانگی", en: "Appliances & Electronics", de: "Haushaltsgeräte" },

  // 5. Furniture & Home Goods
  furniture: { fa: "لوازم خانگی", en: "Home & Furniture", de: "Möbel & Wohnen" },
  "home-kitchen": { fa: "لوازم خانه و آشپزخانه", en: "Home & Kitchen", de: "Haus & Küche" },
  "لوازم خانگی": { fa: "لوازم خانگی", en: "Home & Furniture", de: "Möbel & Wohnen" },
  "لوازم خانه و آشپزخانه": { fa: "لوازم خانه و آشپزخانه", en: "Home & Kitchen", de: "Haus & Küche" },

  // 6. Sports, Games, Hobbies
  game: { fa: "ورزش، بازی و فراغت", en: "Sports & Hobbies", de: "Sport & Freizeit" },
  games: { fa: "ورزش، بازی و فراغت", en: "Sports & Hobbies", de: "Sport & Freizeit" },
  entertainment: { fa: "سرگرمی و فراغت", en: "Entertainment", de: "Unterhaltung" },
  "ورزش، بازی و فراغت": { fa: "ورزش، بازی و فراغت", en: "Sports & Hobbies", de: "Sport & Freizeit" },
  "ورزش و فراغت": { fa: "ورزش و فراغت", en: "Sports & Hobbies", de: "Sport & Freizeit" },

  // 7. Personal Goods
  personal: { fa: "وسایل شخصی", en: "Personal Goods", de: "Persönliche Artikel" },
  "وسایل شخصی": { fa: "وسایل شخصی", en: "Personal Goods", de: "Persönliche Artikel" },

  // 8. Services & Business
  service: { fa: "خدمات و کسب‌وکار", en: "Services & Business", de: "Dienstleistungen" },
  services: { fa: "خدمات و کسب‌وکار", en: "Services & Business", de: "Dienstleistungen" },
  "خدمات": { fa: "خدمات و کسب‌وکار", en: "Services & Business", de: "Dienstleistungen" },
  "خدمات و کسب‌وکار": { fa: "خدمات و کسب‌وکار", en: "Services & Business", de: "Dienstleistungen" },

  // 9. Jobs & Careers
  work: { fa: "استخدام و کاریابی", en: "Jobs & Careers", de: "Jobs & Karriere" },
  jobs: { fa: "استخدام و کاریابی", en: "Jobs & Careers", de: "Jobs & Karriere" },
  hire: { fa: "استخدام و کاریابی", en: "Jobs & Careers", de: "Jobs & Karriere" },
  "استخدام": { fa: "استخدام و کاریابی", en: "Jobs & Careers", de: "Jobs & Karriere" },
  "استخدام و کاریابی": { fa: "استخدام و کاریابی", en: "Jobs & Careers", de: "Jobs & Karriere" },

  // 10. Industry, Business & Buildings
  buildings: { fa: "صنعت و تجارت", en: "Business & Industrial", de: "Gewerbe & Industrie" },
  building: { fa: "صنعت و تجارت", en: "Business & Industrial", de: "Gewerbe & Industrie" },
  industrial: { fa: "صنعت و تجارت", en: "Business & Industrial", de: "Gewerbe & Industrie" },
  "صنعت و تجارت": { fa: "صنعت و تجارت", en: "Business & Industrial", de: "Gewerbe & Industrie" },
};

/**
 * Translates general text string using dictionary and rule-based phrases
 */
export function translateText(text, targetLang = getSavedLanguage()) {
  if (!text || typeof text !== "string") return text || "";
  if (targetLang === LANGUAGES.FA) return text;

  const trimmed = text.trim();

  // 1. Direct dictionary match
  if (TERM_DICTIONARY[trimmed]?.[targetLang]) {
    return TERM_DICTIONARY[trimmed][targetLang];
  }
  if (CITY_DICTIONARY[trimmed]?.[targetLang]) {
    return CITY_DICTIONARY[trimmed][targetLang];
  }
  if (CATEGORY_MAP[trimmed.toLowerCase()]?.[targetLang]) {
    return CATEGORY_MAP[trimmed.toLowerCase()][targetLang];
  }

  // 2. Partial term replacements for titles and phrases
  let translated = trimmed;

  // Replace numbers from Persian to English
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  for (let i = 0; i < 10; i++) {
    translated = translated.replace(new RegExp(persianDigits[i], "g"), String(i));
  }

  // Replace known domain terms
  Object.keys(TERM_DICTIONARY)
    .sort((a, b) => b.length - a.length)
    .forEach((term) => {
      if (translated.includes(term)) {
        const replacement = TERM_DICTIONARY[term][targetLang];
        translated = translated.replace(new RegExp(term, "g"), replacement);
      }
    });

  // Replace city names
  Object.keys(CITY_DICTIONARY)
    .sort((a, b) => b.length - a.length)
    .forEach((c) => {
      if (translated.includes(c)) {
        const replacement = CITY_DICTIONARY[c][targetLang];
        translated = translated.replace(new RegExp(c, "g"), replacement);
      }
    });

  // Handle common prefixes/suffixes
  if (targetLang === LANGUAGES.EN) {
    translated = translated
      .replace(/فروش فوری/g, "Urgent Sale:")
      .replace(/فروش/g, "Sale of")
      .replace(/اجاره/g, "Rent:")
      .replace(/رهن/g, "Mortgage:")
      .replace(/مدل/g, "Model")
      .replace(/تیپ/g, "Trim")
      .replace(/متری/g, " sqm")
      .replace(/تومان/g, "Tomans")
      .replace(/در حد نو/g, "(Like New)")
      .replace(/کاملا سالم/g, "(Excellent Condition)");
  } else if (targetLang === LANGUAGES.DE) {
    translated = translated
      .replace(/فروش فوری/g, "Dringender Verkauf:")
      .replace(/فروش/g, "Verkauf von")
      .replace(/اجاره/g, "Miete:")
      .replace(/رهن/g, "Kaution:")
      .replace(/مدل/g, "Modell")
      .replace(/تیپ/g, "Ausstattung")
      .replace(/متری/g, " qm")
      .replace(/تومان/g, "Toman")
      .replace(/در حد نو/g, "(Wie neu)")
      .replace(/کاملا سالم/g, "(Einwandfreier Zustand)");
  }

  return translated;
}

/**
 * Translates city name
 */
export function translateCity(city, targetLang = getSavedLanguage()) {
  if (!city) return targetLang === LANGUAGES.FA ? "ایران" : (targetLang === LANGUAGES.DE ? "Iran" : "Iran");
  if (targetLang === LANGUAGES.FA) return city;

  if (CITY_DICTIONARY[city]?.[targetLang]) {
    return CITY_DICTIONARY[city][targetLang];
  }

  return translateText(city, targetLang);
}

/**
 * Translates category slug or name to the requested language (FA, EN, or DE)
 */
export function translateCategory(catName, targetLang = getSavedLanguage()) {
  if (!catName) return "";
  const key = String(catName).trim().toLowerCase();

  // 1. Direct dictionary match by lowercase slug or raw name
  if (CATEGORY_MAP[key]?.[targetLang]) {
    return CATEGORY_MAP[key][targetLang];
  }
  if (CATEGORY_MAP[catName]?.[targetLang]) {
    return CATEGORY_MAP[catName][targetLang];
  }

  // 2. If Persian is target and string contains Persian chars, return as is
  if (targetLang === LANGUAGES.FA && /[\u0600-\u06FF]/.test(catName)) {
    return catName;
  }

  // 3. If English/German is target, try general translation
  if (targetLang !== LANGUAGES.FA) {
    const res = translateText(catName, targetLang);
    if (res && res !== catName) return res;
  }

  return catName;
}

/**
 * Formats price/amount based on active language
 */
export function formatAdPrice(amount, targetLang = getSavedLanguage()) {
  const num = Number(amount);
  if (!num || num <= 0) {
    if (targetLang === LANGUAGES.DE) return "Preis auf Anfrage";
    if (targetLang === LANGUAGES.EN) return "Negotiable Price";
    return "قیمت توافقی";
  }

  if (targetLang === LANGUAGES.FA) {
    return {
      price: sp(num),
      currency: "تومان",
    };
  }

  // English & German numbers with latin commas/dots
  const formattedNumber = num.toLocaleString(targetLang === LANGUAGES.DE ? "de-DE" : "en-US");
  const currencyLabel = targetLang === LANGUAGES.DE ? "Toman" : "Tomans";

  return {
    price: formattedNumber,
    currency: currencyLabel,
  };
}

/**
 * Formats time-ago strings based on active language
 */
export function formatTimeAgo(dateStr, targetLang = getSavedLanguage()) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);

  if (targetLang === LANGUAGES.EN) {
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString("en-US");
  }

  if (targetLang === LANGUAGES.DE) {
    if (mins < 1) return "Gerade eben";
    if (mins < 60) return `Vor ${mins} Min.`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `Vor ${hrs} Std.`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `Vor ${days} Tagen`;
    return new Date(dateStr).toLocaleDateString("de-DE");
  }

  // Persian
  if (mins < 1) return "لحظاتی پیش";
  if (mins < 60) return `${mins} دقیقه پیش`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ساعت پیش`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} روز پیش`;
  return new Date(dateStr).toLocaleDateString("fa-IR");
}

/**
 * Translates a complete Post object into the target language
 */
export function translatePost(post, targetLang = getSavedLanguage()) {
  if (!post) return post;
  if (targetLang === LANGUAGES.FA) return post;

  const rawTitle = post.options?.title || post.title || "";
  const rawContent = post.options?.content || post.content || "";
  const rawCity = post.options?.city || post.city || "";
  const rawCategory = post.categoryName || post.category || "";

  return {
    ...post,
    translatedTitle: translateText(rawTitle, targetLang),
    translatedContent: translateText(rawContent, targetLang),
    translatedCity: translateCity(rawCity, targetLang),
    translatedCategory: translateCategory(rawCategory, targetLang),
    priceInfo: formatAdPrice(post.amount, targetLang),
    timeAgo: formatTimeAgo(post.createdAt, targetLang),
  };
}
