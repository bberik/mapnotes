import { createSlice } from "@reduxjs/toolkit";
import Cookies from 'js-cookie';


const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, access, refresh } = action.payload;
      state.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },
    logOut: (state, action) => {
      state.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("currentWorkspace");
      Cookies.remove("REFRESH");
      Cookies.remove("ACCESS");
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;