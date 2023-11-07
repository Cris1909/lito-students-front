import { LocalStorageKeys } from "../enums";

export const useToken = () => {
  return localStorage.getItem(LocalStorageKeys.TOKEN);
};