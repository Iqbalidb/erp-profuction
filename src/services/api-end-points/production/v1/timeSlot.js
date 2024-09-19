/*
     Title:  Time Slot API
     Description:  Time Slot API
     Author: Alamgir Kabir
     Date: 12-February-2022
     Modified: 12-February-2022
*/

export const TIME_SLOT_API = {
  fetch_all_active: 'api/production/TimeSlots/GetByStatus?status=true',
  fetch_all_inactive: 'api/production/TimeSlots/GetByStatus?status=false',

  fetch_by_query: 'api/production/TimeSlots/GetAll',
  fetch_by_id: 'api/production/TimeSlots/GetById',
  add: 'api/production/TimeSlots/AddNew',
  update: 'api/production/TimeSlots/Edit'
};
