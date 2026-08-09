import CategoryForm from "../Components/Templates/CategoryForm"
import AllAds from "../Components/Templates/AllAds"
import ScraperForm from "../Components/Templates/ScraperForm"

function AdminPage() {
  return (
    <>
  <div className="container mx-auto">
  <h2 className="mb-12 font-bold text-blue-600 text-[2rem] p-4 border-b-2">پنل ادمین</h2>
    <CategoryForm />
    <ScraperForm />
    
    <div className="mt-16">
      <h2 className="mb-8 font-bold text-blue-600 text-[2rem] p-4 border-b-2">مدیریت آگهی‌ها</h2>
      <AllAds isAdmin={true} />
    </div>
  </div>
    </>
  )
}

export default AdminPage