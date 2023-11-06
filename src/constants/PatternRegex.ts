export const PatterRegex = {
  emailRegex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/,
  passwordRegex: /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/,
  urlRegex: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i,
};
