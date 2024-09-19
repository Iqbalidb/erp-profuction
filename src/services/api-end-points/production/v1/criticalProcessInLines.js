/*
     Title: Api For Critical Process Lines
     Description: Api For Critical Process Lines
     Author: Ashraful Islam
     Date: 25-October-2022
     Modified: 25-October-2022
*/

export const CRITICAL_PROCESS_LINES_API = {
  add: '/api/production/CriticalProcessInLines/AddNew',
  fetch_by_line: lineId => `/api/production/CriticalProcessInLines/GetByLine?lineId=${lineId}`
};
