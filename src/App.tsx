import { Suspense, lazy, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'animate.css';

import { AuthLayout, SignIn, SignUp } from './pages';
import { Loader } from './common';

import routes from './routes';
import { useAppDispatch, useAppSelector, useToken } from './hooks';
import { ROUTES } from './enums';
import { ProtectedRoutes } from './guards';
import { startValidateToken } from './store';
import { Dashboard } from './pages';
import { selectAuthSlice } from './store/reducers/auth/authSlice';
import { DefaultLayout } from './layout';

function App() {
  const [loading, setLoading] = useState<boolean>(true);

  const { user } = useAppSelector(selectAuthSlice);

  const dispatch = useAppDispatch();

  const handleValidateToken = async () => {
    await dispatch(startValidateToken());
    setLoading(false);
  };

  useEffect(() => {
    handleValidateToken();
  }, []);

  // Validar si puede estar en la ruta según su rol
  const parseRoutes = routes.filter((route) =>
    route.roles.some((condition) => {
      return user.roles.includes(condition);
    }),
  );

  return loading ? (
    <Loader />
  ) : (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        containerClassName="overflow-auto"
      />
      <Routes>
        <Route path="/" element={<Navigate to={ROUTES.SIGNIN} />} />
        <Route element={<AuthLayout />}>
          <Route path={useToken() ? '/' : ROUTES.SIGNIN} element={<SignIn />} />
          <Route path={useToken() ? '/' : ROUTES.SIGNUP} element={<SignUp />} />
        </Route>
        <Route element={<ProtectedRoutes />}>
          <Route element={<DefaultLayout />}>
            <Route index path={ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} />} />
            {parseRoutes.map((routes, index) => {
              const { path, component: Component } = routes;
              return (
                <Route
                  key={index}
                  path={path}
                  element={
                    <Suspense fallback={<Loader />}>
                      <Component />
                    </Suspense>
                  }
                />
              );
            })}
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
