import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Toggleable from "./components/Toggleable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const blogFormRef = useRef();
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    user && blogService.getAll().then((blogs) => setBlogs(blogs));
  }, [user]);

  const createNewBlog = async (newBlogObj) => {
    const returnedBlogObj = await blogService.create(newBlogObj);

    returnedBlogObj.user = {
      username: user.username,
      name: user.name,
    };
    const newBlogs = blogs.concat(returnedBlogObj);

    setBlogs(newBlogs);

    setErrorMessage(
      `a new blog ${newBlogObj.title} by ${newBlogObj.author} added`
    );
    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);

    blogFormRef.current.toggleVisibility();
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogUser");
    setUser(null);
  };

  const handleLikes = async (blog) => {
    const newBlogObj = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    };

    await blogService.update(blog.id, newBlogObj);
    const updatedBlogs = blogs.filter((item) =>
      item.title === newBlogObj.title ? (item.likes = item.likes + 1) : item
    );
    setBlogs(updatedBlogs);
  };

  const handleRemove = async (blog) => {
    window.confirm(`Remove blog ${blog.title} by ${blog.author}`);

    await blogService.remove(blog.id);

    const deletedBlogs = blogs.filter((item) =>
      item.id !== blog.id ? item : null
    );
    setBlogs(deletedBlogs);
  };

  return (
    <div>
      {!user && (
        <div>
          <h2>log in to application</h2>
          <Notification message={errorMessage} />
          <LoginForm setUser={setUser} setErrorMessage={setErrorMessage} />
        </div>
      )}
      {user && (
        <div>
          <h2>blogs</h2>
          <Notification message={errorMessage} />
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>

          <Toggleable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm createNewBlog={createNewBlog} />
          </Toggleable>

          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.title}
                blog={blog}
                blogs={blogs}
                setBlogs={setBlogs}
                user={user}
                handleLikes={handleLikes}
                handleRemove={handleRemove}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default App;
