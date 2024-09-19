import { lazy } from 'react';

/*
     Title: Operator Routes
     Description: Operator Routes
     Author: Alamgir Kabir
     Date: 15-December-2022
     Modified: 15-December-2022
*/
export const operatorGroupRoute = [
  {
    path: '/operator-group',
    exact: true,
    component: lazy( () => import( 'views/production/configuration/operatorGroup/list/OperatorGroupList' ) )
  },
  {
    path: '/new-operator-group',
    exact: true,
    component: lazy( () => import( 'views/production/configuration/operatorGroup/form/OperatorGroupAddForm' ) )
  }
];
