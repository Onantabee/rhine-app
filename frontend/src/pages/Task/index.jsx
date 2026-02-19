import React from "react";
import { ArrowLeft } from "lucide-react";
import { LoadingSpinner } from "../../components/ui";

import TaskDetails from "./TaskDetails";
import CommentsList from "./CommentsList";
import CommentInput from "./CommentInput";
import NotFound from "../NotFound";

import { getCardBackground, getCardBorder } from "../../utils/taskUtils";
import { useTaskDetails } from "../../hooks/task/useTaskDetails";
import { useTheme } from "../../hooks/useTheme";

export default function Task() {
    const {
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
    } = useTaskDetails();
    const { theme } = useTheme();

    if (isError || (!isLoadingTask && !task)) {
        return (
            <NotFound
                title="Task Not Found"
                message="The task you are looking for doesn't exist or you don't have permission to view it."
            />
        );
    }

    if (isLoadingTask) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="flex flex-col text-gray-800 h-full gap-4 p-6">
            <div>
                <button className="flex items-center gap-3 text-primary hover:text-primary-hover cursor-pointer" onClick={() => navigate(`/project/${projectId}`)}>
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
                    cardBackground={getCardBackground(taskStatus, dueDateStatus, theme)}
                    cardBorder={getCardBorder(taskStatus, dueDateStatus, theme)}
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
