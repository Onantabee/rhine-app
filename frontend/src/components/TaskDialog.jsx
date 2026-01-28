import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Dialog, Button, Input, TextField, Select, DatePicker } from "./ui";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "../store/api/tasksApi";
import { useGetNonAdminUsersQuery } from "../store/api/usersApi";

const TaskDialog = ({
  open,
  onClose,
  task,
  showSnackbar,
}) => {
  const userEmail = useSelector((state) => state.auth.userEmail);
  const [taskDetails, setTaskDetails] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
    taskStatus: "PENDING",
    assigneeId: "",
  });

  // RTK Query hooks
  const { data: nonAdminUsers = [] } = useGetNonAdminUsersQuery();
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  useEffect(() => {
    if (!open) {
      setTaskDetails({
        title: "",
        description: "",
        priority: "Medium",
        dueDate: "",
        taskStatus: "PENDING",
        assigneeId: "",
      });
    }
  }, [open]);

  useEffect(() => {
    if (task && open) {
      setTaskDetails({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate?.split("T")[0] || "",
        taskStatus: task.taskStatus,
        assigneeId: task.assigneeId || "",
      });
    }
  }, [task, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (value) => {
    setTaskDetails((prev) => ({ ...prev, dueDate: value }));
  };

  const handleSave = async () => {
    try {
      const taskData = {
        ...taskDetails,
        createdById: userEmail,
      };

      await createTask(taskData).unwrap();
      showSnackbar("Task created successfully!", "success");
      onClose();
    } catch (error) {
      console.error("Error creating task:", error);
      showSnackbar(error.data?.message || "Failed to create task", "error");
    }
  };

  const handleUpdate = async () => {
    try {
      const taskData = {
        ...taskDetails,
        createdById: userEmail,
      };

      await updateTask({ id: task.id, taskData }).unwrap();
      showSnackbar("Task updated successfully!", "success");
      onClose();
    } catch (error) {
      console.error("Error updating task:", error);
      showSnackbar(error.data?.message || "Failed to update task", "error");
    }
  };

  const priorityOptions = [
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" },
  ];

  const statusOptions = [
    { value: "PENDING", label: "Pending" },
    { value: "ONGOING", label: "Ongoing" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  const assigneeOptions = nonAdminUsers.map((user) => ({
    value: user.email,
    label: user.name,
  }));

  return (
    <Dialog open={open} onClose={onClose} title={task ? "Update Task" : "Add Task"} size="lg">
      <div className="space-y-4">
        <Input
          label="Task Name"
          name="title"
          fullWidth
          required
          value={taskDetails.title}
          onChange={handleChange}
          autoFocus
        />

        <TextField
          label="Description"
          name="description"
          fullWidth
          rows={3}
          value={taskDetails.description}
          onChange={handleChange}
        />

        <div className="flex flex-row gap-4">
          <div className="w-full">
            <Select
              label="Priority"
              name="priority"
              value={taskDetails.priority}
              onChange={handleChange}
              options={priorityOptions}
              fullWidth
            />
          </div>
          <div className="w-full">
            <Select
              label="Status"
              name="taskStatus"
              value={taskDetails.taskStatus}
              onChange={handleChange}
              options={statusOptions}
              fullWidth
            />
          </div>
        </div>

        <DatePicker
          label="Due Date"
          value={taskDetails.dueDate}
          onChange={handleDateChange}
          fullWidth
        />

        <Select
          label="Assign To"
          name="assigneeId"
          value={taskDetails.assigneeId || ""}
          onChange={handleChange}
          options={assigneeOptions}
          placeholder="Select assignee"
          fullWidth
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={task ? handleUpdate : handleSave}
            loading={isCreating || isUpdating}
          >
            {task ? "Update" : "Save"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default TaskDialog;
