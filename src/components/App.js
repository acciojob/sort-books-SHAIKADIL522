import React, { useEffect, useMemo } from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import { store, fetchBooks, setSortBy, setOrder } from "../store/booksSlice";
import "./../styles/App.css";

function BooksList() {
  const dispatch = useDispatch();
  const { books, sortBy, order, loading, error } = useSelector((s) => s);

  useEffect(() => { dispatch(fetchBooks()); }, [dispatch]);

  // sort a COPY, never mutate redux state
  const sorted = useMemo(() => {
    const dir = order === "asc" ? 1 : -1;
    return [...books].sort(
      (a, b) =>
        dir * String(a[sortBy] || "").localeCompare(String(b[sortBy] || ""), undefined, { sensitivity: "base" })
    );
  }, [books, sortBy, order]);

  return (
    <div>
      {/* the two selects MUST be the first two children of this div */}
      <div className="controls">
        <select value={sortBy} onChange={(e) => dispatch(setSortBy(e.target.value))}>
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="publisher">Publisher</option>
        </select>
        <select value={order} onChange={(e) => dispatch(setOrder(e.target.value))}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <table>
        <thead>
          <tr><th>Title</th><th>Author</th><th>Publisher</th><th>ISBN</th></tr>
        </thead>
        <tbody>
          {sorted.map((b) => (
            <tr key={b.primary_isbn13 || b.title}>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.publisher}</td>
              <td>{b.primary_isbn13}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const App = () => (
  <Provider store={store}>
    <div>
      {/* Do not remove the main div */}
      <BooksList />
    </div>
  </Provider>
);

export default App;