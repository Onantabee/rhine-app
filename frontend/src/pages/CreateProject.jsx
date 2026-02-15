import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FolderPlus } from "lucide-react";
import { Button, Input } from "../components/ui";
import { useCreateProjectMutation } from "../store/api/projectsApi";
import { setActiveProject } from "../store/slices/projectSlice";
import { setHasProjects } from "../store/slices/authSlice";
import { toast } from "sonner";

const CreateProject = () => {
    const [name, setName] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [fieldErrors, setFieldErrors] = useState({});
    const [createProject, { isLoading }] = useCreateProjectMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFieldErrors({});
        if (!name.trim()) {
            setFieldErrors({ name: "Project name is required" });
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
        } catch (error) {
            toast.error(error?.data?.message || "Failed to create project");
        }
    };

    return (
        <div className="h-[70vh] flex justify-center items-center">
            <div className="relative flex flex-col justify-center items-center lg:flex-row w-full p-2">
                <div className="z-30 h-[500px] lg:h-auto"
                    style={{ padding: '20px', width: '100%', maxWidth: '500px' }}>
                    <div className="flex flex-col items-center mb-8">
                        <h1 className="text-3xl font-semibold text-center text-gray-700">
                            Create a Project
                        </h1>
                        <p className="text-gray-400 font-light text-md mt-2 text-center">
                            Projects organize your tasks and team. You'll be the admin.
                        </p>
                    </div>

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
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            size="lg"
                            isLoading={isLoading}
                        >
                            {isLoading ? "Creating..." : "Create Project"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateProject;
