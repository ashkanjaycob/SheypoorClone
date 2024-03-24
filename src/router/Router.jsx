import { Routes, Route, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Authpage from "../pages/Authpage";
import Homepage from "../pages/Homepage";
import Dashboard from "../pages/Dashboard";
import AdminPage from "../pages/AdminPage";
import NotFound from "../pages/NotFound";
import Category from "../pages/Category";
import { getProfile } from "../Services/user";
import { ThreeCircles } from "react-loader-spinner";
import styles from "../router/loader.module.css";
import AdPage from "../pages/AdPage";

function Router() {
  // eslint-disable-next-line no-unused-vars
  const { data, isLoading, error } = useQuery(["profile"], getProfile);
  // console.log({ data, isLoading, error });

  if (isLoading) {
    return (
      <div className={styles.loader}>
        <ThreeCircles
          visible={true}
          height="60"
          width="60"
          color="#1a90ff"
          ariaLabel="three-circles-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/category/*" element={<Category />} />
      <Route path="/auth/*" element={<Authpage />} />
      <Route
        path="/dashboard/*"
        element={
          data ? (
            <Dashboard />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
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
      <Route path="/dashboard/:id" element={<AdPage userdata={data} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default Router;
