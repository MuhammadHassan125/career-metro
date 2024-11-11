import '../Pages/Login/index.scss'
import { Outlet } from 'react-router-dom'
import LayoutWrapper from './LayoutWrapper'
import { Suspense } from 'react'
import GuestLoading from '../Components/GuestRoutesLoading'

const FullPageFormLayout = () => {
  return (
    <LayoutWrapper>
      <main className="login-section">
        <div className="login-form">
        <Suspense fallback={<GuestLoading/>}>
            <Outlet />
        </Suspense>
        </div>
        </main>
    </LayoutWrapper>
  )
}

export default FullPageFormLayout