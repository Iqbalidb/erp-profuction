/*
     Title: Style Use Info API
     Description: Style Use Info API
     Author: Alamgir Kabir
     Date: 18-July-2022
     Modified: 18-July-2022
*/
export const STYLE_USE_INFO_API = {
  fetch_style_use_info: `/api/production/StyleUseInfo/GetStylesInProductPartsGroup`,
  fetch_style_use_info_by_line_and_buyer_id: ( lineId, buyerId ) => `/api/production/StyleUseInfo/GetStylesFromInput/Line/${lineId}/Buyer/${buyerId}`,
  fetch_style_use_info_by_productionProcessId_and_buyer_id: ( productionProcessId, buyerId ) => `/api/production/StyleUseInfo/GetStylesForFinishing/ProductionProcess/${productionProcessId}/Buyer/${buyerId}`,
  fetch_style_use_info_in_style_wise_production_process_group: `/api/production/StyleUseInfo/GetStylesInProductionProcessGroup`,
  fetch_style_use_bundle_info: `/api/production/StyleUseInfo/GetStylesUsedInBundle`
};
