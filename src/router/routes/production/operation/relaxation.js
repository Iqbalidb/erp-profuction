/*
     Title: Relaxation Route
     Description: Relaxation Route
     Author: Alamgir Kabir
     Date: 10-May-2023
     Modified: 10-May-2023
*/
import { lazy } from 'react';

export const relaxationRoute = [
  {
    path: '/relaxation-list',
    component: lazy( () => import( 'views/production/operation/relaxation/list/RelaxationList' ) )
  },
  {
    path: '/relaxation-new',
    component: lazy( () => import( 'views/production/operation/relaxation/form/RelaxationAddForm' ) )
  },
  {
    path: '/relaxation-complete',
    component: lazy( () => import( 'views/production/operation/relaxation/form/RelaxationCompleteForm' ) )
  },
  {
    path: '/relaxation-details',
    component: lazy( () => import( 'views/production/operation/relaxation/details/RelaxationDetailsForm' ) )
  }
];
