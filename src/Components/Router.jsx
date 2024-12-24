import React, { lazy, useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";
import FullPageFormLayout from "../Layouts/FullPageFormLayout";
import GuestRoute from "./GuestRoute";
import AuthRoute from "./AuthRoute";
import { Snackbar } from "../Utils/SnackbarUtils";


const Login = lazy(() => import("../Pages/Login"));
const Register = lazy(() => import("../Pages/Register"));
const ForgetPassword = lazy(() => import("../Pages/ForgotPassword"));
const ResetPassword = lazy(() => import("../Pages/ResetPassword"));
const VerifyOtp = lazy(() => import("../Pages/VerifyOtp"));
const Dashboard = lazy(() => import("../Pages/Dashboard"));
const MapCareer = lazy(() => import("../Pages/MapCareer/MapCareer"));
const Profile = lazy(() => import("../Pages/Profile"));
const AdminDashboard = lazy(() => import("../Pages/AdminDashboard"));
const AdminUsers = lazy(() => import("../Pages/AdminUser"));
const AdminRoles = lazy(() => import("../Pages/AdminRoles"));
const AdminSkills = lazy(() => import("../Pages/AdminSkills"));
const AdminActivity = lazy(() => import("../Pages/AdminActivity"));
const AdminPermissions = lazy(() => import("../Pages/AdminPermissions"));
const NotFound = lazy(() => import("../Pages/NotFound"));
const Documents = lazy(() => import('../Pages/Documents'));
const UploadDocuments = lazy(() => import('../Pages/UploadDocuments'));
const Recommendations = lazy(() => import('../Pages/Recommendations'));
const MapSinglePath = lazy(() => import('../Pages/MapSinglePath'));
const MapZoom = lazy(() => import('../Pages/MapZoom'));
const MapSelectedPath = lazy(() => import('../Pages/MapSelectedPath'));
const Path = lazy(() => import('../Pages/Path'));
const ListCareerPath = lazy(() => import('../Pages/ListCareerPath'));
const PaymentCheckout = lazy(() => import("../Pages/PaymentCheckout"));
const CancelCheckout = lazy(() => import("../Pages/PaymentCheckout/CancelCheckout"));
const Success = lazy(() => import("../Pages/PaymentCheckout/SuccessCheckout"));
const EditPath = lazy(() => import("../Pages/UploadDocuments/EditPath"));
const AdminEditPermission = lazy(() => import("../Pages/AdminEditPermission"))
const AdminPaths = lazy(() => import("../Pages/AdminPaths"));
const AdminPathMap = lazy(() => import("../Pages/AdminPathMap"));
const ExportPdf = lazy(() => import('../Pages/ExportPdf'));

const guestRoutes = [
  "/login",
  "/register",
  "/forget-password",
  "/reset-password",
  "/verify-otp",
];

const Router = () => {
  const { pathname } = useLocation();
  const [userRole, setUserRole] = useState(localStorage.getItem("user-role"));
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("user-role");
    setUserRole(role || "User");

    if (!role && !guestRoutes.indexOf(pathname)) {
      navigate("/login");
    }
  }, [navigate]);

  const clientRoutes = (
    <>
      <Route path="/" element={<Dashboard />} />
      <Route path="documents" element={<Documents />} />
      <Route path="map-career" element={<MapCareer />} />
      <Route path="recommendations" element={<Recommendations />} />
      <Route path="map-career/:id" element={<MapSinglePath />} />
      <Route path="map-zoom" element={<MapZoom />} />
      <Route path="map-selected-path" element={<MapSelectedPath />} />
      <Route path="path" element={<Path />} />
      <Route path="path/:id/edit" element={<EditPath />} />
      <Route path="add-path" element={<UploadDocuments />} />
      <Route path="list-career-path/:id" element={<ListCareerPath />} />
      <Route path="profile" element={<Profile />} />
      <Route path="payment-checkout" element={<PaymentCheckout />} />
      <Route path="/cancel" element={<CancelCheckout />} />
      <Route path="/success" element={<Success />} />
      <Route path='get-pdf/:id' element={<ExportPdf />} target='_blank' />
    </>
  );

  const adminRoutes = (
    <>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/users" element={<AdminUsers />} />
      <Route path="/roles" element={<AdminRoles />} />
      <Route path="/admin-activities" element={<AdminActivity />} />
      <Route path="/admin-skills/:id" element={<AdminSkills />} />
      <Route path="/admin-paths" element={<AdminPaths />} />
      <Route path="/admin-paths/:id" element={<AdminPathMap />} />
      <Route path="/permissions" element={<AdminPermissions />} />
      <Route path="/edit-role/:id" element={<AdminEditPermission />} />
      <Route path="map-career/:id" element={<MapSinglePath />} />
    </>
  );

  const handleLogout = () => {
    localStorage.removeItem("user-role");
    Snackbar("Logged out successfully!", { variant: "success" });
    navigate("/login");
  };

  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route element={<FullPageFormLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forget-password" element={<ForgetPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="verify-otp" element={<VerifyOtp />} />
        </Route>
      </Route>

      <Route element={<AuthRoute />}>
        <Route element={<MainLayout onLogout={handleLogout} />}>
          {userRole === "User" ? clientRoutes : adminRoutes}
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
