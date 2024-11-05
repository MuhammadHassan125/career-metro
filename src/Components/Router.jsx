import { Route, Routes } from "react-router-dom"
import Login from '../Pages/Login'
import Register from '../Pages/Register'
import ForgetPassword from '../Pages/ForgotPassword'
import MainLayout from '../Layouts/MainLayout'
import Dashboard from '../Pages/Dashboard'
import Documents from '../Pages/Documents'
import UploadDocuments from '../Pages/UploadDocuments';
import Recommendations from '../Pages/Recommendations';
import MapCareer from '../Pages/MapCareer/MapCareer';
import MapSinglePath from '../Pages/MapSinglePath'
import MapZoom from '../Pages/MapZoom'
import MapSelectedPath from '../Pages/MapSelectedPath'
import Path from '../Pages/Path'
import ListCareerPath from '../Pages/ListCareerPath'
import GuestRoute from "./GuestRoute"
import AuthRoute from "./AuthRoute"
import ResetPassword from "../Pages/ResetPassword"
import VerifyOtp from "../Pages/VerifyOtp"
import Profile from "../Pages/Profile"
import ProfileLayout from "../Layouts/ProfileLayout"
import PaymentCheckout from "../Pages/PaymentCheckout"
import CancelCheckout from "../Pages/PaymentCheckout/CancelCheckout"
import Success from "../Pages/PaymentCheckout/SuccessCheckout"
import EditPath from "../Pages/UploadDocuments/EditPath"
import FullPageFormLayout from "../Layouts/FullPageFormLayout"
import ExportPdf from '../Pages/ExportPdf'

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

export default Router