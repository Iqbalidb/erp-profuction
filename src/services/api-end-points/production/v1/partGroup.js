/*
     Title: Part Group APi
     Description: Part Group APi
     Author: Alamgir Kabir
     Date: 02-July-2022
     Modified: 02-July-2022
*/
export const PART_GROUPS_API = {
  fetch_all: '/api/production/PartGroups/GetAll',
  fetch_all_active: '/api/production/PartGroups/GetByStatus?status=true',
  fetch_all_inactive: '/api/production/PartGroups/GetByStatus?status=false',
  fetch_by_query: `/api/production/PartGroups/GetAll`,
  fetch_by_id: `/api/production/PartGroups/GetById`,
  fetch_part_group_in_relaxation_by_style_and_purchase_order_id: ( styleId, purchaseOrderId ) => `/api/production/PartGroups/GetPartGroupInRelaxation/Style/${styleId}/PurchaseOrderId/${purchaseOrderId}`,
  add: `/api/production/PartGroups/AddNew`,
  update: `/api/production/PartGroups/Edit`
};
