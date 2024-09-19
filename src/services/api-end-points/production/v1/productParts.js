/*
     Title: Product Parts API
     Description: Product Parts API
     Author: Nasir Ahmed
     Date: 09-January-2022
     Modified: 07-February-2022
*/

export const PRODUCT_PARTS_API = {
  fetch_all: 'api/production/ProductParts/GetAll',
  fetch_all_active: '/api/production/ProductParts/GetByStatus?status=true',
  fetch_all_inactive: '/api/production/ProductParts/GetByStatus?status=false',
  fetch_by_query: `/api/production/ProductParts/GetAll`,
  fetch_by_id: `/api/production/ProductParts/GetById`,
  add: `/api/production/ProductParts/AddNew`,
  update: `/api/production/ProductParts/Edit`,
  delete: `/apiproduction/ProductParts`,
  delete_by_range: `/api/production/ProductParts`
};

/**
 * 07-Feb-2022 (nasir) : Routes change
 **/
