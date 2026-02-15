import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base API configuration
export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
        credentials: 'include', // Send JSESSIONID cookie with every request
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    tagTypes: ['Task', 'User', 'Comment', 'UnreadCount', 'Project', 'ProjectMember'],
    endpoints: () => ({}),
});
