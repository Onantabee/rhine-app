import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Paper,
  MenuList,
  MenuItem,
  Typography,
  Grow,
  Popper,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation, useNavigate } from "react-router-dom";
import { LogOut, PenSquare, Search, X } from "lucide-react";
import Profile from "./Profile";
import { Button, Dialog } from "./ui";
import { logout as logoutAction, setSearchTerm } from "../store/slices/authSlice";

const Header = ({ setIsSignup }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Redux state
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userName = useSelector((state) => state.auth.userName);
  const userRole = useSelector((state) => state.auth.userRole);
  const searchTerm = useSelector((state) => state.auth.searchTerm);

  const isAdmin = userRole === "ADMIN";

  // Local state
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  const profileRef = useRef(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLoginClick = () => {
    setIsSignup(false);
    handleDrawerToggle();
  };

  const handleSignupClick = () => {
    setIsSignup(true);
    handleDrawerToggle();
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
    setProfileDropdownOpen(false);
  };

  const handleLogoutConfirm = () => {
    dispatch(logoutAction());
    setMobileOpen(false);
    setLogoutDialogOpen(false);
    navigate("/");
    setIsSignup(false);
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleClearSearch = () => {
    dispatch(setSearchTerm(""));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fullName = String(userName || "");
  const names = fullName.split(/\s+/);
  const firstName = names[0] || "";
  const lastName = names[1] || "";

  const handleEditProfileClick = () => {
    setEditProfileOpen(!editProfileOpen);
    setProfileDropdownOpen(false);
  };

  const editProfileDrawer = (
    <Drawer
      anchor="right"
      open={editProfileOpen}
      onClose={() => setEditProfileOpen(false)}
      sx={{
        width: 150,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          backgroundColor: "#1E1E1E",
          color: "#E0E0E0",
          borderLeft: "1px solid #333",
          padding: "20px",
        },
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h6" sx={{ color: "#E0E0E0" }}>
          Profile
        </Typography>
        <IconButton onClick={() => setEditProfileOpen(false)}>
          <CloseIcon className="text-gray-300" />
        </IconButton>
      </div>

      <div className="">
        <div className="relative rounded-full bg-[#1E1E1E] p-5 z-40">
          <div className="absolute -top-5 left-0 flex w-full justify-center items-center">
            <div className="rounded-full bg-[#1e1e1e] p-4">
              <div className="w-16 h-16 bg-[#C77BBF] rounded-full flex justify-center items-center text-2xl">
                <span>
                  {firstName?.charAt(0) || "U"}
                  {lastName?.charAt(0) || " "}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Profile setEditProfileOpen={setEditProfileOpen} />
    </Drawer>
  );

  const drawer = (
    <Drawer
      anchor="right"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      sx={{
        width: 250,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          backgroundColor: "#1E1E1E",
          color: "#E0E0E0",
          borderLeft: "1px solid #333",
          padding: "12px",
        },
      }}
    >
      <div className="flex justify-end pr-2">
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon className="text-gray-300" />
        </IconButton>
      </div>
      <List className="min-w-[250px]">
        {!isLoggedIn ? (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLoginClick}>Login</ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleSignupClick}>
                Signup
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <div className="bg-[#333333] w-full flex p-2 flex-col justify-center items-center rounded-lg">
              <div
                className="profile w-15 h-15 mb-3 bg-[#C77BBF] rounded-full flex justify-center items-center text-3xl cursor-pointer"
                onClick={toggleProfileDropdown}
              >
                <span>
                  {firstName?.charAt(0) || "U"}
                  {lastName?.charAt(0) || " "}
                </span>
              </div>
              <Typography
                sx={{
                  fontWeight: "semibold",
                  fontSize: "25px",
                  color: "#8c8c8c",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {userName ? userName : "User"}
              </Typography>
              {isAdmin && (
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "#8c8c8c",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  (Admin)
                </Typography>
              )}
            </div>
            <Divider
              sx={{
                backgroundColor: "#333333",
                margin: "16px 0",
                width: "100%",
                height: "2px",
              }}
            />
            <ListItem
              disablePadding
              sx={{
                display: "flex",
                width: "100%",
                gap: "10px",
                flexDirection: "column",
              }}
            >
              <ListItemButton
                onClick={handleEditProfileClick}
                sx={{
                  backgroundColor: "",
                  color: "#808080",
                  border: "2px solid #404040",
                  width: "100%",
                  display: "flex",
                  textTransform: "capitalize",
                  fontWeight: "semibold",
                  justifyContent: "start",
                  borderRadius: "8px",
                  padding: "10px",
                  gap: "10px",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: "rgba(128, 128, 128, 0.2)",
                    color: "#a6a6a6",
                    borderColor: "#a6a6a6",
                  },
                }}
              >
                <PenSquare size={18} />
                <span>Edit Profile</span>
              </ListItemButton>
              <ListItemButton
                sx={{
                  backgroundColor: "#ff3333",
                  borderRadius: "8px",
                  width: "100%",
                  display: "flex",
                  gap: "10px",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    backgroundColor: "#ff0000",
                  },
                }}
                onClick={handleLogoutClick}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </ListItemButton>
            </ListItem>
          </div>
        )}
      </List>
    </Drawer>
  );

  return (
    <>
      <AppBar
        position="sticky"
        className="px-5 sm:px-8 md:px-12 lg:px-16 mb-5"
        sx={{ backgroundColor: "#2A2A2A", boxShadow: "none", top: 0 }}
      >
        <Toolbar sx={{ padding: "0 !important" }}>
          <div className="w-full justify-center max-w-[1240px] mx-auto items-center hidden md:flex space-x-4 gap-4">
            <div>
              <h1 className="text-2xl text-[#808080] font-semibold">Rhine</h1>
            </div>
            {!isLoggedIn ? (
              <div className="w-full flex justify-end gap-3">
                <Button
                  variant="outlined"
                  onClick={() => {
                    navigate("/");
                    setIsSignup(false);
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    navigate("/");
                    setIsSignup(true);
                  }}
                >
                  Signup
                </Button>
              </div>
            ) : (
              <div className="flex w-full justify-between items-center gap-4">
                <div className="w-full flex justify-center items-center">
                  {location.pathname === "/home" && (
                    <div className="flex items-center justify-center w-[30rem] transition-colors duration-300 ease-in-out border-2 border-[#404040] focus-within:border-[#737373] pl-6 pr-1 bg-[#404040] py-1 rounded-[15px]">
                      <input
                        type="text"
                        placeholder="Search tasks…"
                        className="text-[16px] w-full text-gray-300 py-1 focus:outline-0"
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                      <div
                        className={`rounded-full p-1 cursor-pointer flex items-center justify-center ${searchTerm &&
                          "bg-[#4d4d4d] hover:bg-[#ff3333] transition-colors duration-300 group"
                          }`}
                        onClick={searchTerm ? handleClearSearch : undefined}
                      >
                        {searchTerm ? (
                          <X
                            className="text-[#ff8080] group-hover:text-[#404040]"
                            size={25}
                          />
                        ) : (
                          <Search color="#9966ff" size={25} />
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="relative" ref={profileRef}>
                  <div
                    className="profile w-10 h-10 bg-[#C77BBF] p-[23px] rounded-full flex justify-center items-center text-lg cursor-pointer"
                    onClick={toggleProfileDropdown}
                  >
                    <span>
                      {firstName?.charAt(0) || "U"}
                      {lastName?.charAt(0) || " "}
                    </span>
                  </div>
                  <Popper
                    open={profileDropdownOpen}
                    anchorEl={profileRef.current}
                    placement="bottom-end"
                    transition
                    disablePortal
                    sx={{ zIndex: 1 }}
                  >
                    {({ TransitionProps }) => (
                      <Grow {...TransitionProps}>
                        <Paper
                          sx={{
                            minWidth: 250,
                            padding: "10px",
                            backgroundColor: "#333333",
                            color: "#E0E0E0",
                            border: "1px solid #444",
                            marginTop: "8px",
                            borderRadius: "15px",
                            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.25)",
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: "semibold",
                              fontSize: "20px",
                              color: "#8c8c8c",
                              display: "flex",
                              justifyContent: "center",
                              ...(!isAdmin && { marginBottom: "10px" }),
                            }}
                          >
                            {userName ? userName : "User"}
                          </Typography>
                          {isAdmin && (
                            <Typography
                              sx={{
                                fontSize: "12px",
                                color: "#8c8c8c",
                                display: "flex",
                                justifyContent: "center",
                                marginBottom: "10px",
                              }}
                            >
                              (Admin)
                            </Typography>
                          )}
                          <MenuList
                            sx={{
                              padding: 0,
                              display: "flex",
                              flexDirection: "column",
                              gap: "5px",
                            }}
                          >
                            <MenuItem
                              onClick={handleEditProfileClick}
                              sx={{
                                backgroundColor: "",
                                color: "#808080",
                                border: "2px solid #404040",
                                display: "flex",
                                textTransform: "capitalize",
                                fontWeight: "semibold",
                                justifyContent: "start",
                                borderRadius: "8px",
                                padding: "10px",
                                gap: "10px",
                                transition: "all 0.2s ease-in-out",
                                "&:hover": {
                                  backgroundColor: "rgba(128, 128, 128, 0.2)",
                                  color: "#a6a6a6",
                                  borderColor: "#a6a6a6",
                                },
                              }}
                            >
                              <PenSquare size={18} />
                              <span>Edit Profile</span>
                            </MenuItem>
                            <MenuItem
                              onClick={handleLogoutClick}
                              sx={{
                                backgroundColor: "#ff3333",
                                display: "flex",
                                textTransform: "uppercase",
                                fontWeight: "semibold",
                                justifyContent: "start",
                                borderRadius: "8px",
                                padding: "10px",
                                gap: "10px",
                                transition: "all 0.2s ease-in-out",
                                "&:hover": {
                                  backgroundColor: "#ff0000",
                                },
                              }}
                            >
                              <LogOut size={18} />
                              <span>Logout</span>
                            </MenuItem>
                          </MenuList>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
                </div>
              </div>
            )}
          </div>
          <div className="md:hidden w-full justify-between items-center flex gap-4">
            <h1 className="text-xl font-bold text-gray-500 w-fit">Rhine</h1>
            <IconButton edge="end" onClick={handleDrawerToggle}>
              <MenuIcon className="text-gray-300" />
            </IconButton>
          </div>
        </Toolbar>
        {drawer}
      </AppBar>

      {drawer}
      {editProfileDrawer}

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        title="Logout?"
        size="sm"
      >
        <p className="text-gray-300 mb-6">
          Are you sure you want to logout?
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={handleLogoutCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleLogoutConfirm}>
            Logout
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default Header;
