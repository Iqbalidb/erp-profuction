/*
     Title: LINe API
     Description: LINe API
     Author: Iqbal Hossain
     Date: 06-January-2022
     Modified: 06-January-2022
*/

export const LINE_API = {
  root: '/api/line',
  fetch_all_active: 'api/production/Lines/GetByStatus?status=true',
  fetch_all_inactive: 'api/production/Lines/GetByStatus?status=false',
  fetch_all: 'api/line/fetch-all',
  fetch_by_query: `/api/production/Lines/GetAll`,
  fetch_by_id: `/api/production/Lines/GetById`,
  fetch_line_by_floor_and_production_process_id: ( floorId, productionProcessId ) => `/api/production/Lines/GetLine/Floor/${floorId}/ProductionProcess/${productionProcessId}`,
  fetch_line_by_zone_group_id: zoneGroupId => `/api/production/Lines/GetLine/ZoneGroup/${zoneGroupId}`,
  add: `/api/production/Lines/AddNew`,
  update: `/api/production/Lines/Edit`,
  delete: `/api/line/delete`,
  delete_by_range: `/api/line/delete-range`
};

/** Change Log
 * 08-Jan-2022(Iqbal): Create (root, fetch_by_query, fetch_by_id, add, update, delete, delete_by_range )
 * 16-Feb-2022(Alamgir): Api Integration
 */
