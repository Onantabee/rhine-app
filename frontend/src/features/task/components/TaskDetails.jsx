import React from "react";
import { Select } from "../../../core/ui";
import { formatDueDateText, statusColors, priorityColors, dueDateStatusConfig } from '../utils/taskUtils';

const TaskDetails = ({
    task,
    taskStatus,
    dueDateStatus,
    isAdmin,
    creatorName,
    assigneeName,
    onStatusChange,
    backgroundColor,
    borderColor
}) => {
    const nonAdminStatuses = ["PENDING", "ONGOING", "COMPLETED"];

    return (
        <div
            className="relative !border-none md:!border border-gray-200 dark:border-[#404040] md:px-6 w-full max-w-full flex flex-col gap-4 md:gap-6 h-fit">
            <div>
                <h1
                    className={`text-2xl md:text-4xl font-bold break-all whitespace-pre-wrap ${taskStatus === "CANCELLED"
                        ? "text-gray-400 dark:text-[#bfbfbf] line-through italic"
                        : "text-gray-900 dark:text-[#cccccc]"
                        }`}
                >
                    {task.title}
                </h1>
            </div>

            <div className="flex flex-col gap-1">
                <p className="text-xs text-gray-500">Description</p>
                <div className="h-30 md:h-20 border border-gray-200 dark:border-[#262626] p-2 bg-gray-200/20 dark:bg-[#262626]/10 overflow-y-auto"
                    style={{
                        backgroundColor: backgroundColor,
                    }}
                >
                    <h1
                        className={`text-[15px] break-all whitespace-pre-wrap ${taskStatus === "CANCELLED" ? "text-gray-400" : "text-gray-700 dark:text-[#b3b3b3]"
                            }`}
                    >
                        {task.description}
                    </h1>
                </div>
            </div>

            <div className="w-full flex flex-col gap-4">
                <div className="flex flex-row gap-4">
                    <div className="text-sm text-gray-500 flex flex-col gap-2">
                        <span className="text-xs">Priority</span>
                        <p
                            className={`text-sm font-medium w-fit rounded-[5px] py-1 px-4 ${dueDateStatus === "OVERDUE" || taskStatus === "CANCELLED"
                                ? priorityColors.OVERDUE
                                : priorityColors[task.priority]
                                }`}
                        >
                            {task.priority}
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="text-gray-500 text-xs">Status</span>
                        {isAdmin ? (
                            <span
                                className={`text-xs font-medium w-fit rounded-[5px] py-1.5 px-3 border ${dueDateStatus === "OVERDUE" || taskStatus === "CANCELLED"
                                    ? statusColors.OVERDUE
                                    : statusColors[taskStatus]
                                    }`}
                            >
                                {taskStatus}
                            </span>
                        ) : taskStatus === "CANCELLED" ? (
                            <span className="text-xs font-medium w-fit rounded-[5px] py-1.5 px-3 border border-gray-300 bg-gray-400/20 dark:border-gray-400/50 dark:bg-[#404040] text-gray-500 dark:text-gray-400">
                                CANCELLED
                            </span>
                        ) : (
                            <div className="w-fit">
                                <Select
                                    value={taskStatus}
                                    onChange={onStatusChange}
                                    size="sm"
                                    options={nonAdminStatuses.map((status) => ({
                                        value: status,
                                        label: status,
                                    }))}
                                    className={`w-auto min-w-[140px] border !py-1 !px-3 rounded-[5px] text-xs ${dueDateStatus === "OVERDUE"
                                        ? statusColors.OVERDUE
                                        : statusColors[taskStatus]
                                        }`}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <div className="flex flex-row gap-4">
                        {[
                            {
                                label: "Due Date",
                                value: (
                                    <span
                                        className={`px-3 py-1 border rounded-[5px] text-sm flex md:justify-center items-center font-medium ${taskStatus === "COMPLETED"
                                            ? "!px-0 py-1 w-full  whitespace-nowrap text-gray-600 dark:text-[#bfbfbf] text-start border border-transparent uppercase text-sm font-medium italic rounded-[5px] line-clamp-1"
                                            : taskStatus === "CANCELLED"
                                                ? "text-gray-500 border-gray-300 bg-gray-400/20 dark:bg-[#404040] dark:text-gray-400 dark:border-gray-400/50"
                                                : dueDateStatus && dueDateStatusConfig[dueDateStatus]
                                                    ? dueDateStatusConfig[dueDateStatus].className
                                                    : "bg-gray-50 dark:bg-[#262626] border-gray-200 dark:border-[#404040] text-gray-600 dark:text-[#bfbfbf]"
                                            }`}
                                    >
                                        {formatDueDateText(task.dueDate, taskStatus, dueDateStatus)}
                                    </span>
                                ),
                            },
                            ...(isAdmin ? [] : [{
                                label: "Created By",
                                value: (
                                    <span
                                        className={`px-3 py-1 border rounded-[5px] text-sm flex md:justify-center items-center font-medium ${taskStatus === "CANCELLED"
                                            ? "text-gray-500 border-gray-300 bg-gray-400/20 dark:bg-[#404040] dark:text-gray-400 dark:border-gray-400/50"
                                            : "bg-blue-50 dark:bg-blue-500/10 border-blue-300 dark:border-blue-300/50 text-blue-700 dark:text-blue-200/80"
                                            }`}
                                    >
                                        {creatorName || "Loading..."}
                                    </span>
                                ),
                            }]),
                            ...(!isAdmin ? [] : [{
                                label: "Assigned To",
                                value: (
                                    <span
                                        className={`px-3 py-1 border rounded-[5px] text-sm flex md:justify-center items-center font-medium ${taskStatus === "CANCELLED"
                                            ? "text-gray-500 border-gray-300 bg-gray-400/20 dark:bg-[#404040]/50 dark:text-gray-400 dark:border-gray-400/50"
                                            : !task.assigneeId
                                                ? "text-gray-500 border-gray-300 bg-gray-400/20 dark:bg-[#404040]/50 dark:text-gray-400 dark:border-gray-400/50"
                                                : "bg-primary/10 border-primary/60 text-primary dark:text-[#bb99ff]"
                                            }`}
                                    >
                                        {assigneeName || "Unassigned"}
                                    </span>
                                ),
                            }]),
                        ].flatMap(({ label, value }, index, array) => [
                            <p key={label} className="flex flex-col gap-2">
                                <span className="text-gray-500 text-xs">{label}</span>{" "}
                                <span className={`w-fit ${taskStatus === "CANCELLED" ? "text-gray-400" : ""}`}>
                                    {value}
                                </span>
                            </p>,
                            index < array.length - 1 ? (
                                null
                            ) : null,
                        ])}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetails;
