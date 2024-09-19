/*
     Title: Finishing Api
     Description: Finishing Api
     Author: Alamgir Kabir
     Date: 24-December-2022
     Modified: 24-December-2022
*/
export const FINISHING_API = {
  fetch_finishing_by_production_sub_process_id: `/api/production/Finishing/GetAll`,
  fetch_finishing_passed_by_production_sub_process_id: `/api/production/Finishing/GetAll`,
  fetch_finishing_details_by_master_id: masterId => `/api/production/Finishing/GetDetailsByMaster?masterId=${masterId}`,
  fetch_finishing_processed_quantity: ( buyerId, styleId, productionProcessId ) => `/api/production/Finishing/GetProcessedQuantity/Buyer/${buyerId}/Style/${styleId}/ProductionProcess/${productionProcessId}`,
  pass_finishing: `/api/production/Finishing/Pass`,
  add: `/api/production/Finishing/AddNew`,
  update: `/api/production/Finishing/Edit`
};
