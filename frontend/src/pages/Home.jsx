import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "../components/ui";
import { useSnackbar } from "../context/SnackbarContext";
import { Plus } from "lucide-react";
import TaskCard from "../components/TaskCard.jsx";
import TaskDialog from "../components/TaskDialog.jsx";
import { Link, useNavigate } from "react-router-dom";
import { Grid, List } from "lucide-react";

import TaskList, { TaskListHeader } from "../components/TaskList.jsx";
import { useGetTasksQuery, useDeleteTaskMutation } from "../store/api/tasksApi";
import { useGetUserByEmailQuery, useGetNonAdminUsersQuery } from "../store/api/usersApi";
import { setSearchTerm } from "../store/slices/authSlice";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userEmail = useSelector((state) => state.auth.userEmail);
  const searchTerm = useSelector((state) => state.auth.searchTerm);

  const { showSnackbar } = useSnackbar();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCardView, setIsCardView] = useState(() => {
    const savedView = localStorage.getItem("taskViewPreference");
    return savedView !== null ? JSON.parse(savedView) : true;
  });

  useEffect(() => {
    localStorage.setItem("taskViewPreference", JSON.stringify(isCardView));
  }, [isCardView]);

  const { data: user } = useGetUserByEmailQuery(userEmail, {
    skip: !userEmail,
  });
  const { data: tasks = [], isLoading: isLoadingTasks } = useGetTasksQuery();
  const { data: nonAdminUsers = [] } = useGetNonAdminUsersQuery();
  const [deleteTask] = useDeleteTaskMutation();

  const isAdmin = user?.userRole === "ADMIN";

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
      <div className="flex flex-col">
        <div
          className={`${isAdmin ? "flex justify-between" : "inline"
            } border-b border-gray-200 py-3 gap-2`}
        >
          <div className="flex gap-3 items-center">
            <h1 className="text-3xl text-gray-600">Tasks</h1>
            <p className="text-gray-500 text-2xl p-2 rounded-full bg-gray-100 w-10 h-10 flex items-center justify-center">{userTasks.length}</p>
          </div>
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

      {isLoadingTasks ? (
        <div className="flex justify-center py-10">
          <p className="text-gray-400">Loading tasks...</p>
        </div>
      ) : isCardView ? (
        <div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
            {userTasks.map((task) => (
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
            ))}
          </div>

          {userTasks.length === 0 && (
            <p className="text-gray-400">No tasks available</p>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[700px] sm:min-w-[1000px] border-collapse border border-gray-200">
            <TaskListHeader isAdmin={isAdmin} />
            <tbody>
              {userTasks.map((task) => (
                <TaskList
                  key={task.id}
                  task={task}
                  onEdit={() => handleOpenDialog(task)}
                  onDelete={() => handleDeleteTask(task.id)}
                  onView={() =>
                    navigate(`/task/${task.id}`, {
                      state: { task, isAdmin, user },
                    })
                  }
                  onClick={!isAdmin ? () => navigate(`/task/${task.id}`, { state: { task, isAdmin, user } }) : undefined}
                  loggedInUser={user}
                  isAdmin={isAdmin}
                  assignee={task.assigneeId}
                  createdBy={task.createdById}
                  searchTerm={searchTerm}
                />
              ))}
            </tbody>
          </table>
          {userTasks.length === 0 && (
            <p className="text-gray-400 p-4">No tasks available</p>
          )}
        </div>
      )}

      <TaskDialog
        open={openDialog}
        onClose={handleCloseDialog}
        task={selectedTask}
      />
    </div>
  );
}
