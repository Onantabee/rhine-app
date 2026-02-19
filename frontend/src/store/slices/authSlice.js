import { createSlice } from "@reduxjs/toolkit";

const getSessionState = () => {
    try {
        return {
            isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
            userEmail: localStorage.getItem("userEmail") || "",
            userName: localStorage.getItem("userName") || "",
            lastProjectId: localStorage.getItem("lastProjectId") || null,
            isVerified: localStorage.getItem("isVerified") === "true",
            token: localStorage.getItem("token") || "",
        };
    } catch {
        return { isLoggedIn: false, userEmail: "", userName: "", lastProjectId: null, token: "" };
    }
};

const persisted = getSessionState();

const initialState = {
    isLoggedIn: persisted.isLoggedIn,
    userEmail: persisted.userEmail,
    userName: persisted.userName,
    lastProjectId: persisted.lastProjectId,
    searchTerm: "",
    assigneeEmailFilter: "",
    sessionChecked: false,
    hasProjects: false,
    isVerified: persisted.isVerified,
    token: persisted.token,
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
            if (action.payload.token) {
                state.token = action.payload.token;
                localStorage.setItem("token", action.payload.token);
            }
            state.sessionChecked = true;
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userEmail", action.payload.email);
            localStorage.setItem("userName", action.payload.name);
            localStorage.setItem("isVerified", String(action.payload.isVerified ?? false));
            if (action.payload.lastProjectId) {
                localStorage.setItem("lastProjectId", action.payload.lastProjectId);
            }
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.userEmail = "";
            state.userName = "";
            state.hasProjects = false;
            state.lastProjectId = null;
            state.isVerified = false;
            state.token = "";
            state.searchTerm = "";
            state.sessionChecked = true;
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("userName");
            localStorage.removeItem("isVerified");
            localStorage.removeItem("token");
            localStorage.removeItem("lastProjectId");
            localStorage.removeItem("activeProject");
        },
        updateAuthUser: (state, action) => {
            if (action.payload) {
                if (action.payload.name) {
                    state.userName = action.payload.name;
                    localStorage.setItem("userName", action.payload.name);
                }
                if (action.payload.email) {
                    state.userEmail = action.payload.email;
                    localStorage.setItem("userEmail", action.payload.email);
                }
                if (action.payload.hasProjects !== undefined) {
                    state.hasProjects = action.payload.hasProjects;
                }
                if (action.payload.isVerified !== undefined) {
                    state.isVerified = action.payload.isVerified;
                    localStorage.setItem("isVerified", String(action.payload.isVerified));
                }
                 if (action.payload.lastProjectId) {
                    state.lastProjectId = action.payload.lastProjectId;
                    localStorage.setItem("lastProjectId", action.payload.lastProjectId);
                }
                if (action.payload.token) {
                    state.token = action.payload.token;
                    localStorage.setItem("token", action.payload.token);
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
        setAssigneeEmailFilter: (state, action) => {
            state.assigneeEmailFilter = action.payload;
        },
    },
});

export const { login, logout, updateAuthUser, setSessionChecked, setSearchTerm, setHasProjects, setAssigneeEmailFilter } =
    authSlice.actions;
export default authSlice.reducer;
