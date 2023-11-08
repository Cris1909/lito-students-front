import { Navigate, Outlet } from "react-router";

import { useToken } from "../hooks";
import { ROUTES } from "../enums";

export const ProtectedRoutes = () => {
  const isAuth = useToken();
  return isAuth ? <Outlet /> : <Navigate to={ROUTES.SIGNIN} />;
};
