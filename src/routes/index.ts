import { lazy } from 'react';

import { ROUTES } from '../enums';

const CreateSubject = lazy(() => import('../pages/Subjects/CreateSubject'));
const ListSubjects = lazy(() => import('../pages/Subjects/ListSubjects'));
 
const CreateAvailableSchedules = lazy(() => import('../pages/AvailableSchedules/CreateAvailableSchedules'));

const coreRoutes = [
  {
    path: ROUTES.CREATE_SUBJECT,
    title: 'Crear Materia',
    component: CreateSubject,
  },
  {
    path: ROUTES.LIST_SUBJECTS,
    title: 'Listar materias',
    component: ListSubjects,
  },
  {
    path: ROUTES.CREATE_AVAILABLE_SCHEDULES,
    title: 'Crear horario disponible',
    component: CreateAvailableSchedules
  }
];

const routes = [...coreRoutes];
export default routes;
