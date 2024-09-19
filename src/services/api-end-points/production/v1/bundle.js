/*
     Title: Bundle API
     Description: Bundle API
     Author: Iqbal Hossain
     Date: 18-January-2022
     Modified: 18-January-2022
*/

export const BUNDLE_API = {
  root: '/api/bundle',
  fetch_all: 'api/bundle/fetch-all',
  fetch_by_query: `/api/production/Bundles/GetAll`,
  fetch_by_id: `/api/production/Bundles/GetById`,

  fetch_partial_bundle_process_for_pass: ( status, currentProcessId ) => `/api/production/Bundles/GetPartialBundleForPass?status=${status}&currentProcessId=${currentProcessId}`,
  fetch_partial_bundle_process_for_assigned: ( status, currentProcessId ) => `/api/production/Bundles/GetPassedBundle?status=${status}&currentProcessId=${currentProcessId}`,
  fetch_bundle_by_cutting_color_size_and_product_part_id: ( cuttingId, colorId, sizeId, productPartsId ) => `/api/production/Bundles/GetForContrastBundle/Cutting/${cuttingId}/Color/${colorId}/Size/${sizeId}/ProductParts/${productPartsId}`,
  fetch_bundle_by_status: ( isChecked, bundleStatus ) => `/api/production/Bundles/GetAll?isChecked=${isChecked}&bundleStatus=${bundleStatus}`,
  get_by_range: `/api/bundle/get-range`,
  update_bundle_by_bundle_check_status: `/api/production/Bundles/CheckBundle`,
  update_bundle_by_bundle_id_for_reject_status: bundleId => `/api/production/Bundles/HasRejectBundle/Bundles/${bundleId}`,
  update_bundle_by_bundle_pass_process: `/api/production/Bundles/PassBundle`,

  add: `/api/production/Bundles/AddContrasrBundle`
};
