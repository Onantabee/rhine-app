import { createSlice } from "@reduxjs/toolkit";

const getPersistedProject = () => {
    try {
        const stored = localStorage.getItem("activeProject");
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
};

const initialState = {
    activeProject: getPersistedProject(),
    projects: [],
};

const projectSlice = createSlice({
    name: "project",
    initialState,
    reducers: {
        setActiveProject: (state, action) => {
            state.activeProject = action.payload;
            localStorage.setItem("activeProject", JSON.stringify(action.payload));
        },
        clearActiveProject: (state) => {
            state.activeProject = null;
            localStorage.removeItem("activeProject");
        },
        setProjects: (state, action) => {
            state.projects = action.payload;
        },
    },
});

export const { setActiveProject, clearActiveProject, setProjects } =
    projectSlice.actions;
export default projectSlice.reducer;
