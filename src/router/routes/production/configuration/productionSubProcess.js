/**
 * Title: PProduction Sub Process Routes
 * Description: Production Sub Process Routes
 * Author: Nasir Ahmed
 * Date: 07-February-2022
 * Modified: 07-February-2022
 **/

import { lazy } from 'react';

export const productionSubProcessRoute = [
  {
    path: '/production-sub-process',
    exact: true,
    component: lazy( () => import( 'views/production/configuration/productionSubProcess/list/ProductionSubProcessList' ) )
  }
];
