import React, { Suspense } from 'react'
import './index.scss'
import Header from './Header'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import LayoutWrapper from '../LayoutWrapper'
import Loading from '../../Components/Loading'
// import Outlet from 'react-router-dom'
const Layout = () => {
  return (
    <LayoutWrapper>
      <main className='layout-section'>
        <div className='dashboard-sidebar'>
          <Sidebar />
        </div>

        <div className='dashboard-main'>
          <div className='dashboard-header'>
            <Header />
          </div>

          <div className='dashboard-content' style={{ position: 'relative' }}>
          <Suspense fallback={<Loading fullScreen={false} />}>
              <Outlet />
          </Suspense>
          </div>
        </div>


      </main>
    </LayoutWrapper>
  )
}

export default Layout