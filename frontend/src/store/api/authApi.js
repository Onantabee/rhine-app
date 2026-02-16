import { baseApi } from './baseApi';

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (data) => ({
                url: 'api/users/register',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        login: builder.mutation({
            query: (data) => ({
                url: 'api/users/login',
                method: 'POST',
                body: data,
            }),
        }),
        getCurrentUser: builder.query({
            query: () => 'api/users/me',
            providesTags: ['User'],
        }),
        logout: builder.mutation({
            query: () => ({
                url: 'api/users/logout',
                method: 'POST',
            }),
        }),
        verifyEmail: builder.mutation({
            query: (data) => ({
                url: `api/users/verify?email=${encodeURIComponent(data.email)}&code=${encodeURIComponent(data.code)}`,
                method: 'POST',
            }),
        }),
        resendOtp: builder.mutation({
            query: (data) => ({
                url: `api/users/resend-otp?email=${encodeURIComponent(data.email)}`,
                method: 'POST',
            }),
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useGetCurrentUserQuery,
    useLazyGetCurrentUserQuery,
    useLogoutMutation,
    useVerifyEmailMutation,
    useResendOtpMutation,
} = authApi;

export default authApi;
