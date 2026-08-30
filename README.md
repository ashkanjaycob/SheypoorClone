<div align="center">

<img src="public/sheypoor-Logo.png" alt="Sheypoor Logo" width="120" />

# 🚀 Sheypoor Clone — Classifieds Marketplace & AI Copilot
### شیپور کلون — پلتفرم نیازمندی‌های آنلاین و دستیار هوش مصنوعی
### Sheypoor Klon — Kleinanzeigen-Marktplatz & KI-Copilot

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-Passing_22/22-729B1B.svg?logo=vitest)](https://vitest.dev/)
[![PWA](https://img.shields.io/badge/PWA-Ready-orange.svg?logo=pwa)](https://web.dev/progressive-web-apps/)
[![i18n](https://img.shields.io/badge/i18n-EN_|_FA_|_DE-blueviolet.svg)](#-table-of-contents)

<p align="center">
  <b>A modern, ultra-fast classifieds marketplace platform equipped with an AI Copilot, 3D animated layered mascot, NLP smart search, voice messaging studio, live Sheypoor scraper, and tri-lingual support (English, Persian, German).</b>
  <br />
  <i>یک وب‌اپلیکیشن جامع و پیشرفته برای خرید و فروش آنلاین، مجهز به دستیار هوشمند، مسکات سه‌بعدی متحرک، موتور جستجوی زبان طبیعی، استودیوی ویس و اسکرپر زنده داده‌ها.</i>
</p>

---

[🇬🇧 English](#-english-documentation) • [🇮🇷 فارسی](#-مستندات-فارسی) • [🇩🇪 Deutsch](#-deutsche-dokumentation)

---

</div>

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
**Sheypoor Clone** is a state-of-the-art classifieds marketplace web application built with React 18, Vite 5, TailwindCSS, and an advanced AI Copilot. It features an interactive 3D layered animated mascot, natural language search intent extraction, audio voice messaging studio, live Sheypoor web scraper, automated price negotiation, and full multi-language (Persian, English, German) internationalization.

---

## 🏗️ Architecture & Directory Structure

The project follows a clean, modular architecture with clear separation of concerns:

```text
sheypoorClone/
├── public/                     # Static assets, mascot layers & PWA icons
│   └── AI-MASCAT/              # 3D Mascot visual layers (hat, head, body, eyes, hands, lips)
├── src/
│   ├── Components/             # UI Components
│   │   ├── AI/                 # AI Mascot, Copilot, Results Modal, Negotiator, Loading Overlay
│   │   ├── Layout/             # Header, Footer, MobileBottomNav, LocationModal, ComingSoonModal
│   │   └── Templates/          # Ad Listings, Admin Panels, Ad Creation, OTP Authentication, Scraper
│   ├── Services/               # Business Logic & Backend API Integration
│   │   ├── aiAgent.js          # PageAgent Controller & DOM Automation
│   │   ├── aiSmartSearchEngine.js # NLP Intent Parser & Scoring Algorithms
│   │   ├── aiNotificationService.js # Web Push Notifications & In-App Toast Fallbacks
│   │   ├── Token.js            # JWT Management & Infinite Loop Refresh Guard
│   │   └── user.js             # Profile, Listings & Category APIs
│   ├── Utils/                  # Core Utilities
│   │   ├── Numbers.js          # Persian/English Digit Translators & Thousands Separators
│   │   ├── adTranslator.js     # Dynamic Translation for Titles, Cities, Prices & Timestamps
│   │   ├── aiStorage.js        # LocalStorage Config & Chat History Persistence
│   │   ├── bookmarks.js        # Saved Listings Management via Custom Events
│   │   ├── cookie.js           # Safe Cookie Manager with SSR & SameSite Support
│   │   ├── i18n.js             # Multi-language Engine (FA, EN, DE) with RTL/LTR Sync
│   │   ├── location.js         # Database of 31 Iranian Provinces & Cities
│   │   └── theme.js            # High-Contrast B&W Dark/Light Theme Switcher
│   ├── __tests__/              # Vitest Automated Test Suites (22/22 Passing)
│   │   ├── aiIntentExtraction.test.js # NLP intent parser & query scenario tests
│   │   ├── aiSmartSearch.test.js      # Ad price formatting, storage & notifications
│   │   ├── aiMascotAndOffsets.test.js # 3D Mascot calibration & offset verification
│   │   └── coreUtilities.test.js      # Cookies, digits, theme, bookmarks, location & i18n
│   ├── configs/                # Axios instances & interceptors (Api.js, PostApi.js)
│   ├── pages/                  # Route Pages (Homepage, Category, AdPage, Dashboard, Admin, Auth, MascotLab)
│   ├── router/                 # React Router v6 SPA Routing
│   └── styles/                 # TailwindCSS design tokens & Vazirmatn typography
├── package.json                # Dependencies & scripts
└── vite.config.js              # Vite bundler & PWA plugin configuration
```

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Core Framework** | React 18.2 + Vite 5.0 | Lightning-fast development & optimized production bundling |
| **Styling & Design** | TailwindCSS 3.4 | Custom design system tokens with High-Contrast B&W Dark Mode |
| **Animation & Physics** | Framer Motion 13 | Smooth mascot floating, eye-blinking, and dialog transitions |
| **Data Fetching & Cache** | TanStack React Query v4 | Smart caching, automatic invalidation & background refetching |
| **User Feedback** | React Hot Toast + SweetAlert2 | Animated in-app notifications and modern dialog confirmations |
| **Testing Engine** | Vitest 4.1 | 22 comprehensive unit & integration tests |
| **Internationalization** | Custom i18n Engine | Dynamic switching across Persian (RTL), English & German (LTR) |
| **AI & Automation** | PageAgent + NLP Engine | Conversational search, intent extraction & deal negotiation |
| **PWA Support** | Vite Plugin PWA | Service Worker offline caching and mobile app installation |

---

## ✨ Key Features & Capabilities

### 1. AI Copilot & 3D Layered Mascot
- **Modular 3D Layered Avatar**: Independently calibrated layers (hat, head, body, waving hands, blinking eyes, lips) with floating physics and cursor parallax.
- **Natural Language Intent Extraction**: Automatically infers search intent, price ceiling, category, and target city from free-form conversational queries.
- **4-Phase Reasoning HUD**: Real-time progress display tracking semantic understanding, database scan, deal analysis, and result curation with glowing radar rings.
- **Voice Message Studio**: Record voice notes via browser MediaRecorder, listen to playback preview, edit real-time speech-to-text transcriptions, and execute search.
- **Smart Deal Negotiator**: Crafts personalized, polite, and persuasive discount requests based on discount percentage and negotiation strategy.
- **SPA Push Notification Hub**: Triggers browser Web Push notifications with animated in-app toast fallbacks.

### 2. Live Sheypoor Data Scraper Engine
- **Automated Listing Ingestion**: Built-in scraper tool in the Admin Panel (`ScraperForm`) enabling administrators to input any Sheypoor category URL and automatically fetch, parse, and ingest real listings, images, prices, locations, and descriptions directly into the database.
- **Real Marketplace Seed Data**: Populates the application with real-world classified ads from across Iran for authentic testing, search matching, and AI recommendations.

### 3. Modern Design & Accessibility
- **High-Contrast Dark Mode**: Tailored black-and-white theme designed for minimal eye strain and sleek aesthetics.
- **Tri-Language Internationalization (i18n)**: Seamless instant switching between Persian (RTL), English (LTR), and German (LTR).
- **Mobile-First UX**: Fixed bottom navigation bar, card layouts optimized for one-handed operation, and a 1-tap logout button on the user dashboard.

---

## 🧪 Automated Testing Suite

The application includes **22 automated tests** across 4 suites:

```bash
npm test
```

```text
 RUN  v4.1.11 /Users/Ashi/Desktop/sheypoorClone

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

<a name="-مستندات-فارسی"></a>
# 🇮🇷 مستندات فارسی

## 📑 فهرست مطالب
1. [معرفی کلی پروژه](#-معرفی-کلی-پروژه)
2. [معماری و ساختار فایل‌ها](#-معماری-و-ساختار-فایلها)
3. [قابلیت‌ها و امکانات کلیدی](#-قابلیتها-و-امکانات-کلیدی)
4. [مجموعه تست‌های خودکار](#-مجموعه-تستهای-خودکار)
5. [راه‌اندازی و اجرای محلی](#-راهاندازی-و-اجرای-محلی)

---

## 🌟 معرفی کلی پروژه
پروژه **Sheypoor Clone** یک بازطراحی مدرن، بهینه‌سازی‌شده و ماژولار از سامانه نیازمندی‌های آنلاین شیپور است که با تمرکز بر سرعت بالا، تجربه کاربری روان (SPA/PWA)، دستیار هوش مصنوعی و طراحی چشم‌نواز پیاده‌سازی شده است.

---

## 🏗️ معماری و ساختار فایل‌ها

معماری پروژه بر پایه الگوهای ماژولار و تفکیک دغدغه‌ها (Separation of Concerns) طراحی شده است:
- **`src/Components/AI/`**: کامپوننت‌های دستیار هوشمند، مسکات سه‌بعدی، مدال نتایج، پیشنهاد قیمت و لودینگ هوشمند.
- **`src/Components/Layout/`**: اسکلت اصلی، هدر، فوتر، نوار ناوبری چسبنده موبایل و مدال‌های موقعیت مکانی.
- **`src/Components/Templates/`**: فرم‌های ثبت آگهی، لیست آگهی‌ها، پنل مدیریت، احراز هویت پیامکی و اسکرپر.
- **`src/Services/`**: لایه ارتباط با API، اتوماسیون PageAgent، موتور پردازش زبان طبیعی و مدیریت توکن‌ها.
- **`src/Utils/`**: توابع تبدیل ارقام فارسی، چندزبانه، تم تاریک/روشن، ذخیره‌سازی محلی و کوکی‌های امن.
- **`src/__tests__/`**: سوئیت تست‌های جامع با فریم‌ورک Vitest (شامل ۲۲ تست فعال).

---

## ✨ قابلیت‌ها و امکانات کلیدی

### ۱. دستیار هوشمند شیپور و مسکات سه‌بعدی متحرک
- **مسکات سه‌بعدی چندلایه:** متشکل از لایه‌های مجزای کلاه، سر، چشم‌ها، دهان، دست‌ها و بدن با فیزیک شناور و واکنش به نشانگر ماوس.
- **موتور استخراج نیت معنایی (NLP Search):** تحلیل زبان طبیعی کوئری‌ها (مثلاً *«خودرو زیر ۵۰۰ میلیون تومان در تهران»*) و استخراج خودکار سقف قیمت، شهر و دسته‌بندی.
- **پردازش ۴ مرحله‌ای با نمایش وضعیت (AI HUD):** تحلیل معنایی، اسکن عمیق دیتابیس، ارزیابی تطابق و گلچین بهترین نتایج همراه با رادارهای نوری.
- **استودیوی ضبط صدا (Voice Studio):** امکان ضبط صوت با میکروفون، پیش‌نمایش پخش صدا، تبدیل بلادرنگ صوت به متن، ویرایش دستی متن و ارسال به دستیار.
- **دستیار چانه‌زنی و پیشنهاد قیمت (Price Negotiator):** ایجاد پیام‌های مودبانه و متقاعدکننده برای گرفتن تخفیف بر اساس درصد تخفیف و استراتژی مذاکره.
- **سیستم نوتیفیکیشن SPA:** اعلان‌های Web Push در کنار سیستم نوتیفیکیشن‌های درون‌برنامه‌ای.

### ۲. اسکرپر خودکار داده‌ها از شیپور (Live Sheypoor Data Scraper)
- **انتقال هوشمند و بلادرنگ آگهی‌ها:** مجهز به موتور اسکرپر اختصاصی در پنل مدیریت (`ScraperForm`) که به ادمین اجازه می‌دهد با وارد کردن لینک هر دسته‌بندی از شیپور، آگهی‌های واقعی، عکس‌ها، قیمت‌ها، شهر و جزییات را به صورت خودکار واکشی کرده و مستقیماً در دیتابیس بارگذاری کند.
- **تغذیه دیتابیس با داده‌های واقعی:** امکان پر کردن سریع پایگاه داده با آگهی‌های زنده بازار برای تست، فیلتر و جستجوی هوشمند.

### ۳. رابط کاربری واکنش‌گرا و طراحی مدرن
- **تم دوگانه لایت و دارک (B&W Dark Mode):** حالت دارک عمیق با رنگ‌بندی دقیق برای کاهش خستگی چشم.
- **چندزبانه کامل:** جابه‌جایی آنی زبان میان فارسی، انگلیسی و آلمانی با تغییر خودکار جهت صفحه (`dir="rtl"` / `dir="ltr"`).
- **بهینه‌سازی کامل برای موبایل:** منوی چسبنده پایین (Sticky Bottom Nav)، کارت‌های هوشمند و خروج تک‌لمسی از حساب کاربری در بالای داشبورد.

---

## 🧪 مجموعه تست‌های خودکار

```bash
# اجرای تمامی تست‌ها
npm test
```
تمامی **۲۲ سناریوی تست** در ۴ فایل با موفقیت ۱۰۰٪ پاس می‌شوند:
- تست استخراج نیت و سناریوهای سرچ (`aiIntentExtraction.test.js`)
- تست فرمت قیمت، سریال‌سازی چت و نوتیفیکیشن (`aiSmartSearch.test.js`)
- تست کالیبراسیون و آفست‌های لایه‌های مسکات (`aiMascotAndOffsets.test.js`)
- تست توابع پایه، کوکی‌ها، تم و زبان‌ها (`coreUtilities.test.js`)

---

## 💻 راه‌اندازی و اجرای محلی

```bash
# ۱. نصب پکیج‌ها
npm install

# ۲. اجرای سرور توسعه
npm run dev

# ۳. اجرای تست‌ها
npm test

# ۴. ساخت نسخه پروداکشن
npm run build
```

---

<a name="-deutsche-dokumentation"></a>
# 🇩🇪 Deutsche Dokumentation

## 📑 Inhaltsverzeichnis
1. [Projektübersicht](#-projektübersicht)
2. [Architektur & Verzeichnisstruktur](#-architektur--verzeichnisstruktur)
3. [Hauptfunktionen & KI-Fähigkeiten](#-hauptfunktionen--ki-fähigkeiten)
4. [Automatisierte Tests](#-automatisierte-tests)
5. [Lokale Installation & Ausführung](#-lokale-installation--ausführung)

---

## 🌟 Projektübersicht
**Sheypoor Clone** ist eine moderne, hochperformante Kleinanzeigen-Plattform, die mit React 18, Vite 5, TailwindCSS und einem intelligenten KI-Copiloten entwickelt wurde. Die Anwendung bietet ein 3D-animiertes Maskottchen, semantische Suchanalyse (NLP), ein Sprachnachrichten-Studio, einen Live-Daten-Scraper von Sheypoor, Preisverhandlungsassistenten und vollständige Mehrsprachigkeit (Deutsch, Persisch, Englisch).

---

## 🏗️ Architektur & Verzeichnisstruktur

- **`src/Components/AI/`**: 3D-Maskottchen, KI-Copilot, Ergebnis-Modal, Preisverhandler und Lade-HUD.
- **`src/Components/Layout/`**: Header, Footer, Sticky-Navigation für Mobilgeräte und Standortfilter.
- **`src/Components/Templates/`**: Inseratsformulare, Anzeigenlisten, Admin-Panel, OTP-Authentifizierung und Scraper.
- **`src/Services/`**: API-Kommunikation, PageAgent-Automatisierung, NLP-Suchmaschine und Token-Verwaltung.
- **`src/Utils/`**: Zahlenkonvertierung, i18n-Engine, B&W Dark/Light Theme, LocalStorage und sichere Cookies.
- **`src/__tests__/`**: 22 automatisierte Unit- und Integrationstests mit Vitest.

---

## ✨ Hauptfunktionen & KI-Fähigkeiten

### 1. KI-Copilot & 3D-Mehrschicht-Maskottchen
- **Modulares 3D-Maskottchen**: Unabhängig kalibrierte Ebenen (Hut, Kopf, Körper, winkende Hände, blinzelnde Augen, Lippen) mit Schwebeflug-Physik und Maus-Parallaxe.
- **Natürliche Sprachanalyse (NLP)**: Automatische Erkennung von Preisobergrenzen, Städten und Kategorien aus Freitextanfragen.
- **4-Phasen-Reasoning-HUD**: Echtzeit-Visualisierung der semantischen Analyse, des Datenbank-Scans und der Top-Treffer.
- **Sprachnachrichten-Studio**: Audioaufnahme per MediaRecorder, Wiedergabevorschau, Speech-to-Text-Transkription in Echtzeit und Textbearbeitung vor dem Absenden.
- **Intelligenter Preisverhandler**: Erstellung höflicher, überzeugender Rabattanfragen basierend auf Verhandlungsstrategien.

### 2. Live-Sheypoor-Daten-Scraper
- **Automatische Inseratsübernahme**: Integriertes Tool im Admin-Panel (`ScraperForm`) zur Eingabe einer Sheypoor-Kategorie-URL und automatischen Speicherung von echten Inseraten, Bildern, Preisen und Beschreibungen in der Datenbank.

### 3. Modernes Design & Benutzerfreundlichkeit
- **B&W Dark Mode**: Kontrastreiches Schwarz-Weiß-Design zur Schonung der Augen.
- **Dreisprachig (i18n)**: Umschaltung zwischen Deutsch (LTR), Persisch (RTL) und Englisch (LTR).
- **Mobile-First**: Fixierte untere Navigationsleiste, touch-optimierte Dialoge und 1-Klick-Logout im Dashboard.

---

## 🧪 Automatisierte Tests

```bash
npm test
```

Alle **22 Testfälle** in 4 Suiten laufen zu 100 % erfolgreich durch:
- NLP-Absichtserkennung (`aiIntentExtraction.test.js`)
- Preisformatierung, Speicher & Benachrichtigungen (`aiSmartSearch.test.js`)
- Maskottchen-Kalibrierung (`aiMascotAndOffsets.test.js`)
- Core-Utilities, Cookies, Theme & i18n (`coreUtilities.test.js`)

---

## 💻 Lokale Installation & Ausführung

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Entwicklungsserver starten
npm run dev

# 3. Tests ausführen
npm test

# 4. Produktions-Build erstellen
npm run build
```

---

<div align="center">
  <sub>Built with ❤️ by Ashkan Yaghoobi</sub>
</div>
