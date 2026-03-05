import { baseApi } from '../../../core/api/baseApi';

export const updateApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProjectUpdates: builder.query({
            query: (projectId) => ({
                url: `/api/projects/${projectId}/updates`,
                method: 'GET',
            }),
            providesTags: (result, error, projectId) =>
                result
                    ? [
                          ...result.map(({ id }) => ({ type: 'Update', id })),
                          { type: 'Update', id: `PROJECT_${projectId}` },
                      ]
                    : [{ type: 'Update', id: `PROJECT_${projectId}` }],
        }),
        markUpdatesAsRead: builder.mutation({
            query: ({ projectId, updateIds }) => ({
                url: `/api/projects/${projectId}/updates/read`,
                method: 'POST',
                body: { updateIds },
            }),
            async onQueryStarted({ projectId, updateIds }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    updateApi.util.updateQueryData('getProjectUpdates', projectId, (draft) => {
                        updateIds.forEach((id) => {
                            const update = draft.find((u) => u.id === id);
                            if (update) {
                                update.isRead = true;
                            }
                        });
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
    useGetProjectUpdatesQuery,
    useMarkUpdatesAsReadMutation,
} = updateApi;
