import { createSlice, createAsyncThunk, configureStore } from "@reduxjs/toolkit";

// Replace with the URL/key given in your task README
const URL =
  "https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=YOUR_KEY";

export const fetchBooks = createAsyncThunk("books/fetch", async () => {
  const res = await fetch(URL);
  if (!res.ok) throw new Error("Failed to fetch books");
  const data = await res.json();
  return data.results.books; // each has title, author, publisher, primary_isbn13
});

const slice = createSlice({
  name: "books",
  initialState: { books: [], sortBy: "title", order: "asc", loading: false, error: null },
  reducers: {
    setSortBy: (s, { payload }) => { s.sortBy = payload; },
    setOrder: (s, { payload }) => { s.order = payload; },
  },
  extraReducers: (b) => {
    b.addCase(fetchBooks.pending, (s) => { s.loading = true; s.error = null; })
     .addCase(fetchBooks.fulfilled, (s, { payload }) => { s.loading = false; s.books = payload; })
     .addCase(fetchBooks.rejected, (s, { error }) => { s.loading = false; s.error = error.message; });
  },
});

export const { setSortBy, setOrder } = slice.actions;
export const store = configureStore({ reducer: slice.reducer });