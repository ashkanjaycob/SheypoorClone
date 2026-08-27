import { Routes, Route, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Authpage from "../pages/Authpage";
import Homepage from "../pages/Homepage";
import Dashboard from "../pages/Dashboard";
import AdminPage from "../pages/AdminPage";
import NotFound from "../pages/NotFound";
import Category from "../pages/Category";
import SavedAds from "../pages/SavedAds";
import AdPage from "../pages/AdPage";
import UpdateAdPage from "../pages/UpdateAdPage";
import { getProfile } from "../Services/user";

function Router() {
  const { data, isLoading } = useQuery(["profile"], getProfile, {
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-light-3">
        <div className="flex flex-col items-center gap-4">
          <img src="/sheypoorBlack.svg" alt="شیپور" className="w-12 h-12 animate-pulse" />
          <div className="w-8 h-8 border-3 border-main border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/category/:id" element={<Category />} />
      <Route path="/saved" element={<SavedAds />} />
      <Route path="/auth/*" element={<Authpage />} />
      
      {/* Ad Detail Pages */}
      <Route path="/dashboard/:id" element={<AdPage userdata={data} />} />
      <Route path="/post/:id" element={<AdPage userdata={data} />} />

      {/* Edit Ad */}
      <Route
        path="/dashboard/update/:id"
        element={data ? <UpdateAdPage /> : <Navigate to="/auth" replace />}
      />

      {/* User Dashboard */}
      <Route
        path="/dashboard/*"
        element={data ? <Dashboard /> : <Navigate to="/auth" replace />}
      />

      {/* Admin Panel */}
      <Route
        path="/admin/*"
        element={
          data && data.role === "ADMIN" ? (
            <AdminPage />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default Router;
