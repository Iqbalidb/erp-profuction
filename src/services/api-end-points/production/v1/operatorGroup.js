/*
     Title: Operator Group API
     Description: Operator Group API
     Author: Alamgir Kabir
     Date: 18-December-2022
     Modified: 18-December-2022
*/
export const OPERATOR_GROUP_API = {
  fetch_all_operator_group: `/api/production/OperatorGroups/GetAll`,
  fetch_inactive_operator_group: `/api/production/OperatorGroups/GetAll?status=false`,
  add: `api/production/OperatorGroups/AddNew`,
  update: `api/production/OperatorGroups/Edit`
};
