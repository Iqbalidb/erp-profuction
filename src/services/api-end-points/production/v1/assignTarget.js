/*
     Title: Assign Target Table API
     Description: Assign Target Table API
     Author: Iqbal Hossain
     Date: 26-January-2022
     Modified: 26-January-2022
*/

export const ASSIGN_TARGET_API = {
  root: '/api/assign-target',
  fetch_all_todays: status => `/api/production/AssignTargets/GetAll?status=${status}`,
  fetch_all_previous: status => `/api/production/AssignTargets/GetAll?status=${status}`,
  fetch_assign_target_by_line_id_and_assign_date: `/api/production/AssignTargets/Get/Line`,
  fetch_by_query: `/api/assign-target/fetch-by-query`,
  fetch_by_id: id => `/api/production/AssignTargets/GetById?id=${id}`,
  get_by_range: `/api/assign-target/get-range`,
  post: `/api/production/AssignTargets/AddNew`,
  put: id => `/api/production/AssignTargets/Edit?id=${id}`
};
