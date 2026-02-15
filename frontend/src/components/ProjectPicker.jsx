import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Plus, FolderOpen } from "lucide-react";
import { useGetProjectsQuery } from "../store/api/projectsApi";
import { useUpdateLastProjectMutation } from "../store/api/usersApi";
import { setActiveProject } from "../store/slices/projectSlice";

const ProjectPicker = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const activeProject = useSelector((state) => state.project.activeProject);
    const { data: projects = [] } = useGetProjectsQuery();
    const [updateLastProject] = useUpdateLastProjectMutation();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectProject = (project) => {
        dispatch(
            setActiveProject({
                id: project.id,
                name: project.name,
                role: project.currentUserRole,
            })
        );
        updateLastProject(project.id).unwrap().catch(console.error);
        setOpen(false);
        navigate(`/project/${project.id}`);
    };

    const handleCreateNew = () => {
        setOpen(false);
        navigate("/create-project");
    };

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium text-gray-700 cursor-pointer"
            >
                <span className="max-w-[150px] truncate text-xl">
                    {activeProject?.name || "Select Project"}
                </span>
                <ChevronDown
                    size={24}
                    className={`transition-transform h-full ${open ? "rotate-180" : ""
                        }`}
                />
            </button>

            {open && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    <div className="p-2 border-b border-gray-100">
                        <p className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Your Projects
                        </p>
                    </div>
                    <div className="max-h-56 overflow-y-auto p-1">
                        {projects.map((project) => (
                            <button
                                key={project.id}
                                onClick={() => handleSelectProject(project)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${activeProject?.id === project.id
                                    ? "bg-[#7733ff]/10 text-[#7733ff] font-medium"
                                    : "text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7733ff] to-[#9b59ff] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                    {project.name?.[0]?.toUpperCase() || "P"}
                                </div>
                                <div className="flex flex-col items-start overflow-hidden">
                                    <span className="truncate w-full text-left">
                                        {project.name}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {project.memberCount} member
                                        {project.memberCount !== 1 ? "s" : ""}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                    <div className="p-2 border-t border-gray-100">
                        <button
                            onClick={handleCreateNew}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#7733ff] hover:bg-[#7733ff]/5 transition-colors font-medium cursor-pointer"
                        >
                            <Plus size={16} />
                            Create New Project
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectPicker;
