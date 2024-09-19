/*
     Title: Sewing Inspection Route
     Description: Sewing Inspection Route
     Author: Iqbal Hossain
     Date: 05-January-2022
     Modified: 05-January-2022
*/

import { lazy } from 'react';

export const sewingInspectionRoute = [
  {
    path: '/sewing-inspection',
    component: lazy( () => import( 'views/production/operation/sewingInspection/list/SewingInspectionList' ) )
  },
  {
    path: '/sewing-inspection-new',
    component: lazy( () => import( 'views/production/operation/sewingInspection/form/SewingInspectionAddForm' ) )
  },
  {
    path: '/sewing-inspection-edit',
    component: lazy( () => import( 'views/production/operation/sewingInspection/form/SewingInspectionEditForm' ) )
  },
  {
    path: '/sewing-inspection-details',
    component: lazy( () => import( 'views/production/operation/sewingInspection/details/SewingInspectionDetails' ) )
  }
];
