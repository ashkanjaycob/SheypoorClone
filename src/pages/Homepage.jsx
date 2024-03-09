import  { Toaster } from "react-hot-toast";
import CtegoryList from "../Components/Templates/CategoryList";
import AllAds from "../Components/Templates/AllAds";

function Homepage() {

  return (
    <>
    <div className="container mx-auto">
    <CtegoryList />
    <div className="flex mb-16">
      <img className="w-[30px] ml-4" src="/sheypoorBlack.svg" alt="" />
      <h2 className="font-bold text-[1.2rem]">آگهی های جدید سراسر ایران
      </h2>
    </div>
    <AllAds />
    <Toaster />
    </div>
    </>
  )
}

export default Homepage