import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const projectSlice = createSlice({
    name: "projects",
    initialState: {
        list: [],
        selectedProject:null
    },
    reducers: {
        setProjects: (state, action) => {
            state.list = action.payload;
        },
        selectProject: (state, action) => {
            state.selectedProject = action.payload;
        },
        addProject: (state, action) => {
            state.list.push(action.payload);
        }
    }
})
export const { setProjects, selectProject, addProject } = projectSlice.actions;
export default projectSlice.reducer;