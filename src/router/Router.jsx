import { Routes, Route } from "react-router-dom";
import Authpage from "../pages/Authpage";
import Homepage from "../pages/Homepage";
import Dashboard from "../pages/Dashboard";
import AdminPage from "../pages/AdminPage";
import NotFound from "../pages/NotFound";

function Router() {
  return (
    <Routes>
    <Route path="/" element={<Homepage />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/auth" element={<Authpage />} />
    <Route path="/admin" element={<AdminPage />} />
    <Route path="/*" element={<NotFound />} />
  </Routes>
  )
}

export default Router