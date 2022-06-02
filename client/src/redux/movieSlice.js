import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getMovies } from '../api/movie';

const limit = 5;

export const fetchMovie = createAsyncThunk(
  'movie/fetchMovie',
  async ({ pageNo, token }, { rejectWithValue }) => {
    const { movies } = await getMovies(pageNo, limit, token);
    if (!movies.length) {
      return rejectWithValue(pageNo);
    }

    return movies;
  }
);

export const fetchLatestMovie = createAsyncThunk(
  'movie/fetchLatestMovie',
  async ({ qty, token }, { rejectWithValue }) => {
    const { movies } = await getMovies(0, qty, token);
    if (!movies.length) {
      return rejectWithValue();
    }

    return movies;
  }
);

const movieSlice = createSlice({
  name: 'movie',
  initialState: {
    newMovies: [],
    currentPageNo: 0,
    reachedToEnd: false,
  },
  reducers: {
    nextClick: (state) => {
      if (!state.reachedToEnd) {
        state.currentPageNo += 1;
      }
    },
    prevClick: (state) => {
      if (state.currentPageNo > 0) {
        state.currentPageNo -= 1;
        state.reachedToEnd = false;
      }
    },
  },
  extraReducers: {
    [fetchMovie.fulfilled]: (state, action) => {
        console.log(action.payload);
      state.newMovies = action.payload;
      state.reachedToEnd = false;
    },
    [fetchMovie.rejected]: (state, action) => {
      state.reachedToEnd = true;
      state.newMovies = [];
    },
    [fetchLatestMovie.fulfilled]: (state, action) => {
      state.newMovies = action.payload;
      state.reachedToEnd = false;
    },
    [fetchLatestMovie.rejected]: (state, action) => {
      state.reachedToEnd = true;
      state.newMovies = [];
    },
  },
});

export default movieSlice;
