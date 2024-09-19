/*
     Title:  Time Slot Routes
     Description:  Time Slot Routes
     Author: Alamgir Kabir
     Date: 12-February-2022
     Modified: 12-February-2022
*/

import { lazy } from 'react';

export const timeSlotRoute = [
  {
    path: '/time-slots',
    exact: true,
    component: lazy( () => import( 'views/production/configuration/timeSlots/list/TimeSlotList' ) )
  }
];
