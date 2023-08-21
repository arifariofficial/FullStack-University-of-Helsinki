import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdoteService";

const anecdoteSlice = createSlice({
  name: "anecdote",
  initialState: [],
  reducers: {
    setAnecdotes(state, action) {
      return action.payload;
    },
    appenedAnecdote(state, action) {
      state.push(action.payload);
    },
    updateAnecdote(state, action) {
      const id = action.payload.id;
      return state.map((item) => (item.id !== id ? item : action.payload));
    },
  },
});

export const { setAnecdotes, appenedAnecdote, updateAnecdote } =
  anecdoteSlice.actions;

export const initializeAnecdote = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content);
    dispatch(appenedAnecdote(newAnecdote));
  };
};

export const handleVote = (id, updateObjct) => {
  return async (dispatch) => {
    const returnedAnecdote = await anecdoteService.updateAnecdote(
      id,
      updateObjct
    );
    dispatch(updateAnecdote(returnedAnecdote));
  };
};

export default anecdoteSlice.reducer;
