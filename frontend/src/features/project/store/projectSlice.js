import { createSlice } from "@reduxjs/toolkit";

const safeGetItem = (key) => {
    try {
        const item = localStorage.getItem(key);
        if (!item || item === "undefined") return null;
        return JSON.parse(item);
    } catch (e) {
        return null;
    }
};

const initialState = {
    activeProject: safeGetItem("activeProject"),
    projects: [],
    projectError: false,
};

const projectSlice = createSlice({
    name: "project",
    initialState,
    reducers: {
        setActiveProject: (state, action) => {
            state.activeProject = action.payload;
            state.projectError = false;
            localStorage.setItem("activeProject", JSON.stringify(action.payload));
        },
        setProjectError: (state, action) => {
            state.projectError = action.payload;
        },
        clearActiveProject: (state) => {
            state.activeProject = null;
            state.projectError = false;
            localStorage.removeItem("activeProject");
        },
        setProjects: (state, action) => {
            state.projects = action.payload;
        },
    },
});

export const { setActiveProject, setProjectError, clearActiveProject, setProjects } =
    projectSlice.actions;
export default projectSlice.reducer;
