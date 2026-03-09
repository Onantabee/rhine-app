import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSnackbar } from "../../../core/context/SnackbarContext";
import { useGetTasksQuery, useDeleteTaskMutation } from '../../task/api/tasksApi';
import { useGetProjectByIdQuery, useGetProjectMembersQuery } from '../api/projectsApi';
import { useGetUserByEmailQuery } from '../../user/api/usersApi';
import { setActiveProject } from '../store/projectSlice';
import { setSearchTerm, setAssigneeEmailFilter } from '../../auth/store/authSlice';

import { getDueDateStatus } from "../../task/utils/taskUtils";

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

    const { data: members = [] } = useGetProjectMembersQuery(projectId, {
        skip: !projectId,
    });

    const hasOtherMembers = members.some(member => member.email !== userEmail && !member.name.includes("(Pending)"));

    const sortedTasks = [...tasks].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const query = new URLSearchParams(location.search);
    const assigneeEmailFilter = query.get("assigneeEmail");
    const statusFilter = query.get("filter");
    const dueFilter = query.get("dueFilter");

    const filterTasks = (tasks) => {
        let filtered = tasks;

        if (searchTerm) {
            filtered = filtered.filter((task) =>
                task.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (assigneeEmailFilter) {
            if (assigneeEmailFilter === 'UNASSIGNED') {
                filtered = filtered.filter((task) => !task.assigneeId && !task.assigneeEmail && task.taskStatus !== "CANCELLED");
            } else {
                filtered = filtered.filter((task) => task.assigneeId === assigneeEmailFilter && task.taskStatus !== "CANCELLED");
            }
        }

        if (statusFilter) {
            filtered = filtered.filter((task) => {
                if (statusFilter === 'PENDING' || statusFilter === 'ONGOING') {
                    if (!task.assigneeId && !task.assigneeEmail) return false;
                    const dueStatus = getDueDateStatus(task.dueDate, task.taskStatus);
                    return task.taskStatus === statusFilter && dueStatus !== 'OVERDUE' && dueStatus !== 'DUE_TODAY';
                }
                return task.taskStatus === statusFilter;
            });
        }

        if (dueFilter) {
            if (dueFilter === 'OVERDUE') {
                filtered = filtered.filter((task) => {
                    if (!task.assigneeId && !task.assigneeEmail) return false;
                    return getDueDateStatus(task.dueDate, task.taskStatus) === 'OVERDUE';
                });
            } else if (dueFilter === 'DUE_TODAY') {
                filtered = filtered.filter((task) => {
                    if (!task.assigneeId && !task.assigneeEmail) return false;
                    return getDueDateStatus(task.dueDate, task.taskStatus) === 'DUE_TODAY';
                });
            }
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
        statusFilter,
        dueFilter,
        navigate,
        hasOtherMembers
    };
};
