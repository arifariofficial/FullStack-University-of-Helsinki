import { createSlice } from "@reduxjs/toolkit";
import commentService from "../services/commentService";

const commentReducer = createSlice({
  name: "comments",
  initialState: [],
  reducers: {
    setComments(state, action) {
      return action.payload;
    },

    appendComment(state, action) {
      return state.concat(action.payload);
    },
  },
});

export const { setComments, appendComment } = commentReducer.actions;

export const initializeComments = (id) => {
  return async (dispatch) => {
    const returnedObj = await commentService.getAll(id);
    dispatch(setComments(returnedObj));
  };
};

export const handleCommentObj = (id, comment) => {
  return async (dispatch) => {
    const returnedObj = await commentService.createComment(id, comment);
    dispatch(appendComment(returnedObj));
  };
};

export default commentReducer.reducer;
