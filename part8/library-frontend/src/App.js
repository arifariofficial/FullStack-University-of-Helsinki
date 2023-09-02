import { Link, Route, Routes, useNavigate } from "react-router-dom";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { All_AUTHORS_AND_BOOKS, BOOK_ADDED, ME } from "./queries";
import { useApolloClient, useQuery, useSubscription } from "@apollo/client";
import { useEffect, useState } from "react";
import Notify from "./components/Notify";
import LoginForm from "./components/LoginForm";
import Recommend from "./components/Recommend";

export const updateCache = (cache, query, addedBook) => {
  const uniqByName = (a) => {
    let seen = new Set();
    return a.filter((item) => {
      let k = item.title;
      return seen.has(k) ? false : seen.add(k);
    });
  };

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    };
  });
};

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [token, setToken] = useState(null);
  const client = useApolloClient();
  const navigate = useNavigate();

  const result = useQuery(All_AUTHORS_AND_BOOKS);
  const user = useQuery(ME);

  useEffect(() => {
    const user = localStorage.getItem("library-user-token");
    setToken(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useSubscription(BOOK_ADDED, {
    onData: (data) => {
      const addedBook = data.data.data.bookAdded;
      window.alert(`${addedBook.title} added`);
      updateCache(client.cache, { query: All_AUTHORS_AND_BOOKS }, addedBook);
    },
  });

  if (result.loading || user.loading) return <div>loading...</div>;

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    navigate("/login");
  };

  const favoriteGenre = user.data ? user.data.me.favoriteGenre : null;

  return (
    <div>
      <div>
        <Link to="/">
          <button>author</button>
        </Link>
        <Link to="/books">
          <button>books</button>
        </Link>

        {token ? (
          <>
            <Link to="/newbook">
              <button>newbook</button>
            </Link>
            <Link to="/recommend">
              <button>recommend</button>
            </Link>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button>login</button>
            </Link>
          </>
        )}
      </div>
      <Notify errorMessage={errorMessage} />
      <Routes>
        <Route
          path="/login"
          element={<LoginForm setToken={setToken} setError={notify} />}
        />
        <Route
          path="/"
          element={
            <Authors authors={result.data.allAuthors} setError={notify} />
          }
        />
        <Route path="/books" element={<Books books={result.data.allBooks} />} />
        <Route path="/newbook" element={<NewBook setError={notify} />} />
        <Route
          path="/recommend"
          element={<Recommend favoriteGenre={favoriteGenre} />}
        />
      </Routes>
    </div>
  );
};

export default App;
