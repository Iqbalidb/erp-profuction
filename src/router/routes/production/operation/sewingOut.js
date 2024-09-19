/*
     Title: Sewing Out Route
     Description: Sewing Out Route
     Author: Iqbal Hossain
     Date: 05-January-2022
     Modified: 05-January-2022
*/

import { lazy } from 'react';

export const sewingOutRoute = [
  {
    path: '/sewing-out',
    component: lazy( () => import( 'views/production/operation/sewingOut/list/SewingOutList' ) )
  },
  {
    path: '/sewing-out-new',
    component: lazy( () => import( 'views/production/operation/sewingOut/form/SewingOutAddForm' ) )
  },
  {
    path: '/sewing-out-edit',
    component: lazy( () => import( 'views/production/operation/sewingOut/form/SewingOutEditForm' ) )
  },
  {
    path: '/sewing-out-details',
    component: lazy( () => import( 'views/production/operation/sewingOut/details/SewingOutDetails' ) )
  }
];
