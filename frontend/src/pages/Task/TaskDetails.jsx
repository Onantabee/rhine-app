import React from "react";
import { formatDueDateText, statusColors, priorityColors } from "./taskUtils";

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
            className="relative bg-[#333333]/50 px-6 py-4 rounded-2xl"
            style={{
                backgroundColor: cardBackground,
                border: cardBorder,
            }}
        >
            {/* Task Title */}
            <div className="mb-2">
                <h1
                    className={`text-4xl font-bold ${taskStatus === "CANCELLED"
                            ? "text-gray-500 line-through italic"
                            : "text-white"
                        }`}
                >
                    {task.title}
                </h1>
            </div>

            {/* Task Description */}
            <div className="mb-2">
                <p className="text-sm text-[#737373]">Description:</p>
                <div className="h-20 border-2 border-[#333333]/70 rounded-2xl px-3 py-1">
                    <h1
                        className={`text-[15px] ${taskStatus === "CANCELLED" && "text-gray-500"
                            }`}
                    >
                        {task.description}
                    </h1>
                </div>
            </div>

            {/* Priority and Status */}
            <div className="flex flex-wrap gap-4 mt-4">
                <div className="rounded-full text-sm text-[#737373] flex items-center justify-center">
                    <span>Priority:&nbsp;</span>
                    <p
                        className={`rounded-full text-gray-300 text-sm font-medium py-2 px-4 border-none ${dueDateStatus === "OVERDUE" || taskStatus === "CANCELLED"
                                ? priorityColors.OVERDUE
                                : priorityColors[task.priority]
                            }`}
                    >
                        {task.priority}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-[#737373] text-sm">Status:</span>
                    {isAdmin ? (
                        <span
                            className={`text-gray-300 rounded-full text-sm font-medium py-2 px-4 border-none ${dueDateStatus === "OVERDUE" || taskStatus === "CANCELLED"
                                    ? statusColors.OVERDUE
                                    : statusColors[taskStatus]
                                }`}
                        >
                            {taskStatus}
                        </span>
                    ) : taskStatus === "CANCELLED" ? (
                        <span className="text-gray-300 rounded-full text-sm font-medium py-2 px-4 border-none bg-gray-500/50">
                            CANCELLED
                        </span>
                    ) : (
                        <select
                            value={taskStatus}
                            onChange={onStatusChange}
                            className={`select rounded-full text-sm font-medium py-2 px-4 border-none focus:outline-none ${dueDateStatus === "OVERDUE"
                                    ? statusColors.OVERDUE
                                    : statusColors[taskStatus]
                                }`}
                        >
                            {nonAdminStatuses.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {/* Due Date, Creator, Assignee */}
            <div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                    {[
                        {
                            label: "Due Date",
                            value: (
                                <span
                                    className={`px-3 py-1 border-2 text-sm rounded-full flex justify-center items-center cursor-pointer font-medium ${taskStatus === "COMPLETED"
                                            ? "bg-green-500/10 text-green-400 border-green-500/30"
                                            : taskStatus === "CANCELLED"
                                                ? "bg-gray-500/10 text-gray-400 border-gray-500/30"
                                                : dueDateStatus === "OVERDUE"
                                                    ? "bg-gray-500/10 text-gray-400 italic border-gray-300/30"
                                                    : dueDateStatus === "DUE_TODAY"
                                                        ? "bg-red-500/10 text-red-400 italic border-red-500/30"
                                                        : dueDateStatus === "DUE_TOMORROW"
                                                            ? "bg-orange-500/10 text-orange-400 italic border-orange-500/30"
                                                            : dueDateStatus === "DUE_IN_2_DAYS"
                                                                ? "bg-yellow-500/10 text-yellow-400 italic border-yellow-500/30"
                                                                : "bg-gray-500/10 text-gray-400 border-gray-500/30"
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
                                    className={`px-3 py-1 border text-sm rounded-full flex justify-center items-center cursor-pointer font-medium ${taskStatus === "CANCELLED"
                                            ? "bg-gray-500/10 border-gray-500 text-[#8c8c8c]"
                                            : "bg-[#5d8bf4]/20 border-[#5d8bf4] text-[#b7cbfa]"
                                        }`}
                                >
                                    {creatorName || "Loading..."}
                                </span>
                            ),
                        },
                        {
                            label: "Assigned To",
                            value: (
                                <span
                                    className={`px-3 py-1 border text-sm rounded-full flex justify-center items-center cursor-pointer font-medium ${taskStatus === "CANCELLED"
                                            ? "bg-gray-500/10 border-gray-500 text-[#8c8c8c]"
                                            : "bg-[#C77BBF]/20 border-[#C77BBF] text-[#e8c9e5]"
                                        }`}
                                >
                                    {assigneeName || "Loading..."}
                                </span>
                            ),
                        },
                    ].flatMap(({ label, value }, index, array) => [
                        <p key={label} className="flex flex-col gap-2">
                            <span className="text-[#737373] text-sm">{label}:</span>{" "}
                            <span className={taskStatus === "CANCELLED" ? "text-gray-500" : ""}>
                                {value}
                            </span>
                        </p>,
                        index < array.length - 1 ? (
                            <div
                                key={`dot-${index}`}
                                className="w-1 h-1 rounded-full bg-[#737373] mx-5 self-center"
                            />
                        ) : null,
                    ])}
                </div>
            </div>
        </div>
    );
};

export default TaskDetails;
