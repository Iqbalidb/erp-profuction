/**
 * Title: Purchase order details end point (s)
 * Description:
 * Author: Nasir Ahmed
 * Date: 10-April-2022
 * Modified: 10-April-2022
 **/

export const PURCHASE_ORDER_DETAILS_API = {
  fetch_size_color_ration: ( orderId, styleId ) => `/api/production/PurchaseOrderDetails/Get/PurchaseOrder/${orderId}/Style/${styleId}`,
  get_previous_quantity: ( orderId, colorId, partGroupId ) => `/api/production/PurchaseOrderDetails/GetPreviousCutQuantity/PurchaseOrder/${orderId}/Color/${colorId}/PartGroup/${partGroupId}`
};
