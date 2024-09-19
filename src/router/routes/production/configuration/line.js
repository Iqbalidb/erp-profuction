/**
 * Title: Line Routes
 * Description: Route navigation for Line routes
 * Author: Nasir Ahmed
 * Date: 20-November-2021
 * Modified: 20-November-2021
 */

import { lazy } from 'react';

export const lineRoute = [
  {
    path: '/line',
    exact: true,
    component: lazy( () => import( 'views/production/configuration/line/list/LineList' ) )
  },
  {
    path: '/line-new',

    component: lazy( () => import( 'views/production/configuration/line/form/LineForm' ) )
  },
  {
    path: '/line-details',

    component: lazy( () => import( 'views/production/configuration/line/details/LineDetails' ) )
  }
];
