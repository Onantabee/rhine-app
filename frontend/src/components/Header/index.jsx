import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Menu } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Dialog } from "../ui";
import { logout as logoutAction, setSearchTerm } from "../../store/slices/authSlice";
import { clearActiveProject } from "../../store/slices/projectSlice";
import { useLogoutMutation } from "../../store/api/authApi";

import MobileDrawer from "./MobileDrawer";
import EditProfileDrawer from "./EditProfileDrawer";
import UserAvatar from "./UserAvatar";
import SearchBar from "./SearchBar";
import ProfileDropdown from "./ProfileDropdown";
import ProjectPicker from "../ProjectPicker";

import { toggleMobileMenu, closeMobileMenu } from "../../store/slices/uiSlice";

const Header = ({ setIsSignup }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [logoutServer] = useLogoutMutation();

    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const userName = useSelector((state) => state.auth.userName);
    const searchTerm = useSelector((state) => state.auth.searchTerm);
    const activeProject = useSelector((state) => state.project.activeProject);
    const mobileMenuOpen = useSelector((state) => state.ui.mobileMenuOpen);
    const isAdmin = activeProject?.role === "PROJECT_ADMIN";

    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [editProfileOpen, setEditProfileOpen] = useState(false);

    const profileRef = useRef(null);

    const handleDrawerToggle = () => dispatch(toggleMobileMenu());

    const handleLoginClick = () => {
        setIsSignup(false);
        dispatch(closeMobileMenu());
    };

    const handleSignupClick = () => {
        setIsSignup(true);
        dispatch(closeMobileMenu());
    };

    const handleLogoutClick = () => {
        setLogoutDialogOpen(true);
        setProfileDropdownOpen(false);
    };

    const handleLogoutConfirm = async () => {
        try {
            await logoutServer().unwrap();
        } catch (error) {
            console.error("Logout failed on server:", error);
        }
        // Always clean up client state
        dispatch(logoutAction());
        dispatch(clearActiveProject());
        dispatch(closeMobileMenu());
        setLogoutDialogOpen(false);
        // Force navigate to home and reload to ensure clean state
        navigate("/");
        window.location.reload();
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

    const handleEditProfileClick = () => {
        setEditProfileOpen(true);
        setProfileDropdownOpen(false);
    };

    const handleEditProfileClose = () => {
        setEditProfileOpen(false);
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

    // Show search only on the project task list page
    const isTaskListPage = /^\/project\/\d+\/?$/.test(location.pathname);

    return (
        <>
            <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-5 sm:px-8 h-[70px]">
                <nav className="flex items-center h-full">
                    <div className="w-full justify-center items-center hidden md:flex space-x-4 gap-4 h-full">
                        {/* <div>
                            <h1
                                className="text-2xl text-[#7733ff] font-semibold cursor-pointer"
                                onClick={() =>
                                    activeProject
                                        ? navigate(`/project/${activeProject.id}`)
                                        : navigate("/")
                                }
                            >
                                Rhine
                            </h1>
                        </div> */}

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
                                <ProjectPicker />

                                <div className="w-full flex justify-center items-center">
                                    {isTaskListPage && (
                                        <SearchBar
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            onClear={handleClearSearch}
                                        />
                                    )}
                                </div>

                                {/* <div className="relative" ref={profileRef}>
                                    <UserAvatar
                                        userName={userName}
                                        size="sm"
                                        onClick={toggleProfileDropdown}
                                    />
                                    <ProfileDropdown
                                        open={profileDropdownOpen}
                                        userName={userName}
                                        isAdmin={isAdmin}
                                        onEditProfile={handleEditProfileClick}
                                        onLogout={handleLogoutClick}
                                    />
                                </div> */}
                            </div>
                        )}
                    </div>

                    <div className="md:hidden w-full justify-between items-center flex gap-4">
                        <h1 className="text-xl font-bold text-[#7733ff] w-fit">Rhine</h1>
                        <button onClick={handleDrawerToggle} className="p-2 text-gray-600 hover:text-gray-800 cursor-pointer">
                            <Menu size={24} />
                        </button>
                    </div>
                </nav>
            </header>

            <MobileDrawer
                open={mobileMenuOpen && !isLoggedIn}
                isLoggedIn={isLoggedIn}
                userName={userName}
                isAdmin={isAdmin}
                onClose={() => dispatch(closeMobileMenu())}
                onLogin={handleLoginClick}
                onSignup={handleSignupClick}
                onEditProfile={handleEditProfileClick}
                onLogout={handleLogoutClick}
            />

            <EditProfileDrawer
                open={editProfileOpen}
                userName={userName}
                onClose={handleEditProfileClose}
            />

            <Dialog
                open={logoutDialogOpen}
                onClose={handleLogoutCancel}
                title="Logout?"
                size="sm"
            >
                <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
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
