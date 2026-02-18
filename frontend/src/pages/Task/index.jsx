import { useState, useEffect, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeft } from "lucide-react";

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
import { LoadingSpinner } from "../../components/ui";

import TaskDetails from "./TaskDetails";
import CommentsList from "./CommentsList";
import CommentInput from "./CommentInput";

import {
    getDueDateStatus,
    getCardBackground,
    getCardBorder,
} from "../../utils/taskUtils";

export default function Task() {
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
    const { data: task, isLoading: isLoadingTask } = useGetTaskByIdQuery(
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
        setNewComment(e.target.innerText);
        e.target.style.height = "auto";
        e.target.style.height = `${Math.min(e.target.scrollHeight, 5 * 24)}px`;
        e.target.style.height = `${Math.min(e.target.scrollHeight, 5 * 24)}px`;
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
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="flex flex-col text-gray-800 h-full gap-4">
            <div>
                <button className="flex items-center gap-3 text-[#7733ff] hover:text-[#5500ff] cursor-pointer" onClick={() => navigate(`/project/${projectId}`)}>
                    <ArrowLeft />
                    Back
                </button>
            </div>
            <div className="w-full max-w-full flex flex-col md:flex-row gap-6 flex-1 min-h-0">
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

                <div className="w-full flex flex-col flex-1 md:flex-initial min-h-0">
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
            </div>
        </div>
    );
}
