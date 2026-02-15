import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Settings, Trash2 } from "lucide-react";
import { Button, Input, Dialog } from "../components/ui";
import {
    useGetProjectByIdQuery,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
} from "../store/api/projectsApi";
import { setActiveProject, clearActiveProject } from "../store/slices/projectSlice";
import { toast } from "sonner";

const ProjectSettings = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { data: project, isLoading } = useGetProjectByIdQuery(projectId);
    const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
    const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

    const [name, setName] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    React.useEffect(() => {
        if (project?.name) {
            setName(project.name);
        }
    }, [project]);

    const handleUpdateName = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        try {
            const updated = await updateProject({
                projectId,
                name: name.trim(),
            }).unwrap();
            dispatch(
                setActiveProject({
                    id: updated.id,
                    name: updated.name,
                    role: updated.currentUserRole,
                })
            );
            toast.success("Project name updated");
        } catch (error) {
            toast.error(error?.data?.message || "Failed to update project");
        }
    };

    const handleDelete = async () => {
        try {
            await deleteProject(projectId).unwrap();
            dispatch(clearActiveProject());
            toast.success("Project deleted");
            navigate("/create-project");
        } catch (error) {
            toast.error(error?.data?.message || "Failed to delete project");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7733ff]" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-8">
                <Settings size={24} className="text-[#7733ff]" />
                <h1 className="text-2xl font-bold text-gray-900">Project Settings</h1>
            </div>

            <div className="space-y-8">
                {/* Project Name */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        General
                    </h2>
                    <form onSubmit={handleUpdateName} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Project Name
                            </label>
                            <Input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isUpdating || !name.trim() || name === project?.name}
                        >
                            {isUpdating ? "Saving..." : "Save Changes"}
                        </Button>
                    </form>
                </div>

                {/* Danger Zone */}
                <div className="bg-white rounded-xl border border-red-200 p-6">
                    <h2 className="text-lg font-semibold text-red-600 mb-2">
                        Danger Zone
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Deleting this project will permanently remove all tasks, comments,
                        and member data. This action cannot be undone.
                    </p>
                    <Button
                        variant="danger"
                        onClick={() => setDeleteDialogOpen(true)}
                    >
                        <Trash2 size={16} />
                        Delete Project
                    </Button>
                </div>
            </div>

            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                title="Delete Project?"
                size="sm"
            >
                <p className="text-gray-600 mb-6">
                    Are you sure? This will permanently delete{" "}
                    <strong>{project?.name}</strong> and all its data.
                </p>
                <div className="flex gap-3 justify-end">
                    <Button
                        variant="secondary"
                        onClick={() => setDeleteDialogOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </Dialog>
        </div>
    );
};

export default ProjectSettings;
