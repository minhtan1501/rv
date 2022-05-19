import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { searchActor } from '../api/actor';

export const handleSearch = createAsyncThunk(
  'search/handleSearch',
  async ({query,token,updaterFuc}, { rejectWithValue }) => {
    if (!query.trim()) {
      return rejectWithValue();
    }
    const {results} = await searchActor(query, token)
    return {results,updaterFuc}
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    searching: false,
    results: [],
    resultNotFound: false
  },
  reducers:{
    resetSearch(state){
      state.searching = false;
      state.results = [];
      state.resultNotFound = false;
    }
  },
  extraReducers: {
    [handleSearch.pending]: (state, action) => {
      state.searching = true;
    },
    [handleSearch.fulfilled]: (state, action) => {
      const {results,updaterFuc} = action.payload
      state.searching = false;
      if(!action?.payload?.length){
        state.resultNotFound = true;
      } 
      updaterFuc([...results])
      state.results = results || []
      
    },
    [handleSearch.rejected]: (state, action) => {
      state.searching = false;
      state.results = [];
      state.resultNotFound = false;
    },
  },
});

export default searchSlice;
