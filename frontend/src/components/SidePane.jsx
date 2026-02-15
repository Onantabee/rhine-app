import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Settings } from "lucide-react";

const SidePane = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const activeProject = useSelector((state) => state.project.activeProject);

    const isAdmin =
        activeProject?.role === "PROJECT_ADMIN";

    const navItems = [
        {
            label: "Tasks",
            icon: <LayoutDashboard size={20} />,
            path: `/project/${projectId}`,
        },
        {
            label: "Team",
            icon: <Users size={20} />,
            path: `/project/${projectId}/team`,
        },
    ];

    if (isAdmin) {
        navItems.push({
            label: "Settings",
            icon: <Settings size={20} />,
            path: `/project/${projectId}/settings`,
        });
    }

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="w-[300px] max-w-full h-full border-r border-gray-200 p-6">
            <nav className="space-y-1">
                {navItems.map((item) => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`w-full flex items-center gap-3 px-3 py-4 rounded-[5px] text-lg font-normal transition-colors cursor-pointer ${isActive(item.path)
                            ? "bg-[#7733ff]/10 text-[#7733ff]"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                    >
                        <span
                            className={
                                isActive(item.path)
                                    ? "text-[#7733ff]"
                                    : "text-gray-400"
                            }
                        >
                            {item.icon}
                        </span>
                        {item.label}
                    </button>
                ))}
            </nav>
        </aside>
    );
};

export default SidePane;
