import { Routes, Route, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Authpage from "../pages/Authpage";
import Homepage from "../pages/Homepage";
import Dashboard from "../pages/Dashboard";
import AdminPage from "../pages/AdminPage";
import NotFound from "../pages/NotFound";
import { getProfile } from "../Services/user";
import { ThreeCircles } from "react-loader-spinner";
import styles from "../router/loader.module.css";

function Router() {
  const { data, isLoading, error } = useQuery(["profile"], getProfile);
  console.log({ data, isLoading, error });

  if (isLoading)
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

  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route
        path="/dashboard"
        element={data ? <Dashboard /> : <Navigate to="/auth" />}
      />
      <Route
        path="/auth"
        element={data ? <Navigate to="/dashboard" /> : <Authpage />}
      />
      <Route
        path="/admin"
        element={
          data && data.role === "ADMIN" ? <AdminPage /> : <Navigate to="/" />
        }
      />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}

export default Router;
