import { LayoutDashboard, Users, Settings, User, LogOut } from "lucide-react";
import { Button, Dialog } from "../ui";
import { useSidePane } from "../../hooks/layout/useSidePane";

const SidePane = ({ onLinkClick }) => {
    const {
        projectId,
        isAdmin,
        isActive,
        handleNavClick,
        handleLogoutClick,
        handleLogoutConfirm,
        logoutDialogOpen,
        setLogoutDialogOpen
    } = useSidePane({ onLinkClick });

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

    return (
        <aside className="w-full md:w-[300px] h-full border-r border-gray-200 dark:border-[#404040] bg-white dark:bg-[#1a1a1a] flex flex-col justify-between">
            <div className="p-6">
                <nav className="space-y-1">
                    {navItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => handleNavClick(item.path)}
                            className={`w-full flex items-center gap-3 px-3 py-4 text-lg font-normal transition-colors cursor-pointer ${isActive(item.path)
                                ? "bg-primary/10 text-primary"
                                : "text-gray-600 dark:text-[#d9d9d9] hover:bg-gray-50 dark:hover:bg-[#262626] hover:text-gray-900 dark:hover:text-[#cccccc]"
                                }`}
                        >
                            <span
                                className={
                                    isActive(item.path)
                                        ? "text-primary"
                                        : "text-gray-600 dark:text-[#d9d9d9]"
                                }
                            >
                                {item.icon}
                            </span>
                            {item.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-[#404040] space-y-1">
                <button
                    onClick={() => handleNavClick("/profile")}
                    className={`w-full flex items-center gap-3 px-3 py-4 text-lg font-normal transition-colors cursor-pointer ${isActive("/profile")
                        ? "bg-primary/10 text-primary"
                        : "text-gray-600 dark:text-[#d9d9d9] hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-[#262626] dark:hover:text-[#cccccc]"
                        }`}
                >
                    <User size={20} className={isActive("/profile") ? "text-primary" : "text-gray-600 dark:text-[#d9d9d9]"} />
                    Profile
                </button>
                {isAdmin && (
                    <button
                        onClick={() => handleNavClick(`/project/${projectId}/settings`)}
                        className={`w-full flex items-center gap-3 px-3 py-4 text-lg font-normal transition-colors cursor-pointer ${isActive(`/project/${projectId}/settings`)
                            ? "bg-primary/10 text-primary"
                            : "text-gray-600 dark:text-[#d9d9d9] hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-[#262626] dark:hover:text-[#cccccc]"
                            }`}
                    >
                        <Settings size={20} className={isActive(`/project/${projectId}/settings`) ? "text-primary" : "text-gray-600 dark:text-[#d9d9d9]"} />
                        Settings
                    </button>
                )}
                <button
                    onClick={handleLogoutClick}
                    className="w-full flex items-center gap-3 px-3 py-4 text-lg font-normal text-red-600 dark:text-red-500 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
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
                <p className="text-gray-600 dark:text-[#d9d9d9] mb-6">Are you sure you want to logout?</p>
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
