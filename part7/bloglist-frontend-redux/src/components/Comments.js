import { useDispatch, useSelector } from "react-redux";
import { handleCommentObj } from "../reducers/commentReducer";
import { useState } from "react";
import { Table } from "react-bootstrap";

const Comments = ({ blog }) => {
  const [comment, setComment] = useState("");
  const [blogId, setBlogId] = useState(null);

  const comments = useSelector(({ comments }) => comments);

  const dispatch = useDispatch();

  const handleComment = (event) => {
    event.preventDefault();
    const commentObj = {
      comment: comment,
    };
    dispatch(handleCommentObj(blogId, commentObj));
  };
  if (!comments) return null;

  return (
    <div>
      <div>
        <h4>comments</h4>
        <form onSubmit={handleComment}>
          <input
            type="text"
            name="comment"
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />
          <button type="submit" onClick={() => setBlogId(blog.id)}>
            add comment
          </button>
        </form>
      </div>
      <div style={{ paddingTop: 5 }}>
        <Table striped>
          <tbody>
            {comments.map((item) => (
              <tr key={item.id}>
                <td>{item.comment}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Comments;
