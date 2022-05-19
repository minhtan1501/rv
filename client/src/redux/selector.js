import { createSelector } from '@reduxjs/toolkit'

const tokenSelector = state => state?.user

export const getToken = createSelector (
    tokenSelector,
     (state) => {
         return state.token
     } 
)