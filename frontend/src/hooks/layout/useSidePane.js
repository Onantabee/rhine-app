import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { logout as logoutAction } from "../../store/slices/authSlice";
import { clearActiveProject } from "../../store/slices/projectSlice";
import { useLogoutMutation } from "../../store/api/authApi";

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
        if (onLinkClick) onLinkClick();
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
        setLogoutDialogOpen(false);
        if (onLinkClick) onLinkClick();
        navigate("/");
        window.location.reload();
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
