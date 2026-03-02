import React, { useState } from "react";
import { createPortal } from "react-dom";
import { MobileListItem, Chip } from "../../../core/ui";
import { useGetUserByEmailQuery } from '../../user/api/usersApi';
import { useGetTaskNewStateQuery } from '../../task/api/tasksApi';
import { useCountUnreadCommentsQuery } from '../../task/api/commentsApi';
import { Pencil, Trash2, Eye, MoreVertical } from "lucide-react";
import {
    getDueDateStatus,
    formatDueDateText,
    dueDateStatusConfig,
    highlightSearchMatch,
    getCardBackground
} from '../../task/utils/taskUtils';
import { useTheme } from "../../../core/hooks/useTheme";

const MobileTaskList = ({
    task,
    onEdit,
    onDelete,
    onView,
    isAdmin,
    assignee,
    createdBy,
    loggedInUser,
    onClick,
    searchTerm,
    isLastChild = false,
}) => {
    const { title, priority, dueDate, taskStatus, projectId } = task;
    const { theme } = useTheme();
    const dueDateStatus = getDueDateStatus(dueDate, taskStatus);
    const shouldGrayOut = dueDateStatus === "OVERDUE" || taskStatus === "CANCELLED";

    const { data: adminUser } = useGetUserByEmailQuery(createdBy, {
        skip: !createdBy,
    });
    const { data: employeeUser } = useGetUserByEmailQuery(assignee, {
        skip: !assignee,
    });

    const { data: taskNewState } = useGetTaskNewStateQuery(
        { projectId, taskId: task.id },
        {
            skip: isAdmin || !projectId,
        }
    );
    const taskIsNew = taskNewState?.isNew || false;

    const { data: unreadCountByRecipient = 0 } = useCountUnreadCommentsQuery(
        {
            taskId: task.id,
            recipientEmail: loggedInUser?.email,
        },
        {
            skip: !loggedInUser?.email,
        }
    );

    const [actionMenuOpen, setActionMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [dropDirection, setDropDirection] = useState("down");

    const toggleActionMenu = (e) => {
        e.stopPropagation();
        if (actionMenuOpen) {
            setActionMenuOpen(false);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const menuHeight = 116; // Approx px height for the 3 menu items + padding
            const isDropUp = isLastChild || spaceBelow < menuHeight;

            setDropDirection(isDropUp ? "up" : "down");
            setMenuPosition({
                top: isDropUp ? rect.top + window.scrollY - menuHeight : rect.bottom + window.scrollY,
                left: rect.right - 192,
            });
            setActionMenuOpen(true);
        }
    };

    const closeMenu = (e) => {
        e.stopPropagation();
        setActionMenuOpen(false);
    };

    let avatarChar = "?";
    let assigneeName = "Unassigned";
    let creatorName = "Unknown";
    let avatarColorClass = "border-primary/30 bg-primary/10 text-primary";

    if (isAdmin) {
        if (assignee) {
            avatarChar = employeeUser?.name?.charAt(0) || "U";
            assigneeName = employeeUser?.name || "Unassigned";
            if (taskStatus === "CANCELLED") {
                avatarColorClass = "text-gray-500 border-gray-300 bg-gray-400/20 dark:bg-[#404040] dark:text-gray-400 dark:border-gray-400/50";
            }
        } else {
            avatarChar = "?";
            avatarColorClass = "text-gray-500 border-gray-300 bg-gray-400/20 dark:bg-[#404040]/50 dark:text-gray-400 dark:border-gray-400/50";
        }
    } else {
        creatorName = adminUser?.name || "Loading...";
        avatarChar = adminUser?.name?.charAt(0) || "C";
        if (taskStatus === "CANCELLED") {
            avatarColorClass = "text-gray-500 border-gray-300 bg-gray-400/20 dark:bg-[#404040] dark:text-gray-400 dark:border-gray-400/50";
        } else {
            avatarColorClass = "bg-blue-50 dark:bg-blue-500/10 border-blue-300 text-blue-700 dark:text-blue-200";
        }
    }

    return (
        <>
            <MobileListItem
                style={{ backgroundColor: getCardBackground(taskStatus, dueDateStatus, theme) }}
                onClick={onClick}
                titleClassName={taskStatus === "CANCELLED" ? "text-gray-400 line-through italic" : "text-gray-800 dark:text-[#cccccc]"}
                title={highlightSearchMatch(title, searchTerm)}
                subtitle={isAdmin ? `Assigned to ${assigneeName}` : `Created by ${creatorName}`}
                avatarChar={avatarChar}
                avatarColorClass={avatarColorClass}

                isNew={!isAdmin && taskIsNew}
                badgeCount={unreadCountByRecipient}
                chips={[
                    <Chip key="status" variant={shouldGrayOut ? "OVERDUE" : taskStatus} size="sm">{taskStatus}</Chip>,
                    <Chip key="priority" variant={shouldGrayOut ? "OVERDUE" : priority} size="sm">{priority}</Chip>
                ]}
                details={[
                    {
                        label: taskStatus !== "CANCELLED" ? undefined : undefined,
                        value: taskStatus !== "CANCELLED" ? (
                            <span className={`px-2 py-1 text-xs font-medium italic border rounded-[5px] whitespace-nowrap ${dueDateStatus && dueDateStatusConfig[dueDateStatus] ? dueDateStatusConfig[dueDateStatus].className : "text-gray-600 dark:text-[#bfbfbf] border-none"}`}>
                                {formatDueDateText(dueDate, taskStatus, dueDateStatus)}
                            </span>
                        ) : (
                            <span className="px-2 py-1 text-xs font-medium italic border rounded-[5px] whitespace-nowrap text-gray-600 dark:text-[#bfbfbf] border-none">Don't matter</span>
                        )
                    },
                ]}
                actions={isAdmin && (
                    <div className="relative inline-block text-left">
                        <button
                            onClick={toggleActionMenu}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 dark:text-[#bfbfbf] rounded-lg cursor-pointer"
                            aria-label="More actions"
                        >
                            <MoreVertical size={18} />
                        </button>
                    </div>
                )}
            />
            {actionMenuOpen && createPortal(
                <div className="fixed inset-0 z-[9999] flex flex-col" style={{ top: 0, left: 0 }}>
                    <div className="fixed inset-0 bg-transparent" onClick={closeMenu} />
                    <div
                        className="absolute z-[10000] w-48 bg-white dark:bg-[#1a1a1a] py-1 shadow-lg ring-1 ring-gray-400 dark:ring-[#404040] ring-opacity-5 focus:outline-none"
                        style={{ top: menuPosition.top, left: menuPosition.left }}
                    >
                        {dropDirection === "down" ? (
                            <div className="absolute -top-[7px] right-[10px] w-3 h-3 rotate-45 bg-white dark:bg-[#1a1a1a] border-t border-l border-gray-400 dark:border-[#404040] z-[-1]" />
                        ) : (
                            <div className="absolute -bottom-[7px] right-[10px] w-3 h-3 rotate-45 bg-white dark:bg-[#1a1a1a] border-b border-r border-gray-400 dark:border-[#404040] z-[-1]" />
                        )}
                        <button
                            onClick={(e) => { closeMenu(e); onView?.(); }}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-[#cccccc] hover:bg-gray-100 dark:hover:bg-[#262626]"
                        >
                            <Eye className="mr-3 h-4 w-4 text-gray-400" />
                            View Task
                        </button>
                        <button
                            onClick={(e) => { closeMenu(e); onEdit?.(); }}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-[#cccccc] hover:bg-gray-100 dark:hover:bg-[#262626]"
                        >
                            <Pencil className="mr-3 h-4 w-4 text-gray-400" />
                            Edit Task
                        </button>
                        <button
                            onClick={(e) => { closeMenu(e); onDelete?.(); }}
                            className="flex w-full items-center px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500 dark:hover:text-white"
                        >
                            <Trash2 className="mr-3 h-4 w-4" />
                            Delete Task
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default MobileTaskList;
