/*
     Title:Sewing Inspection API
     Description:Sewing Inspection API
     Author: Iqbal Hossain
     Date: 29-January-2022
     Modified: 29-January-2022
*/

export const SEWING_INSPECTION_API = {
  root: '/api/sewing-inspection',
  fetch_all: 'api/sewing-inspection/fetch-all',
  fetch_todays: status => `/api/production/SewingInspection/GetAll?status=${status}`,
  fetch_previous: status => `/api/production/SewingInspection/GetAll?status=${status}`,
  fetch_by_query: `/api/sewing-inspection/fetch-by-query`,
  fetch_by_id: `/api/sewing-inspection/fetch-by-id`,
  fetch_by_master_id: `/api/production/SewingInspection/GetDetailsByMaster`,
  add: `/api/production/SewingInspection/AddNew`,
  update: `/api/production/SewingInspection/Edit`
};
