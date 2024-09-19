/*
     Title: Entry File for Routes
     Description: Entry File for Routes
     Author: Iqbal Hossain
     Date: 21-November-2021
     Modified: 21-November-2021
*/

import { configurationRoutes } from './configuration';
import { operationRoutes } from './operation';

export const productionRoutes = [...configurationRoutes, ...operationRoutes];
