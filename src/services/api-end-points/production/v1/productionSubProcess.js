/**
 * Title: Production Sub process end points
 * Description: Production Sub process end points
 * Author: Nasir Ahmed
 * Date: 07-February-2022
 * Modified: 07-February-2022
 **/

export const PRODUCTION_SUB_PROCESS_API = {
  fetch_all_active: '/api/production/ProductionSubProcess/GetByStatus?status=true',
  fetch_all_inactive: '/api/production/ProductionSubProcess/GetByStatus?status=false',
  fetch_by_query: `api/production/ProductionSubProcess/GetAll`,
  fetch_by_status: ( status, processType ) => `/api/production/ProductionSubProcess/GetByStatus?status=${status}&processType=${processType}`,

  fetch_production_sub_process_for_external_process: status => `/api/production/ProductionSubProcess/GetForExternalProcess?status=${status}`,
  fetch_by_id: `api/production/ProductionSubProcess/GetById`,
  fetch_by_parent_id: `api/production/ProductionSubProcess/GetByParentId`,
  fetch_by_current_process_and_style_id: ( currentProcessId, styleId ) => `/api/production/ProductionSubProcess/GetBy/CurrentProcess/${currentProcessId}/Style/${styleId}`,
  fetch_next_process_by_current_process_and_style_id: ( currentProcessId, styleId ) => `/api/production/ProductionSubProcess/GetNextOne/CurrentProcess/${currentProcessId}/Style/${styleId}`,
  add: `api/production/ProductionSubProcess/AddNew`,
  update: `api/production/ProductionSubProcess/Edit`
};
