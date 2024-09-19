/*
     Title:Size Info API
     Description:Size Info API
     Author: Alamgir Kabir
     Date: 19-July-2022
     Modified: 19-July-2022
*/
export const SIZE_INFO_API = {
  fetch_size_info_by_cutting_and_color_id: ( cuttingId, colorId ) => `/api/production/SizeInfo/GetSizeInBundle/Cutting/${cuttingId}/Color/${colorId}`,
  fetch_size_info_by_line_style_and_color_id: ( lineId, styleId, colorId ) => `/api/production/SizeInfo/GetSizeInLine/${lineId}/Style/${styleId}/Color/${colorId}`,
  fetch_size_wise_quantity_for_wash_by_process_style_color_and_line_id: ( processId, styleId, colorId, lineId ) => `/api/production/SizeInfo/GetSizeWiseQuantityForWash/Process/${processId}/Style/${styleId}/Color/${colorId}/Line/${lineId}`,
  fetch_size_wise_quantity_for_wash_receive_by_process_style_color_and_line_id: ( processId, styleId, colorId, lineId ) => `/api/production/SizeInfo/GetSizeWiseQuantityForWashReceive/Process/${processId}/Style/${styleId}/Color/${colorId}/Line/${lineId}`
};
