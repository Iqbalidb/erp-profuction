import { productionPartsGroup } from 'views/production//configuration/productPartsGroup/store/reducers';
import { criticalProcessReducer } from 'views/production/configuration/criticalProcess/store/reducers';
import { floorReducer } from 'views/production/configuration/floor/store/reducers';
import { lineReducer } from 'views/production/configuration/line/store/reducers';
import { OperatorReducer } from 'views/production/configuration/operator/store/reducers';
import { OperatorGroupReducer } from 'views/production/configuration/operatorGroup/store/reducers';
import { partGroupReducer } from 'views/production/configuration/partGroups/store/reducers';
import { productPartReducer } from 'views/production/configuration/productParts/store/reducers';
import { productionProcessReducer } from 'views/production/configuration/productionProcess/store/reducers';
import { productionProcessGroupReducer } from 'views/production/configuration/productionProcessGroup/store/reducers';
import { productionSubProcessReducer } from 'views/production/configuration/productionSubProcess/store/reducer';
import { styleWiseProductionProcessGroupReducer } from 'views/production/configuration/styleWiseProductionProcessGroup/store/reducers';
import { timeSlotReducer } from 'views/production/configuration/timeSlots/store/reducers';
import { incompleteTypeReducer } from 'views/production/configuration/typeManagement/incompleteType/store/reducers';
import { rejectTypeReducer } from 'views/production/configuration/typeManagement/rejectType/store/reducers';
import { sampleTypeReducer } from 'views/production/configuration/typeManagement/sampleType/store/reducers';
import { zoneReducer } from 'views/production/configuration/zone/store/reducers';
import { zoneGroupReducer } from 'views/production/configuration/zoneGroup/store/reducers';
import { assignInputTableReducer } from 'views/production/operation/assignInputTable/store/reducers';
import { assignTargetReducer } from 'views/production/operation/assignTarget/store/reducers';
import { bundleReducer } from 'views/production/operation/bundle/store/reducers';
import { cutPlanReducer } from 'views/production/operation/cutPlan/store/reducers';
import { externalProcessReducer } from 'views/production/operation/externalProcess/store/reducers';
import { finishingReducer } from 'views/production/operation/finishing/store/reducers';
import { panelCheckReducer } from 'views/production/operation/panelCheck/store/reducers';
import { partsStockReducer } from 'views/production/operation/partsStock/store/reducers';
import { relaxationReducer } from 'views/production/operation/relaxation/store/reducers';
import { requisitionReducer } from 'views/production/operation/requisition/store/reducers';
import { sewingInspectionReducer } from 'views/production/operation/sewingInspection/store/reducers';
import { sewingOutReducer } from 'views/production/operation/sewingOut/store/reducers';
import { styleReducer } from 'views/production/operation/style/store/reducers';
import { washReducer } from 'views/production/operation/wash/store/reducers';
import { operatorsReducer } from '../../views/production/configuration/operator/store/reducers/index';

export const productionReducers = {
  lineReducer,
  sampleTypeReducer,
  zoneReducer,
  productPartReducer,
  productionProcessReducer,
  productionSubProcessReducer,
  criticalProcessReducer,
  rejectTypeReducer,
  incompleteTypeReducer,
  cutPlanReducer,
  panelCheckReducer,
  bundleReducer,
  externalProcessReducer,
  assignInputTableReducer,
  assignTargetReducer,
  sewingInspectionReducer,
  washReducer,
  timeSlotReducer,
  floorReducer,
  productionProcessGroupReducer,
  zoneGroupReducer,
  styleReducer,
  productionPartsGroup,
  partGroupReducer,
  partsStockReducer,
  styleWiseProductionProcessGroupReducer,
  sewingOutReducer,
  finishingReducer,
  OperatorReducer,
  OperatorGroupReducer,
  requisitionReducer,
  relaxationReducer,
  operatorsReducer
};
