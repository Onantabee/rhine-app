import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Settings, User, LogOut } from "lucide-react";
import { Button, Dialog } from "./ui";
import { logout as logoutAction } from "../store/slices/authSlice";
import { clearActiveProject } from "../store/slices/projectSlice";
import { useLogoutMutation } from "../store/api/authApi";

const SidePane = ({ onLinkClick }) => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const activeProject = useSelector((state) => state.project.activeProject);

    const projectId = params.projectId || activeProject?.id;

    const [logoutServer] = useLogoutMutation();
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

    const isAdmin = activeProject?.role === "PROJECT_ADMIN";

    const navItems = [];

    if (projectId) {
        navItems.push({
            label: "Tasks",
            icon: <LayoutDashboard size={20} />,
            path: `/project/${projectId}`,
        });
    }

    if (isAdmin) {
        navItems.push({
            label: "Team",
            icon: <Users size={20} />,
            path: `/project/${projectId}/team`,
        });
    }

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

    return (
        <aside className="w-full md:w-[300px] h-full border-r border-gray-200 bg-white flex flex-col justify-between">
            <div className="p-6">
                <nav className="space-y-1">
                    {navItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => handleNavClick(item.path)}
                            className={`w-full flex items-center gap-3 px-3 py-4 text-lg font-normal transition-colors cursor-pointer ${isActive(item.path)
                                ? "bg-[#7733ff]/10 text-[#7733ff]"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                        >
                            <span
                                className={
                                    isActive(item.path)
                                        ? "text-[#7733ff]"
                                        : "text-gray-600"
                                }
                            >
                                {item.icon}
                            </span>
                            {item.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="p-6 border-t border-gray-200 space-y-1">
                <button
                    onClick={() => handleNavClick("/profile")}
                    className={`w-full flex items-center gap-3 px-3 py-4 text-lg font-normal transition-colors cursor-pointer ${isActive("/profile")
                        ? "bg-[#7733ff]/10 text-[#7733ff]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                >
                    <User size={20} className={isActive("/profile") ? "text-[#7733ff]" : "text-gray-600"} />
                    Profile
                </button>
                {isAdmin && (
                    <button
                        onClick={() => handleNavClick(`/project/${projectId}/settings`)}
                        className={`w-full flex items-center gap-3 px-3 py-4 text-lg font-normal transition-colors cursor-pointer ${isActive(`/project/${projectId}/settings`)
                            ? "bg-[#7733ff]/10 text-[#7733ff]"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                    >
                        <Settings size={20} className={isActive(`/project/${projectId}/settings`) ? "text-[#7733ff]" : "text-gray-600"} />
                        Settings
                    </button>
                )}
                <button
                    onClick={handleLogoutClick}
                    className="w-full flex items-center gap-3 px-3 py-4 text-lg font-normal text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>

            <Dialog
                open={logoutDialogOpen}
                onClose={() => setLogoutDialogOpen(false)}
                title="Logout?"
                size="sm"
            >
                <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
                <div className="flex gap-3 justify-end">
                    <Button variant="secondary" onClick={() => setLogoutDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleLogoutConfirm}>
                        Logout
                    </Button>
                </div>
            </Dialog>
        </aside>
    );
};

export default SidePane;
