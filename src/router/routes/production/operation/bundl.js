/*
     Title: Bundle Route
     Description: Bundle Route
     Author: Iqbal Hossain
     Date: 05-January-2022
     Modified: 05-January-2022
*/

import { lazy } from 'react';

export const bundleRoute = [
  {
    path: '/bundle',
    component: lazy( () => import( 'views/production/operation/bundle/list/BundleList' ) )
  },
  {
    path: '/bundle-new',
    component: lazy( () => import( 'views/production/operation/bundle/form/BundleAddForm' ) )
  },
  {
    path: '/bundle-details',
    component: lazy( () => import( 'views/production/operation/bundle/details/BundleDetails' ) )
  }
];
