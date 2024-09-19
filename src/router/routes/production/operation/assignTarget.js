/*
     Title: Assign Target Route
     Description: Assign Target Route
     Author: Iqbal Hossain
     Date: 05-January-2022
     Modified: 05-January-2022
*/

import { lazy } from 'react';

export const assignTargetRoute = [
  {
    path: '/assign-target',
    component: lazy( () => import( 'views/production/operation/assignTarget/list/AssignTargetList' ) )
  },
  {
    path: '/assign-target-new',
    component: lazy( () => import( 'views/production/operation/assignTarget/form/AssignTargetAddForm' ) )
  },
  {
    path: '/assign-target-edit',
    component: lazy( () => import( 'views/production/operation/assignTarget/form/AssignTargetEditForm' ) )
  },
  {
    path: '/assign-target-details',
    component: lazy( () => import( 'views/production/operation/assignTarget/details/AssignTargetDetails' ) )
  }
];
