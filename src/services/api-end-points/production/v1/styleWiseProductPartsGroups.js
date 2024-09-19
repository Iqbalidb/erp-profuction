/*
     Title: Style Wise Product Parts Group API
     Description: Style Wise Product Parts Group API
     Author: Alamgir Kabir
     Date: 07-June-2022
     Modified: 07-June-2022
*/
export const STYLE_WISE_PRODUCT_PARTS_GROUP_API = {
  fetch_by_query: `/api/production/StyleWiseProductPartsGroups/GetAll`,
  fetch_remain_style: `/api/production/StyleWiseProductPartsGroups/GetStylesInProductPartsGroup`,
  fetch_by_id: `/api/production/StyleWiseProductPartsGroups/GetById`,
  // fetch_product_parts_by_style_id: `/api/production/StyleWiseProductPartsGroups/GetProductPartsInStyle`,
  CheckProductPartsIsSameColor: `/api/production/StyleWiseProductPartsGroups/CheckProductPartsIsSameColor`,

  fetch_product_parts_by_style: styleId => `/api/production/StyleWiseProductPartsGroups/GetProductParts/Style/${styleId}`,

  fetch_product_parts_by_style_color_partGroup: ( styleId, colorId, partGroupId ) => `/api/production/StyleWiseProductPartsGroups/GetProductParts/Style/${styleId}/Color/${colorId}/PartGroup/${partGroupId}`,
  fetch_product_parts_by_style_cutting_color_and_size_id: ( styleId, cuttingId, colorId, sizeId ) => `/api/production/StyleWiseProductPartsGroups/GetProductPartsForBundle/Style/${styleId}/Cutting/${cuttingId}/Color/${colorId}/Size/${sizeId}`,
  fetch_product_parts_by_style_color: ( styleId, colorId, poId ) => `/api/production/StyleWiseProductPartsGroups/GetProductParts/Style/${styleId}/Color/${colorId}/PurchaseOrder/${poId}`,

  check_product_parts: ( styleId, styleColorId, partGroupIds ) => `/api/production/StyleWiseProductPartsGroups/CheckProductParts/Style/${styleId}/Color/${styleColorId}/PartGroup/${partGroupIds}`,
  add: `/api/production/StyleWiseProductPartsGroups/AddNew`,
  update: `/api/production/StyleWiseProductPartsGroups/Edit`
};

/** Change Log
 * 07-June-2022: fetch_product_parts_by_style,fetch_product_parts_by_style_color_partGroup,check_product_parts end point add
 */
