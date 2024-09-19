/*
     Title: Relaxation Route
     Description: Relaxation Route
     Author: Alamgir Kabir
     Date: 27-March-2023
     Modified: 27-March-2023
*/
import { lazy } from 'react';

export const requisitionRoute = [
  {
    path: '/requisition-list',
    component: lazy( () => import( 'views/production/operation/requisition/list/RequisitionList' ) )
  },
  {
    path: '/requisition-new',
    component: lazy( () => import( 'views/production/operation/requisition/form/RequisitionAddForm' ) )
  },
  {
    path: '/requisition-edit',
    component: lazy( () => import( 'views/production/operation/requisition/form/RequisitionEditForm' ) )
  },
  {
    path: '/requisition-receive',
    component: lazy( () => import( 'views/production/operation/requisition/form/RequisitionReceiveForm' ) )
  },
  {
    path: '/requisition-details',
    component: lazy( () => import( 'views/production/operation/requisition/details/RequisitionDetails' ) )
  }
];
