import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activeProject: null,
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
