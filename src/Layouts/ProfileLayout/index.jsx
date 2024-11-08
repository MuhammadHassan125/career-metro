import React from 'react'
import Header from '../MainLayout/Header'
import { Outlet } from 'react-router-dom'
import LayoutWrapper from '../LayoutWrapper'

const ProfileLayout = () => {
    return (
        <LayoutWrapper>
            <main className='layout-section'>
                    <div className='dashboard-header'>
                        <Header />
                    </div>

                    <div className='dashboard-content'>
                        <Outlet />
                    </div>
            </main>
        </LayoutWrapper>
    )
}

export default ProfileLayout