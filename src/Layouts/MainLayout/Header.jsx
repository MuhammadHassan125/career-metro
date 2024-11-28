import React, { useEffect, useRef } from "react";
import "./index.scss";
import { IoSearchOutline } from "react-icons/io5";
import Badge from "@mui/material/Badge";
import { IoMdNotifications } from "react-icons/io";
import Avatar from "@mui/material/Avatar";
import { MdKeyboardArrowDown } from "react-icons/md";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import { LuMenu } from "react-icons/lu";
import Drawer from "@mui/material/Drawer";
import { NavLink } from "react-router-dom";
import { Snackbar } from "../../Utils/SnackbarUtils";
import { Box, Typography } from "@mui/material";
import { MdOutlineMarkChatUnread } from "react-icons/md";
import { MdOutlineMarkChatRead } from "react-icons/md";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import useFetch from "point-fetch-react";
import Fire from "../../Fire/Fire";
import { baseURL } from "../../Utils/contants";

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [openNotification, setOpenNotification] = React.useState(false);
  const [notifications, setNotifications] = React.useState(null);
  const [readAll, setReadAll] = React.useState(false);
  const [read, setRead] = React.useState(false);
  const [unread, setUnread] = React.useState(false);
  const [unseenCount, setUnseenCount] = React.useState(null);
  const previousUnseenCountRef = useRef(0);
  const audioRef = useRef(new Audio("./notification-sound.mp3"));
  const [userRole, setUserRole] = React.useState("");

  useEffect(() => {
    const role = localStorage.getItem("roleName");
    setUserRole(role || "User ");
  }, []);

  const open = Boolean(anchorEl);

  const navigate = useNavigate();
  const [user, setUser] = React.useState();
  const { get, put } = useFetch({ state: {} });
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigateProfile = () => {
    navigate("/profile");
  };

  const handleNavigateDashboard = () => {
    navigate("/");
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  // const sidebarItems = [
  //   { id: 1, name: "Dashboard", link: "/" },
  //   { id: 2, name: "Career", link: "/map-career" },
  //   { id: 3, name: "Add Path", link: "/map-single-path" },
  //   { id: 5, name: "All Paths", link: "/path" },
  //   { id: 8, name: "Settings", link: "" },
  //   { id: 9, name: "Logout", link: "/login" },
  // ];

  const clientItems = [
    { id: 1, name: "Dashboard", link: "/" },
    { id: 2, name: "Career", link: "/map-career" },
    { id: 3, name: "All Paths", link: "/path" },
    { id: 4, name: "Settings", link: "/profile" },
    { id: 9, name: "Logout", link: "/login" },
  ];

  const adminItems = [
    { id: 5, name: "Dashboard", link: "/" },
    { id: 6, name: "Users", link: "/users" },
    { id: 7, name: "Roles", link: "/roles" },
    { id: 8, name: "Permissions", link: "/permissions" },
    { id: 9, name: "Logout", link: "/login" },
  ];

  const sidebarItems = userRole === "User" ? clientItems : adminItems;
  const authToken = localStorage.getItem("user-visited-dashboard")

  const gettingProfileInfo = () => {
    if (!authToken) return;
    Fire.get({
      url: `${baseURL}/show-profile`,
      onSuccess: (res) => {
        setUser(res?.data || []);
      },
      onError: (err) => {
        setUser([]);
      },
    });
  };

  useEffect(() => {
    gettingProfileInfo();
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("user-visited-dashboard");
    navigate("/login");
    Snackbar("Logout successfully", { variant: "success" });
  };

  const handleToggle = () => {
    setOpenNotification(!openNotification);
    if (openNotification === false) {
      getNotification();
      handleSeenAllNotifications();
    }
    return;
  };

  const getNotification = () => {
    get({
      endPoint: `/get-notifications`,

      onSuccess: (res) => {
        setNotifications(res?.data?.data);
        setUnseenCount(res?.data?.data?.unseen_count);
      }
    });
  };

  const handleSeenAllNotifications = () => {
    put({ endPoint: `/update-seen-all-notifications-for-specific-user` });
  };

  const handleReadToggle = (id) => {
    setRead(!read);

    if (read === true) {
      handleReadSpecificNotifications(id);
    }
  };

  const handleReadSpecificNotifications = (id) => {
    put({
      endPoint: `/update-read-notification-for-specfic-user/${id}`,
      onSuccess: (res) => {
        getNotification();
      }
    });
  };

  const handleUnreadToggle = (id) => {
    setUnread(!unread);

    if (unread === true) {
      handleUnreadSpecificNotifications(id);
    }
  };
  const handleUnreadSpecificNotifications = (id) => {
    put({
      endPoint: `/update-unread-notification-for-specfic-user/${id}`,
      onSuccess: (res) => {
        getNotification();
      }
    });
  };

  const handleRead = () => {
    setReadAll(!readAll);

    if (readAll === true) {
      handleReadAllNotifications();
    }
  };
  const handleReadAllNotifications = () => {
    put({
      endPoint: `/update-read-all-notifications-for-specfic-user`,
      onSuccess: (res) => {
        getNotification();
      }
    });
  };

  useEffect(() => {
    getNotification();

    const pollInterval = setInterval(() => {
      getNotification();
    }, 30000);

    return () => clearInterval(pollInterval);
  }, []);

  useEffect(() => {
    if (unseenCount > previousUnseenCountRef.current) {
      audioRef.current.play();
    }
    previousUnseenCountRef.current = unseenCount;
  }, [unseenCount]);
  return (
    <>
      <main className="header-section">
        {/* search box div  */}
        <div className="search-bar">
          <IoSearchOutline style={{ color: "1px solid #202224" }} />
          <input type="text" placeholder="Search" />
        </div>

        <div className="header-icons-right">
          <Badge
            onClick={handleToggle}
            color="primary"
            badgeContent={unseenCount || 0}
            sx={{ position: "relative", zIndex: 999 }}
          >
            <IoMdNotifications
              style={{
                fontSize: "23px",
                color: "var(--primary-btn-color)",
                cursor: "pointer",
              }} />
            {openNotification && (
              <React.Fragment>
                <Box
                  sx={{
                    position: "absolute",
                    backgroundColor: "white",
                    padding: "10px 15px",
                    width: "240px",
                    height: "300px",
                    overflow: "auto",
                    marginLeft: "-50%",
                    top: 30,
                    left: -40,
                    zIndex: 99,
                    borderRadius: "5px",
                    boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    style={{
                      display: "flex",
                      borderBottom: "1px solid #f5f6fa",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "-15px",
                    }}
                  >
                    <h5>Notifications</h5>
                    <div>
                      <div
                        onClick={() => handleRead()}
                        style={{
                          fontSize: "20px",
                          cursor: "pointer",
                          background: "#f5f6fa",
                          borderRadius: "30px",
                          width: "25px",
                          height: "25px",
                          display: "flex",
                          alignItem: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MdOutlineMarkEmailUnread
                          style={{ marginTop: "5px", fontSize: "15px" }}
                        />
                      </div>
                      <p style={{ fontSize: "8px" }}>Read All</p>
                    </div>
                  </div>
                  {notifications?.notifications &&
                    notifications?.notifications?.length > 0 ? (
                    notifications?.notifications?.map((notification) => (
                      <React.Fragment>
                        <Box
                          key={notification.id}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            "&:hover": {
                              backgroundColor: "",
                              cursor: "pointer",
                            },
                          }}
                        >
                          <Box>
                            <p style={{ fontWeight: "bold", fontSize: "13px" }}>
                              {notification.title}
                            </p>
                            <p style={{ fontSize: "12px" }}>
                              {notification.description}
                            </p>
                          </Box>

                          <Box sx={{ mt: 2 }}>
                            {notifications.read === true ? (
                              <div
                                onClick={() =>
                                  handleUnreadToggle(notification.id)
                                }
                                style={{
                                  fontSize: "20px",
                                  cursor: "pointer",
                                  background: "#f5f6fa",
                                  borderRadius: "30px",
                                  width: "25px",
                                  height: "25px",
                                  display: "flex",
                                  alignItem: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <MdOutlineMarkChatRead
                                  style={{ marginTop: "5px", fontSize: "15px" }}
                                />
                              </div>
                            ) : (
                              <div
                                onClick={() =>
                                  handleReadToggle(notification.id)
                                }
                                style={{
                                  fontSize: "20px",
                                  cursor: "pointer",
                                  background: "#f5f6fa",
                                  borderRadius: "30px",
                                  width: "25px",
                                  height: "25px",
                                  display: "flex",
                                  alignItem: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <MdOutlineMarkChatUnread
                                  style={{ marginTop: "5px", fontSize: "15px" }}
                                />
                              </div>
                            )}
                          </Box>
                        </Box>
                      </React.Fragment>
                    ))
                  ) : (
                    <Typography>No notifications available</Typography>
                  )}
                </Box>
              </React.Fragment>
            )}
          </Badge>

          {/* menu drawer */}
          <LuMenu
            className="menu-icon"
            style={{ fontSize: "23px", color: "#3D42DF", cursor: "pointer" }}
            onClick={toggleDrawer(true)}
          />

          <Avatar
            alt="Travis Howard"
            src={
              user?.data?.profile_picture ||
              "https://media.istockphoto.com/id/1278978817/photo/portrait-of-happy-mature-man-smiling.jpg?s=612x612&w=0&k=20&c=GPniKSszzPgprveN7sCT5mb-_L3-RSlGAOAsmoDaafw="
            }
          />
          <div className="inter-font">
            <h3>
              {user?.data?.username
                ? user?.data?.username.length > 8
                  ? `${user?.data?.username.substring(0, 8)}..`
                  : user?.data?.username
                : "Guest"}
            </h3>
            <h6>
              {" "}
              {user?.data?.email
                ? user?.data?.email.length > 8
                  ? `${user?.data?.email.substring(0, 16)}..`
                  : user?.data?.email
                : "Email"}
            </h6>
          </div>

          <div className="dropdown-header">
            <MdKeyboardArrowDown onClick={handleClick} />
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={handleNavigateDashboard}> Dashboard</MenuItem>
              <MenuItem onClick={handleNavigateProfile}> Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </div>
      </main>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={
          {
            // width: 600,
          }
        }
      >
        <div>
          {sidebarItems.map((sidebarItem) =>
            sidebarItem.link ? (
              <NavLink
                key={sidebarItem.id}
                to={sidebarItem.link}
                className={({ isActive }) =>
                  isActive ? "sidebar-item active" : "sidebar-item"
                }
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
          )}
        </div>
      </Drawer>
    </>
  );
};

export default Header;
