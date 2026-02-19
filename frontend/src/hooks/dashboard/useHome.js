import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSnackbar } from "../../context/SnackbarContext";
import { useGetTasksQuery, useDeleteTaskMutation } from "../../store/api/tasksApi";
import { useGetProjectByIdQuery } from "../../store/api/projectsApi";
import { useGetUserByEmailQuery } from "../../store/api/usersApi";
import { setActiveProject } from "../../store/slices/projectSlice";
import { setSearchTerm, setAssigneeEmailFilter } from "../../store/slices/authSlice";

export const useHome = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { projectId } = useParams();
    const userEmail = useSelector((state) => state.auth.userEmail);
    const searchTerm = useSelector((state) => state.auth.searchTerm);
    const activeProject = useSelector((state) => state.project.activeProject);

    const isAdmin = activeProject?.role === "PROJECT_ADMIN";

    const [taskToDelete, setTaskToDelete] = useState(null);
    const { showSnackbar } = useSnackbar();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [deleteTask] = useDeleteTaskMutation();
    
    const [isCardView, setIsCardView] = useState(() => {
        const savedView = localStorage.getItem("taskViewPreference");
        return savedView !== null ? JSON.parse(savedView) : true;
    });

    useEffect(() => {
        localStorage.setItem("taskViewPreference", JSON.stringify(isCardView));
    }, [isCardView]);

    const { data: user } = useGetUserByEmailQuery(userEmail, {
        skip: !userEmail,
    });
    
    const { data: tasks = [], isLoading: isLoadingTasks } = useGetTasksQuery(projectId, {
        skip: !projectId,
    });
    
    const { data: project } = useGetProjectByIdQuery(projectId, {
        skip: !projectId,
    });

    useEffect(() => {
        if (project && (!activeProject || activeProject.id !== project.id)) {
            dispatch(
                setActiveProject({
                    id: project.id,
                    name: project.name,
                    role: project.currentUserRole,
                })
            );
        }
    }, [project, activeProject, dispatch]);

    const sortedTasks = [...tasks].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const query = new URLSearchParams(location.search);
    const assigneeEmailFilter = query.get("assigneeEmail");

    const filterTasks = (tasks) => {
        let filtered = tasks;

        if (searchTerm) {
            filtered = filtered.filter((task) =>
                task.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (assigneeEmailFilter) {
            filtered = filtered.filter((task) => task.assigneeId === assigneeEmailFilter);
        }

        if (!isAdmin && user) {
            filtered = filtered.filter((task) => task.assigneeId === user.email);
        }

        return filtered;
    };

    const handleDeleteTask = async (id) => {
        try {
            await deleteTask({ projectId, id }).unwrap();
            showSnackbar("Task deleted successfully!", "success");
        } catch (error) {
            console.error("Error deleting task:", error);
            showSnackbar(error.data?.message || "Failed to delete task", "error");
        }
    };

    const filteredTasks = filterTasks(sortedTasks);

    const handleOpenDialog = (task = null) => {
        setSelectedTask(task);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedTask(null);
    };

    return {
        projectId,
        user,
        activeProject,
        isAdmin,
        isLoadingTasks,
        filteredTasks,
        isCardView,
        setIsCardView,
        openDialog,
        handleOpenDialog,
        handleCloseDialog,
        selectedTask,
        taskToDelete,
        setTaskToDelete,
        handleDeleteTask,
        searchTerm,
        assigneeEmailFilter,
        navigate 
    };
};
