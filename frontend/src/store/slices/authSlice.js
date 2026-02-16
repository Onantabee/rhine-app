import { createSlice } from "@reduxjs/toolkit";

const getSessionState = () => {
    try {
        return {
            isLoggedIn: sessionStorage.getItem("isLoggedIn") === "true",
            userEmail: sessionStorage.getItem("userEmail") || "",
            userName: sessionStorage.getItem("userName") || "",
            lastProjectId: sessionStorage.getItem("lastProjectId") || null,
            isVerified: sessionStorage.getItem("isVerified") === "true",
        };
    } catch {
        return { isLoggedIn: false, userEmail: "", userName: "", lastProjectId: null };
    }
};

const persisted = getSessionState();

const initialState = {
    isLoggedIn: persisted.isLoggedIn,
    userEmail: persisted.userEmail,
    userName: persisted.userName,
    lastProjectId: persisted.lastProjectId,
    searchTerm: "",
    sessionChecked: false,
    hasProjects: false,
    isVerified: persisted.isVerified,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = true;
            state.userEmail = action.payload.email;
            state.userName = action.payload.name;
            state.hasProjects = action.payload.hasProjects ?? false;
            state.lastProjectId = action.payload.lastProjectId || null;
            state.isVerified = action.payload.isVerified ?? false;
            state.sessionChecked = true;
            sessionStorage.setItem("isLoggedIn", "true");
            sessionStorage.setItem("userEmail", action.payload.email);
            sessionStorage.setItem("userName", action.payload.name);
            sessionStorage.setItem("isVerified", String(action.payload.isVerified ?? false));
            if (action.payload.lastProjectId) {
                sessionStorage.setItem("lastProjectId", action.payload.lastProjectId);
            }
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.userEmail = "";
            state.userName = "";
            state.hasProjects = false;
            state.lastProjectId = null;
            state.isVerified = false;
            state.searchTerm = "";
            state.sessionChecked = true;
            sessionStorage.clear();
            localStorage.removeItem("activeProject");
        },
        updateAuthUser: (state, action) => {
            if (action.payload) {
                if (action.payload.name) {
                    state.userName = action.payload.name;
                    sessionStorage.setItem("userName", action.payload.name);
                }
                if (action.payload.email) {
                    state.userEmail = action.payload.email;
                    sessionStorage.setItem("userEmail", action.payload.email);
                }
                if (action.payload.hasProjects !== undefined) {
                    state.hasProjects = action.payload.hasProjects;
                }
                if (action.payload.isVerified !== undefined) {
                    state.isVerified = action.payload.isVerified;
                    sessionStorage.setItem("isVerified", String(action.payload.isVerified));
                }
                 if (action.payload.lastProjectId) {
                    state.lastProjectId = action.payload.lastProjectId;
                    sessionStorage.setItem("lastProjectId", action.payload.lastProjectId);
                }
            }
        },
        setSessionChecked: (state, action) => {
            state.sessionChecked = action.payload !== undefined ? action.payload : true;
        },
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        setHasProjects: (state, action) => {
            state.hasProjects = action.payload;
        },
    },
});

export const { login, logout, updateAuthUser, setSessionChecked, setSearchTerm, setHasProjects } =
    authSlice.actions;
export default authSlice.reducer;
