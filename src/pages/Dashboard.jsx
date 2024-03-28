import AddAdvertising from "../Components/Templates/AddAdvertising";

function Dashboard() {
  return (
    <>
      <div className="container mx-auto">
        <h2 className="mb-12 font-bold text-blue-600 text-[2rem] py-4 border-b-2 px-4">داشبورد کاربری</h2>
        <AddAdvertising />
      </div>
    </>
  );
}

export default Dashboard;
