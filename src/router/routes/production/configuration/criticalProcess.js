/**
 * Title: Critical Process Routes
 * Description: Route navigation for Critical Process
 * Author: Iqbal Hossain
 * Date: 06-January-2022
 * Modified: 06-January-2022
 */

import { lazy } from 'react';

export const criticalProcessRoute = [
  {
    path: '/critical-process',
    exact: true,
    component: lazy( () => import( 'views/production/configuration/criticalProcess/list/CriticalProcessList' ) )
  }
];
