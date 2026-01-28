import { baseApi } from './baseApi';

// Authentication API slice
export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Register new user
        register: builder.mutation({
            query: (userData) => ({
                url: '/users/register',
                method: 'POST',
                body: userData,
            }),
            invalidatesTags: ['User'],
        }),

        // Login user
        login: builder.mutation({
            query: (credentials) => ({
                url: '/users/login',
                method: 'POST',
                body: credentials,
            }),
        }),

        // Update user role
        updateRole: builder.mutation({
            query: (roleData) => ({
                url: '/users/update-role',
                method: 'POST',
                body: roleData,
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useUpdateRoleMutation,
} = authApi;
