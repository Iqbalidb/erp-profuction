/**
 * Title: API End points for Critical Process
 * Description: API End points for Critical Process
 * Author: Nasir Ahmed
 * Date: 10-January-2022
 * Modified: 10-January-2022
 **/
export const CRITICAL_PROCESS_API = {

  fetch_all: 'api/production/CriticalProcesses/GetAll',
  fetch_all_active: 'api/production/CriticalProcesses/GetAll?status=true',
  fetch_by_query: `/api/production/CriticalProcesses/GetAll`,
  fetch_by_id: `/api/production/CriticalProcesses/GetById`,
  add: `/api/production/CriticalProcesses/AddNew`,
  update: `/api/production/CriticalProcesses/Edit`,
  delete: `/api/production/CriticalProcesses/delete`,
  delete_by_range: `/api/production/CriticalProcesses/delete-range`
};
