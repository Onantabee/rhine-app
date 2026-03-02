import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { logout as logoutAction } from '../../features/auth/store/authSlice';
import { clearActiveProject } from '../../features/project/store/projectSlice';
import { useLogoutMutation } from '../../features/auth/api/authApi';
import { baseApi } from '../api/baseApi';

export const useSidePane = ({ onLinkClick }) => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const activeProject = useSelector((state) => state.project.activeProject);

    const projectId = params.projectId || activeProject?.id;

    const [logoutServer] = useLogoutMutation();
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

    const isAdmin = activeProject?.role === "PROJECT_ADMIN";

    const isActive = (path) => location.pathname === path;

    const handleNavClick = (path) => {
        navigate(path);
        setTimeout(() => {
            if (onLinkClick) onLinkClick();
        }, 150);
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
        dispatch(logoutAction());
        dispatch(clearActiveProject());
        dispatch(baseApi.util.resetApiState());
        setLogoutDialogOpen(false);
        if (onLinkClick) onLinkClick();
        navigate("/");
    };

    return {
        projectId,
        isAdmin,
        isActive,
        handleNavClick,
        handleLogoutClick,
        handleLogoutConfirm,
        logoutDialogOpen,
        setLogoutDialogOpen
    };
};
