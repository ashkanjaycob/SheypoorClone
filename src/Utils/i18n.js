/**
 * Sheypoor Internationalization (i18n) Engine
 * Supported Languages: Persian (fa, RTL), English (en, LTR), German (de, LTR)
 */

export const LANG_KEY = "sheypoor_lang";

export const LANGUAGES = {
  FA: "fa",
  EN: "en",
  DE: "de",
};

export const TRANSLATIONS = {
  // === Persian (Default) ===
  fa: {
    appName: "شیپور",
    appTagline: "نیازمندی‌های رایگان خرید و فروش، استخدام و خدمات",
    home: "خانه",
    categories: "دسته‌بندی‌ها",
    savedAds: "ذخیره‌ها",
    messages: "پیام‌ها",
    myAccount: "حساب من",
    myAds: "آگهی‌های من",
    postAd: "ثبت رایگان آگهی",
    adminPanel: "پنل مدیریت",
    logout: "خروج از حساب",
    login: "ورود / ثبت‌نام",
    loginSubtitle: "برای استفاده از امکانات، شماره موبایل خود را وارد کنید",
    searchPlaceholder: "جست‌وجو در همه آگهی‌ها...",
    searchInCityPlaceholder: "جست‌وجو در آگهی‌های {city}...",
    allIran: "همه‌ی ایران",
    selectCity: "انتخاب شهر",
    popularCities: "شهرهای پربازدید",
    allProvinces: "همه استان‌ها",
    searchCityPlaceholder: "جست‌وجوی شهر یا استان...",
    clearCityFilter: "حذف فیلتر شهر",
    showingCityAds: "در حال نمایش آگهی‌های شهر: {city}",
    recentAds: "جدیدترین آگهی‌های سراسر ایران",
    recentAdsSubtitle: "شیپور، سایت نیازمندی‌های رایگان",
    otherRecentAds: "سایر آگهی‌های جدید",
    nationwideShowcase: "ویترین سراسری",
    nationwideShowcaseSubtitle: "آگهی‌های ویژه استانی و سراسر ایران.",
    viewAll: "مشاهده همه",
    featuredBadge: "ویژه",
    loadMore: "مشاهده آگهی‌های بیشتر",
    loadMoreRemaining: "مشاهده آگهی‌های بیشتر ({count} آگهی دیگر)",
    loadingMore: "در حال بارگذاری آگهی‌های بیشتر...",
    allAdsLoaded: "تمامی {count} آگهی نمایش داده شد",
    shuffleAds: "چیدمان تصادفی جدید",
    noAdsFound: "هیچ آگهی یافت نشد!",
    noAdsInCity: "در شهر «{city}» آگهی‌ای یافت نشد!",
    viewAllIranAds: "مشاهده آگهی‌های همه‌ی ایران",
    priceNegotiable: "توافقی",
    currencyToman: "تومان",
    justNow: "لحظاتی پیش",
    minutesAgo: "{mins} دقیقه پیش",
    hoursAgo: "{hrs} ساعت پیش",
    daysAgo: "{days} روز پیش",
    adSaved: "آگهی به ذخیره‌ها افزوده شد",
    adUnsaved: "آگهی از ذخیره‌ها حذف شد",
    savedAdsTitle: "آگهی‌های ذخیره‌شده شما",
    savedAdsEmpty: "شما هنوز هیچ آگهی را ذخیره نکرده‌اید",
    savedAdsEmptyDesc: "با کلیک روی آیکون نشان‌کردن هر آگهی، آن را در این بخش ذخیره کنید.",
    browseAdsBtn: "مشاهده و مرور آگهی‌ها",
    filterAll: "همه",
    filterPhoto: "عکس‌دار",
    filterCheap: "ارزان‌ترین",
    filterExpensive: "گران‌ترین",
    allAdsFilter: "همه",
    withPhotoFilter: "عکس‌دار",
    cheapestFilter: "ارزان‌ترین",
    mostExpensiveFilter: "گران‌ترین",
    randomizeFeed: "چیدمان تصادفی",
    loadMoreAds: "مشاهده آگهی‌های بیشتر",
    themeLight: "روشن",
    themeDark: "تاریک (سیاه و سفید)",
    themeSystem: "هماهنگ با سیستم",
    langFa: "فارسی",
    langEn: "English",
    langDe: "Deutsch",
    deleteAd: "حذف آگهی",
    deleteAdConfirm: "آیا از حذف این آگهی اطمینان دارید؟ این عملیات غیرقابل بازگشت است.",
    cancel: "انصراف",
    confirmDelete: "بله، حذف کن",
    deleting: "در حال حذف...",
    comingSoonTitle: "بخش پیام‌ها به‌زودی!",
    comingSoonDesc: "قابلیت چت آنلاین و پیام‌رسانی بین خریدار و فروشنده در دست توسعه است.",
    gotIt: "متوجه شدم",
    contactSeller: "اطلاعات تماس و چت",
    sellerPhone: "شماره تماس فروشنده",
    adDetails: "مشخصات و جزییات آگهی",
    safetyWarning: "راهنمای خرید امن: هرگز پیش از تحویل کالا، بیعانه پرداخت نکنید.",
    description: "توضیحات",
    categoryVehicles: "وسایل نقلیه و خودرو",
    categoryRealEstate: "املاک و مسکن",
    categoryElectronic: "لوازم الکترونیکی",
    categoryJobs: "استخدام و کاریابی",
    categoryHomeKitchen: "لوازم خانگی و آشپزخانه",
    categoryServices: "خدمات و کسب‌وکار",
    categoryPersonal: "لوازم شخصی و پوشاک",
    categoryIndustrial: "صنعتی، اداری و تجاری",
    categoryEntertainment: "سرگرمی و فراغت",
  },

  // === English (LTR) ===
  en: {
    appName: "Sheypoor",
    appTagline: "Free Classifieds, Real Estate, Vehicles, Jobs & Services",
    home: "Home",
    categories: "Categories",
    savedAds: "Saved Ads",
    messages: "Messages",
    myAccount: "My Account",
    myAds: "My Ads",
    postAd: "Post Free Ad",
    adminPanel: "Admin Panel",
    logout: "Log Out",
    login: "Log In / Register",
    loginSubtitle: "Enter your mobile number to access your account",
    searchPlaceholder: "Search in all classifieds...",
    searchInCityPlaceholder: "Search classifieds in {city}...",
    allIran: "All Regions",
    selectCity: "Select Location",
    popularCities: "Popular Cities",
    allProvinces: "All Provinces",
    searchCityPlaceholder: "Search city or province...",
    clearCityFilter: "Clear City Filter",
    showingCityAds: "Showing ads for: {city}",
    recentAds: "Fresh Classifieds Nationwide",
    recentAdsSubtitle: "Sheypoor, The Premier Free Marketplace",
    otherRecentAds: "More Recent Listings",
    nationwideShowcase: "Nationwide Showcase",
    nationwideShowcaseSubtitle: "Premium featured listings across all regions.",
    viewAll: "View All",
    featuredBadge: "Featured",
    loadMore: "Load More Listings",
    loadMoreRemaining: "Load More Listings ({count} remaining)",
    loadingMore: "Loading more listings...",
    allAdsLoaded: "All {count} listings are displayed",
    shuffleAds: "Randomize Feed",
    noAdsFound: "No listings found!",
    noAdsInCity: "No listings found in «{city}»!",
    viewAllIranAds: "View All Listings",
    priceNegotiable: "Negotiable",
    currencyToman: "Tomans",
    justNow: "Just now",
    minutesAgo: "{mins}m ago",
    hoursAgo: "{hrs}h ago",
    daysAgo: "{days}d ago",
    adSaved: "Added to saved listings",
    adUnsaved: "Removed from saved listings",
    savedAdsTitle: "Your Bookmarked Listings",
    savedAdsEmpty: "You haven't saved any listings yet",
    savedAdsEmptyDesc: "Click the bookmark icon on any listing to save it here for later.",
    browseAdsBtn: "Browse Listings",
    filterAll: "All",
    filterPhoto: "With Photos",
    filterCheap: "Lowest Price",
    filterExpensive: "Highest Price",
    allAdsFilter: "All Listings",
    withPhotoFilter: "With Photos",
    cheapestFilter: "Lowest Price",
    mostExpensiveFilter: "Highest Price",
    randomizeFeed: "Randomize Feed",
    loadMoreAds: "Load More Listings",
    themeLight: "Light",
    themeDark: "Dark (Black & White)",
    themeSystem: "System Default",
    langFa: "فارسی",
    langEn: "English",
    langDe: "Deutsch",
    deleteAd: "Delete Listing",
    deleteAdConfirm: "Are you sure you want to delete this listing? This action cannot be undone.",
    cancel: "Cancel",
    confirmDelete: "Yes, Delete",
    deleting: "Deleting...",
    comingSoonTitle: "Messages Coming Soon!",
    comingSoonDesc: "Direct real-time chat between buyers and sellers is under active development.",
    gotIt: "Got It",
    contactSeller: "Contact Information & Chat",
    sellerPhone: "Seller Phone Number",
    adDetails: "Listing Specifications",
    safetyWarning: "Safe Shopping Guide: Never pay a deposit before inspecting the item in person.",
    description: "Description",
    categoryVehicles: "Vehicles & Cars",
    categoryRealEstate: "Real Estate & Housing",
    categoryElectronic: "Electronics & Gadgets",
    categoryJobs: "Jobs & Employment",
    categoryHomeKitchen: "Home & Kitchen",
    categoryServices: "Services & Business",
    categoryPersonal: "Personal Goods & Fashion",
    categoryIndustrial: "Industrial & Office",
    categoryEntertainment: "Hobbies & Leisure",
  },

  // === German (LTR) ===
  de: {
    appName: "Sheypoor",
    appTagline: "Kostenlose Kleinanzeigen, Immobilien, Fahrzeuge & Jobs",
    home: "Startseite",
    categories: "Kategorien",
    savedAds: "Gespeichert",
    messages: "Nachrichten",
    myAccount: "Mein Konto",
    myAds: "Meine Anzeigen",
    postAd: "Anzeige aufgeben",
    adminPanel: "Admin-Bereich",
    logout: "Abmelden",
    login: "Anmelden / Registrieren",
    loginSubtitle: "Geben Sie Ihre Telefonnummer ein, um fortzufahren",
    searchPlaceholder: "In allen Anzeigen suchen...",
    searchInCityPlaceholder: "Anzeigen in {city} suchen...",
    allIran: "Ganzes Land",
    selectCity: "Ort auswählen",
    popularCities: "Beliebte Städte",
    allProvinces: "Alle Bundesländer",
    searchCityPlaceholder: "Stadt oder Region suchen...",
    clearCityFilter: "Filter zurücksetzen",
    showingCityAds: "Anzeigen für: {city}",
    recentAds: "Aktuelle Kleinanzeigen",
    recentAdsSubtitle: "Sheypoor, Ihr kostenloser Marktplatz",
    otherRecentAds: "Weitere neue Inserate",
    nationwideShowcase: "Bundesweites Schaufenster",
    nationwideShowcaseSubtitle: "Top-Angebote und hervorgehobene Inserate.",
    viewAll: "Alle anzeigen",
    featuredBadge: "Top",
    loadMore: "Mehr Anzeigen laden",
    loadMoreRemaining: "Mehr Anzeigen laden ({count} übrig)",
    loadingMore: "Weitere Anzeigen werden geladen...",
    allAdsLoaded: "Alle {count} Anzeigen werden angezeigt",
    shuffleAds: "Neu mischen",
    noAdsFound: "Keine Anzeigen gefunden!",
    noAdsInCity: "Keine Anzeigen in «{city}» gefunden!",
    viewAllIranAds: "Alle Anzeigen anzeigen",
    priceNegotiable: "Verhandelbar",
    currencyToman: "Toman",
    justNow: "Gerade eben",
    minutesAgo: "Vor {mins} Min.",
    hoursAgo: "Vor {hrs} Std.",
    daysAgo: "Vor {days} Tagen",
    adSaved: "Zu Favoriten hinzugefügt",
    adUnsaved: "Aus Favoriten entfernt",
    savedAdsTitle: "Ihre gespeicherten Anzeigen",
    savedAdsEmpty: "Sie haben noch keine Anzeigen gespeichert",
    savedAdsEmptyDesc: "Klicken Sie auf das Lesezeichen-Symbol, um Inserate hier zu merken.",
    browseAdsBtn: "Anzeigen durchsuchen",
    filterAll: "Alle",
    filterPhoto: "Mit Fotos",
    filterCheap: "Günstigste",
    filterExpensive: "Teuerste",
    allAdsFilter: "Alle Inserate",
    withPhotoFilter: "Mit Fotos",
    cheapestFilter: "Günstigste",
    mostExpensiveFilter: "Teuerste",
    randomizeFeed: "Neu mischen",
    loadMoreAds: "Mehr Anzeigen laden",
    themeLight: "Hell",
    themeDark: "Dunkel (Schwarz-Weiß)",
    themeSystem: "Systemstandard",
    langFa: "فارسی",
    langEn: "English",
    langDe: "Deutsch",
    deleteAd: "Anzeige löschen",
    deleteAdConfirm: "Möchten Sie dieses Inserat wirklich löschen? Dieser Vorgang kann nicht rückgängig gemacht werden.",
    cancel: "Abbrechen",
    confirmDelete: "Ja, löschen",
    deleting: "Wird gelöscht...",
    comingSoonTitle: "Nachrichten in Kürze verfügbar!",
    comingSoonDesc: "Der Direkt-Chat zwischen Käufer und Verkäufer wird derzeit entwickelt.",
    gotIt: "Verstanden",
    contactSeller: "Kontakt & Chat",
    sellerPhone: "Telefonnummer des Verkäufers",
    adDetails: "Details & Spezifikationen",
    safetyWarning: "Sicherheitshinweis: Zahlen Sie niemals eine Anzahlung vor der Besichtigung.",
    description: "Beschreibung",
    categoryVehicles: "Fahrzeuge & Autos",
    categoryRealEstate: "Immobilien & Wohnen",
    categoryElectronic: "Elektronik & Geräte",
    categoryJobs: "Jobs & Stellenangebote",
    categoryHomeKitchen: "Haus & Küche",
    categoryServices: "Dienstleistungen",
    categoryPersonal: "Mode & Persönliches",
    categoryIndustrial: "Gewerbe & Industrie",
    categoryEntertainment: "Freizeit & Hobbys",
  },
};

