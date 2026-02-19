import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../ui";
import { useCreateProjectMutation } from "../../store/api/projectsApi";
import { setActiveProject } from "../../store/slices/projectSlice";
import { setHasProjects } from "../../store/slices/authSlice";
import { toast } from "sonner";

const CreateProjectForm = ({ onSuccess, onCancel, showCancel = false }) => {
    const [name, setName] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [fieldErrors, setFieldErrors] = useState({});
    const [createProject, { isLoading }] = useCreateProjectMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFieldErrors({});
        if (!name.trim()) {
            setFieldErrors({ name: "Project name is required" });
            return;
        } else if (name.length > 100) {
            setFieldErrors({ name: "Project name must be less than 100 characters" });
            return;
        }

        try {
            const project = await createProject({ name: name.trim() }).unwrap();
            dispatch(
                setActiveProject({
                    id: project.id,
                    name: project.name,
                    role: project.currentUserRole,
                })
            );
            dispatch(setHasProjects(true));
            toast.success("Project created!");
            navigate(`/project/${project.id}`);

            if (onSuccess) {
                onSuccess(project);
            }
        } catch (error) {
            toast.error(error?.data?.message || "Failed to create project");
        }
    };

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
