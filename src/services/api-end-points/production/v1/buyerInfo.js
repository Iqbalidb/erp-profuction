/*
     Title: BUYER INFO API
     Description: BUYER INFO API
     Author: Alamgir Kabir
     Date: 31-October-2022
     Modified: 31-October-2022
*/

export const BUYER_INFO_API = {
  fetch_buyer_by_line_id: lineId => `/api/production/BuyerInfo/GetBuyerFromInput/Line/${lineId}`,
  fetch_buyer_by_production_process_id: `/api/production/BuyerInfo/GetBuyerForFinishing/ProductionProcess`
};
