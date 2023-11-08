import { lazy } from 'react';
import { ROUTES } from '../enums';

const CreateSubject = lazy(() => import('../pages/Subjects/CreateSubject'));
const ListSubjects = lazy(() => import('../pages/Subjects/ListSubjects'));

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
];

const routes = [...coreRoutes];
export default routes;
