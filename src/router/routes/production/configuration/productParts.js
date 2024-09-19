/*
     Title: product Parts Route
     Description: product Parts Route
     Author: Iqbal Hossain
     Date: 05-January-2022
     Modified: 05-January-2022
*/

import { lazy } from 'react';

export const productPartsRoute = [
  {
    path: '/product-parts',
    component: lazy( () => import( 'views/production/configuration/productParts/list/ProductPartsList' ) )
  }
];
