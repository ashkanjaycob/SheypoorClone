<div align="center">

<img src="public/sheypoor-Logo.png" alt="Sheypoor Logo" width="120" />

# 🚀 شیپور کلون — پلتفرم نیازمندی‌های آنلاین و دستیار هوش مصنوعی
### Sheypoor Clone — Next-Generation Classifieds Marketplace & AI Copilot

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-Passing_22/22-729B1B.svg?logo=vitest)](https://vitest.dev/)
[![PWA](https://img.shields.io/badge/PWA-Ready-orange.svg?logo=pwa)](https://web.dev/progressive-web-apps/)
[![i18n](https://img.shields.io/badge/i18n-FA_|_EN_|_DE-blueviolet.svg)](#-internationalization-i18n)

<p align="center">
  <b>یک وب‌اپلیکیشن جامع، مدرن و فوق‌سریع برای خرید و فروش آنلاین، مجهز به دستیار هوشمند، مسکات سه‌بعدی متحرک، موتور جستجوی زبان طبیعی، استودیوی ضبط ویس و سیستم چندزبانه.</b>
  <br />
  <i>A modern, ultra-fast classifieds marketplace platform equipped with an AI Copilot, 3D animated layered mascot, NLP smart search, voice messaging studio, and multi-language support.</i>
</p>

---

[فارسی](#-راهنمای-فارسی) • [English](#-english-documentation)

---

</div>

<a name="-راهنمای-فارسی"></a>
# 🇮🇷 مستندات فارسی پروژه

## 📑 فهرست مطالب
1. [معرفی کلی و اهداف پروژه](#-معرفی-کلی)
2. [معماری و ساختار پروژه (Architecture)](#-معماری-و-ساختار-پروژه)
3. [تکنولوژی‌ها و ابزارهای مورد استفاده (Tech Stack)](#-تکنولوژیها-و-ابزارها)
4. [قابلیت‌ها و امکانات کلیدی (Key Features)](#-قابلیتها-و-امکانات-کلیدی)
5. [مجموعه تست‌های خودکار (Testing Suite)](#-تستهای-خودکار)
6. [نصب و راه‌اندازی محلی (Getting Started)](#-نصب-و-راهاندازی-محلی)
7. [متغیرهای محیطی (Environment Variables)](#-متغیرهای-محیطی)

---

## 🌟 معرفی کلی
پروژه **Sheypoor Clone** یک بازطراحی مدرن، بهینه‌سازی‌شده و ماژولار از سامانه نیازمندی‌های آنلاین شیپور است که با تمرکز بر سرعت بالا، تجربه کاربری روان (SPA/PWA)، قابلیت‌های پیشرفته هوش مصنوعی و طراحی چشم‌نواز (High-End Aesthetics) پیاده‌سازی شده است.

---

## 🏗️ معماری و ساختار پروژه

معماری پروژه بر پایه الگوهای ماژولار و تفکیک دغدغه‌ها (Separation of Concerns) طراحی شده است:

```text
sheypoorClone/
├── public/                     # فایل‌های استاتیک، تصاویر مسکات و آیکون‌های PWA
│   └── AI-MASCAT/              # لایه‌های گرافیکی مسکات (کلاه، سر، چشم‌ها، دست‌ها، بدن)
├── src/
│   ├── Components/             # کامپوننت‌های رابط کاربری
│   │   ├── AI/                 # کامپوننت‌های هوش مصنوعی (Mascot, Copilot, Results, Negotiator, Overlay)
│   │   ├── Layout/             # اسکلت برنامه (Header, Footer, MobileBottomNav, Modals)
│   │   └── Templates/          # فرم‌ها و بخش‌های اصلی صفحات (آگهی‌ها، ادمین، ثبت آگهی، OTP)
│   ├── Services/               # لایه سرویس‌ها و منطق ارتباط با API
│   │   ├── aiAgent.js          # کنترلر تعاملی PageAgent و اتوماسیون DOM
│   │   ├── aiSmartSearchEngine.js # موتور استخراج نیت و امتیازدهی هوشمند به آگهی‌ها
│   │   ├── aiNotificationService.js # سرویس ارسال وب پوش و نوتیفیکیشن‌های درون‌برنامه‌ای
│   │   ├── Token.js            # مدیریت چرخه حیات توکن‌ها و جلوگیری از Refresh Loop
│   │   └── user.js             # سرویس دریافت اطلاعات پروفایل، آگهی‌ها و دسته‌بندی‌ها
│   ├── Utils/                  # توابع کمکی و یوتیلیتی‌ها
│   │   ├── Numbers.js          # تبدیل اعداد فارسی/انگلیسی و جداکننده ارقام
│   │   ├── adTranslator.js     # موتور ترجمه پویا برای عناوین، شهرها، قیمت‌ها و زمان
│   │   ├── aiStorage.js        # مدیریت محلی کانفیگ و تاریخچه چت دستیار هوشمند
│   │   ├── bookmarks.js        # سیستم نشان‌کردن آگهی‌ها با CustomEvent
│   │   ├── cookie.js           # مدیریت کوکی‌های امن با پشتیبانی کامل از SSR و Lax
│   │   ├── i18n.js             # موتور بین‌المللی‌سازی (FA, EN, DE) و تغییر جهت RTL/LTR
│   │   ├── location.js         # پایگاه داده ۳۱ استان و شهرهای ایران با فیلتر بلادرنگ
│   │   └── theme.js            # مدیریت تم لایت / دارک با کنتراست بالا و سینک سیستمی
│   ├── __tests__/              # مجموعه تست‌های جامع واحد و یکپارچگی (Vitest)
│   │   ├── aiIntentExtraction.test.js # تست سناریوهای استخراج قصد کاربر با هوش مصنوعی
│   │   ├── aiSmartSearch.test.js      # تست فرمت قیمت، ذخیره تاریخچه و نوتیفیکیشن
│   │   ├── aiMascotAndOffsets.test.js # اعتبارسنجی کالیبراسیون لایه‌های مسکات
│   │   └── coreUtilities.test.js      # تست یوتیلیتی‌های هسته، کوکی، نشان‌ها و زبان‌ها
│   ├── configs/                # پیکربندی Axios و اینترسپتورها (Api.js, PostApi.js)
│   ├── pages/                  # صفحات اصلی (Homepage, Category, AdPage, Dashboard, Admin, Auth, MascotLab)
│   ├── router/                 # مسیریابی SPA با React Router v6
│   └── styles/                 # استایل‌های Tailwind و فونت‌های فارسی وزیرمتن
├── package.json                # وابستگی‌ها و اسکریپت‌ها
└── vite.config.js              # پیکربندی Vite و پلاگین PWA
```

---

## 🛠️ تکنولوژی‌ها و ابزارها

| بخش | ابزار / کتابخانه | توضیحات |
| :--- | :--- | :--- |
| **هسته فرانت‌اند** | React 18.2 + Vite 5.0 | محیط توسعه و کامپایل فوق سریع با Fast Refresh |
| **استایل‌دهی و طراحی** | TailwindCSS 3.4 | طراحی اختصاصی بر پایه Design System، لایت و دارک مد |
| **انیمیشن و فیزیک** | Framer Motion 13 | انیمیشن‌های روان مسکات، باز شدن مدال‌ها و ترنزیشن‌ها |
| **مدیریت کش و داده‌ها** | TanStack React Query v4 | واکشی، کش هوشمند و همگام‌سازی وضعیت داده‌ها |
| **مدیریت فرم و اعلان‌ها** | React Hot Toast + SweetAlert2 | نمایش نوتیفیکیشن‌ها و دیالوگ‌های تایید مدرن |
| **تست خودکار** | Vitest 4.1 | فریم‌ورک تست سریع واحد با پوشش ۲۲ سناریوی مختلف |
| **بین‌المللی‌سازی** | Custom i18n Engine | پشتیبانی از سه زبان فارسی (RTL)، انگلیسی و آلمانی (LTR) |
| **هوش مصنوعی** | PageAgent + NLP Engine | استخراج نیت، سرچ هوشمند، پیشنهاد قیمت و چت دستیار |
| **مدیریت وب اپلیکیشن** | Vite Plugin PWA | قابلیت نصب به صورت برنامه وب پیشرونده با کش آفلاین |

---

## ✨ قابلیت‌ها و امکانات کلیدی

### ۱. دستیار هوشمند شیپور (Sheypoor AI Copilot)
- **مسکات سه‌بعدی چندلایه (Layered 3D Mascot):** متشکل از لایه‌های مجزای کلاه، سر، چشم‌ها، دهان، دست‌ها و بدن با فیزیک شناور و واکنش به نشانگر ماوس.
- **موتور استخراج نیت معنایی (NLP Search):** تحلیل زبان طبیعی کوئری‌ها (مثلاً *«خودرو زیر ۵۰۰ میلیون تومان در تهران»*) و استخراج خودکار سقف قیمت، شهر و دسته‌بندی.
- **پردازش ۴ مرحله‌ای با نمایش وضعیت (AI HUD):** تحلیل معنایی، اسکن عمیق پایگاه‌داده، ارزیابی تطابق و گلچین بهترین نتایج همراه با رادارهای نوری.
- **استودیوی ضبط صدا (Voice Message Studio):** امکان ضبط صوت با میکروفون، پیش‌نمایش پخش صدا، تبدیل بلادرنگ صوت به متن، ویرایش دستی متن و ارسال به دستیار.
- **دستیار چانه‌زنی و مذاکره قیمت (Price Negotiator):** ایجاد پیام‌های مودبانه و متقاعدکننده برای گرفتن تخفیف از فروشنده بر اساس درصد تخفیف و استراتژی مذاکره.
- **سیستم نوتیفیکیشن SPA:** اعلان‌های Web Push در کنار سیستم Fallback نوتیفیکیشن‌های درون‌برنامه‌ای.
- **پنل مدیریت تنظیمات هوش مصنوعی:** امکان تست و تغییر کلید API و مدل هوش مصنوعی در پنل ادمین.

### ۲. رابط کاربری واکنش‌گرا و مدرن (High-End UI/UX)
- **تم دوگانه لایت و دارک (B&W Dark Mode):** حالت دارک عمیق با رنگ‌بندی دقیق برای کاهش خستگی چشم.
- **چندزبانه کامل:** جابه‌جایی آنی زبان میان فارسی، انگلیسی و آلمانی با تغییر خودکار جهت صفحه (`dir="rtl"` / `dir="ltr"`).
- **بهینه‌سازی کامل برای موبایل:** منوی چسبنده پایین (Sticky Bottom Nav)، کارت‌های هوشمند و خروج تک‌لمسی از حساب کاربری در بالای داشبورد.

### ۳. مدیریت آگهی‌ها و امکانات هسته
- **سیستم فیلتر ۳۱ استان و شهرهای ایران:** جستجو و انتخاب لحظه‌ای استان‌ها و شهرها با ذخیره‌سازی محلی.
- **نشان‌کردن آگهی‌ها (Bookmarks):** ذخیره‌سازی محلی آگهی‌های موردعلاقه با اطلاع‌رسانی بلادرنگ میان کامپوننت‌ها.
- **ثبت و مدیریت آگهی:** آپلود تصاویر، اعتبارسنجی ارقام و قیمت‌ها با ارقام فارسی.

### ۴. اسکرپر خودکار داده‌ها از شیپور (Live Sheypoor Data Scraper)
- **انتقال هوشمند و بلادرنگ آگهی‌ها:** مجهز به موتور اسکرپر اختصاصی در پنل مدیریت (`ScraperForm`) که به ادمین اجازه می‌دهد با وارد کردن لینک هر دسته‌بندی از شیپور، آگهی‌های واقعی، عکس‌ها، قیمت‌ها، شهر و جزییات را به صورت خودکار واکشی کرده و مستقیماً در دیتابیس بارگذاری کند.
- **تغذیه دیتابیس با داده‌های واقعی:** امکان پر کردن سریع و واقعی پایگاه داده با آگهی‌های زنده بازار برای تست، فیلتر و جستجوی هوشمند.

---

## 🧪 تست‌های خودکار (Testing Suite)

پروژه شامل **۲۲ تست خودکار** جامع در ۴ سوئیت مجزا با فریم‌ورک **Vitest** است:

```bash
# اجرای تمامی تست‌ها
npm test
```

### پوشش سناریوهای تست:
1. `src/__tests__/aiIntentExtraction.test.js`: تست استخراج نیت، سقف قیمت، دسته‌بندی و پایداری در برابر ورودی‌های نامعتبر.
2. `src/__tests__/aiSmartSearch.test.js`: تست فرمت‌کننده قیمت‌ها، انواع داده‌های ورودی، سریال‌سازی تاریخچه چت و پشتیبانی از نوتیفیکیشن.
3. `src/__tests__/aiMascotAndOffsets.test.js`: اعتبارسنجی مختصات و کالیبراسیون دقیق لایه‌های مسکات.
4. `src/__tests__/coreUtilities.test.js`: تست توابع تبدیل اعداد (`e2p`, `p2e`, `sp`)، مدیریت کوکی‌ها، تم، مکان‌یابی و سیستم چندزبانه.

---

## 💻 نصب و راه‌اندازی محلی

### پیش‌نیازها
- **Node.js**: نسخه 18.0 یا بالاتر
- **npm**: نسخه 9.0 یا بالاتر

### مراحل اجرا:
```bash
# ۱. کلون کردن مخزن
git clone https://github.com/ashkanjaycob/SheypoorClone.git
cd SheypoorClone

# ۲. نصب پکیج‌ها
npm install

# ۳. اجرای سرور توسعه (Development)
npm run dev

# ۴. اجرای تست‌های خودکار
npm test

# ۵. ساخت خروجی پروداکشن (Production Build)
npm run build
```

---

## 🔐 متغیرهای محیطی

یک فایل `.env` در ریشه پروژه با مقادیر زیر بسازید:

```env
# آدرس سرور بک‌اند
VITE_BASE_URL=http://localhost:5000/

# کلید هوش مصنوعی (اختیاری - از طریق پنل ادمین نیز قابل تنظیم است)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

---

<a name="-english-documentation"></a>
# 🇬🇧 English Documentation

## 📑 Table of Contents
1. [Overview](#-overview)
2. [Architecture & Directory Structure](#-architecture--directory-structure)
3. [Technology Stack](#-technology-stack)
4. [Key Features & Capabilities](#-key-features--capabilities)
5. [Automated Testing Suite](#-automated-testing-suite)
6. [Getting Started Locally](#-getting-started-locally)
7. [Environment Variables](#-environment-variables)

---

## 🌟 Overview
**Sheypoor Clone** is a state-of-the-art, high-performance classifieds marketplace web application built with React 18, Vite 5, TailwindCSS, and an advanced AI Copilot. It features an interactive 3D layered animated mascot, natural language search intent extraction, audio voice messaging studio, automated price negotiation, and full multi-language (Persian, English, German) internationalization.

---

## 🏗️ Architecture & Directory Structure

```text
src/
├── Components/         # UI Components
│   ├── AI/             # Mascot, Copilot, Results Modal, Price Negotiator, Overlay
│   ├── Layout/         # Header, Footer, MobileBottomNav, Modal system
│   └── Templates/      # Ad Listings, Admin Panels, Ad Creation, OTP Authentication
├── Services/           # Business Logic & Backend API Integration
│   ├── aiAgent.js      # PageAgent Controller & DOM Automation
│   ├── aiSmartSearchEngine.js # NLP Intent Parser & Scoring Algorithms
│   ├── aiNotificationService.js # Web Push Notifications & In-App Toast Fallbacks
│   ├── Token.js        # JWT Management & Infinite Loop Refresh Guard
│   └── user.js         # Profile, Listings & Category APIs
├── Utils/              # Core Utilities
│   ├── Numbers.js      # Persian/English Digit Translators & Thousands Separators
│   ├── adTranslator.js # Dynamic Translation for Titles, Cities, Prices & Timestamps
│   ├── aiStorage.js    # LocalStorage Config & Chat History Persistence
│   ├── bookmarks.js    # Saved Listings Management via Custom Events
│   ├── cookie.js       # Safe Cookie Manager with SSR & SameSite Support
│   ├── i18n.js         # Multi-language Engine (FA, EN, DE) with RTL/LTR Sync
│   ├── location.js     # Database of 31 Iranian Provinces & Cities
│   └── theme.js        # High-Contrast B&W Dark/Light Theme Switcher
└── __tests__/          # Vitest Automated Test Suites (22/22 Passing)
```

---

## 🛠️ Technology Stack

- **Core Framework**: React 18.2, Vite 5.0
- **Styling**: TailwindCSS 3.4 with custom typography and color tokens
- **Animations**: Framer Motion 13
- **Data Fetching & Caching**: TanStack React Query v4
- **Feedback & Alerts**: React Hot Toast, SweetAlert2
- **Testing**: Vitest 4.1
- **PWA & Service Worker**: Vite Plugin PWA
- **Date & Calendar**: Moment-Jalaali

---

## ✨ Key Features & Capabilities

### 1. AI Copilot & 3D Layered Mascot
- **Modular 3D Layered Avatar**: Independently calibrated layers (hat, head, body, waving hands, blinking eyes, lips) with floating physics and cursor parallax.
- **Natural Language Intent Extraction**: Automatically infers search intent, price ceiling, category, and target city from free-form conversational queries.
- **Voice Message Studio**: Record voice notes via browser MediaRecorder, listen to playback preview, edit real-time speech-to-text transcriptions, and execute search.
- **Smart Deal Negotiator**: Crafts personalized, polite, and persuasive discount requests based on discount percentage and negotiation strategy.
- **SPA Push Notification Hub**: Triggers browser Web Push notifications with animated in-app toast fallbacks.

### 2. Modern Design & Accessibility
- **High-Contrast Dark Mode**: Tailored black-and-white theme designed for minimal eye strain and sleek aesthetics.
- **Tri-Language Internationalization (i18n)**: Seamless instant switching between Persian (RTL), English (LTR), and German (LTR).
- **Mobile-First UX**: Fixed bottom navigation bar, card layouts optimized for one-handed operation, and a 1-tap logout button on the user dashboard.

### 3. Live Sheypoor Data Scraper Engine
- **Automated Listing Ingestion**: Features a built-in scraper tool in the Admin Panel (`ScraperForm`) that enables administrators to input any Sheypoor category URL and automatically fetch, parse, and ingest real listings, images, prices, locations, and descriptions directly into the database.
- **Real Marketplace Seed Data**: Quickly populates the application with real-world classified ads from across Iran for authentic testing, search matching, and AI recommendations.

---

## 🧪 Automated Testing Suite

The application includes **22 automated tests** across 4 suites:

```bash
npm test
```

```text
 ✓ src/__tests__/coreUtilities.test.js (8 tests)
 ✓ src/__tests__/aiSmartSearch.test.js (7 tests)
 ✓ src/__tests__/aiMascotAndOffsets.test.js (2 tests)
 ✓ src/__tests__/aiIntentExtraction.test.js (5 tests)

 Test Files  4 passed (4)
      Tests  22 passed (22)
```

---

## 💻 Getting Started Locally

```bash
# 1. Clone repository
git clone https://github.com/ashkanjaycob/SheypoorClone.git
cd SheypoorClone

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Run test suite
npm test

# 5. Build for production
npm run build
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_BASE_URL=http://localhost:5000/
VITE_GEMINI_API_KEY=your_api_key_here
```

---

<div align="center">
  <sub>Built with ❤️ by Ashkan Yaghoobi</sub>
</div>
