import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from '../api/baseApi';
import authReducer from '../../features/auth/store/authSlice';
import projectReducer from '../../features/project/store/projectSlice';
import uiReducer from './uiSlice';
import { websocketMiddleware } from './websocketMiddleware';

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        auth: authReducer,
        project: projectReducer,
        ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware, websocketMiddleware),
});
