import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const User = () => {
  const users = useSelector(({ users }) => users);
  const id = useParams().id;
  const user = users.find((item) => item.id === id);

  if (!user) return null;

  return (
    <div>
      <h2>{user.name}</h2>
      <h4>added blogs</h4>
      {user.blogs.map((item) => (
        <li key={item.id}>{item.title}</li>
      ))}
    </div>
  );
};
export default User;
