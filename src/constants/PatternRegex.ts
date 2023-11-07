export const PatterRegex = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/,
  password: /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/,
  url: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i,
  phoneNumber: /^3\d{9}$/
};
