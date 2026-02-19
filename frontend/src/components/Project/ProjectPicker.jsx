import React, { useState } from "react";
import { ChevronDown, Plus, Search } from "lucide-react";
import { Button } from "../ui";
import CreateProjectDialog from "./CreateProjectDialog";
import { useProjectPicker } from "../../hooks/project/useProjectPicker";

const ProjectPicker = () => {
    const {
        open,
        createDialogOpen,
        setCreateDialogOpen,
        ref,
        activeProject,
        projects,
        handleSelectProject,
        handleCreateNew,
        toggleOpen
    } = useProjectPicker();

    const [searchTerm, setSearchTerm] = useState("");

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="relative" ref={ref}>
                <button
                    onClick={toggleOpen}
                    className="flex items-center gap-2 py-1.5 transition-colors text-sm font-medium text-gray-700 dark:text-[#cccccc] cursor-pointer"
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
                    <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#404040] shadow-lg z-50 overflow-hidden">
                        <div className="p-3 border-b border-gray-100 dark:border-[#404040]">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider py-1">
                                    Projects <span className="dark:text-gray-400 text-gray-600 px-2 py-1 rounded-full bg-gray-200 dark:bg-[#333333]">{projects.length}</span>
                                </span>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search projects..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-50 dark:bg-[#262626] border border-gray-200 dark:border-[#404040] text-gray-700 dark:text-[#cccccc] focus:outline-none focus:border-primary/50 placeholder:text-gray-400"
                                    autoFocus
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>

                        {filteredProjects.length > 0 ? (
                            <div className="max-h-56 overflow-y-auto p-2 flex flex-col gap-1">
                                {filteredProjects.map((project) => (
                                    <button
                                        key={project.id}
                                        onClick={() => handleSelectProject(project)}
                                        className={`w-full flex items-center gap-3 h-12 px-3 py-3 text-sm transition-colors cursor-pointer ${activeProject?.id === project.id
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "text-gray-700 dark:text-[#cccccc] hover:bg-gray-50 dark:hover:bg-[#262626]"
                                            }`}
                                    >
                                        <div className="flex flex-col items-start overflow-hidden w-full">
                                            <div className="flex items-center justify-between w-full">
                                                <span className="truncate text-base">
                                                    {project.name}
                                                </span>
                                                {project.currentUserRole === 'PROJECT_ADMIN' && (
                                                    <span className={`text-xs px-1.5 py-0.5 text-orange-600 dark:text-orange-500`}>
                                                        Owner
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
                                <p className="text-gray-400 px-6 py-2">No projects found</p>
                            </div>
                        )}
                        <div className="p-2 border-t border-gray-100 dark:border-[#404040] bg-gray-50/50 dark:bg-[#1a1a1a]">
                            <Button
                                onClick={handleCreateNew}
                                variant='outlined'
                                className="w-full justify-center"
                                size="md"
                            >
                                <Plus size={16} className="mr-2" />
                                Create New Project
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            <CreateProjectDialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
            />
        </>
    );
};

export default ProjectPicker;
