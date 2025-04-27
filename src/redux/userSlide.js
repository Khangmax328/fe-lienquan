// src/redux/slides/userSlide.js
import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {},
  reducers: {
    updateUser: (state, action) => {
      return action.payload
    },
    logoutUser: () => {
      return {}
    },
  },
})

export const { updateUser, logoutUser } = userSlice.actions
export default userSlice.reducer
