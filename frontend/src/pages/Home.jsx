import React from "react";
import { Button, LoadingSpinner, Dialog } from "../components/ui";
import { Plus, Grid, List, X } from "lucide-react";
import TaskCard from "../components/Task/TaskCard.jsx";
import TaskDialog from "../components/Task/TaskDialog.jsx";
import TaskList, { TaskListHeader } from "../components/Task/TaskList.jsx";
import { useHome } from "../hooks/dashboard/useHome.js";

export default function Home() {
  const {
    projectId,
    user,
    isAdmin,
    isLoadingTasks,
    filteredTasks,
    isCardView,
    setIsCardView,
    openDialog,
    handleOpenDialog,
    handleCloseDialog,
    selectedTask,
    taskToDelete,
    setTaskToDelete,
    handleDeleteTask,
    searchTerm,
    assigneeEmailFilter,
    navigate
  } = useHome();

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col shrink-0 p-6 pb-0">
        <div className="flex justify-between border-b border-gray-200 pb-3 gap-2">
          <div className="flex gap-3 items-center">
            <h1 className="text-3xl text-gray-600">Tasks</h1>
            {filteredTasks.length > 0 && (
              <p className="text-gray-500 text-2xl p-2 rounded-full bg-gray-100 w-10 h-10 flex items-center justify-center">
                {filteredTasks.length}
              </p>
            )}
            {assigneeEmailFilter && (
              <div className="flex items-center gap-2 ml-4">
                <span className="text-sm text-gray-500 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  Filtering by: {assigneeEmailFilter}
                </span>
                <button
                  onClick={() => navigate(`/project/${projectId}`)}
                  className="text-xs text-red-500 hover:text-red-800 underline cursor-pointer hover:bg-gray-300 p-1.5 rounded-full"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
          {isAdmin && (
            <Button
              size="md"
              onClick={() => handleOpenDialog()}
              className="bg-red-500 hover:bg-red-600 text-white relative"
            >
              <Plus size={20} />
              Add Task
            </Button>
          )}
        </div>

        <div className="flex flex-row gap-2 py-3">
          <Button
            onClick={() => setIsCardView(true)}
            size="md"
            variant={isCardView ? "primary" : "outlined"}
            className="flex items-center gap-2"
          >
            <Grid size={20} />
            Card View
          </Button>
          <Button
            onClick={() => setIsCardView(false)}
            size="md"
            variant={!isCardView ? "primary" : "outlined"}
            className="flex items-center gap-2"
          >
            <List size={20} />
            List View
          </Button>
        </div>
      </div>

      {isLoadingTasks ? (
        <div className="flex justify-center py-10">
          <LoadingSpinner size="lg" />
        </div>
      ) : isCardView ? (
        <div className="overflow-y-auto w-full h-full min-h-0">

          <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 p-6 pt-3">
            {filteredTasks.map((task) => (
              <div key={task.id} onClick={!isAdmin ? () => navigate(`/project/${projectId}/task/${task.id}`) : undefined} className={!isAdmin ? "cursor-pointer" : ""}>
                <TaskCard
                  task={task}
                  onEdit={() => handleOpenDialog(task)}
                  onDelete={() => setTaskToDelete(task.id)}
                  onView={() =>
                    navigate(`/project/${projectId}/task/${task.id}`, {
                      state: { task, isAdmin, user },
                    })
                  }
                  loggedInUser={user}
                  isAdmin={isAdmin}
                  assignee={task.assigneeId}
                  createdBy={task.createdById}
                  searchTerm={searchTerm}
                />
              </div>
            ))}
          </div>

          {filteredTasks.length === 0 && (
            <p className="text-gray-400 px-6 py-2">No tasks available</p>
          )}
        </div>
      ) : (
        <div className="h-full min-h-0 p-6 pt-0 flex flex-col">
          <div className="bg-white flex flex-col min-h-0 border border-gray-200">
            <div className="overflow-auto w-full h-fit">
              <table className="w-full min-w-[1000px] border-none text-left">
                <TaskListHeader isAdmin={isAdmin} />
                <tbody>
                  {filteredTasks.map((task) => (
                    <TaskList
                      key={task.id}
                      task={task}
                      onEdit={() => handleOpenDialog(task)}
                      onDelete={() => setTaskToDelete(task.id)}
                      onView={() =>
                        navigate(`/project/${projectId}/task/${task.id}`, {
                          state: { task, isAdmin, user },
                        })
                      }
                      onClick={() =>
                        navigate(`/project/${projectId}/task/${task.id}`, {
                          state: { task, isAdmin, user },
                        })
                      }
                      loggedInUser={user}
                      isAdmin={isAdmin}
                      assignee={task.assigneeId}
                      createdBy={task.createdById}
                      searchTerm={searchTerm}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            {filteredTasks.length === 0 && (
              <p className="text-gray-400 p-4">No tasks available</p>
            )}
          </div>
        </div>
      )}

      <TaskDialog
        open={openDialog}
        onClose={handleCloseDialog}
        task={selectedTask}
        projectId={projectId}
      />

      <Dialog
        open={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        title="Delete Task?"
        size="sm"
      >
        <p className="text-gray-600 mb-6">You are about to delete a task. This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => setTaskToDelete(null)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (taskToDelete) {
                handleDeleteTask(taskToDelete);
                setTaskToDelete(null);
              }
            }}
            autoFocus
          >
            Delete
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
