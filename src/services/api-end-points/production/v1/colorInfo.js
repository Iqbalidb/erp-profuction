/*
     Title: Color Info API
     Description: Color Info API
     Author: Alamgir Kabir
     Date: 09-November-2022
     Modified: 09-November-2022
*/
export const COLOR_INFO_API = {
  fetch_color_by_line_and_style_id: ( lineId, styleId ) => `/api/production/ColorInfo/GetColorInLine/${lineId}/Style/${styleId}`,
  fetch_color_by_cutting_id: cuttingId => `/api/production/ColorInfo/GetColorInBundle/Cutting/${cuttingId}`,
  fetch_color_in_relaxation_by_style_and_purchase_order_id: ( styleId, purchaseOrderId ) => `/api/production/ColorInfo/GetColorInRelaxation/Style/${styleId}/PurchaseOrderId/${purchaseOrderId}`
};
