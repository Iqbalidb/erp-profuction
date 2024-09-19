/*
     Title: Zone API
     Description: Zone API
     Author: Iqbal Hossain
     Date: 09-January-2022
     Modified: 09-January-2022
*/

export const ZONE_API = {
  root: '/api/zone',
  fetch_all_active: 'api/production/Zones/GetByStatus?status=true',
  fetch_all_inactive: 'api/production/Zones/GetByStatus?status=false',
  fetch_all: '/api/production/Zones/GetAll',
  fetch_by_query: `/api/production/Zones/GetAll`,
  fetch_by_id: `/api/production/Zones/GetById`,
  fetch_zone_by_floor_and_production_process_id: ( floorId, productionProcessId ) => `/api/production/Zones/GetZone/Floor/${floorId}/ProductionProcess/${productionProcessId}`,
  add: `/api/production/Zones/AddNew`,
  update: `/api/production/Zones/Edit`,
  delete: `/api/zone/delete`,
  delete_by_range: `/api/zone/delete-range`
};
/** Change Log
 * 17-Feb-2022 (Alamgir):Add Api Url
 */
