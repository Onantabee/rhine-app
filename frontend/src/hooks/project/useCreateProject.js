import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCreateProjectMutation } from "../../store/api/projectsApi";
import { useSnackbar } from "../../context/SnackbarContext";
import { setActiveProject } from "../../store/slices/projectSlice";
import { setHasProjects } from "../../store/slices/authSlice";
import { toast } from "sonner";

export const useCreateProject = ({ onSuccess } = {}) => {
    const [name, setName] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
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

    return {
        name,
        setName,
        fieldErrors,
        isLoading,
        handleSubmit
    };
};
