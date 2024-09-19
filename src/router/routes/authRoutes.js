import { lazy } from 'react';

export const authRoutes = [
  {
    path: '/home',
    component: lazy(() => import('../../views/Home'))
  },
  {
    path: '/project-structure',
    component: lazy(() => import('../../documents/read/ProjectStructure'))
  },

  {
    path: '/login',
    component: lazy(() => import('../../views/account/Login')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/error',
    component: lazy(() => import('../../views/Error')),
    layout: 'BlankLayout'
  }
];
