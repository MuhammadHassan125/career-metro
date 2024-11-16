import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './index.scss';
import { Snackbar } from '../../Utils/SnackbarUtils';

const Sidebar = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('');
  
  useEffect(() => {
    const role = localStorage.getItem('user-role');
    setUserRole(role || 'User'); 
  }, []);

  const clientItems = [
    { id: 1, name: "Dashboard", link: "/" },
    { id: 2, name: "Career", link: "/map-career" },
    { id: 3, name: "All Paths", link: "/path" },
    { id: 4, name: "Settings", link: "/profile" },
  ];

  const adminItems = [
    { id: 5, name: "Dashboard", link: "/" },
    { id: 6, name: "Users", link: "/users" },
    { id: 7, name: "Roles", link: "/roles" },
    { id: 8, name: "Permissions", link: "/permissions" },
  ];

  const sidebarItems =
    userRole === 'User' ? clientItems : adminItems;

  const handleLogout = () => {
    localStorage.removeItem('user-visited-dashboard');
    localStorage.removeItem('user-role');
    navigate('/login');
    Snackbar('Logout successfully', { variant: 'success' });
  };

  return (
    <main className='sidebar-section'>
      <div className="sidebar-logo">
        <img src='/images/logo.png' alt='logo' />
      </div>
      {sidebarItems.map((sidebarItem) => (
        sidebarItem.link ? (
          <NavLink
            key={sidebarItem.id}
            to={sidebarItem.link}
            className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}
          >
            <ul>
              <li>{sidebarItem.name}</li>
            </ul>
          </NavLink>
        ) : (
          <div key={sidebarItem.id} className="sidebar-item inactive">
            <ul>
              <li>{sidebarItem.name}</li>
            </ul>
          </div>
        )
      ))}
      <div className="sidebar-item inactive" onClick={handleLogout}>
        <ul>
          <li>Logout</li>
        </ul>
      </div>
    </main>
  );
};

export default Sidebar;
