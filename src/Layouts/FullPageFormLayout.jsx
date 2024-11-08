import '../Pages/Login/index.scss'
import { Outlet } from 'react-router-dom'
import LayoutWrapper from './LayoutWrapper'

const FullPageFormLayout = () => {
  return (
    <LayoutWrapper>
      <main className="login-section">
        <div className="login-form">
            <Outlet />
        </div>
        </main>
    </LayoutWrapper>
  )
}

export default FullPageFormLayout