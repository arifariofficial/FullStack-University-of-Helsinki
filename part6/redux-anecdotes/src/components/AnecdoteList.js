import { useSelector, useDispatch } from "react-redux";
import { handleVote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const AnecdoteList = () => {
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    if (filter === "") {
      return anecdotes;
    }
    return anecdotes.filter((item) =>
      item.content.toLowerCase().includes(filter.toLowerCase())
    );
  });
  const dispatch = useDispatch();

  const vote = (id) => {
    const votedAnecdote = anecdotes.find((item) => item.id === id);
    const updateObjct = {
      ...votedAnecdote,
      votes: votedAnecdote.votes + 1,
    };

    dispatch(handleVote(id, updateObjct));
    dispatch(setNotification(`you voted "${votedAnecdote.content}"`, 10));
  };

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
