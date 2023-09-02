import { useQuery } from "@apollo/client";
import { All_BOOKS } from "../queries";

const Recommend = ({ favoriteGenre }) => {
  const result = useQuery(All_BOOKS, {
    variables: { genre: favoriteGenre },
  });
  if (result.loading) return <div>loading...</div>;
  const books = result.data ? result.data.allBooks : "";

  return (
    <div>
      <h2>recommendations</h2>
      <div>
        books in your favorite genre{" "}
        <span style={{ fontWeight: "bold" }}>{favoriteGenre}</span>
      </div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((item) => (
            <tr key={item.title}>
              <td>{item.title}</td>
              <td>{item.author.name}</td>
              <td>{item.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommend;
