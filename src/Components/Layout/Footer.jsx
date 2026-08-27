import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-light-2 laptop:block hidden">
      {/* Main Footer Content */}
      <div className="max-w-container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 laptop:grid-cols-4 gap-8">
          {/* Column 1: شیپور */}
          <div>
            <h4 className="text-heading-5 text-dark-0 mb-4">شیپور</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-body-2 text-dark-3 hover:text-main transition-colors">درباره شیپور</a></li>
              <li><a href="#" className="text-body-2 text-dark-3 hover:text-main transition-colors">بلاگ</a></li>
              <li><a href="#" className="text-body-2 text-dark-3 hover:text-main transition-colors">فرصت‌های شغلی</a></li>
              <li><a href="#" className="text-body-2 text-dark-3 hover:text-main transition-colors">نقشه سایت</a></li>
            </ul>
          </div>

          {/* Column 2: راهنمای مشتریان */}
          <div>
            <h4 className="text-heading-5 text-dark-0 mb-4">راهنمای مشتریان</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-body-2 text-dark-3 hover:text-main transition-colors">سوالات متداول</a></li>
              <li><a href="#" className="text-body-2 text-dark-3 hover:text-main transition-colors">تماس با پشتیبانی</a></li>
              <li><a href="#" className="text-body-2 text-dark-3 hover:text-main transition-colors">راهنما و پشتیبانی</a></li>
              <li><a href="#" className="text-body-2 text-dark-3 hover:text-main transition-colors">قوانین و مقررات</a></li>
            </ul>
          </div>

          {/* Column 3: خدمات */}
          <div>
            <h4 className="text-heading-5 text-dark-0 mb-4">خدمات</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-body-2 text-dark-3 hover:text-main transition-colors">همه فروشگاه‌ها</a></li>
              <li><a href="#" className="text-body-2 text-dark-3 hover:text-main transition-colors">همه مشاوران</a></li>
              <li><a href="#" className="text-body-2 text-dark-3 hover:text-main transition-colors">قیمت روز خودرو</a></li>
              <li><a href="#" className="text-body-2 text-dark-3 hover:text-main transition-colors">قیمت روز مسکن</a></li>
            </ul>
          </div>

          {/* Column 4: دانلود اپلیکیشن */}
          <div>
            <h4 className="text-heading-5 text-dark-0 mb-4">دانلود اپلیکیشن شیپور</h4>
            <div className="space-y-3">
              {/* Direct APK Download */}
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-white rounded-sheypoor border border-light-0 hover:border-main hover:shadow-card transition-all group">
                <svg className="w-8 h-8 text-main" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <div className="text-right">
                  <span className="text-body-4 text-dark-3 block">دانلود مستقیم</span>
                  <span className="text-body-2 font-semibold text-dark-0 group-hover:text-main transition-colors">اپلیکیشن اندروید</span>
                </div>
              </button>

              {/* iOS */}
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-white rounded-sheypoor border border-light-0 hover:border-main hover:shadow-card transition-all group">
                <svg className="w-8 h-8 text-dark-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-right">
                  <span className="text-body-4 text-dark-3 block">دانلود از</span>
                  <span className="text-body-2 font-semibold text-dark-0 group-hover:text-main transition-colors">اپ استور</span>
                </div>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-3 mt-6">
              <div className="w-16 h-16 bg-white rounded-sheypoor border border-light-0 flex items-center justify-center" title="نماد اعتماد الکترونیکی">
                <span className="text-body-4 text-dark-3 text-center leading-tight">نماد<br/>اعتماد</span>
              </div>
              <div className="w-16 h-16 bg-white rounded-sheypoor border border-light-0 flex items-center justify-center" title="ساماندهی">
                <span className="text-body-4 text-dark-3 text-center leading-tight">ساماندهی</span>
              </div>
              <div className="w-16 h-16 bg-white rounded-sheypoor border border-light-0 flex items-center justify-center" title="اتحادیه کسب و کار">
                <span className="text-body-4 text-dark-3 text-center leading-tight">اتحادیه</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-light-1 border-t border-light-0">
        <div className="max-w-container mx-auto px-4 py-4">
          <div className="flex flex-col laptop:flex-row items-center justify-between gap-3">
            <div className="text-body-3 text-dark-3">
              کلیه حقوق این سایت متعلق به شرکت نت تجارت اهورا (شیپور) است.
              <Link to="https://linkedin.com/in/ashkanyaghobi" target="_blank" className="text-main hover:text-main-darker mr-1 transition-colors">
                توسعه داده شده توسط اشکان یعقوبی
              </Link>
            </div>
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a href="#" className="text-dark-3 hover:text-main transition-colors" aria-label="لینکدین">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                </svg>
              </a>
              <a href="#" className="text-dark-3 hover:text-main transition-colors" aria-label="توییتر">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="text-dark-3 hover:text-main transition-colors" aria-label="اینستاگرام">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
