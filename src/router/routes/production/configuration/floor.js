/*
     Title: Floor Route
     Description: Floor Route
     Author: Alamgir Kabir
     Date: 14-February-2022
     Modified: 14-February-2022
*/

import { lazy } from 'react';

export const floorRoute = [
  {
    path: '/floor',
    exact: true,
    component: lazy( () => import( 'views/production/configuration/floor/list/FloorList' ) )
  }
];
