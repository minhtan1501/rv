import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getInfo, getToken, login, logout } from '../api/auth';

export const userLogin = createAsyncThunk('user/login', async (userInfo) => {
  const data = await login(userInfo);

  return data;
});
export const getUserInfo = createAsyncThunk(
  'user/getUserInfo',
  async (data) => {
    try {
      const res = await getInfo(data);
      return res;
    } catch (err) {}
  }
);
export const refreshToken = createAsyncThunk('user/refreshToken', async () => {
  try {
    const res = await getToken();
    return res?.accessToken;
  } catch (err) {}
});

export const userLogout = createAsyncThunk('user/logout', async () => {
  try {
    await logout()
  }catch (err) {}

})

const userSlide = createSlice({
  name: 'user',
  initialState: {
    token: '',
    user: {},
    isLogin: false,
  },
  reducers: {
    setToken(state,action) {
      state.isLogin = true;
        state.token = action.payload
    }
  },
  extraReducers: {
    [userLogin.fulfilled]: (state, action) => {
      console.log(action);
      localStorage.setItem('firstLogin', true);
      state.isLogin = true;
      state.token = action.payload?.accessToken;
    },
    [getUserInfo.fulfilled]: (state, action) => {
      state.isLogin = true 
      state.user = action.payload.user;
    },
    [refreshToken.fulfilled]: (state, action) => {
      state.token = action.payload;
    },
    [userLogout.fulfilled]: (state) => {
      state.isLogin = false;
      state.user = {};
      state.token = "";
      localStorage.removeItem("firstLogin")

    }
  },
});

export default userSlide;
