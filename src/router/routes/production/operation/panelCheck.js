/*
     Title: Panel Cehck Route
     Description: Panel Cehck Route
     Author: Iqbal Hossain
     Date: 05-January-2022
     Modified: 05-January-2022
*/

import { lazy } from 'react';

export const panelCheckRoute = [
  {
    path: '/panel-check',
    component: lazy( () => import( 'views/production/operation/panelCheck/list/PanelCheckList' ) )
  },
  {
    path: '/panel-check-new',
    component: lazy( () => import( 'views/production/operation/panelCheck/form/PanelCheckAddForm' ) )
  }
];