/**
 * Gets currently saved language
 */
export function getSavedLanguage() {
  if (typeof window === "undefined") return LANGUAGES.FA;
  return localStorage.getItem(LANG_KEY) || LANGUAGES.FA;
}

/**
 * Checks whether current language is Right-to-Left (RTL)
 */
export function isRtl(lang = getSavedLanguage()) {
  return lang === LANGUAGES.FA;
}

/**
 * Sets current language and updates HTML attributes
 */
export function setLanguage(lang) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LANG_KEY, lang);
  applyLanguage(lang);
  window.dispatchEvent(new CustomEvent("sheypoor_lang_changed", { detail: lang }));
}

/**
 * Applies direction and lang attribute to HTML tag
 */
export function applyLanguage(lang = getSavedLanguage()) {
  if (typeof window === "undefined") return;
  const rtl = isRtl(lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = rtl ? "rtl" : "ltr";
}

/**
 * Translates a key with optional dynamic variable interpolation
 */
export function t(key, params = {}, lang = getSavedLanguage()) {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.fa;
  let text = dict[key] || TRANSLATIONS.fa[key] || key;

  if (params && typeof params === "object") {
    Object.keys(params).forEach((k) => {
      text = text.replace(new RegExp(`\\{${k}\\}`, "g"), params[k]);
    });
  }
  return text;
}

// Initial bootstrap
if (typeof window !== "undefined") {
  applyLanguage();
}
