/*
     Title: Production Process API
     Description: Production Process API
     Author: Iqbal Hossain
     Date: 09-January-2022
     Modified: 07-February-2022
*/

export const PRODUCTION_PROCESS_API = {
  fetch_all_active: '/api/production/ProductionProcess/GetByStatus?status=true',
  fetch_all_inactive: '/api/production/ProductionProcess/GetByStatus?status=false',
  fetch_by_query: `api/production/ProductionProcess/GetAll`,
  fetch_by_id: `api/production/ProductionProcess/GetById`,
  add: `api/production/ProductionProcess/AddNew`,
  update: `api/production/ProductionProcess/Edit`,
  delete: `/api/production-process/delete`,
  delete_by_range: `/api/production-process/delete-range`
};

/**
 * 07-Feb-2022 (nasir) : Routes change
 **/
