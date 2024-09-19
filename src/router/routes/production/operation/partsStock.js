/*
   Title: Parts Stock Routes
   Description: Parts Stock Routes
   Author: Nasir Ahmed
   Date: 06-July-2022
   Modified: 06-July-2022
*/
import { lazy } from 'react';

export const partsStockRoutes = [
  {
    path: '/parts-stock',
    component: lazy( () => import( 'views/production/operation/partsStock/list/PartsStockList' ) )
  },
  {
    path: '/parts-stock-new',
    component: lazy( () => import( 'views/production/operation/partsStock/forms/PartsStcokCreate' ) )
  }
];
