/*
     Title: Wash API
     Description: Wash API
     Author: Iqbal Hossain
     Date: 12-February-2022
     Modified: 12-February-2022
*/

export const WASH_API = {
  root: '/api/wash',
  fetch_all: 'api/wash/fetch-all',
  fetch_by_query: `/api/wash/fetch-by-query`,
  fetch_by_id: `/api/wash/fetch-by-id`,
  fetch_by_master_id: `/api/production/Washing/GetDetailsByMaster`,

  fetch_send_wash_item_by_processid: `/api/production/Washing/GetAll`,

  add: `/api/production/Washing/AddNew`,
  update: `/api/production/Washing/Edit`,
  get_by_range: `/api/wash/get-range`
};
