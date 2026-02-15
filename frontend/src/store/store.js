import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import authReducer from "./slices/authSlice";
import projectReducer from "./slices/projectSlice";
import uiReducer from "./slices/uiSlice";
import { websocketMiddleware } from "./middleware/websocketMiddleware";

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
