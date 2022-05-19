import { configureStore } from '@reduxjs/toolkit'
import searchSlice from './searchSlice'
import themeSlice from './themeSlice'
import userSlide from './userSlide'

const store = configureStore({
    reducer: {
        theme: themeSlice.reducer,
        user: userSlide.reducer,
        search: searchSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})


export default store