import { useSelector } from "react-redux";

const Notification = () => {
  const notification = useSelector(({ notification }) => notification);
  if (!notification) {
    return null;
  }

  return <div className="error">{notification}</div>;
};

export default Notification;
