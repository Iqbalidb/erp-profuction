/*
     Title: Wash Receive Api
     Description: Wash Receive Api
     Author: Alamgir Kabir
     Date: 05-February-2023
     Modified: 05-February-2023
*/

export const WASH_RECEIVE_API = {
  root: '/api/wash',
  fetch_all: 'api/wash/fetch-all',
  fetch_by_query: `/api/wash/fetch-by-query`,
  fetch_by_id: `/api/wash/fetch-by-id`,
  fetch_wash_receive_by_master_id: `/api/production/WashingReceive/GetDetailsByMaster`,
  fetch_receive_wash_item_by_processid: `/api/production/WashingReceive/GetAll`,
  add: `/api/production/WashingReceive/AddNew`,
  update: `/api/production/WashingReceive/Edit`,
  pass: `/api/production/WashingReceive/Pass`,
  get_by_range: `/api/wash/get-range`
};
