/*
     Title: Panel Check API
     Description: Panel Check API
     Author: Iqbal Hossain
     Date: 22-January-2022
     Modified: 22-January-2022
*/

export const PANEL_CHECK_API = {
  fetch_unchecked_bundles: `/api/production/PanelCheck/GetUncheckedBundles`,
  fetch_checked_bundles: `/api/production/PanelCheck/GetCheckedBundles`,
  update_bundle_by_bundle_check_status: `/api/production/PanelCheck/CheckBundle`,
  update_bundle_by_bundle_id_for_reject_status: bundleId => `/api/production/PanelCheck/HasRejectBundle/Bundles/${bundleId}`
};
