/**
 * Title: rejectType Routes
 * Description: Route navigation for rejectType routes
 * Author: Iqbal Hossain
 * Date: 06-January-2022
 * Modified: 06-January-2022
 */

import { lazy } from 'react';

export const rejectTypeRoute = [
  {
    path: '/reject-type',
    exact: true,
    component: lazy( () => import( 'views/production/configuration/typeManagement/rejectType/list/RejectTypeList' ) )
  }
];
