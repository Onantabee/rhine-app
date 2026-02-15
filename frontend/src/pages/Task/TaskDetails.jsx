import React from "react";
import { Select } from "../../components/ui";
import { formatDueDateText, statusColors, priorityColors } from "../../utils/taskUtils";

/**
 * TaskDetails component - Displays task information card
 */
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
            className="relative bg-gray-50 px-6 py-4 w-full max-w-full flex flex-col gap-6 h-fit rounded-[5px]"
            style={{
                backgroundColor: cardBackground,
                border: cardBorder,
            }}
        >
            {/* Task Title */}
            <div>
                <h1
                    className={`text-4xl font-bold ${taskStatus === "CANCELLED"
                        ? "text-gray-400 line-through italic"
                        : "text-gray-900"
                        }`}
                >
                    {task.title}
                </h1>
            </div>

            {/* Task Description */}
            <div className="flex flex-col gap-1">
                <p className="text-sm text-gray-500">Description:</p>
                <div className="h-20 border border-gray-200 px-3 py-1 bg-gray-200/20 rounded-[5px]">
                    <h1
                        className={`text-[15px] ${taskStatus === "CANCELLED" ? "text-gray-400" : "text-gray-700"
                            }`}
                    >
                        {task.description}
                    </h1>
                </div>
            </div>

            {/* Priority and Status */}
            <div className="flex flex-wrap gap-4">
                <div className="text-sm text-gray-500 flex items-center justify-center">
                    <span>Priority:&nbsp;</span>
                    <p
                        className={`text-sm border border-gray-200 font-medium rounded-[5px] py-1 px-4 border-none ${dueDateStatus === "OVERDUE" || taskStatus === "CANCELLED"
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

            {/* Due Date, Creator, Assignee */}
            <div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-6">
                    {[
                        {
                            label: "Due Date",
                            value: (
                                <span
                                    className={`px-3 py-1 border rounded-[5px] text-sm flex justify-center items-center font-medium ${taskStatus === "COMPLETED"
                                        ? "bg-green-50 text-green-700 border-green-300"
                                        : taskStatus === "CANCELLED"
                                            ? "bg-gray-100 text-gray-500 border-gray-300"
                                            : dueDateStatus === "OVERDUE"
                                                ? "bg-gray-100 text-gray-500 italic border-gray-300"
                                                : dueDateStatus === "DUE_TODAY"
                                                    ? "bg-red-50 text-red-600 italic border-red-300"
                                                    : dueDateStatus === "DUE_TOMORROW"
                                                        ? "bg-orange-50 text-orange-600 italic border-orange-300"
                                                        : dueDateStatus === "DUE_IN_2_DAYS"
                                                            ? "bg-yellow-50 text-yellow-700 italic border-yellow-300"
                                                            : "bg-gray-50 text-gray-600 border-gray-200"
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
                                        ? "bg-gray-100 border-gray-300 text-gray-500"
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
                                        ? "bg-gray-100 border-gray-300 text-gray-500"
                                        : "bg-[#7733ff]/10 border-[#7733ff]/30 text-[#7733ff]"
                                        }`}
                                >
                                    {assigneeName || "Loading..."}
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
