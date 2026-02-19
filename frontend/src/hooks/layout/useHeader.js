import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setSearchTerm, logout } from "../../store/slices/authSlice";
import { useLogoutMutation } from "../../store/api/authApi";
import { toggleMobileMenu, closeMobileMenu } from "../../store/slices/uiSlice";

export const useHeader = ({ setIsSignup }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [logoutServer] = useLogoutMutation();

    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const isVerified = useSelector((state) => state.auth.isVerified);
    const hasProjects = useSelector((state) => state.auth.hasProjects);
    const userName = useSelector((state) => state.auth.userName);
    const searchTerm = useSelector((state) => state.auth.searchTerm);
    const activeProject = useSelector((state) => state.project.activeProject);
    const mobileMenuOpen = useSelector((state) => state.ui.mobileMenuOpen);
    const isAdmin = activeProject?.role === "PROJECT_ADMIN";

    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

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
    };

    const handleLogoutConfirm = async () => {
        try {
            await logoutServer().unwrap();
        } catch (error) {
            console.error("Logout failed on server:", error);
        }
        dispatch(logout());
        dispatch(closeMobileMenu());
        setLogoutDialogOpen(false);

        navigate("/");
    };

    const handleLogoutCancel = () => {
        setLogoutDialogOpen(false);
    };

    const handleSearchChange = (e) => {
        dispatch(setSearchTerm(e.target.value));
    };

    const handleClearSearch = () => {
        dispatch(setSearchTerm(""));
    };

    
    const handleCloseMobileMenu = () => dispatch(closeMobileMenu());

    const isTaskListPage = /^\/project\/\d+(\/team)?\/?$/.test(location.pathname);
    
    // Logic for shouldShowMobileMenu
    const shouldShowMobileMenu = (pathname) => {
        if (pathname.includes("/verify-email")) return false;
        if (pathname.includes("/create-project")) return false;

        if (pathname === "/" || pathname === "/profile") return true;
        if (pathname.startsWith("/project/")) return true;

        return false;
    };


    return {
        location,
        navigate,
        isLoggedIn,
        isVerified,
        hasProjects,
        userName,
        searchTerm,
        activeProject,
        mobileMenuOpen,
        isAdmin,
        logoutDialogOpen,
        handleDrawerToggle,
        handleLoginClick,
        handleSignupClick,
        handleLogoutClick,
        handleLogoutConfirm,
        handleLogoutCancel,
        handleSearchChange,
        handleClearSearch,
        handleCloseMobileMenu,
        isTaskListPage,
        shouldShowMobileMenu
    };
};
