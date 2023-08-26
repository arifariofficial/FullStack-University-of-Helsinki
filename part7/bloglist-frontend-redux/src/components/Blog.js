import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { handleLikes } from "../reducers/blogReducer";
import { initializeComments } from "../reducers/commentReducer";
import Comments from "./Comments";
import { useEffect } from "react";

const Blog = () => {
  const dispatch = useDispatch();

  const blogs = useSelector(({ blogs }) => blogs);
  const id = useParams().id;
  const blog = blogs.find((item) => item.id === id);

  useEffect(() => {
    dispatch(initializeComments(id));
  }, []);

  const likes = (id) => {
    const likedBlog = blogs.find((item) => item.id === id);
    const updateBlog = {
      ...likedBlog,
      likes: blog.likes + 1,
    };
    dispatch(handleLikes(id, updateBlog));
  };

  return (
    <div>
      {blog && (
        <div>
          <h2>
            {blog.title} {blog.author}
          </h2>
          <div>
            <p>{blog.url}</p>
            <p>
              {blog.likes} likes{" "}
              <button onClick={() => likes(blog.id)}>like</button>
            </p>
            <p>added by {blog.user.name}</p>
          </div>
          <div>
            <Comments blog={blog} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
