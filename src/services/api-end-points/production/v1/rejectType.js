/*
     Title: production/RejectTypes API
     Description: production/RejectTypes API
     Author: Iqbal Hossain
     Date: 10-January-2022
     Modified: 10-January-2022
*/

export const REJECT_TYPE_API = {
  fetch_all: 'api/production/RejectTypes/GetAll',
  fetch_by_query: `/api/production/RejectTypes/GetAll`,
  fetch_by_id: `/api/production/RejectTypes/GetById`,
  add: `/api/production/RejectTypes/AddNew`,
  update: `/api/production/RejectTypes/Edit`,
  delete: `/api/production/RejectTypes/delete`,
  delete_by_range: `/api/production/RejectTypes/delete-range`
};

/** Change Log
 * 08-Jan-2022(Iqbal): Create (root, fetch_by_query, fetch_by_id, add, update, delete, delete_by_range )
 */
