import { createSlice } from "@reduxjs/toolkit";
import blogsService from "../services/blogs";

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    appendBlog(state, action) {
      return state.push(action.payload);
    },
    updateBlog(state, action) {
      const updatedObj = action.payload;
      return state.map((item) =>
        item.title !== updatedObj.title ? item : updatedObj
      );
    },
    deleteBlog(state, action) {
      const id = action.payload;
      return state.filter((item) => item.id !== id);
    },
  },
});

export const { setBlogs, appendBlog, updateBlog, deleteBlog } =
  blogSlice.actions;

export const initializeBlog = () => {
  return async (dispatch) => {
    const returnedObj = await blogsService.getAll();
    dispatch(setBlogs(returnedObj));
  };
};

export const createNewBlog = (newObj, user) => {
  return async (dispatch) => {
    const returnedObj = await blogsService.create(newObj);
    returnedObj.user = {
      id: user.id,
      username: user.username,
      name: user.name,
    };
    dispatch(appendBlog(returnedObj));
  };
};

export const handleDelete = (id) => {
  return async (dispatch) => {
    await blogsService.remove(id);
    dispatch(deleteBlog(id));
  };
};

export const handleLikes = (id, obj) => {
  return async (dispatch) => {
    const returnedObj = await blogsService.update(id, obj);
    returnedObj.user = {
      username: obj.user.username,
      name: obj.user.name,
    };
    dispatch(updateBlog(returnedObj));
  };
};

export default blogSlice.reducer;
