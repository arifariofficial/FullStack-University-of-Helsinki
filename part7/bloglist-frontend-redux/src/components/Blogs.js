import Toggleable from "./Toggleable";
import BlogForm from "./BlogForm";
import { Link } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import { Table } from "react-bootstrap";

const Blogs = () => {
  const [user, blogs] = useSelector(
    (state) => [state.user, state.blogs],
    shallowEqual
  );

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const copyOfBlogs = [...blogs];

  return (
    <div>
      {user && (
        <div>
          {<Toggleable buttonLabel="create new">{<BlogForm />}</Toggleable>}

          <Table striped>
            <tbody>
              {copyOfBlogs
                .sort((a, b) => b.likes - a.likes)
                .map((item) => (
                  <tr key={item.id} style={blogStyle}>
                    <td>
                      <Link to={`/blogs/${item.id}`}>
                        {item.title}
                        {item.author}
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Blogs;
