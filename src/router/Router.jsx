import { Routes, Route } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Authpage from "../pages/Authpage";
import Homepage from "../pages/Homepage";
import Dashboard from "../pages/Dashboard";
import AdminPage from "../pages/AdminPage";
import NotFound from "../pages/NotFound";
import { getProfile } from "../Services/user";


function Router() {

  const { data, isLoading , error } = useQuery(["profile"] , getProfile);
  console.log({ data, isLoading , error });

  if ( isLoading) return <h1>is loading ... </h1>

  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/auth" element={<Authpage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}

export default Router;
