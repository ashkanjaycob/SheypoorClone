import  { Toaster } from "react-hot-toast";
import CtegoryList from "../Components/Templates/CategoryList";
import AllAds from "../Components/Templates/AllAds";

function Homepage() {

  return (
    <>
    <div className="container mx-auto py-6">
    <CtegoryList />
    <div className="flex items-center mb-8 mt-12 px-2">
      <img className="w-7 laptop:w-8 ml-4" src="/sheypoorBlack.svg" alt="شیپور" />
      <h2 className="font-bold text-xl laptop:text-2xl text-gray-800">آگهی های جدید سراسر ایران
      </h2>
    </div>
    <AllAds />
    <Toaster />
    </div>
    </>
  )
}

export default Homepage