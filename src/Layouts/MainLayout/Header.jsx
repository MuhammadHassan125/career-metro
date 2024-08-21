import React from 'react';
import './index.scss';
import { IoSearchOutline } from "react-icons/io5";
import Badge from '@mui/material/Badge';
import { IoMdNotifications } from "react-icons/io";
import Avatar from '@mui/material/Avatar';
import { MdKeyboardArrowDown } from "react-icons/md";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { LuMenu } from "react-icons/lu";
import Drawer from '@mui/material/Drawer';
import { NavLink } from 'react-router-dom';
import { Snackbar } from '../../Utils/SnackbarUtils';
import {useUser} from '../../context/context';

const Header = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const open = Boolean(anchorEl);

    const navigate = useNavigate();
    const {user} = useUser();
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNavigateLogin = () => {
        navigate('/login');
    };

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const sidebarItems = [
        { id: 1, name: "Dashboard", link: "/dashboard" },
        { id: 2, name: "Career", link: "/map-career" },
        { id: 3, name: "Add Path", link: "/map-single-path" },
        { id: 4, name: "Documents", link: "/documents" },
        { id: 5, name: "Paths", link: "/path" },
        { id: 6, name: "Select Map", link: "/map-selected-path" },
        { id: 7, name: "Profile", link: "" },
        { id: 8, name: "Settings", link: "" },
        { id: 9, name: "Logout", link: "/login" }
    ];

    const handleLogout = () => {
        localStorage.removeItem('user-visited-dashboard');
        navigate('/login');
        Snackbar('Logout successfully', { variant: 'success' });
    }
    return (
        <>
            <main className='header-section'>
                {/* search box div  */}
                <div className='search-bar'>
                    <IoSearchOutline style={{ color: "1px solid #202224" }} />
                    <input
                        type='text'
                        placeholder='Search'
                    />
                </div>

                <div className='header-icons-right'>
                    <Badge color="error" badgeContent={6}>
                        <IoMdNotifications style={{ fontSize: "23px", color: "#3D42DF", cursor: "pointer" }} />
                    </Badge>

                    {/* menu drawer */}
                    <LuMenu className='menu-icon' style={{ fontSize: "23px", color: "#3D42DF", cursor: "pointer" }} onClick={toggleDrawer(true)} />

                    <Avatar alt="Travis Howard" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-VQAt_Jdn00BF0-hh3QGNhplTP3Tnp8J1nw&s" />
                    <div className='inter-font'>
                        <h3>{user?.data?.username}</h3>
                        <h5>Admin</h5>
                    </div>

                    <div className='dropdown-header'>
                        <MdKeyboardArrowDown onClick={handleClick} />
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem onClick={handleClose}>Profile</MenuItem>
                            <MenuItem onClick={handleClose}>My account</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </div>
                </div>
            </main>

            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                sx={{
                    // width: 600,
                }}
            >
                <div>
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
                </div>
            </Drawer>
        </>
    );
};

export default Header;
