// // src/redux/slides/userSlide.js
// import { createSlice } from '@reduxjs/toolkit'

// const userSlice = createSlice({
//   name: 'user',
//   initialState: {},
//   reducers: {
//     updateUser: (state, action) => {
//       return action.payload
//     },
//     logoutUser: () => {
//       return {}
//     },
//   },
// })

// export const { updateUser, logoutUser } = userSlice.actions
// export default userSlice.reducer
// src/redux/slides/userSlide.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    email: null,
    username: null,
    balance: 0,  // khởi tạo balance là 0
  },
  reducers: {
    updateUser: (state, action) => {
      return action.payload;
    },
    logoutUser: () => {
      return {};
    },
    updateBalance: (state, action) => {
      state.balance = action.payload;  // Cập nhật balance
    }
  },
});

export const { updateUser, logoutUser, updateBalance } = userSlice.actions;  // Xuất action
export default userSlice.reducer;
