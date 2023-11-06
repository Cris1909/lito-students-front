import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

import {RootState} from '../../store';
import { IUser, defaultUser } from '../../../interfaces';


interface IAuthState {
  token: string;
  loading: boolean;
  user: IUser;
  isSession: boolean;              
}

const initialState: IAuthState = {
  token: '',
  loading: false,
  user: defaultUser,
  isSession: false

};

// Tipos de payloads actions
type LoginPayload = PayloadAction<{
  user: IUser;
  token: string;
}>;

// Creación slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoadingLogin: (state, {payload = true}: PayloadAction<boolean>) => {
      state.loading = payload;
    },

    login: (state, {payload}: LoginPayload) => {
      const {user, token} = payload;
      state.token = token;
      state.user = user;
      state.isSession = true;
      state.loading = false;
    },

    logout: state => {
      state.token = '';
      state.user = defaultUser;
      state.isSession = false;
      state.loading = false;
    },
  },
});

export const {
  setLoadingLogin,
  login,
  logout,
} = authSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAuthSlice = (state: RootState) => state.auth;

export default authSlice;
