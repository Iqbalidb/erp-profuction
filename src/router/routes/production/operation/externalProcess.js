/*
     Title: External Process Route
     Description: External Process Route
     Author: Iqbal Hossain
     Date: 05-January-2022
     Modified: 05-January-2022
*/

import { lazy } from 'react';

export const externalProcessRoute = [
  {
    path: '/external-process',
    component: lazy( () => import( 'views/production/operation/externalProcess/list/ExternalProcessList' ) )
  },
  {
    path: '/external-process-new',
    component: lazy( () => import( 'views/production/operation/externalProcess/form/ExternalProcessAddForm' ) )
  },
  {
    path: '/external-process-details',
    component: lazy( () => import( 'views/production/operation/externalProcess/details/ExternalProcessDetails' ) )
  }
];
