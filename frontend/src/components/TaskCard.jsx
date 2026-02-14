import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, Chip, Button, Dialog } from "./ui";
import { Pencil, Trash2, Eye } from "lucide-react";
import { useGetUserByEmailQuery } from "../store/api/usersApi";
import { useGetTaskNewStateQuery } from "../store/api/tasksApi";
import { useCountUnreadCommentsQuery } from "../store/api/commentsApi";

const TaskCard = ({
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
  const { title, priority, dueDate, taskStatus } = task;
  const [deleteTaskDialogOpen, setDeleteTaskDialogOpen] = useState(false);
  const [dueDateStatus, setDueDateStatus] = useState(null);

  // RTK Query hooks for user data
  const { data: adminUser } = useGetUserByEmailQuery(createdBy, {
    skip: !createdBy,
  });
  const { data: employeeUser } = useGetUserByEmailQuery(assignee, {
    skip: !assignee,
  });

  // Unread count query
  const { data: unreadCountByRecipient = 0 } = useCountUnreadCommentsQuery(
    {
      taskId: task.id,
      recipientEmail: loggedInUser?.email,
    },
    {
      skip: !loggedInUser?.email,
      pollingInterval: 30000,
    }
  );

  // Task new state query (for employee only)
  const { data: taskNewState } = useGetTaskNewStateQuery(task.id, {
    skip: isAdmin,
  });
  const taskIsNew = taskNewState?.isNew || false;

  useEffect(() => {
    if (taskStatus === "COMPLETED" || taskStatus === "CANCELLED") {
      setDueDateStatus(null);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      setDueDateStatus("OVERDUE");
    } else if (diffDays === 0) {
      setDueDateStatus("DUE_TODAY");
    } else if (diffDays === 1) {
      setDueDateStatus("DUE_TOMORROW");
    } else if (diffDays === 2) {
      setDueDateStatus("DUE_IN_2_DAYS");
    } else {
      setDueDateStatus(null);
    }
  }, [dueDate, taskStatus]);

  const highlightSearchMatch = (text) => {
    if (!searchTerm || searchTerm.trim() === "") return text;

    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span
          key={index}
          className="bg-[#7733ff]/30 text-[#7733ff] px-1 font-bold"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const fullName = String(employeeUser?.name || "");
  const names = fullName.split(/\s+/);
  const firstName = names[0];
  const lastName = names[1];

  const getCardBackground = () => {
    if (taskStatus === "COMPLETED") return "rgba(220, 252, 231, 0.5)";
    if (taskStatus === "CANCELLED") return "rgba(243, 244, 246, 0.5)";

    switch (dueDateStatus) {
      case "DUE_IN_2_DAYS":
        return "rgba(254, 249, 195, 0.3)";
      case "DUE_TOMORROW":
        return "rgba(255, 237, 213, 0.3)";
      case "DUE_TODAY":
        return "rgba(254, 226, 226, 0.3)";
      case "OVERDUE":
        return "rgba(243, 244, 246, 0.5)";
      default:
        return "#ffffff";
    }
  };

  const dueDateStatusConfig = {
    OVERDUE: {
      text: "Overdue",
      className: "bg-gray-100 border-gray-300 text-gray-500",
    },
    DUE_TODAY: {
      text: "Due",
      className: "bg-red-50 border-red-300 text-red-600",
    },
    DUE_TOMORROW: {
      text: "Due Tomorrow",
      className: "bg-orange-50 border-orange-300 text-orange-600",
    },
    DUE_IN_2_DAYS: {
      text: "Due in 2 Days",
      className: "bg-yellow-50 border-yellow-300 text-yellow-700",
    },
  };

  const getDueDateText = () => {
    if (["COMPLETED", "CANCELLED"].includes(taskStatus)) {
      return formatDate(dueDate);
    }

    if (dueDateStatusConfig[dueDateStatus]) {
      return dueDateStatusConfig[dueDateStatus].text;
    }

    return formatDate(dueDate);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  const shouldGrayOut = () => {
    return dueDateStatus === "OVERDUE" || taskStatus === "CANCELLED";
  };

  return (
    <div className="relative">
      {/* Unread badge */}
      {unreadCountByRecipient > 0 && (
        <button
          onClick={onView}
          className="absolute h-6 w-6 bg-red-500 text-white text-xs border border-red-400 flex justify-center items-center -right-2 -top-2 cursor-pointer z-10"
        >
          {unreadCountByRecipient}
        </button>
      )}

      {/* New task badge */}
      {!isAdmin && taskIsNew && (
        <button
          onClick={onView}
          className={`absolute h-6 px-3 bg-[#7733ff] text-white text-xs border border-[#8855ee] flex justify-center items-center ${unreadCountByRecipient > 0 ? "right-8" : "-right-2"
            } -top-2 cursor-pointer z-10`}
        >
          New
        </button>
      )}

      <Card
        padding="default"
        className=""
        style={{
          backgroundColor: getCardBackground(),
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
        {/* Title */}
        <h3
          className={`text-base font-bold mb-3 ${taskStatus === "CANCELLED"
            ? "text-gray-400 line-through italic"
            : "text-gray-700"
            }`}
        >
          {highlightSearchMatch(title)}
        </h3>

        <div className="border-t border-gray-200 my-3" />

        {/* Status and Priority */}
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

        {/* Assignee/Creator and Due Date */}
        <div className="flex items-center gap-2 mb-3">
          {isAdmin ? (
            <div>
              {taskStatus === "COMPLETED" || taskStatus === "CANCELLED" ? (
                <div
                  className={`px-3 py-1.5 font-semibold border text-sm ${taskStatus === "CANCELLED"
                    ? "bg-gray-100 border-gray-300 text-gray-500"
                    : "bg-[#7733ff]/10 border-[#7733ff]/30 text-[#7733ff]"
                    }`}
                >
                  {firstName || "User"} {lastName || ""}
                </div>
              ) : (
                <div className="w-8 h-8 border border-[#7733ff]/30 bg-[#7733ff]/10 text-[#7733ff] flex justify-center items-center text-sm">
                  {firstName?.charAt(0) || "U"}
                  {lastName?.charAt(0) || ""}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col">
              <span className="text-gray-400 text-xs mb-1">Creator</span>
              <span
                className={`px-3 py-1 border text-sm font-medium ${taskStatus === "CANCELLED"
                  ? "bg-gray-100 border-gray-300 text-gray-500"
                  : "bg-blue-50 border-blue-300 text-blue-700"
                  }`}
              >
                {adminUser?.name || "Loading..."}
              </span>
            </div>
          )}

          {!(taskStatus === "COMPLETED" || taskStatus === "CANCELLED") && (
            <>
              <div className="bg-gray-300 w-1 h-1" />
              <div className="flex flex-col">
                {!isAdmin && <span className="text-gray-400 text-xs mb-1">Due</span>}
                <span
                  className={`px-3 py-1 border text-sm font-medium italic ${dueDateStatus && dueDateStatusConfig[dueDateStatus]
                    ? dueDateStatusConfig[dueDateStatus].className
                    : "bg-gray-50 border-gray-200 text-gray-600"
                    }`}
                >
                  {getDueDateText()}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Admin Actions */}
        {isAdmin && (
          <>
            <div className="border-t border-gray-200 my-3" />
            <div className="flex justify-end gap-2">
              <button
                onClick={onView}
                className="p-2 text-gray-400 hover:text-blue-500 cursor-pointer"
              >
                <Eye size={18} />
              </button>
              <button
                onClick={onEdit}
                className="p-2 text-gray-400 hover:text-[#7733ff] cursor-pointer"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => setDeleteTaskDialogOpen(true)}
                className="p-2 text-red-400 hover:text-red-600 cursor-pointer"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteTaskDialogOpen}
        onClose={() => setDeleteTaskDialogOpen(false)}
        title="Delete Task?"
        size="sm"
      >
        <p className="text-gray-600 mb-6">You are about to delete a task.</p>
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => setDeleteTaskDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={onDelete} autoFocus>
            Delete
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default TaskCard;
