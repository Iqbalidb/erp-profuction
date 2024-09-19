/*
     Title: FLOOR_API
     Description: FLOOR_API
     Author: Alamgir Kabir
     Date: 14-February-2022
     Modified: 14-February-2022
*/

export const FLOOR_API = {
  fetch_all_active: '/api/production/Floors/GetByStatus?status=true',
  fetch_by_query: '/api/production/Floors/GetAll',
  fetch_by_id: '/api/production/Floors/GetById',
  add: '/api/production/Floors/AddNew',
  update: '/api/production/Floors/Edit'
};
