import { Toaster } from "react-hot-toast";
import CategoryList from "../Components/Templates/CategoryList";
import SpecialtyHubs from "../Components/Templates/SpecialtyHubs";
import AllAds from "../Components/Templates/AllAds";

function Homepage() {
  return (
    <div className="min-h-screen bg-light-3">
      {/* 1. Categories Section */}
      <CategoryList />

      {/* 2. Specialty Hubs (Cars & Real Estate) */}
      <SpecialtyHubs />

      {/* Divider */}
      <div className="max-w-container mx-auto px-4">
        <div className="border-b border-light-0 my-2" />
      </div>

      {/* 3. Main Feed Section: 2 rows of ads -> Showcase Section -> All remaining ads with Load More */}
      <section id="all-ads-section" className="max-w-container mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <img
            className="w-7 laptop:w-8"
            src="/sheypoorBlack.svg"
            alt="شیپور"
          />
          <div>
            <h2 className="text-heading-4 laptop:text-heading-3 text-dark-0">
              جدیدترین آگهی‌های سراسر ایران
            </h2>
            <p className="text-body-3 text-dark-3 mt-0.5">
              شیپور، سایت نیازمندی‌های رایگان
            </p>
          </div>
        </div>

        {/* All Ads with Showcase in between 2 rows and remaining ads */}
        <AllAds withShowcase={true} />
      </section>

      <Toaster />
    </div>
  );
}

export default Homepage;