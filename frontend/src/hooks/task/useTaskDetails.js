import { useState, useEffect, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    useGetTaskByIdQuery,
    useUpdateTaskStatusMutation,
    useUpdateTaskNewStateMutation,
} from "../../store/api/tasksApi";
import {
    useGetCommentsByTaskQuery,
    useAddCommentMutation,
    useUpdateCommentMutation,
    useDeleteCommentMutation,
    useMarkCommentsAsReadMutation,
} from "../../store/api/commentsApi";
import { useGetUserByEmailQuery } from "../../store/api/usersApi";
import { getDueDateStatus } from "../../utils/taskUtils";
import { useSnackbar } from "../../context/SnackbarContext";

export const useTaskDetails = () => {
    const { state } = useLocation();
    const { taskId, projectId } = useParams();
    const navigate = useNavigate();
    const userEmail = useSelector((state) => state.auth.userEmail);
    const activeProject = useSelector((state) => state.project.activeProject);

    const isAdmin = activeProject?.role === "PROJECT_ADMIN";
    const [taskStatus, setTaskStatus] = useState(state?.task?.taskStatus || "PENDING");
    const [newComment, setNewComment] = useState("");
    const [now, setNow] = useState(new Date());
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [editingComment, setEditingComment] = useState(null);
    const [dueDateStatus, setDueDateStatus] = useState(null);

    const commentInputRef = useRef(null);
    const commentContainerRef = useRef(null);
    const dropdownRef = useRef(null);

    const { data: user } = useGetUserByEmailQuery(userEmail, { skip: !userEmail });
    const { data: task, isLoading: isLoadingTask, isError } = useGetTaskByIdQuery(
        { projectId, taskId: taskId || state?.task?.id },
        { skip: !projectId || (!taskId && !state?.task?.id) }
    );
    const { data: comments = [] } = useGetCommentsByTaskQuery(
        taskId || state?.task?.id,
        {
            skip: !taskId && !state?.task?.id,
        }
    );
    const { data: creatorUser } = useGetUserByEmailQuery(task?.createdById, {
        skip: !task?.createdById,
    });
    const { data: assigneeUser } = useGetUserByEmailQuery(task?.assigneeId, {
        skip: !task?.assigneeId,
    });

    const [updateTaskStatus] = useUpdateTaskStatusMutation();
    const [addComment] = useAddCommentMutation();
    const [updateComment] = useUpdateCommentMutation();
    const [deleteComment] = useDeleteCommentMutation();
    const [markCommentsAsRead] = useMarkCommentsAsReadMutation();
    const [updateTaskNewState] = useUpdateTaskNewStateMutation();

    const isCommentingAllowed = !(!isAdmin && taskStatus === "CANCELLED");

    useEffect(() => {
        if (task?.taskStatus) {
            setTaskStatus(task.taskStatus);
        }
    }, [task?.taskStatus]);

    useEffect(() => {
        if (task?.dueDate) {
            setDueDateStatus(getDueDateStatus(task.dueDate, taskStatus));
        }
    }, [task?.dueDate, taskStatus]);

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (task?.id && user?.email) {
            markCommentsAsRead({
                taskId: task.id,
                recipientEmail: user.email,
            });

            if (!isAdmin && task.assigneeId === user.email) {
                updateTaskNewState({ projectId, id: task.id, isNew: false });
            }
        }
    }, [task?.id, user?.email, isAdmin, task?.assigneeId, markCommentsAsRead, updateTaskNewState, projectId, comments]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdownId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (commentContainerRef.current) {
            setTimeout(() => {
                commentContainerRef.current.scrollTop =
                    commentContainerRef.current.scrollHeight;
            }, 100);
        }
    }, [comments]);

    const getAuthorName = (authorEmail) => {
        if (authorEmail === user?.email) return "You";
        if (authorEmail === creatorUser?.email) return creatorUser?.name;
        if (authorEmail === assigneeUser?.email) return assigneeUser?.name;
        return authorEmail;
    };

    const handleUpdateComment = async () => {
        if (!editingComment) return;

        try {
            await updateComment({
                commentId: editingComment.id,
                content: newComment.trim(),
                taskId,
            }).unwrap();
        } catch (error) {
            console.error("Error updating comment:", error);
        } finally {
            setEditingComment(null);
            setNewComment("");
            if (commentInputRef.current) {
                commentInputRef.current.innerText = "";
                commentInputRef.current.style.height = "auto";
            }
        }
    };

    const handleAddComment = async () => {
        if (!user || !newComment.trim()) return;

        const commentPayload = {
            taskId,
            authorEmail: user.email,
            content: newComment.trim(),
            recipientEmail: isAdmin ? task.assigneeId : task.createdById,
            isRead: true,
        };

        setNewComment("");
        if (commentInputRef.current) {
            commentInputRef.current.innerText = "";
            commentInputRef.current.style.height = "auto";
        }

        try {
            await addComment(commentPayload).unwrap();
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleEditClick = (comment) => {
        setEditingComment(comment);
        setNewComment(comment.content);
        if (commentInputRef.current) {
            commentInputRef.current.innerText = comment.content;
        }
        setOpenDropdownId(null);
    };

    const handleDeleteClick = async (commentId) => {
        try {
            await deleteComment({ commentId, taskId }).unwrap();
            setOpenDropdownId(null);
            if (editingComment?.id === commentId) {
                setEditingComment(null);
                setNewComment("");
                if (commentInputRef.current) {
                    commentInputRef.current.innerText = "";
                }
            }
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;

        if (!isAdmin && newStatus === "CANCELLED") {
            return;
        }

        if (newStatus === taskStatus) return;

        const previousStatus = taskStatus;
        setTaskStatus(newStatus);

        try {
            await updateTaskStatus({
                projectId,
                id: task.id,
                taskStatus: newStatus,
            }).unwrap();
        } catch (error) {
            console.error("Error updating task status:", error);
            setTaskStatus(previousStatus);
        }
    };

    const handleCommentChange = (e) => {
        const text = e.target.innerText;
        // Fix for contentEditable artifact where clearing text leaves a newline
        setNewComment(text === "\n" ? "" : text);
        e.target.style.height = "auto";
        e.target.style.height = `${Math.min(e.target.scrollHeight, 5 * 24)}px`;
    };

    const handleCancelEdit = () => {
        setEditingComment(null);
        setNewComment("");
        if (commentInputRef.current) {
            commentInputRef.current.innerText = "";
            commentInputRef.current.style.height = "auto";
        }
    };

    return {
        task,
        isLoadingTask,
        isError,
        comments,
        user,
        creatorUser,
        assigneeUser,
        isAdmin,
        taskStatus,
        dueDateStatus,
        newComment,
        now,
        openDropdownId,
        setOpenDropdownId,
        editingComment,
        isCommentingAllowed,
        commentInputRef,
        commentContainerRef,
        dropdownRef,
        getAuthorName,
        handleUpdateComment,
        handleAddComment,
        handleEditClick,
        handleDeleteClick,
        handleStatusChange,
        handleCommentChange,
        handleCancelEdit,
        navigate,
        projectId
    };
};
