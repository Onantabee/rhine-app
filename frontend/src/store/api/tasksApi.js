import { baseApi } from './baseApi';

// Tasks API slice — all endpoints scoped under /api/projects/{projectId}/tasks
export const tasksApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all tasks in a project
        getTasks: builder.query({
            query: (projectId) => `/api/projects/${projectId}/tasks`,
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
            query: ({ projectId, taskId }) => `/api/projects/${projectId}/tasks/${taskId}`,
            providesTags: (result, error, { taskId }) => [{ type: 'Task', id: taskId }],
        }),

        // Get task's "is new" state
        getTaskNewState: builder.query({
            query: ({ projectId, taskId }) => `/api/projects/${projectId}/tasks/${taskId}/is-new`,
            providesTags: (result, error, { taskId }) => [{ type: 'Task', id: taskId }],
        }),

        // Create new task in a project
        createTask: builder.mutation({
            query: ({ projectId, taskData }) => ({
                url: `/api/projects/${projectId}/tasks`,
                method: 'POST',
                body: taskData,
            }),
            invalidatesTags: [{ type: 'Task', id: 'LIST' }],
        }),

        // Update task
        updateTask: builder.mutation({
            query: ({ projectId, id, taskData }) => ({
                url: `/api/projects/${projectId}/tasks/${id}`,
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
            query: ({ projectId, id, taskStatus }) => ({
                url: `/api/projects/${projectId}/tasks/${id}/status`,
                method: 'PUT',
                body: { taskStatus },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Task', id }],
        }),

        // Update task "is new" state
        updateTaskNewState: builder.mutation({
            query: ({ projectId, id, isNew }) => ({
                url: `/api/projects/${projectId}/tasks/${id}/is-new`,
                method: 'PUT',
                body: { isNew },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Task', id }],
        }),

        // Delete task
        deleteTask: builder.mutation({
            query: ({ projectId, id }) => ({
                url: `/api/projects/${projectId}/tasks/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Task', id: 'LIST' }],
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
