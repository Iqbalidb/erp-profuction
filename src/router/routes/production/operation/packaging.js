/*
     Title: Packaging Route
     Description: Packaging Route
     Author: Iqbal Hossain
     Date: 05-January-2022
     Modified: 05-January-2022
*/

import { lazy } from 'react';

export const packagingRoute = [
  {
    path: '/packaging',
    component: lazy( () => import( 'views/production/operation/packaging/list/PackagingList' ) )
  },
  {
    path: '/packaging-new',
    component: lazy( () => import( 'views/production/operation/packaging/form/PackagingAddForm' ) )
  },
  {
    path: '/packaging-assign-to-passed',
    component: lazy( () => import( 'views/production/operation/packaging/form/PackagingAssignToPassed' ) )
  },
  {
    path: '/packaging-details',
    component: lazy( () => import( 'views/production/operation/packaging/details/PackagingDetails' ) )
  }
];
