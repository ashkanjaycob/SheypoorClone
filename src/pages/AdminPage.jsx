import CategoryForm from "../Components/Templates/CategoryForm";
import CategoryDeletionForm from "../Components/Templates/CategoryDeletionForm";
import ScraperForm from "../Components/Templates/ScraperForm";
import AllAds from "../Components/Templates/AllAds";
import CategoryList from "../Components/Templates/CategoryList";
import { Link } from "react-router-dom";

function AdminPage() {
  return (
    <div className="min-h-screen bg-light-3 py-6">
      <div className="max-w-container mx-auto px-4">
        {/* Header Title */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-light-0">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-heading-3 text-dark-0">پنل مدیریت ادمین</h1>
              <span className="badge-promoted">مدیر کل</span>
            </div>
            <p className="text-body-3 text-dark-3 mt-1">مدیریت دسته‌بندی‌ها، انتقال داده و حذف تمامی آگهی‌ها</p>
          </div>
          <Link to="/" className="btn-outline text-body-3 !h-10 !px-4">
            ← بازگشت به سایت
          </Link>
        </div>

        {/* Current Categories Preview */}
        <div className="mb-8">
          <h2 className="text-heading-4 text-dark-0 mb-4">دسته‌بندی‌های فعلی سیستم</h2>
          <CategoryList />
        </div>

        {/* Category Forms Grid */}
        <div className="grid grid-cols-1 laptop:grid-cols-2 gap-6 mb-10">
          <CategoryForm />
          <CategoryDeletionForm />
        </div>

        {/* Scraper Tool */}
        <div className="mb-12">
          <ScraperForm />
        </div>

        {/* All Ads Admin Management */}
        <section className="pt-6 border-t border-light-0">
          <div className="flex items-center gap-3 mb-6">
            <img src="/sheypoorBlack.svg" alt="" className="w-6 h-6" />
            <h2 className="text-heading-4 text-dark-0">
              مدیریت و نظارت بر کلیه آگهی‌ها
            </h2>
          </div>
          <AllAds isAdmin={true} />
        </section>
      </div>
    </div>
  );
}

export default AdminPage;