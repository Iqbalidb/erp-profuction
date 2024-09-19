/*
     Title: Operator API
     Description: Operator API
     Author: Alamgir Kabir
     Date: 13-December-2022
     Modified: 13-December-2022
*/
export const OPERATOR_API = {
  fetch_by_query: `api/production/Operators/GetAll`,
  fetch_all: `api/production/Operators/GetAll?status=${true}`,
  fetch_all_inactive: `api/production/Operators/GetAll?status=${false}`,
  fetch_by_id: `api/production/Operators/GetById`,
  fetch_operator_for_operator_group: `api/production/Operators/GetOperatorForGroup`,
  fetch_operator_by_operator_group: `api/production/Operators/GetOperatorByGroup`,
  update: `api/production/Operators/Edit`,
  add: `api/production/Operators/AddNew`
};
