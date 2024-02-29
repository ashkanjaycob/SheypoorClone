import CategoryForm from "../Components/Templates/CategoryForm"


function AdminPage() {
  return (
    <>
  <div className="container mx-auto">
  <h2 className="mb-12 font-bold text-blue-600 text-[2rem] py-4 border-b-2">پنل ادمین</h2>
    <CategoryForm />
  </div>
    </>
  )
}

export default AdminPage