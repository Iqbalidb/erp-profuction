/*
     Title: Zone Group Route
     Description: Zone Group Route
     Author: Alamgir Kabir
     Date: 29-March-2022
     Modified: 29-March-2022
*/

import { lazy } from 'react';

export const zoneGroupRoute = [
  {
    path: '/zone-group',
    exact: true,
    component: lazy( () => import( 'views/production/configuration/zoneGroup/list/ZoneGroupList' ) )
  },
  {
    path: '/zone-group-create',
    exact: true,
    component: lazy( () => import( 'views/production/configuration/zoneGroup/form/ZoneGroupAddForm Modified' ) )
  },
  {
    path: '/zone-group-edit',
    exact: true,
    component: lazy( () => import( 'views/production/configuration/zoneGroup/form/ZoneGroupEditFormModified' ) )
  },
  {
    path: '/zone-group-details',
    exact: true,
    component: lazy( () => import( 'views/production/configuration/zoneGroup/details/ZoneGroupDetails' ) )
  }
];
