import React from "react";
import { Select } from "../../components/ui";
import { formatDueDateText, statusColors, priorityColors, dueDateStatusConfig } from "../../utils/taskUtils";

const TaskDetails = ({
    task,
    taskStatus,
    dueDateStatus,
    isAdmin,
    creatorName,
    assigneeName,
    onStatusChange,
    cardBackground,
    cardBorder,
}) => {
    const nonAdminStatuses = ["PENDING", "ONGOING", "COMPLETED"];

    return (
        <div
            className="relative border-gray-200 dark:border-[#404040] px-6 py-4 w-full max-w-full flex flex-col gap-6 h-fit"
            style={{
                backgroundColor: cardBackground,
                border: cardBorder,
            }}
        >
            <div>
                <h1
                    className={`text-4xl font-bold break-all whitespace-pre-wrap ${taskStatus === "CANCELLED"
                        ? "text-gray-400 dark:text-[#bfbfbf] line-through italic"
                        : "text-gray-900 dark:text-[#cccccc]"
                        }`}
                >
                    {task.title}
                </h1>
            </div>

            <div className="flex flex-col gap-1">
                <p className="text-sm text-gray-500">Description:</p>
                <div className="h-20 border border-gray-200 dark:border-[#404040] px-3 py-1 bg-gray-200/20 dark:bg-[#404040]/10 overflow-y-auto">
                    <h1
                        className={`text-[15px] break-all whitespace-pre-wrap ${taskStatus === "CANCELLED" ? "text-gray-400" : "text-gray-700 dark:text-[#cccccc]"
                            }`}
                    >
                        {task.description}
                    </h1>
                </div>
            </div>

            <div className="flex flex-wrap gap-4">
                <div className="text-sm text-gray-500 flex items-center justify-center">
                    <span>Priority:&nbsp;</span>
                    <p
                        className={`text-sm font-medium rounded-[5px] py-1 px-4 ${dueDateStatus === "OVERDUE" || taskStatus === "CANCELLED"
                            ? priorityColors.OVERDUE
                            : priorityColors[task.priority]
                            }`}
                    >
                        {task.priority}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm">Status:</span>
                    {isAdmin ? (
                        <span
                            className={`text-sm font-medium rounded-[5px] py-2 px-4 border-none ${dueDateStatus === "OVERDUE" || taskStatus === "CANCELLED"
                                ? statusColors.OVERDUE
                                : statusColors[taskStatus]
                                }`}
                        >
                            {taskStatus}
                        </span>
                    ) : taskStatus === "CANCELLED" ? (
                        <span className="text-sm font-medium py-2 px-4 border-none bg-gray-100 text-gray-500">
                            CANCELLED
                        </span>
                    ) : (
                        <Select
                            value={taskStatus}
                            onChange={onStatusChange}
                            size="sm"
                            options={nonAdminStatuses.map((status) => ({
                                value: status,
                                label: status,
                            }))}
                            className={`w-auto min-w-[140px] border py-0 px-2 rounded-[5px] ${dueDateStatus === "OVERDUE"
                                ? statusColors.OVERDUE
                                : statusColors[taskStatus]
                                }`}
                        />
                    )}
                </div>
            </div>

            <div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-6">
                    {[
                        {
                            label: "Due Date",
                            value: (
                                <span
                                    className={`px-3 py-1 border rounded-[5px] text-sm flex justify-center items-center font-medium ${taskStatus === "COMPLETED"
                                        ? "bg-green-50 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-300/50"
                                        : taskStatus === "CANCELLED"
                                            ? "bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700/50"
                                            : dueDateStatus && dueDateStatusConfig[dueDateStatus]
                                                ? dueDateStatusConfig[dueDateStatus].className
                                                : "bg-gray-50 dark:bg-[#262626] border-gray-200 dark:border-[#404040] text-gray-600 dark:text-[#bfbfbf]"
                                        }`}
                                >
                                    {formatDueDateText(task.dueDate, taskStatus, dueDateStatus)}
                                </span>
                            ),
                        },
                        {
                            label: "Created By",
                            value: (
                                <span
                                    className={`px-3 py-1 border rounded-[5px] text-sm flex justify-center items-center font-medium ${taskStatus === "CANCELLED"
                                        ? "bg-gray-100 border-gray-200 dark:border-[#404040] text-gray-500"
                                        : "bg-blue-50 border-blue-300 text-blue-700"
                                        }`}
                                >
                                    {creatorName || "Loading..."}
                                </span>
                            ),
                        },
                        ...(!isAdmin ? [] : [{
                            label: "Assigned To",
                            value: (
                                <span
                                    className={`px-3 py-1 border rounded-[5px] text-sm flex justify-center items-center font-medium ${taskStatus === "CANCELLED"
                                        ? "bg-gray-100 border-gray-200 dark:border-[#404040] text-gray-500"
                                        : !task.assigneeId
                                            ? "bg-gray-100 border-gray-200 dark:border-[#404040] text-gray-500"
                                            : "bg-primary/10 border-primary/30 text-primary"
                                        }`}
                                >
                                    {assigneeName || "Unassigned"}
                                </span>
                            ),
                        }]),
                    ].flatMap(({ label, value }, index, array) => [
                        <p key={label} className="flex gap-2 items-center">
                            <span className="text-gray-500 text-sm">{label}:</span>{" "}
                            <span className={taskStatus === "CANCELLED" ? "text-gray-400" : ""}>
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
    );
};

export default TaskDetails;
