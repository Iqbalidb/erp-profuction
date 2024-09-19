/**
 * Title: Entry file for all routes for production reporting module
 * Description: All routes for production reporting modue are imported here and from here all files are exported as item of routes array
 * Author: Nasir Ahmed
 * Date: 21-November-2021
 * Modified: 13-Feb-2022
 */

import { criticalProcessRoute } from './criticalProcess';
import { floorRoute } from './floor';
import { lineRoute } from './line';
import { operatorRoute } from './operator';
import { operatorGroupRoute } from './operatorGroup';
import { partGroupsRoute } from './partGroups';
import { productionProcessRoute } from './productionProcess';
import { productionProcessGroupRoute } from './productionProcessGroup';
import { productionSubProcessRoute } from './productionSubProcess';
import { productPartsRoute } from './productParts';
import { productPartsGroupRoute } from './productPartsGroup';
import { styleWiseProductionProcessGroupRoute } from './styleWiseProductionProcessGroup';
import { timeSlotRoute } from './timeSlots';
import { incompleteTypeRoute } from './typeManagement/incompleteType';
import { rejectTypeRoute } from './typeManagement/rejectType';
import { sampleTypeRoute } from './typeManagement/sampleType';
import { zoneRoute } from './zone';
import { zoneGroupRoute } from './zoneGroup';

export const configurationRoutes = [
  ...lineRoute,
  ...zoneRoute,
  ...productionProcessRoute,
  ...productionSubProcessRoute,
  ...productPartsRoute,
  ...criticalProcessRoute,
  ...incompleteTypeRoute,
  ...rejectTypeRoute,
  ...sampleTypeRoute,
  ...floorRoute,
  ...timeSlotRoute,
  ...productionProcessGroupRoute,
  ...productPartsGroupRoute,
  ...zoneGroupRoute,
  ...partGroupsRoute,
  ...styleWiseProductionProcessGroupRoute,
  ...operatorRoute,
  ...operatorGroupRoute
];

/**
 * 06-Dec-2021(Nasir) => change 'item' with'style-category',
 * 06-Jan-2022(Iqbal) => change 'typeManagement, time, criticalProcess',
 * 07-Feb-2022(nasir) => add production sub process route,
 * 13-Feb-2022(nasir) => time route removed
 **/
