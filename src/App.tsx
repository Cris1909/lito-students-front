import { Suspense, lazy, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { ECommerce, SignIn, SignUp } from './pages';
import {Loader} from './common';

import routes from './routes';
import { useToken } from './hooks';
import { ROUTES } from './enums';
import { ProtectedRoutes } from './guards';

const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));

function App() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

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
        <Route path={useToken() ? '/' : ROUTES.SIGNIN} element={<SignIn />} />
        <Route path={useToken() ? '/' : ROUTES.SIGNUP} element={<SignUp />} />

        <Route element={<ProtectedRoutes />}>
          <Route element={<DefaultLayout />}>
            <Route index element={<ECommerce />} />
            <Route path="*" element={<Navigate to={'/'} />} />
            {routes.map((routes, index) => {
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
