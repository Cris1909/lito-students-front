import { LocalStorageKeys } from '../../../enums';
import { AuthService } from '../../../services';
import { AppDispatch, RootState } from '../../store';
import { login, logout, setError, setLoading, } from './authSlice';

export const thunkExample = () => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {};
};

interface LoginProps {
  email: string;
  password: string;
}

export const startLogin = ({ email, password }: LoginProps) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(setLoading(true))
    try {
      const { payload, token } = await AuthService.login({ email, password });
      dispatch(
        login({
          token,
          user: payload,
        }),
      );
      localStorage.setItem(LocalStorageKeys.USER, JSON.stringify(payload));
      localStorage.setItem(LocalStorageKeys.TOKEN, token);
      return { success: true, error: null };
    } catch (error: any) {
      dispatch(setError(error?.message));
      return { success: false, error: error?.message };
    }
  };
};

export const startLogout = () => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    localStorage.removeItem(LocalStorageKeys.TOKEN)
    localStorage.removeItem(LocalStorageKeys.USER)
    dispatch(logout());
  };
};
