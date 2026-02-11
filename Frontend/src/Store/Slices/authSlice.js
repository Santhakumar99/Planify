
import { createSlice } from "@reduxjs/toolkit";

const storedUser = sessionStorage.getItem("User");
const storedToken = sessionStorage.getItem("token");

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: storedUser ? JSON.parse(storedUser) : null,
        token: storedToken || null,
        isloggedIn: !!storedToken
    },
    reducers: {
        loginSuccess: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isloggedIn = true;

            // persist
            sessionStorage.setItem("User", JSON.stringify(action.payload.user));
            sessionStorage.setItem("token", action.payload.token);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isloggedIn = false;

            sessionStorage.clear();
        }
    }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
