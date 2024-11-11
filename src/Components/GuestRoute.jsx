import { Suspense, useMemo } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import GuestLoading from "./GuestRoutesLoading";

const hasResetToken = () => !!localStorage.getItem('reset-token');
const hasOtpVerified = () => !!localStorage.getItem('otp-verified');

const GuestRoute = () => {
  const userVisitedDashboard = useMemo(() => localStorage.getItem('user-visited-dashboard'), []);
  const location = useLocation();
  
  if (userVisitedDashboard) {
    return <Navigate to="/" />;
  }

  if (location.pathname === '/reset-password' && !hasResetToken()) {
    return <Navigate to="/forget-password" />;
  }

  if (location.pathname === '/verify-otp' && !hasOtpVerified()) {
    return <Navigate to="/register" />;
  }

  return  <Suspense fallback={<GuestLoading/>}><Outlet /></Suspense>;
};

export default GuestRoute;
