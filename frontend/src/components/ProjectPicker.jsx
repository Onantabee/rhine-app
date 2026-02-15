import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Plus, FolderOpen } from "lucide-react";
import { useGetProjectsQuery } from "../store/api/projectsApi";
import { useUpdateLastProjectMutation } from "../store/api/usersApi";
import { setActiveProject } from "../store/slices/projectSlice";
import { Button } from "./ui";

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
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-[5px ] shadow-lg z-50 overflow-hidden">
                    <div className="max-h-56 overflow-y-auto p-2 flex flex-col gap-2">
                        {projects.map((project) => (
                            <button
                                key={project.id}
                                onClick={() => handleSelectProject(project)}
                                className={`w-full flex items-center gap-3 h-14 px-2 rounded-[5px] text-sm transition-colors cursor-pointer ${activeProject?.id === project.id
                                    ? "bg-[#7733ff]/10 text-[#7733ff] font-medium"
                                    : "text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                <div className="flex items-start flex-col overflow-hidden">
                                    <span className="truncate w-full text-left text-lg">
                                        {project.name}
                                    </span>
                                    <span className="text-xs font-light text-gray-400">
                                        {/* {project.memberCount} member
                                        {project.memberCount !== 1 ? "s" : ""} */}
                                        {project.currentUserRole === 'PROJECT_ADMIN' && 'Owner'}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                    <div className="p-2 border-t border-gray-100">
                        <Button
                            onClick={handleCreateNew}
                            variant='outlined'
                            className="w-full"
                        >
                            <Plus size={16} />
                            Create New Project
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectPicker;
