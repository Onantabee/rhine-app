import React from "react";
import { Chip } from "./ui";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { useGetUserByEmailQuery } from "../store/api/usersApi";

const TaskList = ({
  task,
  onEdit,
  onDelete,
  onView,
  isAdmin,
  assignee,
  createdBy,
}) => {
  const { title, priority, dueDate, taskStatus } = task;

  // RTK Query hooks for user data
  const { data: adminUser } = useGetUserByEmailQuery(createdBy, {
    skip: !createdBy,
  });
  const { data: employeeUser } = useGetUserByEmailQuery(assignee, {
    skip: !assignee,
  });

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="grid grid-cols-[35%_10%_10%_25%_10%_10%] gap-4 p-3.5 bg-[#1f1f1f] rounded-lg border border-[#404040] transition-all duration-300 hover:bg-[#2a2a2a] group">
      {/* Title */}
      <div className="flex items-center">
        <p className="text-gray-400 text-sm font-medium overflow-hidden text-ellipsis whitespace-nowrap group-hover:text-gray-300 transition-colors">
          {title}
        </p>
      </div>

      {/* Status */}
      <div className="flex justify-center items-center">
        <Chip variant={taskStatus} size="sm">
          {taskStatus}
        </Chip>
      </div>

      {/* Priority */}
      <div className="flex justify-center items-center">
        <Chip variant={priority} size="sm">
          {priority}
        </Chip>
      </div>

      {/* Assignee/Creator */}
      <div className="flex items-center gap-2 px-2">
        {isAdmin ? (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#C77BBF] flex items-center justify-center text-sm text-white">
              {employeeUser?.name?.charAt(0) || "U"}
            </div>
            <span className="text-gray-400 text-sm">
              {employeeUser?.name || "Loading..."}
            </span>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">
            {adminUser?.name || "Loading..."}
          </span>
        )}
      </div>

      {/* Due Date */}
      <div className="flex justify-center items-center">
        <span className="text-gray-400 text-sm">{formatDate(dueDate)}</span>
      </div>

      {/* Actions (Admin Only) */}
      {isAdmin && (
        <div className="flex justify-center items-center gap-1">
          <button
            onClick={onView}
            className="p-1 text-transparent hover:text-blue-400 transition-colors"
          >
            <ViewIcon fontSize="small" />
          </button>
          <button
            onClick={onEdit}
            className="p-1 text-transparent hover:text-cyan-400 transition-colors"
          >
            <EditIcon fontSize="small" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-[#ff6666] hover:text-red-400 transition-colors"
          >
            <DeleteIcon fontSize="small" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskList;
