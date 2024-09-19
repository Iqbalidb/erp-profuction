/*
     Title: Part Groups Route
     Description: Part Groups Route
     Author: Alamgir Kabir
     Date: 02-July-2022
     Modified: 02-July-2022
*/

import { lazy } from 'react';

export const partGroupsRoute = [
  {
    path: '/part-groups',
    component: lazy( () => import( 'views/production/configuration/partGroups/list/PartGroupsList' ) )
  }
];
