import AddAdvertising from "../Components/Templates/AddAdvertising";
import AdsList from "../Components/Templates/AdsList";

function Dashboard() {
  return (
    <div className="container mx-auto px-4 desktop:px-8 py-6">
      <h2 className="mb-8 font-bold text-blue-600 text-2xl laptop:text-3xl py-4 border-b-2 text-center laptop:text-right">
        داشبورد کاربری
      </h2>
      <div className="flex flex-col gap-12">
        <section>
          <AddAdvertising />
        </section>
        
        <hr className="border-gray-200" />
        
        <section>
          <h2 className="mb-8 font-bold text-blue-600 text-xl laptop:text-2xl py-2 text-center laptop:text-right">
            لیست آگهی‌های شما
          </h2>
          <AdsList />
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
