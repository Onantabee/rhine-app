import { baseApi } from './baseApi';

// Tasks API slice
export const tasksApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all tasks
        getTasks: builder.query({
            query: () => '/task',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Task', id })),
                        { type: 'Task', id: 'LIST' },
                    ]
                    : [{ type: 'Task', id: 'LIST' }],
        }),

        // Get task by ID
        getTaskById: builder.query({
            query: (id) => `/task/${id}`,
            providesTags: (result, error, id) => [{ type: 'Task', id }],
        }),

        // Get task's "is new" state
        getTaskNewState: builder.query({
            query: (id) => `/task/${id}/is-new`,
            providesTags: (result, error, id) => [{ type: 'Task', id }],
        }),

        // Create new task
        createTask: builder.mutation({
            query: (taskData) => ({
                url: '/task/create-task',
                method: 'POST',
                body: taskData,
            }),
            invalidatesTags: [{ type: 'Task', id: 'LIST' }],
            // Optimistic update
            async onQueryStarted(taskData, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    tasksApi.util.updateQueryData('getTasks', undefined, (draft) => {
                        const tempTask = {
                            ...taskData,
                            id: Date.now(), // Temporary ID
                            isNew: true,
                            _optimistic: true,
                        };
                        draft.push(tempTask);
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),

        // Update task
        updateTask: builder.mutation({
            query: ({ id, taskData }) => ({
                url: `/task/update-task/${id}`,
                method: 'PUT',
                body: taskData,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Task', id },
                { type: 'Task', id: 'LIST' },
            ],
        }),

        // Update task status
        updateTaskStatus: builder.mutation({
            query: ({ id, taskStatus }) => ({
                url: `/task/${id}/status`,
                method: 'PUT',
                body: { taskStatus },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Task', id }],
            // Optimistic update for status change
            async onQueryStarted({ id, taskStatus }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    tasksApi.util.updateQueryData('getTaskById', id, (draft) => {
                        draft.taskStatus = taskStatus;
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),

        // Update task "is new" state
        updateTaskNewState: builder.mutation({
            query: ({ id, isNew }) => ({
                url: `/task/task-is-new-state/${id}`,
                method: 'PUT',
                body: { isNew },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Task', id }],
        }),

        // Delete task
        deleteTask: builder.mutation({
            query: (id) => ({
                url: `/task/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Task', id: 'LIST' }],
            // Optimistic update for deletion
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    tasksApi.util.updateQueryData('getTasks', undefined, (draft) => {
                        return draft.filter((task) => task.id !== id);
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
    }),
});

export const {
    useGetTasksQuery,
    useGetTaskByIdQuery,
    useGetTaskNewStateQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useUpdateTaskStatusMutation,
    useUpdateTaskNewStateMutation,
    useDeleteTaskMutation,
} = tasksApi;
