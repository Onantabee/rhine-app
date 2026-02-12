import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base API configuration
export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',

        prepareHeaders: (headers) => {
            // Add any auth headers here if needed in the future
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    tagTypes: ['Task', 'User', 'Comment', 'UnreadCount'],
    endpoints: () => ({}),
});
