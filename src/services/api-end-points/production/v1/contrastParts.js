/**
 * Title: API End points for Contrast Parts
 * Description: API End points for Contrast Parts
 * Author: Nasir Ahmed
 * Date: 05-July-2022
 * Modified: 10-July-2022
 **/

export const CONTRAST_PARTS_API = {
  fetch_all: 'api/production/ContrastParts/GetAll',
  fetch_all_balance: 'api/production/ContrastParts/GetAllBalance',
  fetch_by_query: `/api/production/ContrastParts/GetAll`,
  fetch_by_id: `/api/production/ContrastParts/GetById`,
  fetch_previous_quantity: ( poDetailId, colorId, sizeId, productPartsId ) => `/api/production/ContrastParts/GetPreviousQuantity/PurchaseOrderDetails/${poDetailId}/Color/${colorId}/Size/${sizeId}/ProductParts/${productPartsId}`,
  create: `/api/production/ContrastParts/AddNew`
};
