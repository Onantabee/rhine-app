import { baseApi } from './baseApi';

export const tasksApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
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

        getTaskById: builder.query({
            query: ({ projectId, taskId }) => `/api/projects/${projectId}/tasks/${taskId}`,
            providesTags: (result, error, { taskId }) => [{ type: 'Task', id: taskId }],
        }),

        getTaskNewState: builder.query({
            query: ({ projectId, taskId }) => `/api/projects/${projectId}/tasks/${taskId}/is-new`,
            providesTags: (result, error, { taskId }) => [{ type: 'Task', id: taskId }],
        }),

        createTask: builder.mutation({
            query: ({ projectId, taskData }) => ({
                url: `/api/projects/${projectId}/tasks`,
                method: 'POST',
                body: taskData,
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: 'Task', id: 'LIST' },
                { type: 'ProjectMember', id: projectId },
            ],
        }),

        updateTask: builder.mutation({
            query: ({ projectId, id, taskData }) => ({
                url: `/api/projects/${projectId}/tasks/${id}`,
                method: 'PUT',
                body: taskData,
            }),
            invalidatesTags: (result, error, { projectId, id }) => [
                { type: 'Task', id },
                { type: 'Task', id: 'LIST' },
                { type: 'ProjectMember', id: projectId },
            ],
        }),

        updateTaskStatus: builder.mutation({
            query: ({ projectId, id, taskStatus }) => ({
                url: `/api/projects/${projectId}/tasks/${id}/status`,
                method: 'PUT',
                body: { taskStatus },
            }),
            invalidatesTags: (result, error, { projectId, id }) => [
                { type: 'Task', id },
                { type: 'ProjectMember', id: projectId },
            ],
        }),

        updateTaskNewState: builder.mutation({
            query: ({ projectId, id, isNew }) => ({
                url: `/api/projects/${projectId}/tasks/${id}/is-new`,
                method: 'PUT',
                body: { isNew },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Task', id }],
        }),

        deleteTask: builder.mutation({
            query: ({ projectId, id }) => ({
                url: `/api/projects/${projectId}/tasks/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: 'Task', id: 'LIST' },
                { type: 'ProjectMember', id: projectId },
            ],
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
