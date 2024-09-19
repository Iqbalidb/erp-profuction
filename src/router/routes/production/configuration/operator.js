import { lazy } from 'react';

/*
     Title: Operator Routes
     Description: Operator Routes
     Author: Alamgir Kabir
     Date: 12-December-2022
     Modified: 12-December-2022
*/
export const operatorRoute = [
  {
    path: '/operator',
    exact: true,
    component: lazy( () => import( 'views/production/configuration/operator/list/OperatorList' ) )
  },
  {
    path: '/new-operator',
    exact: true,
    component: lazy( () => import( 'views/production/configuration/operator/form/OperatorAddForm' ) )
  }
];
