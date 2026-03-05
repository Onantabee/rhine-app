import { baseApi } from '../../../core/api/baseApi';

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
        forgotPassword: builder.mutation({
            query: (data) => ({
                url: 'api/users/forgot-password',
                method: 'POST',
                body: data,
            }),
        }),
        validateResetToken: builder.query({
            query: (token) => `api/users/validate-reset-token?token=${encodeURIComponent(token)}`,
            keepUnusedDataFor: 0,
        }),
        resetPassword: builder.mutation({
            query: (data) => ({
                url: 'api/users/reset-password',
                method: 'POST',
                body: data,
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
    useForgotPasswordMutation,
    useValidateResetTokenQuery,
    useResetPasswordMutation,
} = authApi;

export default authApi;
