import React from "react";
import { Card, Chip } from "../ui";
import { Pencil, Trash2, Eye } from "lucide-react";
import {
  formatDueDateText,
  getCardBackground,
  dueDateStatusConfig,
  highlightSearchMatch,
} from "../../utils/taskUtils";
import { useTaskCard } from "../../hooks/task/useTaskCard";

const TaskCard = ({
  task,
  onEdit,
  onDelete,
  onView,
  isAdmin,
  assignee,
  loggedInUser,
  createdBy,
  searchTerm
}) => {
  const { title, priority, dueDate, taskStatus } = task;

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

  return (
    <div className="relative">
      {unreadCountByRecipient > 0 && (
        <button
          onClick={onView}
          className="absolute h-6 w-6 bg-red-500 text-white text-xs border border-red-400 flex justify-center items-center -right-2 -top-2 cursor-pointer z-10 rounded-full"
        >
          {unreadCountByRecipient}
        </button>
      )}

      {!isAdmin && taskIsNew && (
        <button
          onClick={onView}
          className={`absolute rounded-full  h-6 px-3 bg-[#14B8A6] text-white text-xs flex justify-center items-center ${unreadCountByRecipient > 0 ? "right-8" : "-right-2"
            } -top-2 cursor-pointer z-10`}
        >
          New
        </button>
      )}

      <Card
        padding="default"
        className=""
        style={{
          backgroundColor: getCardBackground(taskStatus, dueDateStatus),
          borderColor:
            taskStatus === "COMPLETED"
              ? "rgba(34, 197, 94, 0.3)"
              : taskStatus === "CANCELLED"
                ? "rgba(209, 213, 219, 0.5)"
                : dueDateStatus === "DUE_TODAY"
                  ? "rgba(239, 68, 68, 0.3)"
                  : dueDateStatus === "DUE_TOMORROW"
                    ? "rgba(249, 115, 22, 0.3)"
                    : dueDateStatus === "DUE_IN_2_DAYS"
                      ? "rgba(234, 179, 8, 0.3)"
                      : "#e5e7eb",
        }}
      >
        <h3
          className={`text-base font-bold mb-3 truncate ${taskStatus === "CANCELLED"
            ? "text-gray-400 line-through italic"
            : "text-gray-700 dark:text-[#cccccc]"
            }`}
        >
          {highlightSearchMatch(title, searchTerm)}
        </h3>

        <div className="border-t border-gray-200 dark:border-[#404040] my-3" />

        <div className="flex gap-2 mb-3">
          <Chip
            variant={shouldGrayOut() ? "OVERDUE" : taskStatus}
            size="sm"
            className="min-w-[90px]"
          >
            {taskStatus}
          </Chip>
          <Chip
            variant={shouldGrayOut() ? "OVERDUE" : priority}
            size="sm"
            className="min-w-[80px]"
          >
            {priority}
          </Chip>
        </div>

        <div className="flex items-center gap-2 mb-3">
          {isAdmin ? (
            !assignee ? (
              <div className="px-3 py-1.5 font-semibold border text-sm rounded-[5px] bg-gray-100 border-gray-200 dark:border-[#404040] text-gray-500">
                Unassigned
              </div>
            ) : (
              <div>
                {taskStatus === "COMPLETED" || taskStatus === "CANCELLED" ? (
                  <div
                    className={`px-3 py-1.5 font-semibold border text-sm rounded-[5px] ${taskStatus === "CANCELLED"
                      ? "bg-gray-100 border-gray-200 dark:border-[#404040] text-gray-500"
                      : "bg-primary/10 border-primary/30 text-primary"
                      }`}
                  >
                    {firstName || "User"} {lastName ? lastName.charAt(0) + "." : ""}
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full border border-primary/30 bg-primary/10 text-primary flex justify-center items-center text-sm">
                    {firstName?.charAt(0) || "U"}
                    {lastName?.charAt(0) || ""}
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="flex flex-col">
              <span className="text-gray-400 text-xs mb-1">Creator</span>
              <span
                className={`px-3 py-1 rounded-[5px] border text-sm font-medium truncate max-w-[115px] ${taskStatus === "CANCELLED"
                  ? "bg-gray-100 border-gray-200 dark:border-[#404040] text-gray-500"
                  : "bg-blue-50 border-blue-300 text-blue-700"
                  }`}
              >
                {adminUser?.name ? `${adminUser.name.split(" ")[0]} ${adminUser.name.split(" ")[1] ? adminUser.name.split(" ")[1].charAt(0) + "." : ""}`.trim() : "Loading..."}
              </span>
            </div>
          )}

          {!(taskStatus === "COMPLETED" || taskStatus === "CANCELLED") && (
            <>
              <div className="bg-gray-300 w-1 h-1 rounded-full" />
              <div className="flex flex-col">
                {!isAdmin && <span className="text-gray-400 text-xs mb-1">Due</span>}
                <span
                  className={`px-3 py-1 border text-sm font-medium italic rounded-[5px] ${dueDateStatus && dueDateStatusConfig[dueDateStatus]
                    ? dueDateStatusConfig[dueDateStatus].className
                    : "bg-gray-50 border-gray-200 dark:border-[#404040] text-gray-600 dark:text-[#bfbfbf]"
                    }`}
                >
                  {formatDueDateText(dueDate, taskStatus, dueDateStatus)}
                </span>
              </div>
            </>
          )}
        </div>

        {
          isAdmin && (
            <>
              <div className="border-t border-gray-200 dark:border-[#404040] my-3" />
              <div className="flex justify-end items-center gap-2">
                <button
                  onClick={onView}
                  className="p-2 text-gray-400 hover:text-blue-500 cursor-pointer"
                >
                  <Eye size={18} />
                </button>
                <hr className="h-6 w-[2px] border-none bg-gray-200" />
                <button
                  onClick={onEdit}
                  className="p-2 text-gray-400 hover:text-primary cursor-pointer"
                >
                  <Pencil size={18} />
                </button>
                <hr className="h-6 w-[2px] border-none bg-gray-200" />
                <button
                  onClick={onDelete}
                  className="p-2 text-red-400 hover:text-red-600 cursor-pointer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </>
          )
        }
      </Card >
    </div >
  );
};

export default TaskCard;
