/*
     Title: Cuttings API
     Description: Cuttings API
     Author: Alamgir Kabir
     Date: 28-April-2022
     Modified: 28-April-2022
*/

export const CUTTINGS_API = {
  root: '/api/cut-plan',
  fetch_cuttings_by_cut_plan: '/api/production/Cuttings/GetCuttingByCutPlan',
  fetch_cuttings_by_cut_plan_id: cutPlanId => `/api/production/Cuttings/GetCuttingInBundle/CutPlan/${cutPlanId}`,
  fetch_cuttings_details_by_cut_plan: '/api/production/Cuttings/GetCuttingDetailsByCuttingId',
  confirm: '/api/production/Cuttings/ConfirmCutByCuttingId',
  update: '/api/production/Cuttings/Edit'
};
