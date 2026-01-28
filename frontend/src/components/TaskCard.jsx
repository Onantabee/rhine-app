import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, Chip, Button, Dialog } from "./ui";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import {
  useGetUserByEmailQuery,
  useGetTaskNewStateQuery,
} from "../store/api/usersApi";
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
      pollingInterval: 30000, // Poll every 30 seconds
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
          className="bg-[#c77bbf8b] text-white px-1 rounded font-bold"
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
    if (taskStatus === "COMPLETED") return "rgba(0, 51, 0, 0.1)";
    if (taskStatus === "CANCELLED") return "rgba(51, 0, 51, 0.1)";

    switch (dueDateStatus) {
      case "DUE_IN_2_DAYS":
        return "rgba(51, 51, 0, 0.2)";
      case "DUE_TOMORROW":
        return "rgba(51, 33, 0, 0.2)";
      case "DUE_TODAY":
        return "rgba(51, 0, 0, 0.2)";
      case "OVERDUE":
        return "rgba(128, 128, 128, 0.1)";
      default:
        return "#1f1f1f";
    }
  };

  const dueDateStatusConfig = {
    OVERDUE: {
      text: "Overdue",
      className: "bg-[#666666]/30 border-[#808080]/50 text-[#bfbfbf]",
    },
    DUE_TODAY: {
      text: "Due",
      className: "bg-[#ff0000]/30 border-[#ff0000]/50 text-[#ff9999]",
    },
    DUE_TOMORROW: {
      text: "Due Tomorrow",
      className: "bg-[#805300]/30 border-[#805300]/50 text-[#ffa600]",
    },
    DUE_IN_2_DAYS: {
      text: "Due in 2 Days",
      className: "bg-[#808000]/30 border-[#808000]/50 text-[#cccc00]",
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
          className="absolute h-6 w-6 rounded-full bg-red-500 text-white text-xs border border-[#fb5059] flex justify-center items-center -right-2 -top-2 cursor-pointer hover:scale-110 transition-transform z-10"
        >
          {unreadCountByRecipient}
        </button>
      )}

      {/* New task badge */}
      {!isAdmin && taskIsNew && (
        <button
          onClick={onView}
          className={`absolute h-6 px-3 rounded-full bg-[#ff6600] text-white text-xs border border-[#ff751a] flex justify-center items-center ${unreadCountByRecipient > 0 ? "right-8" : "-right-2"
            } -top-2 cursor-pointer z-10`}
        >
          New
        </button>
      )}

      <Card
        padding="default"
        className="transition-all duration-300 hover:shadow-lg"
        style={{
          backgroundColor: getCardBackground(),
          borderColor:
            taskStatus === "COMPLETED"
              ? "rgba(34, 197, 94, 0.3)"
              : taskStatus === "CANCELLED"
                ? "rgba(64, 64, 64, 0.3)"
                : dueDateStatus === "DUE_TODAY"
                  ? "rgba(255, 0, 0, 0.3)"
                  : dueDateStatus === "DUE_TOMORROW"
                    ? "rgba(128, 83, 0, 0.3)"
                    : dueDateStatus === "DUE_IN_2_DAYS"
                      ? "rgba(128, 128, 0, 0.3)"
                      : "#404040",
        }}
      >
        {/* Title */}
        <h3
          className={`text-base font-bold mb-3 ${taskStatus === "CANCELLED"
              ? "text-gray-500 line-through italic"
              : "text-gray-400"
            }`}
        >
          {highlightSearchMatch(title)}
        </h3>

        <div className="border-t border-[#333333] my-3" />

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
                  className={`px-3 py-1.5 font-semibold border text-sm rounded-full ${taskStatus === "CANCELLED"
                      ? "bg-[#666666]/30 border-[#666666] text-[#8c8c8c]"
                      : "bg-[#C77BBF]/30 border-[#C77BBF] text-[#e8c9e5]"
                    }`}
                >
                  {firstName || "User"} {lastName || ""}
                </div>
              ) : (
                <div className="w-8 h-8 border border-[#C77BBF] bg-[#C77BBF]/30 text-[#e8c9e5] rounded-full flex justify-center items-center text-sm">
                  {firstName?.charAt(0) || "U"}
                  {lastName?.charAt(0) || ""}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col">
              <span className="text-[#666666] text-xs mb-1">Creator</span>
              <span
                className={`px-3 py-1 border text-sm rounded-full font-medium ${taskStatus === "CANCELLED"
                    ? "bg-[#666666]/30 border-[#666666] text-[#8c8c8c]"
                    : "bg-[#5d8bf4]/20 border-[#5d8bf4] text-[#b7cbfa]"
                  }`}
              >
                {adminUser?.name || "Loading..."}
              </span>
            </div>
          )}

          {!(taskStatus === "COMPLETED" || taskStatus === "CANCELLED") && (
            <>
              <div className="bg-[#4d4d4d] w-1 h-1 rounded-full" />
              <div className="flex flex-col">
                {!isAdmin && <span className="text-[#666666] text-xs mb-1">Due</span>}
                <span
                  className={`px-3 py-1 border text-sm rounded-full font-medium italic ${dueDateStatus && dueDateStatusConfig[dueDateStatus]
                      ? dueDateStatusConfig[dueDateStatus].className
                      : "bg-[#333333]/30 border-[#4d4d4d] text-[#a6a6a6]"
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
            <div className="border-t border-[#333333] my-3" />
            <div className="flex justify-end gap-2">
              <button
                onClick={onView}
                className="p-2 rounded text-gray-500 hover:text-blue-400 transition-colors"
              >
                <ViewIcon fontSize="small" />
              </button>
              <button
                onClick={onEdit}
                className="p-2 rounded text-gray-500 hover:text-cyan-400 transition-colors"
              >
                <EditIcon fontSize="small" />
              </button>
              <button
                onClick={() => setDeleteTaskDialogOpen(true)}
                className="p-2 rounded text-[#ff6666] hover:text-red-400 transition-colors"
              >
                <DeleteIcon fontSize="small" />
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
        <p className="text-gray-300 mb-6">You are about to delete a task.</p>
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
