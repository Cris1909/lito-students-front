export type IUser = {
  _id: string | null;
  name: string;
  email: string;
  roles: string[];
  phoneNumber: string | null;
};

export const defaultUser: IUser = {
  _id: '',
  name: '',
  email: '',
  roles: [],
  phoneNumber: null,
};