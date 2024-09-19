/*
     Title:Assign Input Table API
     Description:Assign Input Table API
     Author: Iqbal Hossain
     Date: 26-January-2022
     Modified: 26-January-2022
*/

export const ASSIGN_INPUT_TABLE_API = {
  root: '/api/assign-input-table',
  fetch_all: 'api/assign-input-table/fetch-all',
  fetch_bundle_for_pending: ( status, currentProcessId ) => `/api/production/AssignInputTables/GetBundleForAssign?status=${status}&currentProcessId=${currentProcessId}`,
  fetch_bundle_for_assigned: status => `/api/production/AssignInputTables/GetAssignedBundle?status=${status}`,
  fetch_by_query: `/api/assign-input-table/fetch-by-query`,
  fetch_by_id: `/api/assign-input-table/fetch-by-id`,
  get_by_range: `/api/assign-input-table/get-range`,
  add: `/api/production/AssignInputTables/AddNew`
};
