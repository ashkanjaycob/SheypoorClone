import  { Toaster } from "react-hot-toast";
import CtegoryList from "../Components/Templates/CategoryList";

function Homepage() {
  return (
    <>
    <h1> Welcome To Home Page</h1>
    <CtegoryList />
    <Toaster />
    </>
  )
}

export default Homepage