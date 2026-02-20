import { Dialog, Button, Input, TextField, Select, DatePicker } from "../ui";
import { useTaskDialog } from "../../hooks/task/useTaskDialog";

const TaskDialog = ({
  open,
  onClose,
  task,
  projectId,
}) => {
  const {
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
  } = useTaskDialog({ open, onClose, task, projectId });

  // const todayStr = new Date().toISOString().split('T')[0];

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
          maxLength={100}
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
          maxLength={255}
          showCount
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
          // minDate={todayStr}
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
