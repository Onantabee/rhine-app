import React from "react";
import { Button, LoadingSpinner, Dialog, MobileListItem, Chip } from "../../../core/ui/index.js";
import { Plus, Grid, List, X } from "lucide-react";
import TaskCard from "../components/TaskCard.jsx";
import TaskDialog from "../components/TaskDialog.jsx";
import TaskList, { TaskListHeader } from "../components/TaskList.jsx";
import MobileTaskList from "../components/MobileTaskList.jsx";
import { useHome } from "../hooks/useHome.js";

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
    navigate,
    hasOtherMembers
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
      <div className="flex flex-col shrink-0 p-4 md:p-6 pb-0 md:pb-0">
        <div className="border-b border-gray-200 dark:border-[#404040]">
          <div className="flex justify-between pb-3 gap-2">
            <div className="flex gap-3 items-center">
              <h1 className="text-2xl md:text-3xl text-gray-600 dark:text-[#bfbfbf]">Tasks</h1>
              <p className="text-gray-500 dark:text-[#bfbfbf] text-md md:text-2xl p-2 rounded-full bg-gray-100 dark:bg-[#404040] w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                {filteredTasks.length}
              </p>
              {assigneeEmailFilter && (
                <div className="hidden md:flex items-center gap-2 ml-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-500/10 truncate">
                    Filtering by: {assigneeEmailFilter}
                  </span>
                  <button
                    onClick={() => navigate(`/project/${projectId}`)}
                    className="text-xs text-red-500 hover:text-red-800 underline cursor-pointer hover:bg-gray-300 p-1.5 rounded-full dark:hover:bg-[#262626] dark:hover:text-red-400"
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
                disabled={!hasOtherMembers}
                title={!hasOtherMembers ? "Invite a member first before you can add a task" : ""}
                className={`relative ${hasOtherMembers ? 'bg-red-500 hover:bg-red-600 text-white' : ''}`}
              >
                <Plus size={20} />
                <span className="hidden md:block">Add Task</span>
              </Button>
            )}
          </div>

          {assigneeEmailFilter && (
            <div className="md:hidden flex items-center gap-2 pb-3">
              <span className="text-sm text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-500/10">
                Filtering by: {assigneeEmailFilter}
              </span>
              <button
                onClick={() => navigate(`/project/${projectId}`)}
                className="text-xs text-red-500 underline cursor-pointer bg-gray-100 p-1.5 rounded-full dark:bg-[#262626] dark:text-red-400"
              >
                <X size={16} />
              </button>
            </div>
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
            <span className="hidden md:block">Card View</span>
          </Button>
          <Button
            onClick={() => setIsCardView(false)}
            size="md"
            variant={!isCardView ? "primary" : "outlined"}
            className="flex items-center gap-2"
          >
            <List size={20} />
            <span className="hidden md:block">List View</span>
          </Button>
        </div>
      </div>

      {isLoadingTasks ? (
        <div className="flex justify-center py-10">
          <LoadingSpinner size="lg" />
        </div>
      ) : isCardView ? (
        <div className="overflow-y-auto w-full h-full min-h-0 pt-2 -mt-2">



          {filteredTasks.length === 0 ? (
            <p className="text-gray-400 px-4 md:px-6 py-2">No tasks available</p>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 p-4 md:p-6 pt-0 md:pt-0">
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
          )}
        </div>
      ) : (
        <div className="h-full min-h-0 p-4 pb-0 md:p-6 pt-0 md:pt-0 flex flex-col">
          <div className="bg-white dark:bg-[#1a1a1a] flex flex-col min-h-0 border-t md:border-y md:border border-gray-200 dark:border-[#404040] -mx-4 md:mx-0">
            {/* Mobile View */}
            <div className="block md:hidden overflow-y-auto">
              {filteredTasks.length === 0 ? (
                <p className="text-gray-400 p-4 dark:bg-[#1a1a1a]">No tasks available</p>
              ) : (
                filteredTasks.map((task) => (
                  <MobileTaskList
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
                ))
              )}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block overflow-auto w-full h-fit">
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
              <p className="hidden md:block text-gray-400 p-4 dark:bg-[#1a1a1a]">No tasks available</p>
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
        <p className="text-gray-600 dark:text-[#bfbfbf] mb-6">You are about to delete a task. This action cannot be undone.</p>
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
