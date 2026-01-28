import { baseApi } from './baseApi';

// User management API slice
export const usersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all users
        getAllUsers: builder.query({
            query: () => '/users',
            providesTags: ['User'],
        }),

        // Get user by email
        getUserByEmail: builder.query({
            query: (email) => `/users/${email}`,
            providesTags: (result, error, email) => [{ type: 'User', id: email }],
        }),

        // Get non-admin users
        getNonAdminUsers: builder.query({
            query: () => '/users/non-admin',
            providesTags: ['User'],
        }),

        // Update user details
        updateUser: builder.mutation({
            query: ({ email, userData }) => ({
                url: `/users/update/${email}`,
                method: 'PUT',
                body: userData,
            }),
            invalidatesTags: (result, error, { email }) => [{ type: 'User', id: email }],
        }),

        // Change password
        changePassword: builder.mutation({
            query: ({ email, currentPassword, newPassword }) => ({
                url: `/users/change-password/${email}`,
                method: 'PUT',
                body: { currentPassword, newPassword },
            }),
        }),
    }),
});

export const {
    useGetAllUsersQuery,
    useGetUserByEmailQuery,
    useGetNonAdminUsersQuery,
    useUpdateUserMutation,
    useChangePasswordMutation,
} = usersApi;
