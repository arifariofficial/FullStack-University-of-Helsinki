import { useDispatch } from "react-redux";
import { createAnecdote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const handleNew = (event) => {
    event.preventDefault();
    const typedObj = event.target.anecdote.value;
    dispatch(createAnecdote(typedObj));
    event.target.anecdote.value = "";

    dispatch(setNotification(`anecdote "${typedObj}" added`, 10));
  };
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleNew}>
        <div>
          <input name="anecdote" />
        </div>
        <button>create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
