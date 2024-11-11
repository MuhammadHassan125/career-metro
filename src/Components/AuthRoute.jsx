import { Suspense, useMemo } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Loading from "./Loading";

const AuthRoute = () => {
  const userVisitedDashboard = useMemo(
    () => localStorage.getItem("user-visited-dashboard"),
    []
  );
  return userVisitedDashboard ? (
    <Suspense fallback={<Loading />}>
      <Outlet />
    </Suspense>
  ) : (
    <Navigate to="/login" />
  );
};

export default AuthRoute;
