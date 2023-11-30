import { lazy } from 'react';

import { ROUTES, Roles } from '../enums';

// import { CreateSubject, ListSubjects, CreateAvailableSchedules } from '../pages';

const CreateSubject = lazy(() => import('../pages/Subjects/CreateSubject'));
const ListSubjects = lazy(() => import('../pages/Subjects/ListSubjects'));
const CreateAvailableSchedules = lazy(
  () => import('../pages/AvailableSchedules/CreateAvailableSchedules'),
);
const Statistics = lazy(() => import('../pages/Statistics/StatisticsScreen'));

const coreRoutes = [
  {
    path: ROUTES.CREATE_SUBJECT,
    title: 'Crear Materia',
    component: CreateSubject,
    roles: [Roles.ADMIN],
  },
  {
    path: ROUTES.LIST_SUBJECTS,
    title: 'Listar materias',
    component: ListSubjects,
    roles: [Roles.ADMIN],
  },
  {
    path: ROUTES.CREATE_AVAILABLE_SCHEDULES,
    title: 'Crear horario disponible',
    component: CreateAvailableSchedules,
    roles: [Roles.TEACHER],
  },
  {
    path: ROUTES.STATISTICS,
    title: 'Estadísticas',
    component: Statistics,
    roles: [Roles.ADMIN],
  },
];

const routes = [...coreRoutes];
export default routes;
