/*
     Title: sewing-out API
     Description: sewing-out API
     Author: Alamgir Kabir
     Date: 28-February-2022
     Modified: 28-February-2022
*/
export const SEWING_OUT_API = {
  root: '/api/sewing-out',
  fetch_all: 'api/production/sewing-out/fetch-all',
  fetch_todays: status => `/api/production/SewingOut/GetAll?status=${status}`,
  fetch_previous: status => `/api/production/SewingOut/GetAll?status=${status}`,
  fetch_by_query: `/api/sewing-out/fetch-by-query`,
  fetch_by_masterId: masterId => `/api/production/SewingOut/GetDetailsByMaster?masterId=${masterId}`,
  add: `/api/production/SewingOut/AddNew`,
  update: `/api/production/SewingOut/Edit`,
  pass_sewing_out: `/api/production/SewingOut/Pass`,
  get_by_range: `/api/production/sewing-out/get-range`
};
