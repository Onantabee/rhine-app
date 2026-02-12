import { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    useGetTaskByIdQuery,
    useUpdateTaskStatusMutation,
} from "../../store/api/tasksApi";
import {
    useGetCommentsByTaskQuery,
    useAddCommentMutation,
    useUpdateCommentMutation,
    useDeleteCommentMutation,
    useMarkCommentsAsReadMutation,
} from "../../store/api/commentsApi";
import { useGetUserByEmailQuery } from "../../store/api/usersApi";
import { useUpdateTaskNewStateMutation } from "../../store/api/tasksApi";

// Sub-components
import TaskDetails from "./TaskDetails";
import CommentsList from "./CommentsList";
import CommentInput from "./CommentInput";

// Utilities
import {
    getDueDateStatus,
    getCardBackground,
    getCardBorder,
} from "./taskUtils";

/**
 * Task page component - Main task detail and comments view
 */
export default function Task() {
    const { state } = useLocation();
    const { taskId } = useParams();
    const userEmail = useSelector((state) => state.auth.userEmail);

    const isAdmin = state?.isAdmin || false;
    const [taskStatus, setTaskStatus] = useState(state?.task?.taskStatus || "PENDING");
    const [newComment, setNewComment] = useState("");
    const [now, setNow] = useState(new Date());
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [editingComment, setEditingComment] = useState(null);
    const [dueDateStatus, setDueDateStatus] = useState(null);

    const commentInputRef = useRef(null);
    const commentContainerRef = useRef(null);
    const dropdownRef = useRef(null);

    // RTK Query hooks
    const { data: user } = useGetUserByEmailQuery(userEmail, { skip: !userEmail });
    const { data: task, isLoading: isLoadingTask } = useGetTaskByIdQuery(
        taskId || state?.task?.id,
        { skip: !taskId && !state?.task?.id }
    );
    const { data: comments = [] } = useGetCommentsByTaskQuery(
        taskId || state?.task?.id,
        {
            skip: !taskId && !state?.task?.id,
            pollingInterval: 5000,
        }
    );
    const { data: creatorUser } = useGetUserByEmailQuery(task?.createdById, {
        skip: !task?.createdById,
    });
    const { data: assigneeUser } = useGetUserByEmailQuery(task?.assigneeId, {
        skip: !task?.assigneeId,
    });

    // Mutations
    const [updateTaskStatus] = useUpdateTaskStatusMutation();
    const [addComment] = useAddCommentMutation();
    const [updateComment] = useUpdateCommentMutation();
    const [deleteComment] = useDeleteCommentMutation();
    const [markCommentsAsRead] = useMarkCommentsAsReadMutation();
    const [updateTaskNewState] = useUpdateTaskNewStateMutation();

    const isCommentingAllowed = !(!isAdmin && taskStatus === "CANCELLED");

    // Sync taskStatus with fetched task
    useEffect(() => {
        if (task?.taskStatus) {
            setTaskStatus(task.taskStatus);
        }
    }, [task?.taskStatus]);

    // Due date status calculation
    useEffect(() => {
        if (task?.dueDate) {
            setDueDateStatus(getDueDateStatus(task.dueDate, taskStatus));
        }
    }, [task?.dueDate, taskStatus]);

    // Timer for comment timestamps
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Mark comments as read on page load
    useEffect(() => {
        if (task?.id && user?.email) {
            markCommentsAsRead({
                taskId: task.id,
                recipientEmail: user.email,
            });
            updateTaskNewState({ id: task.id, isNew: false });
        }
    }, [task?.id, user?.email, markCommentsAsRead, updateTaskNewState]);

    // Close dropdown on outside click
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

    // Auto-scroll to bottom on new comments
    useEffect(() => {
        if (commentContainerRef.current) {
            setTimeout(() => {
                commentContainerRef.current.scrollTop =
                    commentContainerRef.current.scrollHeight;
            }, 100);
        }
    }, [comments]);

    // Get author name for comments
    const getAuthorName = (authorEmail) => {
        if (authorEmail === user?.email) return "Me";
        if (authorEmail === creatorUser?.email) return creatorUser?.name;
        if (authorEmail === assigneeUser?.email) return assigneeUser?.name;
        return authorEmail;
    };

    // Event handlers
    const handleUpdateComment = async () => {
        if (!editingComment) return;

        try {
            await updateComment({
                id: editingComment.id,
                content: newComment.trim(),
            }).unwrap();
            setEditingComment(null);
            setNewComment("");
            if (commentInputRef.current) {
                commentInputRef.current.innerText = "";
                commentInputRef.current.dataset.placeholder = "Add a comment...";
            }
        } catch (error) {
            console.error("Error updating comment:", error);
        }
    };

    const handleAddComment = async () => {
        if (!user || !newComment.trim()) return;

        try {
            const commentPayload = {
                taskId: task.id,
                authorEmail: user.email,
                content: newComment.trim(),
                recipientEmail: isAdmin ? task.assigneeId : task.createdById,
                isRead: true,
            };

            await addComment(commentPayload).unwrap();
            setNewComment("");
            if (commentInputRef.current) {
                commentInputRef.current.innerText = "";
                commentInputRef.current.dataset.placeholder = "Add a comment...";
            }
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
            await deleteComment(commentId).unwrap();
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
                id: task.id,
                taskStatus: newStatus,
            }).unwrap();
        } catch (error) {
            console.error("Error updating task status:", error);
            setTaskStatus(previousStatus);
        }
    };

    const handleCommentChange = (e) => {
        setNewComment(e.target.innerText);
        e.target.style.height = "auto";
        e.target.style.height = `${Math.min(e.target.scrollHeight, 5 * 24)}px`;
        e.target.dataset.placeholder =
            e.target.innerText.trim() === "" ? "Add a comment..." : "";
    };

    const handleCancelEdit = () => {
        setEditingComment(null);
        setNewComment("");
        if (commentInputRef.current) {
            commentInputRef.current.innerText = "";
        }
    };

    if (isLoadingTask || !task) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-400">Loading task...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-between min-h-full h-[calc(100dvh-84px)] text-gray-200 md:px-5">
            <div className="rounded-lg md:p-2 w-full max-w-3xl mx-auto">
                <TaskDetails
                    task={task}
                    taskStatus={taskStatus}
                    dueDateStatus={dueDateStatus}
                    isAdmin={isAdmin}
                    creatorName={creatorUser?.name}
                    assigneeName={assigneeUser?.name}
                    onStatusChange={handleStatusChange}
                    cardBackground={getCardBackground(taskStatus, dueDateStatus)}
                    cardBorder={getCardBorder(taskStatus, dueDateStatus)}
                />

                <CommentsList
                    comments={comments}
                    currentUserEmail={user?.email}
                    getAuthorName={getAuthorName}
                    now={now}
                    isCommentingAllowed={isCommentingAllowed}
                    openDropdownId={openDropdownId}
                    onToggleDropdown={(id) =>
                        setOpenDropdownId(openDropdownId === id ? null : id)
                    }
                    onEditComment={handleEditClick}
                    onDeleteComment={handleDeleteClick}
                    dropdownRef={dropdownRef}
                    containerRef={commentContainerRef}
                />
            </div>

            <CommentInput
                isCommentingAllowed={isCommentingAllowed}
                newComment={newComment}
                editingComment={editingComment}
                onCommentChange={handleCommentChange}
                onSubmit={editingComment ? handleUpdateComment : handleAddComment}
                onCancelEdit={handleCancelEdit}
                inputRef={commentInputRef}
            />
        </div>
    );
}
