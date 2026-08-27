import { Link } from "react-router-dom";

const vehicleHubs = [
  { label: "خودرو سواری", icon: "/car.svg", color: "bg-blue-50", path: "/" },
  { label: "موتورسیکلت", icon: "/car.svg", color: "bg-orange-50", path: "/" },
  { label: "قیمت روز خودرو", icon: "/car.svg", color: "bg-green-50", path: "/" },
  { label: "خودرو اقساطی", icon: "/car.svg", color: "bg-purple-50", path: "/" },
];

const realEstateHubs = [
  { label: "خرید مسکونی", icon: "/home.svg", color: "bg-emerald-50", path: "/" },
  { label: "اجاره مسکونی", icon: "/home.svg", color: "bg-sky-50", path: "/" },
  { label: "خرید ویلا", icon: "/home.svg", color: "bg-amber-50", path: "/" },
  { label: "زمین و کلنگی", icon: "/home.svg", color: "bg-rose-50", path: "/" },
];

function SpecialtyHubs() {
  return (
    <section className="max-w-container mx-auto px-4 py-4">
      {/* Vehicle Hub */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <img src="/car.svg" className="w-6 h-6" alt="" />
          <h3 className="text-heading-5 text-dark-0">از خودرو کلاسیک تا ماشین سنگین</h3>
        </div>
        <div className="grid grid-cols-2 laptop:grid-cols-4 gap-3">
          {vehicleHubs.map((hub, i) => (
            <Link
              key={i}
              to={hub.path}
              className={`${hub.color} rounded-sheypoor-lg p-4 flex items-center gap-3 hover:shadow-card transition-all duration-200 group`}
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <img src={hub.icon} className="w-5 h-5" alt={hub.label} />
              </div>
              <span className="text-body-2 font-medium text-dark-1">{hub.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Real Estate Hub */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <img src="/home.svg" className="w-6 h-6" alt="" />
          <h3 className="text-heading-5 text-dark-0">املاک و مستغلات</h3>
        </div>
        <div className="grid grid-cols-2 laptop:grid-cols-4 gap-3">
          {realEstateHubs.map((hub, i) => (
            <Link
              key={i}
              to={hub.path}
              className={`${hub.color} rounded-sheypoor-lg p-4 flex items-center gap-3 hover:shadow-card transition-all duration-200 group`}
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <img src={hub.icon} className="w-5 h-5" alt={hub.label} />
              </div>
              <span className="text-body-2 font-medium text-dark-1">{hub.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SpecialtyHubs;
