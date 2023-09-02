import { useState } from "react";

const Books = ({ books }) => {
  const [filter, setFilter] = useState(null);

  if (!books) return null;
  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books
            .filter((item) => (filter ? item.genres.includes(filter) : item))
            .map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => setFilter("refactoring")}>refactoring</button>
        <button onClick={() => setFilter("design")}>design</button>
        <button onClick={() => setFilter("crime")}>crime</button>
        <button onClick={() => setFilter("crime")}>classic</button>
        <button onClick={() => setFilter(null)}>all genres</button>
      </div>
      <div></div>
    </div>
  );
};

export default Books;
