import { useDispatch, useSelector } from "react-redux";
import { setVisible } from "../reducers/visibleReducer";

const Toggleable = (props) => {
  const visible = useSelector(({ visible }) => visible);
  const dispatch = useDispatch();

  const showWhenVisible = { display: visible ? "" : "none" };
  const hideWhenVisible = { display: visible ? "none" : "" };

  const toggleVisibility = () => {
    dispatch(setVisible(!visible));
  };

  return (
    <div>
      <div style={hideWhenVisible}>
        <button id="new-blog-button" onClick={toggleVisibility}>
          {props.buttonLabel}
        </button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  );
};

Toggleable.displayName = "Toggleable";

export default Toggleable;
