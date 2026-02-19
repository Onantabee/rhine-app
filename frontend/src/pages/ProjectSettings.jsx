import { Settings, Trash2 } from "lucide-react";
import { Button, Input, Dialog, LoadingSpinner } from "../components/ui";
import { useProjectSettings } from "../hooks/project/useProjectSettings";

const ProjectSettings = () => {
    const {
        project,
        isLoading,
        name,
        setName,
        handleUpdateName,
        isUpdating,
        handleDelete,
        isDeleting,
        deleteDialogOpen,
        setDeleteDialogOpen
    } = useProjectSettings();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl flex flex-col gap-3 p-6">
            <div className="flex justify-between pb-3 gap-2 border-b border-gray-200">
                <h1 className="text-3xl text-gray-600 truncate">Project Settings</h1>
            </div>

            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold text-gray-700">
                        General
                    </h2>
                    <form onSubmit={handleUpdateName} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Project Name
                            </label>
                            <Input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                maxLength={100}
                            />
                        </div>
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-fit"
                            disabled={isUpdating || !name.trim() || name === project?.name}
                        >
                            {isUpdating ? "Saving..." : "Save Changes"}
                        </Button>
                    </form>
                </div>

                <div className="bg-white border border-red-200 p-4 flex flex-col gap-4">
                    <h2 className="text-xl font-semibold text-red-600">
                        Danger Zone
                    </h2>
                    <p className="text-gray-400 font-light text-md">
                        Deleting this project will permanently remove all tasks, comments,
                        and member data. This action cannot be undone.
                    </p>
                    <Button
                        variant="danger"
                        size="lg"
                        className="w-fit"
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
