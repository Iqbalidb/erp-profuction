/**
 * Title: sampleType Routes
 * Description: Route navigation for sampleType routes
 * Author: Iqbal Hossain
 * Date: 06-January-2022
 * Modified: 06-January-2022
 */

import { lazy } from 'react';

export const sampleTypeRoute = [
  {
    path: '/sample-type',
    exact: true,
    component: lazy( () => import( 'views/production/configuration/typeManagement/sampleType/list/SampleTypeList' ) )
  }
];
