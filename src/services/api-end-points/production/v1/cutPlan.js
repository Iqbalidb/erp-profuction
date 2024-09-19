/*
     Title: Cut Plan API
     Description: Cut Plan API
     Author: Iqbal Hossain
     Date: 18-January-2022
     Modified: 18-January-2022
*/

export const CUT_PLAN_API = {
  root: '/api/cut-plan',
  fetch_all: 'api/cut-plan/fetch-all',
  fetch_by_query: `/api/production/CutPlans/GetAll`,
  fetch_by_id: `/api/production/CutPlans/GetCutByCutPlan`,
  fetch_cut_plan_by_cut_plan: `/api/production/CutPlans/GetCutByCutPlan`,
  fetch_cut_plan_no_by_style: `/api/production/CutPlans/GetCutPlanNoByStyle`,
  fetch_cut_plan_no_by_style_id: styleId => `/api/production/CutPlans/GetCutPlanInBundle/Style/${styleId}`,

  // fetch_cut_plan_no_by_style: (id, styleNo) => `/api/production/CutPlans/GetCutPlanNoByStyle/${id}/styleNo/${styleNo}`,

  add: `/api/production/CutPlans/AddNew`,
  update: `/api/cut-plan/update`,
  delete: `/api/cut-plan/delete`,
  delete_by_range: `/api/cut-plan/delete-range`
};
