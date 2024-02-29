import AddAdvertising from "../Components/Templates/AddAdvertising";

function Dashboard() {
  return (
    <>
      <div className="container mx-auto">
        <h2 className="mb-12 py-4 border-b-2">داشبورد کاربری</h2>
        <AddAdvertising />
      </div>
    </>
  );
}

export default Dashboard;
