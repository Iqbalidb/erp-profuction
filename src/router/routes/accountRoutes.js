import { lazy } from 'react';
export const accountRoutes = [
  {
    path: '/users',
    component: lazy(() => import('../../views/account/user-management/user/list'))
  }
];
