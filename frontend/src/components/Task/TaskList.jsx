import React from "react";
import { Button, Chip } from "../ui";
import { Pencil, Trash2, Eye } from "lucide-react";
import { useGetUserByEmailQuery } from "../../store/api/usersApi";
import { useGetTaskNewStateQuery } from "../../store/api/tasksApi";
import { useCountUnreadCommentsQuery } from "../../store/api/commentsApi";
import {
  getDueDateStatus,
  formatDueDateText,
  dueDateStatusConfig,
  getCardBackground,
  highlightSearchMatch,
} from "../../utils/taskUtils";

export const TaskListHeader = ({ isAdmin }) => (
  <thead className="bg-gray-50 border-0">
    <tr className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider p-3.5">Title</th>
      <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider p-3.5">Status</th>
      <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider p-3.5">Priority</th>
      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider p-3.5">{isAdmin ? "Assignee" : "Created By"}</th>
      <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider p-3.5">Due Date</th>
      {isAdmin && <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider p-3.5">Actions</th>}
    </tr>
  </thead>
);

const TaskList = ({
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
}) => {
  const { title, priority, dueDate, taskStatus, projectId } = task;
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

  return (
    <>
      <tr
        onClick={onClick}
        className="relative bg-white hover:bg-gray-50 group cursor-pointer"
      >
        <td className="p-3.5 relative flex items-center justify-between gap-2">
          <h3
            className={`text-base font-bold truncate ${taskStatus === "CANCELLED"
              ? "text-gray-400 line-through italic"
              : "text-gray-700"
              }`}
          >
            {highlightSearchMatch(title, searchTerm)}
          </h3>
          <div className="flex items-center gap-2">
            {unreadCountByRecipient > 0 && (
              <span className="w-6 h-6 bg-red-500 text-white text-xs flex justify-center items-center rounded-full">
                {unreadCountByRecipient > 99 ? "99+" : unreadCountByRecipient}
              </span>
            )}
            {!isAdmin && taskIsNew && (
              <button
                onClick={onView}
                className={`rounded-full h-6 px-3 bg-[#14B8A6] text-white text-xs flex justify-center items-center cursor-pointer z-10`}
              >
                New
              </button>
            )}
          </div>
        </td>

        <td className="p-3.5 text-center">
          <Chip variant={shouldGrayOut ? "OVERDUE" : taskStatus} size="sm">
            {taskStatus}
          </Chip>
        </td>

        <td className="p-3.5 text-center">
          <Chip variant={shouldGrayOut ? "OVERDUE" : priority} size="sm">
            {priority}
          </Chip>
        </td>

        <td className="p-3.5">
          {isAdmin ? (
            <div className="flex items-center gap-2">
              {assignee ? (
                <div className="w-8 h-8 rounded-full border border-primary/30 bg-primary/10 text-primary flex justify-center items-center text-sm">
                  {employeeUser?.name?.charAt(0) || "U"}
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full border border-gray-300 bg-gray-100 text-gray-500 flex justify-center items-center text-sm">
                  <span className="text-xs">?</span>
                </div>
              )}
              <span className="text-gray-600 text-sm truncate">
                {employeeUser?.name || "Unassigned"}
              </span>
            </div>
          ) : (
            <span className={`px-3 py-1 rounded-[5px] border text-sm font-medium truncate max-w-[115px] ${taskStatus === "CANCELLED"
              ? "bg-gray-100 border-gray-300 text-gray-500"
              : "bg-blue-50 border-blue-300 text-blue-700"
              }`}>
              {adminUser?.name || "Loading..."}
            </span>
          )}
        </td>

        <td className="p-3.5 text-center">
          <span
            className={`px-3 py-1 text-sm font-medium italic border rounded-[5px] whitespace-nowrap ${dueDateStatus && dueDateStatusConfig[dueDateStatus]
              ? dueDateStatusConfig[dueDateStatus].className
              : "text-gray-600 border-none"
              }`}
          >
            {formatDueDateText(dueDate, taskStatus, dueDateStatus)}
          </span>
        </td>

        {isAdmin && (
          <td className="p-3.5">
            <div className="flex justify-center items-center gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); onView?.(); }}
                className="p-1 text-gray-400 group-hover:text-blue-500 cursor-pointer"
              >
                <Eye size={18} />
              </button>
              <hr className="h-6 w-[2px] border-none bg-gray-200 mx-2" />
              <button
                onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
                className="p-1 text-gray-400 group-hover:text-primary cursor-pointer"
              >
                <Pencil size={18} />
              </button>
              <hr className="h-6 w-[2px] border-none bg-gray-200 mx-2" />
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="p-1 text-red-400 group-hover:text-red-600 cursor-pointer"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </td>
        )}
      </tr>

    </>
  );
};

export default TaskList;
