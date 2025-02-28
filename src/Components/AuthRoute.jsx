// import { Suspense, useMemo } from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import Loading from "./Loading";

// const AuthRoute = () => {
//   const userVisitedDashboard = useMemo(
//     () => localStorage.getItem("user-visited-dashboard"),
//     []
//   );
//   return userVisitedDashboard ? (
//     <Suspense fallback={<Loading />}>
//       <Outlet />
//     </Suspense>
//   ) : (
//     <Navigate to="/login" />
//   );
// };

// export default AuthRoute;

import { Suspense, useEffect, useMemo } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loading from "./Loading";

const AuthRoute = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("user-visited-dashboard", tokenFromUrl);
      window.location.reload();
    }
  }, []);

  const userVisitedDashboard = useMemo(() => localStorage.getItem('user-visited-dashboard'), []);

  return userVisitedDashboard ? (
    <Suspense fallback={<Loading />}>
      <Outlet />
    </Suspense>
  ) : (
    <Navigate to="/login" />
  );
};

export default AuthRoute;
