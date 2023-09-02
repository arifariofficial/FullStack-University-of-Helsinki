import { useMutation } from "@apollo/client";
import { useState } from "react";
import { All_AUTHORS_AND_BOOKS, CREATE_BOOK } from "../queries";
import { useNavigate } from "react-router-dom";
import { updateCache } from "../App";

const NewBook = ({ setError }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  const navigate = useNavigate();

  const [createBook] = useMutation(CREATE_BOOK, {
    onError: (error) => {
      console.log(error);
      setError(error.graphQLErrors[0].message);
    },

    onCompleted: () => {
      navigate("/books");
    },

    update: (cache, response) => {
      console.log("newbook:update", cache, response);
      updateCache(
        cache,
        { query: All_AUTHORS_AND_BOOKS },
        response.data.addBook
      );
    },
  });

  const submit = async (event) => {
    event.preventDefault();

    createBook({ variables: { title, author, genres, published } });

    setTitle("");
    setPublished("");
    setAuthor("");
    setGenres([]);
    setGenre("");
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  const handlePublishInput = (value) => {
    setPublished(Number(value));
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => handlePublishInput(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(" ")}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
