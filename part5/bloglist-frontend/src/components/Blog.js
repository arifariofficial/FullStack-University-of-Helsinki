import React, { useState } from "react";

const Blog = ({ blog, handleLikes, handleRemove, user }) => {
  const [showAll, setShowAll] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const removeStyle = {
    backgroundColor: "magenta",
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{" "}
        <button onClick={() => setShowAll(!showAll)}>
          {showAll ? "hide" : "view"}
        </button>
      </div>
      {showAll && (
        <div>
          <p>{blog.url}</p>
          <p>
            likes {blog.likes}{" "}
            <button id="like" onClick={() => handleLikes(blog)}>
              like
            </button>
          </p>
          <p>{blog.user.name}</p>
          {blog.user.username === user.username ? (
            <button style={removeStyle} onClick={() => handleRemove(blog)}>
              remove
            </button>
          ) : (
            ""
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
