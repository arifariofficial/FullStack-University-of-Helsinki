import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { All_AUTHORS_AND_BOOKS, EDIT_AUTHOR } from "../queries";
import Select from "react-select";

const Authors = ({ authors, setError }) => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");

  const [editAuthor, result] = useMutation(EDIT_AUTHOR, {
    onError: (error) => {
      const message = error.graphQLErrors[0].message;
      setError(message);
    },

    update: (cache, response) => {
      cache.updateQuery({ query: All_AUTHORS_AND_BOOKS }, ({ allAuthors }) => {
        return {
          allAuthors: allAuthors.concat(response.data.editAuthor),
        };
      });
    },
  });

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      setError("Author not found");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.data]);

  const submit = (event) => {
    event.preventDefault();
    editAuthor({ variables: { name, born } });
    setBorn("");
  };

  const options = [
    authors.map((item) => ({
      value: item.name,
      label: item.name,
    })),
  ];

  const handleName = (e) => {
    const authorName = e.value;
    setName(authorName);
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <h2>Set birthyear</h2>
        <Select
          defaultValue={name}
          onChange={(event) => handleName(event)}
          options={options[0]}
        />
        <form onSubmit={submit} style={{ padding: 5 }}>
          <div></div>
          <div>
            born
            <input
              type="text"
              value={born}
              onChange={({ target }) => setBorn(Number(target.value))}
            />
          </div>
          <button type="submit">update author</button>
        </form>
      </div>
    </div>
  );
};

export default Authors;
