import React from "react";
import { Chip } from "./ui";
import { Pencil, Trash2, Eye } from "lucide-react";
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
    <div className="grid grid-cols-[35%_10%_10%_25%_10%_10%] gap-4 p-3.5 bg-white border border-gray-200 hover:bg-gray-50 group">
      {/* Title */}
      <div className="flex items-center">
        <p className="text-gray-600 text-sm font-medium overflow-hidden text-ellipsis whitespace-nowrap group-hover:text-gray-800">
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
            <div className="w-7 h-7 bg-[#7733ff] flex items-center justify-center text-sm text-white">
              {employeeUser?.name?.charAt(0) || "U"}
            </div>
            <span className="text-gray-600 text-sm">
              {employeeUser?.name || "Loading..."}
            </span>
          </div>
        ) : (
          <span className="text-gray-600 text-sm">
            {adminUser?.name || "Loading..."}
          </span>
        )}
      </div>

      {/* Due Date */}
      <div className="flex justify-center items-center">
        <span className="text-gray-500 text-sm">{formatDate(dueDate)}</span>
      </div>

      {/* Actions (Admin Only) */}
      {isAdmin && (
        <div className="flex justify-center items-center gap-1">
          <button
            onClick={onView}
            className="p-1 text-transparent group-hover:text-blue-500 cursor-pointer"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={onEdit}
            className="p-1 text-transparent group-hover:text-[#7733ff] cursor-pointer"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-red-400 group-hover:text-red-600 cursor-pointer"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskList;
