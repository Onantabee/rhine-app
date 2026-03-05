import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    useGetProjectsQuery,
} from '../api/projectsApi';
import { useUpdateLastProjectMutation } from '../../user/api/usersApi';
import { setActiveProject } from '../store/projectSlice';
import { closeMobileMenu } from '../../../core/store/uiSlice';

export const useProjectPicker = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const ref = useRef(null);
    const activeProject = useSelector((state) => state.project.activeProject);
    const { data: projects = [], isLoading: isLoadingProjects } = useGetProjectsQuery();
    const [updateLastProject] = useUpdateLastProjectMutation();

    const handleSelectProject = (project) => {
        dispatch(
            setActiveProject({
                id: project.id,
                name: project.name,
                role: project.currentUserRole,
            })
        );
        updateLastProject(project.id).unwrap().catch(console.error);
        dispatch(closeMobileMenu());
        setOpen(false);
        navigate(`/project/${project.id}`);
    };

    const handleCreateNew = () => {
        setOpen(false);
        setCreateDialogOpen(true);
    };

    const toggleOpen = () => setOpen(!open);

    return {
        open,
        createDialogOpen,
        setCreateDialogOpen,
        ref,
        activeProject,
        projects,
        isLoadingProjects,
        handleSelectProject,
        handleCreateNew,
        toggleOpen
    };
};
