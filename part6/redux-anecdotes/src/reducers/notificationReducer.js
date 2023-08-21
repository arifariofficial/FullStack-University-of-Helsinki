import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: "",
  reducers: {
    notification(state, action) {
      return action.payload;
    },
  },
});

export const { notification } = notificationSlice.actions;

export const setNotification = (text, time) => {
  return (dispatch) => {
    dispatch(notification(text));
    setTimeout(() => {
      dispatch(notification(""));
    }, time * 1000);
  };
};

export default notificationSlice.reducer;
