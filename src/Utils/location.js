/**
 * Location utility — manages the active city filter with localStorage persistence
 * and live custom events for instant component sync.
 */

const STORAGE_KEY = "sheypoor_selected_city";
export const ALL_IRAN = "all";

export const POPULAR_CITIES = [
  "تهران",
  "مشهد",
  "اصفهان",
  "شیراز",
  "تبریز",
  "کرج",
  "قم",
  "اهواز",
  "رشت",
  "بابل",
  "آمل",
  "ساری",
  "قائم شهر",
  "گرگان",
  "ارومیه",
  "کرمانشاه",
  "همدان",
  "کاشان",
  "کرمان",
  "یزد",
  "بوشهر",
  "بندرعباس",
];

export const ALL_CITIES = [
  { province: "تهران", cities: ["تهران", "اسلامشهر", "شهریار", "قدس", "ملارد", "ورامین", "پاکدشت", "ری", "دماوند", "پردیس", "اندیشه"] },
  { province: "مازندران", cities: ["ساری", "بابل", "آمل", "قائم شهر", "نوشهر", "چالوس", "تنکابن", "بابلسر", "محمودآباد", "رامسر", "سرخرود"] },
  { province: "خراسان رضوی", cities: ["مشهد", "نیشابور", "سبزوار", "تربت حیدریه", "کاشمر", "قوچان", "گناباد"] },
  { province: "اصفهان", cities: ["اصفهان", "کاشان", "خمینی‌شهر", "نجف‌آباد", "شاهین‌شهر", "فولادشهر", "لنجان"] },
  { province: "فارس", cities: ["شیراز", "مرودشت", "جهرم", "فسا", "کازرون", "داراب", "لار"] },
  { province: "آذربایجان شرقی", cities: ["تبریز", "مراغه", "مرند", "میانه", "اهر", "بناب"] },
  { province: "البرز", cities: ["کرج", "فردیس", "کمال‌شهر", "نظرآباد", "محمدشهر", "هشتگرد"] },
  { province: "گیلان", cities: ["رشت", "بندر انزلی", "لاهیجان", "لنگرود", "تالش", "آستارا", "صومعه‌سرا"] },
  { province: "خوزستان", cities: ["اهواز", "دزفول", "آبادان", "ماهشهر", "خرمشهر", "شوشتر", "مسجدسلیمان"] },
  { province: "قم", cities: ["قم"] },
  { province: "آذربایجان غربی", cities: ["ارومیه", "خوی", "بوکان", "مهاباد", "میاندوآب", "سلماس", "شاهین دژ"] },
  { province: "کرمانشاه", cities: ["کرمانشاه", "اسلام‌آباد غرب", "کنگاور", "جوانرود"] },
  { province: "گلستان", cities: ["گرگان", "گنبد کاووس", "علی‌آباد کتول", "بندر ترکمن"] },
  { province: "کرمان", cities: ["کرمان", "سیرجان", "رفسنجان", "جیرفت", "بم"] },
  { province: "همدان", cities: ["همدان", "ملایر", "نهاوند", "تویسرکان", "اسدآباد"] },
  { province: "یزد", cities: ["یزد", "میبد", "اردکان", "بافق"] },
  { province: "هرمزگان", cities: ["بندرعباس", "میناب", "قشم", "کیش", "بندر لنگه"] },
  { province: "بوشهر", cities: ["بوشهر", "برازجان", "گناوه", "کنگان", "عسلویه"] },
  { province: "سیستان و بلوچستان", cities: ["زاهدان", "زابل", "چابهار", "ایرانشهر", "سراوان"] },
  { province: "قزوین", cities: ["قزوین", "الوند", "تاکستان", "آبیک"] },
  { province: "زنجان", cities: ["زنجان", "ابهر", "خرمدره"] },
  { province: "مرکزی", cities: ["اراک", "ساوه", "خمین", "محلات"] },
  { province: "کردستان", cities: ["سنندج", "سقز", "مریوان", "بانه"] },
  { province: "لرستان", cities: ["خرم‌آباد", "بروجرد", "دورود", "کوهدشت"] },
  { province: "اردبیل", cities: ["اردبیل", "پارس‌آباد", "مشگین‌شهر", "خلخال"] },
  { province: "چهارمحال و بختیاری", cities: ["شهرکرد", "بروجن", "فارسان"] },
  { province: "سمنان", cities: ["سمنان", "شاهرود", "دامغان", "گرمسار"] },
  { province: "ایلام", cities: ["ایلام", "دهلران", "ایوان"] },
  { province: "کهگیلویه و بویراحمد", cities: ["یاسوج", "دوگنبدان", "دهدشت"] },
  { province: "خراسان جنوبی", cities: ["بیرجند", "قائن", "فردوس"] },
  { province: "خراسان شمالی", cities: ["بجنورد", "شیروان", "اسفراین"] },
];

/** Get currently selected city from localStorage (defaults to "all") */
export function getSelectedCity() {
  try {
    return localStorage.getItem(STORAGE_KEY) || ALL_IRAN;
  } catch {
    return ALL_IRAN;
  }
}

/** Set selected city and dispatch custom event */
export function setSelectedCity(cityName) {
  try {
    localStorage.setItem(STORAGE_KEY, cityName || ALL_IRAN);
  } catch (e) {
    console.error(e);
  }
  window.dispatchEvent(new CustomEvent("sheypoor_city_changed", { detail: cityName }));
}

/** Reset city filter to all Iran */
export function clearSelectedCity() {
  setSelectedCity(ALL_IRAN);
}

/** Returns the display label (e.g. "تهران" or "همه‌ی ایران") */
export function getCityDisplayLabel(cityValue) {
  if (!cityValue || cityValue === ALL_IRAN) return "همه‌ی ایران";
  return cityValue;
}
