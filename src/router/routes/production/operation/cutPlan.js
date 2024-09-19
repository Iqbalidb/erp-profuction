/*
     Title: Cut Plan Route
     Description: Cut Plan Route
     Author: Iqbal Hossain
     Date: 05-January-2022
     Modified: 05-January-2022
*/

import { lazy } from 'react';

export const cutPlanRoute = [
  {
    path: '/cut-plan',
    component: lazy( () => import( 'views/production/operation/cutPlan/list/CutPlanList' ) )
  },
  {
    path: '/cut-plan-new',
    component: lazy( () => import( 'views/production/operation/cutPlan/form/CutPlanAddForm' ) )
  },
  {
    path: '/cut-plan-confirm',
    component: lazy( () => import( 'views/production/operation/cutPlan/form/CutPlanConfirmForm' ) )
  },
  {
    path: '/cut-plan-details',
    component: lazy( () => import( 'views/production/operation/cutPlan/details/CutPlanDetails' ) )
  }
];
