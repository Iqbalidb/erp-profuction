/*
     Title: Production Parts Group Route
     Description: Production Parts Group Route
     Author: Alamgir Kabir
     Date: 11-May-2022
     Modified: 11-May-2022
*/

import { lazy } from 'react';

export const productPartsGroupRoute = [
  {
    path: '/product-parts-group',
    component: lazy( () => import( 'views/production/configuration/productPartsGroup/list/ProductPartsGroupList' ) )
  },
  {
    path: '/product-parts-group-new',
    component: lazy( () => import( 'views/production/configuration/productPartsGroup/form/ProductPartsGroupAddForm' ) )
  },
  {
    path: '/product-parts-group-edit',
    component: lazy( () => import( 'views/production/configuration/productPartsGroup/form/ProductPartsGroupEditForm' ) )
  },
  {
    path: '/product-parts-group-details',
    component: lazy( () => import( 'views/production/configuration/productPartsGroup/details/ProductPartsGroupDetails' ) )
  }
];
