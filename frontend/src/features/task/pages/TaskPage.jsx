import React from "react";
import { ArrowLeft } from "lucide-react";
import { LoadingSpinner, Tabs } from "../../../core/ui";

import TaskDetails from '../components/TaskDetails';
import CommentsList from '../components/CommentsList';
import CommentInput from '../components/CommentInput';
import NotFound from '../../../core/pages/NotFound';

import { getCardBackground, getCardBorder } from '../utils/taskUtils';
import { useTaskDetails } from '../hooks/useTaskDetails';
import { useTheme } from "../../../core/hooks/useTheme";

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
        projectId,
        activeTab,
        setActiveTab,
        unreadCommentsCount
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
        <div className="flex flex-col text-gray-800 h-full gap-4 p-4 md:p-6">
            <div className="hidden md:flex justify-between items-center w-full">
                <button className="flex items-center gap-3 text-primary hover:text-primary-hover cursor-pointer" onClick={() => navigate(`/project/${projectId}/tasks`)}>
                    <span className="bg-gray-100 dark:bg-[#262626] hover:bg-gray-200 hover:dark:bg-[#333333] p-2 rounded-full"><ArrowLeft /></span>
                    Back
                </button>
            </div>

            <Tabs
                tabs={[
                    { id: 'details', label: 'Task details' },
                    { id: 'comments', label: 'Comments', badge: unreadCommentsCount },
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
                className="flex md:hidden"
            />

            <div className="w-full max-w-full flex flex-col md:flex-row gap-6 flex-1 min-h-0">
                <div className={`w-full max-w-full h-fit ${activeTab === 'details' ? 'block' : 'hidden md:block'}`}>
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
                </div>

                <div className={`w-full flex flex-col flex-1 md:flex-initial min-h-0 ${activeTab === 'comments' ? 'flex' : 'hidden md:flex'}`}>
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
                        taskStatus={taskStatus}
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
