import { lazy } from 'react';

/*
     Title: Style Wise Production Process Group Route
     Description: Style Wise Production Process Group Route
     Author: Alamgir Kabir
     Date: 31-July-2022
     Modified: 31-July-2022
*/
export const styleWiseProductionProcessGroupRoute = [
  {
    path: '/style-wise-production-process-group',
    exact: true,
    component: lazy( () => import( 'views/production/configuration/styleWiseProductionProcessGroup/list/StyleWiseProductionProcessGroupList' ) )
  }
];
