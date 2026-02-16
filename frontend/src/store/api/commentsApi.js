import { baseApi } from './baseApi';

export const commentsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCommentsByTask: builder.query({
            query: (taskId) => `/api/comments/task/${taskId}`,
            providesTags: (result, error, taskId) => [{ type: 'Comment', id: taskId }],
        }),
        getCommentsByRecipient: builder.query({
            query: (recipientEmail) => `/api/comments/recipient/${recipientEmail}`,
            providesTags: ['Comment'],
        }),
        countUnreadComments: builder.query({
            query: ({ taskId, recipientEmail }) =>
                `/api/comments/count-unread-by-recipient/${taskId}/${recipientEmail}`,
            providesTags: (result, error, { taskId, recipientEmail }) => [
                { type: 'UnreadCount', id: `${taskId}-${recipientEmail}` },
            ],
        }),
        addComment: builder.mutation({
            query: ({ taskId, authorEmail, content, recipientEmail }) => ({
                url: `/api/comments/task/${taskId}`,
                method: 'POST',
                body: { authorEmail, content, recipientEmail },
            }),
            invalidatesTags: (result, error, { taskId }) => [
                { type: 'Comment', id: taskId },
            ],
            async onQueryStarted(
                { taskId, authorEmail, content, recipientEmail },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    commentsApi.util.updateQueryData('getCommentsByTask', taskId, (draft) => {
                        const tempComment = {
                            id: Date.now(),
                            taskId,
                            authorEmail,
                            content,
                            recipientEmail,
                            createdAt: new Date().toISOString(),
                            isReadByRecipient: false,
                            _optimistic: true,
                        };
                        draft.push(tempComment);
                    })
                );
                try {
                    const { data } = await queryFulfilled;
                    dispatch(
                        commentsApi.util.updateQueryData('getCommentsByTask', taskId, (draft) => {
                            const index = draft.findIndex((c) => c._optimistic);
                            if (index !== -1) {
                                draft[index] = data;
                            }
                        })
                    );
                } catch {
                    patchResult.undo();
                }
            },
        }),
        markCommentsAsRead: builder.mutation({
            query: ({ taskId, recipientEmail }) => ({
                url: `/api/comments/mark-as-read-by-recipient/${taskId}`,
                method: 'POST',
                body: { recipientEmail },
            }),
            invalidatesTags: (result, error, { taskId, recipientEmail }) => [
                { type: 'Comment', id: taskId },
                { type: 'UnreadCount', id: `${taskId}-${recipientEmail}` },
            ],
        }),
        markCommentAsRead: builder.mutation({
            query: ({ commentId, userEmail }) => ({
                url: `/api/comments/mark-as-read/${commentId}`,
                method: 'POST',
                body: { userEmail },
            }),
            invalidatesTags: ['Comment', 'UnreadCount'],
        }),

        updateComment: builder.mutation({
            query: ({ commentId, content }) => ({
                url: `/api/comments/${commentId}`,
                method: 'PUT',
                body: { content },
            }),
            invalidatesTags: (result, error, { commentId }) => ['Comment'],
            async onQueryStarted({ commentId, content, taskId }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    commentsApi.util.updateQueryData('getCommentsByTask', taskId, (draft) => {
                        const comment = draft.find((c) => c.id === commentId);
                        if (comment) {
                            comment.content = content;
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),

        deleteComment: builder.mutation({
            query: (commentId) => ({
                url: `api/comments/${commentId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Comment'],
            async onQueryStarted({ commentId, taskId }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    commentsApi.util.updateQueryData('getCommentsByTask', taskId, (draft) => {
                        return draft.filter((c) => c.id !== commentId);
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
    useGetCommentsByTaskQuery,
    useGetCommentsByRecipientQuery,
    useCountUnreadCommentsQuery,
    useAddCommentMutation,
    useMarkCommentsAsReadMutation,
    useMarkCommentAsReadMutation,
    useUpdateCommentMutation,
    useDeleteCommentMutation,
} = commentsApi;
