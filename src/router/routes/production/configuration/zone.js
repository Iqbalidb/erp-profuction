/**
 * Title: Zone Routes
 * Description: Route navigation for Zone
 * Author: Nasir Ahmed
 * Date: 21-November-2021
 * Modified: 21-November-2021
 */

import { lazy } from 'react';

export const zoneRoute = [
  {
    path: '/zone',
    exact: true,
    component: lazy( () => import( 'views/production/configuration/zone/list/ZoneList' ) )
  },
  {
    path: '/zone-new',

    component: lazy( () => import( 'views/production/configuration/zone/form/ZoneForm' ) )
  },
  {
    path: '/zone-details',

    component: lazy( () => import( 'views/production/configuration/zone/details/ZoneDetails' ) )
  }
];
