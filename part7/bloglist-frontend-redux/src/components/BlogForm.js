import React, { useState } from "react";
import { createNewBlog } from "../reducers/blogReducer";
import { useDispatch, useSelector } from "react-redux";
import { setVisible } from "../reducers/visibleReducer";
import { setNotification } from "../reducers/notificationReducer";

const BlogForm = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const dispatch = useDispatch();
  const user = useSelector(({ user }) => user);
  const visible = useSelector(({ visible }) => visible);

  const handleCreateBlog = (e) => {
    e.preventDefault();

    dispatch(
      createNewBlog(
        {
          title: title,
          author: author,
          url: url,
          likes: 0,
        },
        user
      )
    );
    dispatch(setVisible(!visible));
    dispatch(setNotification(`a new blog "${title} was added"`, 5));

    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <div>
      <h2>create new</h2>
      <form id="form" onSubmit={handleCreateBlog}>
        <div>
          title:
          <input
            id="title"
            type="text"
            name="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            id="author"
            type="text"
            name="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            id="url"
            type="text"
            name="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button id="create-button">create</button>
      </form>
    </div>
  );
};

export default BlogForm;
