/**
 * Title: Purchase orders api end points
 * Description:
 * Author: Nasir Ahmed
 * Date: 09-April-2022
 * Modified: 09-April-2022
 **/

export const PURCHASE_ORDERS_API = {
  fetch_PO_with_buyer_and_style: ( buyerId, styleId ) => `/api/merchandising/buyers/${buyerId}/styles/${styleId}/purchaseOrders`,
  fetch_used_po_in_requisition_by_style_id: styleId => `/api/production/PurchaseOrderDetails/GetPurchaseOrderUsedInRequisition?styleId=${styleId}`
};
