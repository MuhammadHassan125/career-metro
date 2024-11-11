import { Route, Routes } from "react-router-dom"
import React, {  lazy } from 'react';
import MainLayout from '../Layouts/MainLayout'
import ProfileLayout from "../Layouts/ProfileLayout"
import FullPageFormLayout from "../Layouts/FullPageFormLayout"
import GuestRoute from "./GuestRoute"
import AuthRoute from "./AuthRoute"

const Login = lazy(() => import('../Pages/Login'));
const Register = lazy(() => import('../Pages/Register'));
const ForgetPassword = lazy(() => import('../Pages/ForgotPassword'));
const ResetPassword = lazy(() => import("../Pages/ResetPassword"));
const VerifyOtp = lazy(() => import("../Pages/VerifyOtp"));
const Dashboard = lazy(() => import('../Pages/Dashboard'));
const Documents = lazy(() => import('../Pages/Documents'));
const UploadDocuments = lazy(() => import('../Pages/UploadDocuments'));
const Recommendations = lazy(() => import('../Pages/Recommendations'));
const MapCareer = lazy(() => import('../Pages/MapCareer/MapCareer'));
const MapSinglePath = lazy(() => import('../Pages/MapSinglePath'));
const MapZoom = lazy(() => import('../Pages/MapZoom'));
const MapSelectedPath = lazy(() => import('../Pages/MapSelectedPath'));
const Path = lazy(() => import('../Pages/Path'));
const ListCareerPath = lazy(() => import('../Pages/ListCareerPath'));
const Profile = lazy(() => import("../Pages/Profile"));
const PaymentCheckout = lazy(() => import("../Pages/PaymentCheckout"));
const CancelCheckout = lazy(() => import("../Pages/PaymentCheckout/CancelCheckout"));
const Success = lazy(() => import("../Pages/PaymentCheckout/SuccessCheckout"));
const EditPath = lazy(() => import("../Pages/UploadDocuments/EditPath"));
const ExportPdf = lazy(() => import('../Pages/ExportPdf'));

const Router = () => {
  return (
   
      <Routes>
        <Route element={<GuestRoute />}>
          <Route element={<FullPageFormLayout/>}>
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path="forget-password" element={<ForgetPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="verify-otp" element={<VerifyOtp />} />
          </Route>
        </Route>
        <Route element={<AuthRoute />}>
          <Route element={<MainLayout />}>
            <Route path='/' element={<Dashboard />} index={true} />
            <Route path='documents' element={<Documents />} />
            <Route path='recommendations' element={<Recommendations />} />
            <Route path='map-career' element={<MapCareer />} />
            <Route path='map-career/:id' element={<MapSinglePath />} />
            <Route path='map-zoom' element={<MapZoom />} />
            <Route path='map-selected-path' element={<MapSelectedPath />} />
            <Route path='path' element={<Path />} />
            <Route path='path/:id/edit' element={<EditPath/>} />
            <Route path='add-path' element={<UploadDocuments />} />
            <Route path='list-career-path/:id' element={<ListCareerPath />} />
            <Route path='profile' element={<Profile />} />
            <Route path='payment-checkout' element={<PaymentCheckout />} />
            <Route path='/cancel' element={<CancelCheckout />} />
            <Route path='/success' element={<Success />} />
          </Route>

          <Route path='get-pdf/:id' element={<ExportPdf/>} target='_blank'/>

          <Route element={<ProfileLayout />}>
            <Route path='profile' element={<Profile />} index={true} />
          </Route>
        </Route>
      </Routes>
  )
}

export default Router;
