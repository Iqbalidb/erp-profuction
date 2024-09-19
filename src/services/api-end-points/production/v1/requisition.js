/*
     Title: Requisition api end points
     Description: Requisition api end points
     Author: Alamgir Kabir
     Date: 04-May-2023
     Modified: 04-May-2023
*/
export const REQUISITION_API = {
  fetch_all: `/api/production/Requisition/GetAll`,
  fetch_requisition_by_master_id: `/api/production/Requisition/GetDetailsByMaster`,
  update: `/api/production/Requisition/Edit`,
  receive: `/api/production/Requisition/Receive`,
  add: `/api/production/Requisition/AddNew`
};
