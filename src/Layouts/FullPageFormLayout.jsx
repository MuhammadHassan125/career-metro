import '../Pages/Login/index.scss'
import { Outlet } from 'react-router-dom'
import LayoutWrapper from './LayoutWrapper'
import { Suspense } from 'react'
import GuestLoading from '../Components/GuestRoutesLoading'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { GoogleClientId } from '../Utils/contants'

const FullPageFormLayout = () => {
  return (
    <LayoutWrapper>
      <GoogleOAuthProvider clientId={GoogleClientId}>
      <main className="login-section">
        <div className="login-form">
        <Suspense fallback={<GuestLoading/>}>
            <Outlet />
        </Suspense>
        </div>
        </main>
      </GoogleOAuthProvider>
    </LayoutWrapper>
  )
}

export default FullPageFormLayout