/*
     Title: Zone Group API end points
     Description: Zone Group API end points
     Author: Alamgir Kabir
     Date: 30-March-2022
     Modified: 30-March-2022
*/
export const ZONE_GROUP_API = {
  fetch_by_query: `api/production/ZoneGroups/GetAll`,
  fetch_all_active: 'api/production/ZoneGroups/GetByStatus?status=true',
  add: `api/production/ZoneGroups/AddNew`,
  update: `api/production/ZoneGroups/Edit`,
  fetch_by_id: `api/production/ZoneGroups/GetById`
};
