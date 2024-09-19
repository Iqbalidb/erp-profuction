/*
     Title: Transfer Store Api
     Description: Transfer Store Api
     Author: Alamgir Kabir
     Date: 22-December-2022
     Modified: 22-December-2022
*/
export const TRANSFER_STORE_API = {
  fetch_assigned_quantity_by_buyer_style_production_process_id: ( buyerId, styleId, productionProcessId ) => `/api/production/TransfarStore/GetAssignedQuantity/Buyer/${buyerId}/Style/${styleId}/ProductionProcess/${productionProcessId}`
};
