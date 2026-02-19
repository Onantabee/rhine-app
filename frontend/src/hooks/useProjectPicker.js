import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetProjectsQuery } from "../store/api/projectsApi";
import { useUpdateLastProjectMutation } from "../store/api/usersApi";
import { setActiveProject } from "../store/slices/projectSlice";
import { closeMobileMenu } from "../store/slices/uiSlice";

export const useProjectPicker = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const ref = useRef(null);
    const activeProject = useSelector((state) => state.project.activeProject);
    const { data: projects = [] } = useGetProjectsQuery();
    const [updateLastProject] = useUpdateLastProjectMutation();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
        handleSelectProject,
        handleCreateNew,
        toggleOpen
    };
};
