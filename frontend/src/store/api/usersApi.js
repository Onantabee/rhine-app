import { baseApi } from './baseApi';

const usersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllUsers: builder.query({
            query: () => 'api/users',
            providesTags: ['User'],
        }),
        getUserByEmail: builder.query({
            query: (email) => `api/users/${email}`,
            providesTags: (result, error, email) => [{ type: 'User', id: email }],
        }),
        updateUser: builder.mutation({
            query: ({ email, ...data }) => ({
                url: `api/users/update/${email}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { email }) => [
                { type: 'User', id: email },
            ],
        }),
        changePassword: builder.mutation({
            query: ({ email, currentPassword, newPassword }) => ({
                url: `api/users/change-password/${email}`,
                method: 'PUT',
                body: { currentPassword, newPassword },
            }),
        }),
        updateLastProject: builder.mutation({
            query: (projectId) => ({
                url: `api/users/update-last-project/${projectId}`,
                method: "PUT",
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const {
    useGetAllUsersQuery,
    useGetUserByEmailQuery,
    useUpdateUserMutation,
    useChangePasswordMutation,
    useUpdateLastProjectMutation,
} = usersApi;

export default usersApi;
