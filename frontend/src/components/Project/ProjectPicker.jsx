import { ChevronDown, Plus } from "lucide-react";
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

    return (
        <>
            <div className="relative" ref={ref}>
                <button
                    onClick={toggleOpen}
                    className="flex items-center gap-2 py-1.5 rounded-lg transition-colors text-sm font-medium text-gray-700 dark:text-[#cccccc] cursor-pointer"
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
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#404040] rounded-[5px ] shadow-lg z-50 overflow-hidden">
                        {projects.length > 0 ? (
                            <div className="max-h-56 overflow-y-auto p-2 flex flex-col gap-2">
                                {projects.map((project) => (
                                    <button
                                        key={project.id}
                                        onClick={() => handleSelectProject(project)}
                                        className={`w-full flex items-center gap-3 h-14 px-2 text-sm transition-colors cursor-pointer ${activeProject?.id === project.id
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "text-gray-700 dark:text-[#cccccc] hover:bg-gray-50 dark:hover:bg-[#262626]"
                                            }`}
                                    >
                                        <div className="flex items-start flex-col overflow-hidden">
                                            <span className="truncate w-full text-left text-lg">
                                                {project.name}
                                            </span>
                                            <span className={`text-xs font-light ${activeProject?.id === project.id ? 'text-primary' : 'text-gray-600 dark:text-[#bfbfbf]'}`}>
                                                {project.currentUserRole === 'PROJECT_ADMIN' && 'Owner'}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-14">
                                <p className="text-gray-400 truncate w-full text-center text-lg">No projects found</p>
                            </div>
                        )}
                        <div className="p-2 border-t border-gray-100 dark:border-[#404040]">
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
            <CreateProjectDialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
            />
        </>
    );
};

export default ProjectPicker;
