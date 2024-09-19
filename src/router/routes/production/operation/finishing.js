/*
     Title: Finishing Route
     Description: Finishing Route
     Author: Iqbal Hossain
     Date: 05-January-2022
     Modified: 05-January-2022
*/

import { lazy } from 'react';

export const finishingRoute = [
  {
    path: '/finishing',
    component: lazy( () => import( 'views/production/operation/finishing/list/FinishingList' ) )
  },
  {
    path: '/finishing-new',
    component: lazy( () => import( 'views/production/operation/finishing/form/FinishingAddForm' ) )
  },
  {
    path: '/finishing-edit',
    component: lazy( () => import( 'views/production/operation/finishing/form/FinishingEditForm' ) )
  },
  {
    path: '/finishing-details',
    component: lazy( () => import( 'views/production/operation/finishing/details/FinishingDetails' ) )
  }
];
