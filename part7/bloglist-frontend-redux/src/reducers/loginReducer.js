import { createSlice } from "@reduxjs/toolkit";
import loginService from "../services/login";
import { setNotification } from "./notificationReducer";
import blogService from "../services/blogs";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export const handleLogin = (credential) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login(credential);
      dispatch(setUser(user));
      blogService.setToken(user.token);
      window.localStorage.setItem("loggedBlogUser", JSON.stringify(user));
    } catch (error) {
      dispatch(setNotification("wrong credentials", 5));
    }
  };
};

export default userSlice.reducer;
