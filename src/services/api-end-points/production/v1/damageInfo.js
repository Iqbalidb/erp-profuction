/*
     Title: Damage Info API
     Description: Damage Info API
     Author: Alamgir Kabir
     Date: 26-July-2022
     Modified: 26-July-2022
*/
export const DAMAGE_INFO_API = {
  fetch_rejected_serials: bundleId => `/api/production/DamageInfos/GetRejectSerial/Bundles/${bundleId}`,
  fetch_damage_info_by_bundle_id: bundleId => `/api/production/DamageInfos/GetDamageInfo/Bundles/${bundleId}`,
  add: `/api/production/DamageInfos/AddNew`
};
