/**
 * Title: Production Process Group Route
 * Description:
 * Author: Nasir Ahmed
 * Date: 23-March-2022
 * Modified: 23-March-2022
 */

import { lazy } from 'react';

export const productionProcessGroupRoute = [
  {
    path: '/production-process-group',
    exact: true,
    component: lazy( () => import( 'views/production/configuration/productionProcessGroup/list/ProductionProcessGroupList' ) )
  },
  {
    path: '/production-process-group/create',
    exact: true,
    component: lazy( () => import( 'views/production/configuration/productionProcessGroup/form/ProductionProcessGroupForm' ) )
  },
  {
    path: '/production-process-group/edit',
    exact: true,
    component: lazy( () => import( 'views/production/configuration/productionProcessGroup/form/ProductionProcessGroupEditForm' ) )
  },
  {
    path: '/production-process-group-details',
    exact: true,
    component: lazy( () => import( 'views/production/configuration/productionProcessGroup/details/ProductionProcessGroupDetails' ) )
  }
];
