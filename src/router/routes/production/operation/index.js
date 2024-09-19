/*
     Title: Entry file for all routes for production reporting module
     Description: All routes for production reporting modue are imported here and from here all files are exported as item of routes array
     Author: Iqbal Hossain
     Date: 05-January-2022
     Modified: 05-January-2022
*/
import { assignInputTableRoute } from './assignInputTable';
import { assignTargetRoute } from './assignTarget';
import { bundleRoute } from './bundl';
import { cutPlanRoute } from './cutPlan';
import { externalProcessRoute } from './externalProcess';
import { finishingRoute } from './finishing';
import { packagingRoute } from './packaging';
import { panelCheckRoute } from './panelCheck';
import { partsStockRoutes } from './partsStock';
import { relaxationRoute } from './relaxation';
import { requisitionRoute } from './requisition';
import { sewingInspectionRoute } from './sewingInspection';
import { sewingOutRoute } from './sewingOut';
import { shipmentRoute } from './shipment';
import { washRoute } from './wash';

export const operationRoutes = [
  ...cutPlanRoute,
  ...partsStockRoutes,
  ...panelCheckRoute,
  ...assignInputTableRoute,
  ...assignTargetRoute,
  ...bundleRoute,
  ...externalProcessRoute,
  ...finishingRoute,
  ...packagingRoute,
  ...sewingOutRoute,
  ...sewingInspectionRoute,
  ...shipmentRoute,
  ...washRoute,
  ...requisitionRoute,
  ...relaxationRoute
];
