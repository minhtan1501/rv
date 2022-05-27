import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const handleSearch = createAsyncThunk(
  'search/handleSearch',
  async ({ query, token, search, updaterFuc }, { rejectWithValue }) => {
    if (!query.trim()) {
      return rejectWithValue();
    }
    if (!search) rejectWithValue();
    const { results } = await search(query, token);
    return { results, updaterFuc };
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    searching: false,
    results: [],
    resultNotFound: false,
  },
  reducers: {
    resetSearch(state) {
      state.searching = false;
      state.results = [];
      state.resultNotFound = false;
    },
  },
  extraReducers: {
    [handleSearch.pending]: (state, action) => {
      state.searching = true;
    },
    [handleSearch.fulfilled]: (state, action) => {
      const { results, updaterFuc } = action.payload;
      state.searching = false;
      if (!results?.length) {
        state.resultNotFound = true;
        state.results = [];
        updaterFuc && updaterFuc([]);
      } 
      else{
        updaterFuc && updaterFuc([...results]);
        state.results = results;
        state.resultNotFound = false;

      }
    },
    [handleSearch.rejected]: (state, action) => {
      state.searching = false;
      state.results = [];
      state.resultNotFound = false;
    },
  },
});

export default searchSlice;
