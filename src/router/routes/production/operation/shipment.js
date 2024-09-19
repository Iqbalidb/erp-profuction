/*
     Title: Shipment Route
     Description: Shipment Route
     Author: Iqbal Hossain
     Date: 05-January-2022
     Modified: 05-January-2022
*/

import { lazy } from 'react';

export const shipmentRoute = [
  {
    path: '/shipment',
    component: lazy( () => import( 'views/production/operation/shipment/list/ShipmentList' ) )
  },
  {
    path: '/shipment-assign-to-passed',
    component: lazy( () => import( 'views/production/operation/shipment/form/ShipmentAddForm' ) )
  }
];
