/*
     Title: Assign Input Table Route
     Description: Assign Input Table Route
     Author: Iqbal Hossain
     Date: 05-January-2022
     Modified: 05-January-2022
*/

import { lazy } from 'react';

export const assignInputTableRoute = [
  {
    path: '/assign-input-table',
    component: lazy( () => import( 'views/production/operation/assignInputTable/list/AssignInputTableList' ) )
  },
  {
    path: '/assign-input-table-new',
    component: lazy( () => import( 'views/production/operation/assignInputTable/form/AssignInputTableAddForm' ) )
  },
  {
    path: '/assign-input-table-details',
    component: lazy( () => import( 'views/production/operation/assignInputTable/details/AssignInputTableDetails' ) )
  }
];
