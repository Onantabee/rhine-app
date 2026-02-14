import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Snackbar } from "../components/ui";
import { Plus } from "lucide-react";
import TaskCard from "../components/TaskCard.jsx";
import TaskDialog from "../components/TaskDialog.jsx";
import { Link, useNavigate } from "react-router-dom";
import { Grid, List } from "lucide-react";
import { Masonry } from "react-plock";
import TaskList from "../components/TaskList.jsx";
import { useGetTasksQuery, useDeleteTaskMutation } from "../store/api/tasksApi";
import { useGetUserByEmailQuery, useGetNonAdminUsersQuery } from "../store/api/usersApi";
import { setSearchTerm } from "../store/slices/authSlice";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userEmail = useSelector((state) => state.auth.userEmail);
  const searchTerm = useSelector((state) => state.auth.searchTerm);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCardView, setIsCardView] = useState(true);

  // RTK Query hooks
  const { data: user } = useGetUserByEmailQuery(userEmail, {
    skip: !userEmail,
  });
  const { data: tasks = [], isLoading: isLoadingTasks } = useGetTasksQuery();
  const { data: nonAdminUsers = [] } = useGetNonAdminUsersQuery();
  const [deleteTask] = useDeleteTaskMutation();

  const isAdmin = user?.userRole === "ADMIN";

  // Clear search term on unmount
  useEffect(() => {
    return () => {
      dispatch(setSearchTerm(""));
    };
  }, [dispatch]);

  const handleOpenDialog = (task = null) => {
    setSelectedTask(task);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTask(null);
  };

  const filterTasks = (tasks) => {
    if (!searchTerm) return tasks;
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id).unwrap();
      showSnackbar("Task deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting task:", error);
      showSnackbar(error.data?.message || "Failed to delete task", "error");
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const getUserTasks = () => {
    const filtered = filterTasks(tasks);
    return filtered.filter(
      (task) =>
        user?.email === task.createdById || user?.email === task.assigneeId
    );
  };

  const userTasks = getUserTasks();

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex flex-col">
        <div
          className={`${isAdmin ? "flex justify-between" : "inline"
            } border-b border-gray-200 py-3 gap-2`}
        >
          <h1 className="text-3xl text-gray-600">Tasks</h1>
          {isAdmin && (
            <Button
              size="md"
              onClick={() => handleOpenDialog()}
              className="bg-red-500 hover:bg-red-600 text-white relative"
            >
              <Plus size={18} />
              Add Task
            </Button>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex flex-row gap-2 border-b border-gray-200 py-3">
          <Button
            onClick={() => setIsCardView(true)}
            variant={isCardView ? "primary" : "outlined"}
            className="flex items-center gap-2"
          >
            <Grid size={16} />
            Card View
          </Button>
          <Button
            onClick={() => setIsCardView(false)}
            variant={!isCardView ? "primary" : "outlined"}
            className="flex items-center gap-2"
          >
            <List size={16} />
            List View
          </Button>
        </div>
      </div>

      {/* Task Display */}
      {isLoadingTasks ? (
        <div className="flex justify-center py-10">
          <p className="text-gray-400">Loading tasks...</p>
        </div>
      ) : isCardView ? (
        <div>
          <Masonry
            items={userTasks}
            config={{
              columns: [1, 2, 3, 4],
              gap: [16, 16, 16, 16],
              media: [640, 768, 1024, 1280],
            }}
            render={(task) => (
              <div key={task.id}>
                {!isAdmin ? (
                  <Link
                    to={`/task/${task.id}`}
                    state={{ task, isAdmin, user }}
                  >
                    <TaskCard
                      task={task}
                      onEdit={() => handleOpenDialog(task)}
                      onDelete={() => handleDeleteTask(task.id)}
                      loggedInUser={user}
                      isAdmin={isAdmin}
                      assignee={task.assigneeId}
                      createdBy={task.createdById}
                      searchTerm={searchTerm}
                    />
                  </Link>
                ) : (
                  <TaskCard
                    task={task}
                    onEdit={() => handleOpenDialog(task)}
                    onDelete={() => handleDeleteTask(task.id)}
                    onView={() =>
                      navigate(`/task/${task.id}`, {
                        state: { task, isAdmin, user },
                      })
                    }
                    loggedInUser={user}
                    isAdmin={isAdmin}
                    assignee={task.assigneeId}
                    createdBy={task.createdById}
                    searchTerm={searchTerm}
                  />
                )}
              </div>
            )}
          />

          {userTasks.length === 0 && (
            <p className="text-gray-400">No tasks available</p>
          )}
        </div>
      ) : (
        <div className="text-gray-300 w-full mt-20 flex justify-center items-center">
          <h1 className="text-[10vw] sm:text-[8vw] md:text-[6vw]">
            {"<>Coming Soon!</>"}
          </h1>
        </div>
      )}

      {/* Task Dialog */}
      <TaskDialog
        open={openDialog}
        onClose={handleCloseDialog}
        task={selectedTask}
        showSnackbar={showSnackbar}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        variant={snackbarSeverity}
        position="bottom-left"
      />
    </div>
  );
}
