import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

import {RootState} from '../../store';
import { IUser, defaultUser } from '../../../interfaces';


interface IAuthState {
  token: string;
  loading: boolean;
  user: IUser;
  isSession: boolean; 
  error: string | null
}

const initialState: IAuthState = {
  token: '',
  loading: false,
  user: defaultUser,
  isSession: false,
  error: null
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
    setLoading: (state, {payload = true}: PayloadAction<boolean>) => {
      state.loading = payload;
      state.error = null
    },

    login: (state, {payload}: LoginPayload) => {
      const {user, token} = payload;
      state.token = token;
      state.user = user;
      state.error = null
      state.isSession = true;
      state.loading = false;
    },

    logout: state => {
      state.token = '';
      state.user = defaultUser;
      state.isSession = false;
      state.loading = false;
    },

    setError: (state, {payload}: PayloadAction<string>) => {
      state.error = payload
      state.loading = false;
      state.user = defaultUser
      state.isSession = false
      state.token = ''
    }
  },
});

export const {
  setLoading,
  login,
  logout,
  setError
} = authSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAuthSlice = (state: RootState) => state.auth;

export default authSlice;
