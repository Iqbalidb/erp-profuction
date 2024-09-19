/**
 * Title: incompleteType Routes
 * Description: Route navigation for incompleteType routes
 * Author: Iqbal Hossain
 * Date: 06-January-2022
 * Modified: 06-January-2022
 */

import { lazy } from 'react';

export const incompleteTypeRoute = [
  {
    path: '/incomplete-type',
    exact: true,
    component: lazy( () => import( 'views/production/configuration/typeManagement/incompleteType/list/IncompleteTypeList' ) )
  }
];
