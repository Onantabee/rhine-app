import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
    useGetProjectsQuery,
    useGetProjectByIdQuery,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
} from "../store/api/projectsApi";
import { setActiveProject, clearActiveProject } from "../store/slices/projectSlice";
import { setHasProjects } from "../store/slices/authSlice";
import { toast } from "sonner";

export const useProjectSettings = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { data: project, isLoading } = useGetProjectByIdQuery(projectId);
    const { data: projects } = useGetProjectsQuery();

    const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
    const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

    const [name, setName] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    useEffect(() => {
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

            const remainingProjects = projects?.filter(p => p.id !== Number(projectId)) || [];

            if (remainingProjects.length > 0) {
                const nextProject = remainingProjects[0];
                dispatch(setActiveProject({
                    id: nextProject.id,
                    name: nextProject.name,
                    role: nextProject.currentUserRole
                }));
                navigate(`/project/${nextProject.id}`);
                toast.success("Project deleted. Switched to " + nextProject.name);
            } else {
                dispatch(clearActiveProject());
                dispatch(setHasProjects(false));
                toast.success("Project deleted");
                navigate("/create-project");
            }
        } catch (error) {
            toast.error(error?.data?.message || "Failed to delete project");
        }
    };

    return {
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
    };
};
