import { Link } from "react-router-dom";

const vehicleHubs = [
  { label: "خودرو سواری", icon: "🚗", path: "/category/vehicles" },
  { label: "موتورسیکلت", icon: "🏍️", path: "/category/vehicles" },
  { label: "قیمت روز خودرو", icon: "📊", path: "/category/vehicles" },
  { label: "خودرو اقساطی", icon: "💳", path: "/category/vehicles" },
];

const realEstateHubs = [
  { label: "خرید مسکونی", icon: "🏠", path: "/category/realstate" },
  { label: "اجاره مسکونی", icon: "🔑", path: "/category/realstate" },
  { label: "خرید ویلا", icon: "🏡", path: "/category/realstate" },
  { label: "زمین و کلنگی", icon: "🏗️", path: "/category/realstate" },
];

function SpecialtyHubs() {
  return (
    <section className="max-w-container mx-auto px-4 py-6">
      {/* Vehicle Hub */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🚘</span>
          <h3 className="text-heading-5 text-dark-0">از خودرو کلاسیک تا ماشین سنگین</h3>
        </div>
        <div className="grid grid-cols-2 laptop:grid-cols-4 gap-3">
          {vehicleHubs.map((hub, i) => (
            <Link
              key={i}
              to={hub.path}
              className="bg-white border border-light-0 rounded-sheypoor-lg p-4 flex items-center gap-3 hover:border-main/40 hover:shadow-card-hover transition-all duration-200 group"
            >
              <div className="w-10 h-10 bg-light-2 rounded-full flex items-center justify-center text-lg group-hover:bg-light-special group-hover:scale-110 transition-all">
                {hub.icon}
              </div>
              <span className="text-body-2 font-medium text-dark-1 group-hover:text-main transition-colors">{hub.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Real Estate Hub */}
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🏢</span>
          <h3 className="text-heading-5 text-dark-0">املاک و مستغلات</h3>
        </div>
        <div className="grid grid-cols-2 laptop:grid-cols-4 gap-3">
          {realEstateHubs.map((hub, i) => (
            <Link
              key={i}
              to={hub.path}
              className="bg-white border border-light-0 rounded-sheypoor-lg p-4 flex items-center gap-3 hover:border-main/40 hover:shadow-card-hover transition-all duration-200 group"
            >
              <div className="w-10 h-10 bg-light-2 rounded-full flex items-center justify-center text-lg group-hover:bg-light-special group-hover:scale-110 transition-all">
                {hub.icon}
              </div>
              <span className="text-body-2 font-medium text-dark-1 group-hover:text-main transition-colors">{hub.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SpecialtyHubs;
