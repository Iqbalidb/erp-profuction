/*
     Title: Wash Route
     Description: Wash Route
     Author: Iqbal Hossain
     Date: 05-January-2022
     Modified: 05-January-2022
*/

import { lazy } from 'react';

export const washRoute = [
  {
    path: '/wash',
    component: lazy( () => import( 'views/production/operation/wash/list/WashList' ) )
  },
  {
    path: '/wash-new',
    component: lazy( () => import( 'views/production/operation/wash/form/WashAddForm' ) )
  },
  {
    path: '/wash-received',
    component: lazy( () => import( 'views/production/operation/wash/form/WashReceivedForm' ) )
  },
  {
    path: '/wash-edit',
    component: lazy( () => import( 'views/production/operation/wash/form/WashEditForm' ) )
  },
  {
    path: '/wash-receive-edit',
    component: lazy( () => import( 'views/production/operation/wash/form/WashReceiveEditForm' ) )
  },
  {
    path: '/wash-details',
    component: lazy( () => import( 'views/production/operation/wash/details/WashDetails' ) )
  },
  {
    path: '/wash-receive-details',
    component: lazy( () => import( 'views/production/operation/wash/details/WashReceiveDetails' ) )
  }
];
