/**
 * Title: Production Process Group API end points
 * Description:
 * Author: Nasir Ahmed
 * Date: 27-March-2022
 * Modified: 27-March-2022
 **/
export const PRODUCTION_PROCESS_GROUP_API = {
  fetch_all_active: '/api/production/ProductionProcessGroups/GetByStatus?status=true',
  fetch_by_query: `api/production/ProductionProcessGroups/GetAll`,
  add: `api/production/ProductionProcessGroups/AddNew`,
  update: `api/production/ProductionProcessGroups/Edit`,
  delete: `/api/production/ProductionProcessGroups/RemoveDetail`,
  fetch_by_id: '/api/production/ProductionProcessGroups/GetById'
};
