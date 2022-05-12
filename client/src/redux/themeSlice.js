import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
    name:"theme",
    initialState:{
        status: localStorage.getItem('theme') ||'dark'
    },
    reducers:{
        toggleTheme(state,action){
            const newStatus  = action.payload === 'dark' ? 'light' : 'dark';
            localStorage.setItem("theme", newStatus);
            state.status = newStatus
        },

    },
})

export default themeSlice