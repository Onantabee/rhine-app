import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "../context/SnackbarContext";
import {
    useCreateTaskMutation,
    useUpdateTaskMutation,
} from "../store/api/tasksApi";
import { useGetProjectMembersQuery } from "../store/api/projectsApi";

export const useTaskDialog = ({ open, onClose, task, projectId }) => {
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
        } else if (taskDetails.title.length > 100) {
            errors.title = "Task name must be less than 100 characters";
        }

        if (taskDetails.description.trim() === "") {
            errors.description = "Description is required";
        } else if (taskDetails.description.length > 255) {
            errors.description = "Description must be less than 255 characters";
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

    return {
        taskDetails,
        fieldErrors,
        isCreating,
        isUpdating,
        handleChange,
        handleDateChange,
        handleSave,
        handleUpdate,
        priorityOptions,
        statusOptions,
        assigneeOptions,
    };
};
