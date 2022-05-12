import { configureStore } from '@reduxjs/toolkit'
import themeSlice from './themeSlice'
import userSlide from './userSlide'

const store = configureStore({
    reducer: {
        theme: themeSlice.reducer,
        user: userSlide.reducer
    }
})


export default store