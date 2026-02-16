import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Dialog, Button, Input, TextField, Select, DatePicker } from "./ui";
import { useSnackbar } from "../context/SnackbarContext";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "../store/api/tasksApi";
import { useGetProjectMembersQuery } from "../store/api/projectsApi";

const TaskDialog = ({
  open,
  onClose,
  task,
  projectId,
}) => {
  const { showSnackbar } = useSnackbar();
  const userEmail = useSelector((state) => state.auth.userEmail);
  const [taskDetails, setTaskDetails] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
    taskStatus: "PENDING",
    assigneeId: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const { data: projectMembers = [] } = useGetProjectMembersQuery(projectId, {
    skip: !projectId,
  });
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
      setFieldErrors({});
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

  const clearFieldError = (field) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskDetails((prev) => ({ ...prev, [name]: value }));
    clearFieldError(name);
  };

  const handleDateChange = (value) => {
    setTaskDetails((prev) => ({ ...prev, dueDate: value }));
    clearFieldError("dueDate");
  };

  const validateFields = () => {
    const errors = {};

    if (taskDetails.title.trim() === "") {
      errors.title = "Task name is required";
    }

    if (taskDetails.description.trim() === "") {
      errors.description = "Description is required";
    }

    if (!taskDetails.dueDate) {
      errors.dueDate = "Due date is required";
    }

    if (!taskDetails.assigneeId) {
      errors.assigneeId = "Please assign this task to someone";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    try {
      const taskData = {
        ...taskDetails,
        dueDate: new Date(taskDetails.dueDate).toISOString(),
        createdById: userEmail,
      };

      await createTask({ projectId, taskData }).unwrap();
      showSnackbar("Task created successfully!", "success");
      onClose();
    } catch (error) {
      console.error("Error creating task:", error);
      showSnackbar(error.data?.message || "Failed to create task", "error");
    }
  };

  const handleUpdate = async () => {
    if (!validateFields()) return;

    try {
      const taskData = {
        ...taskDetails,
        dueDate: new Date(taskDetails.dueDate).toISOString(),
        createdById: userEmail,
      };

      await updateTask({ projectId, id: task.id, taskData }).unwrap();
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

  const assigneeOptions = projectMembers
    .filter((member) => {
      const isPending = member.name.toLowerCase().includes("(pending)");
      const isCreator = member.email === (task ? task.createdById : userEmail);
      return !isPending && !isCreator;
    })
    .map((member) => ({
      value: member.email,
      label: member.name,
    }));

  return (
    <Dialog open={open} onClose={onClose} title={task ? "Update Task" : "Add Task"} size="lg">
      <div className="space-y-4">
        <Input
          label="Task Name"
          name="title"
          fullWidth
          value={taskDetails.title}
          onChange={handleChange}
          autoFocus
          error={!!fieldErrors.title}
          helperText={fieldErrors.title}
        />

        <TextField
          label="Description"
          name="description"
          fullWidth
          rows={3}
          value={taskDetails.description}
          onChange={handleChange}
          error={!!fieldErrors.description}
          helperText={fieldErrors.description}
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
          error={!!fieldErrors.dueDate}
          helperText={fieldErrors.dueDate}
        />

        <Select
          label="Assign To"
          name="assigneeId"
          value={taskDetails.assigneeId || ""}
          onChange={handleChange}
          options={assigneeOptions}
          placeholder="Select assignee"
          fullWidth
          error={!!fieldErrors.assigneeId}
          helperText={fieldErrors.assigneeId}
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
