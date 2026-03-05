import React from "react";
import { Card, Chip } from "../../../core/ui";
import { Pencil, Trash2, Eye } from "lucide-react";
import {
    formatDueDateText,
    getCardBackground,
    getCardBorder,
    dueDateStatusConfig,
    highlightSearchMatch,
} from '../../task/utils/taskUtils';
import { useTaskCard } from '../hooks/useTaskCard';
import { useTheme } from "../../../core/hooks/useTheme";

const MobileTaskCard = ({
    task,
    onEdit,
    onDelete,
    onView,
    isAdmin,
    assignee,
    loggedInUser,
    createdBy,
    searchTerm,
}) => {
    const { title, priority, taskStatus, dueDate } = task;

    const {
        adminUser,
        unreadCountByRecipient,
        taskIsNew,
        dueDateStatus,
        firstName,
        lastName,
        shouldGrayOut,
    } = useTaskCard({
        task,
        isAdmin,
        assignee,
        loggedInUser,
        createdBy,
    });

    const { theme } = useTheme();

    return (
        <div className="relative overflow-visible">
            {unreadCountByRecipient > 0 && (
                <button
                    onClick={onView}
                    className="absolute h-6 w-6 bg-red-500 text-white text-xs border border-red-400 flex justify-center items-center -right-2 -top-2 cursor-pointer z-10 rounded-full"
                >
                    {unreadCountByRecipient > 99 ? "99+" : unreadCountByRecipient}
                </button>
            )}

            {!isAdmin && taskIsNew && (
                <button
                    onClick={onView}
                    className={`absolute rounded-full h-6 px-3 bg-[#14B8A6] dark:bg-[#0f8a7b] text-white text-xs flex justify-center items-center ${unreadCountByRecipient > 0 ? "right-8" : "-right-2"
                        } -top-2 cursor-pointer z-10`}
                >
                    New
                </button>
            )}

            <Card
                padding="default"
                className={`hover:!bg-gray-50 dark:hover:!bg-[#262626] hover:!border-gray-200 dark:hover:!border-[#404040] !p-3 h-full flex flex-col gap-2 ${!isAdmin ? "cursor-pointer" : ""}`}
                style={{
                    backgroundColor: getCardBackground(taskStatus, dueDateStatus, theme),
                    border: getCardBorder(taskStatus, dueDateStatus, theme),
                }}
                onClick={!isAdmin ? onView : undefined}
            >
                <h3
                    className={`text-base font-bold truncate ${taskStatus === "CANCELLED"
                        ? "text-gray-400 line-through italic"
                        : "text-gray-700 dark:text-[#cccccc]"
                        }`}
                >
                    {highlightSearchMatch(title, searchTerm)}
                </h3>

                <div className="w-full flex gap-2">
                    <Chip
                        variant={shouldGrayOut() ? "OVERDUE" : taskStatus}
                        size="sm"
                        className="w-full"
                    >
                        {taskStatus}
                    </Chip>
                    <Chip
                        variant={shouldGrayOut() ? "OVERDUE" : priority}
                        size="sm"
                        className="rounded-full w-fit"
                    >
                        {priority.charAt(0)}
                    </Chip>
                </div>

                {!isAdmin && (
                    <div className="flex flex-col gap-2 items-start">
                        <span className="text-sm text-gray-500 dark:text-[#bfbfbf] truncate mt-0.5">Creator</span>
                        <div className="flex items-center gap-2">
                            <div className="flex flex-col">
                                <span
                                    className={`flex justify-center items-center text-sm w-7.5 h-7.5 rounded-full border text-sm font-medium truncate max-w-[115px] ${taskStatus === "CANCELLED"
                                        ? "text-gray-500 border-gray-300 bg-gray-400/20 dark:bg-[#404040] dark:text-gray-400 dark:border-gray-400/50"
                                        : "bg-blue-50 dark:bg-blue-500/10 border-blue-300 text-blue-700 dark:text-blue-200"
                                        }`}
                                >
                                    {adminUser?.name ? `${adminUser.name.split(" ")[0].charAt(0)}`.trim() : "Loading..."}
                                </span>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-[#bfbfbf] truncate mt-0.5">{adminUser?.name}</span>
                        </div>
                    </div>
                )}

                <div className="w-full flex items-center gap-2 ">
                    {isAdmin ? (
                        !assignee ? (
                            <div className=" w-8 h-8 rounded-full text-gray-500 border-gray-300 bg-gray-400/20 dark:bg-[#404040]/50 dark:text-gray-400 border dark:border-gray-400/50 flex shrink-0 justify-center items-center text-sm">
                                U
                            </div>
                        ) : (
                            <div>
                                {taskStatus === "COMPLETED" || taskStatus === "CANCELLED" ? (
                                    <div
                                        className={`px-3 py-1.5 font-semibold border text-sm rounded-[5px] ${taskStatus === "CANCELLED"
                                            ? "text-gray-500 border-gray-300 bg-gray-400/20 dark:bg-[#404040] dark:text-gray-400 dark:border-gray-400/50"
                                            : "bg-primary/10 border-primary/30 text-primary"
                                            }`}
                                    >
                                        {firstName || "User"} {lastName ? lastName : ""}
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded-full border border-primary/30 bg-primary/10 text-primary flex justify-center items-center text-sm">
                                        {firstName?.charAt(0) || "U"}
                                    </div>
                                )}
                            </div>
                        )
                    ) : (
                        null
                    )}

                    {!(taskStatus === "COMPLETED" || taskStatus === "CANCELLED") ? (
                        <>
                            <div className="flex flex-col w-full">
                                <span
                                    className={`px-3 py-1 w-full text-center border text-sm font-medium italic rounded-[5px] line-clamp-1 ${dueDateStatus && dueDateStatusConfig[dueDateStatus]
                                        ? dueDateStatusConfig[dueDateStatus].className
                                        : "bg-gray-50 dark:bg-[#262626] border-gray-200 dark:border-[#404040] text-gray-600 dark:text-[#bfbfbf] "
                                        }`}
                                >
                                    {formatDueDateText(dueDate, taskStatus, dueDateStatus)}
                                </span>
                            </div>
                        </>
                    ) : (
                        !isAdmin && (
                            <div className="flex flex-col w-full flex">
                                <span
                                    className={`py-1 w-full  whitespace-nowrap text-gray-600 dark:text-[#bfbfbf] text-start border border-transparent uppercase text-sm font-medium italic rounded-[5px] line-clamp-1`}>
                                    Don't matter
                                </span>
                            </div>
                        )
                    )}
                </div>

                {isAdmin && (
                    <div className="flex justify-end items-center gap-2">
                        <button
                            onClick={onView}
                            className="p-2 text-gray-400 hover:text-blue-500 cursor-pointer"
                        >
                            <Eye size={18} />
                        </button>
                        <button
                            onClick={onEdit}
                            className="p-2 text-gray-400 hover:text-primary cursor-pointer"
                        >
                            <Pencil size={18} />
                        </button>
                        <button
                            onClick={onDelete}
                            className="p-2 text-red-400 hover:text-red-600 cursor-pointer"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default MobileTaskCard;
