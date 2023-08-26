import { createSlice } from "@reduxjs/toolkit";

const showAllSlice = createSlice({
  name: "showAll",
  initialState: false,
  reducers: {
    setShowAll(state, action) {
      return action.payload;
    },
  },
});
export const { setShowAll } = showAllSlice.actions;
export default showAllSlice.reducer;
