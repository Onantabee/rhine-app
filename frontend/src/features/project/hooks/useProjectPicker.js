import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
    useGetProjectsQuery,
    useGetProjectByIdQuery,
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
    const projectError = useSelector((state) => state.project.projectError);
    const { data: projects = [], isLoading: isLoadingProjects } = useGetProjectsQuery();
    
    const { projectId: urlProjectId } = useParams();
    const { isFetching } = useGetProjectByIdQuery(urlProjectId, { skip: !urlProjectId });
    const [updateLastProject] = useUpdateLastProjectMutation();

    const handleSelectProject = (project) => {
        if (activeProject?.id === project.id) {
            setOpen(false);
            return;
        }

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
        projectError,
        projects,
        isLoadingProjects,
        isFetching,
        handleSelectProject,
        handleCreateNew,
        toggleOpen
    };
};
