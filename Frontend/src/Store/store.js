import { configureStore } from '@reduxjs/toolkit';

// importing slice reducers
import authReducer from "../Store/Slices/authSlice";
import projectReducer from "../Store/Slices/projectSlice"; 

export const store = configureStore({
    reducer: {
        auth: authReducer,
        projects:projectReducer
    }
})