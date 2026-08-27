import AddAdvertising from "../Components/Templates/AddAdvertising";
import AdsList from "../Components/Templates/AdsList";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="min-h-screen bg-light-3 py-6">
      <div className="max-w-container mx-auto px-4">
        {/* Header Breadcrumb & Title */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-light-0">
          <div>
            <h1 className="text-heading-3 text-dark-0">داشبورد کاربری</h1>
            <p className="text-body-3 text-dark-3 mt-1">مدیریت و ثبت آگهی‌های شما در شیپور</p>
          </div>
          <Link to="/saved" className="btn-outline text-body-3 !h-10 !px-4 hidden tablet:inline-flex">
            مشاهده ذخیره‌ها
          </Link>
        </div>

        <div className="space-y-12">
          {/* Post New Ad Section */}
          <section>
            <AddAdvertising />
          </section>

          {/* User Ads Section */}
          <section className="pt-6">
            <div className="flex items-center gap-3 mb-6">
              <img src="/sheypoorBlack.svg" alt="" className="w-6 h-6" />
              <h2 className="text-heading-4 text-dark-0">
                آگهی‌های ثبت‌شده شما
              </h2>
            </div>
            <AdsList />
          </section>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
