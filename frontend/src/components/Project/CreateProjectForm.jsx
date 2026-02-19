import { Button, Input } from "../ui";
import { useCreateProject } from "../../hooks/project/useCreateProject";

const CreateProjectForm = ({ onSuccess, onCancel, showCancel = false }) => {
    const {
        name,
        setName,
        fieldErrors,
        isLoading,
        handleSubmit
    } = useCreateProject({ onSuccess });

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Input
                id="project-name"
                label="Project Name"
                type="text"
                placeholder="e.g. Marketing Campaign"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                error={!!fieldErrors.name}
                helperText={fieldErrors.name}
                maxLength={100}
            />

            <div className={`flex ${showCancel ? 'justify-end gap-3' : 'flex-col'} mt-6`}>
                {showCancel && (
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                )}
                <Button
                    type="submit"
                    variant="primary"
                    className={!showCancel ? "w-full" : ""}
                    size={!showCancel ? "lg" : "md"}
                    isLoading={isLoading}
                >
                    {isLoading ? "Creating..." : "Create Project"}
                </Button>
            </div>
        </form>
    );
};

export default CreateProjectForm;
