// /*
//      Title: Product Parts dummy data
//      Description: Product Parts dummy data
//      Author: Nasir Ahmed
//      Date: 09-January-2022
//      Modified: 09-January-2022
// */

// import { paginateArray } from '@fake-db/utils';
// import { PRODUCT_PARTS_API } from 'services/api-end-points/production/v1';
// import { randomIdGenerator } from 'utility/Utils';
// import mock from '../../mock';

// const data = [
//   {
//     id: 1,
//     name: 'Front',
//     shortCode: 'F',
//     status: 'active'
//   },
//   {
//     id: 2,
//     name: 'Back',
//     shortCode: 'B',
//     status: 'active'
//   },
//   {
//     id: 3,
//     name: 'Yoke',
//     shortCode: 'Y',
//     status: 'active'
//   }
// ];

// //GET ALL DATA
// mock.onGet(`${PRODUCT_PARTS_API.fetch_all}`).reply(200, data);

// //POST: Add new
// mock.onPost(`${PRODUCT_PARTS_API.add}`).reply(config => {
//   const res = JSON.parse(config.data);
//   res.id = randomIdGenerator();
//   data.unshift(res);
//   return [201, { message: 'Data Added Successfully!!', succeeded: true, data: res }];
// });

// //POST: update
// mock.onPost(`${PRODUCT_PARTS_API.update}`).reply(config => {
//   const updateItem = JSON.parse(config.data).data;
//   updateItem.id = Number(updateItem.id);
//   const res = data.find(e => e.id === Number(updateItem.id));
//   Object.assign(res, updateItem);
//   return [200, { message: 'Data Updated Successfully!!', succeeded: true, data: res }];
// });

// //GET: get singlep
// mock.onGet(`${PRODUCT_PARTS_API.fetch_by_id}`).reply(config => {
//   const { id } = config;
//   const productPart = data.find(e => e.id === id);
//   return [200, productPart, { succeeded: true }];
// });

// //GET: get by query
// mock.onGet(`${PRODUCT_PARTS_API.fetch_by_query}`).reply(config => {
//   const { q = '', rowsPerPage = 10, page = 1, status = null } = config;
//   const queryLowered = q.toLowerCase();
//   const filteredData = data.filter(
//     pp =>
//       pp.name.toLowerCase().includes(queryLowered) ||
//       pp.status === (status === '' ? pp.status : status)
//   );
//   return [
//     200,
//     {
//       data: paginateArray(data, rowsPerPage, page),
//       totalRecords: filteredData.length,
//       succeeded: true
//     }
//   ];
// });

// //DELETE: delete
// mock.onDelete(`${PRODUCT_PARTS_API.delete}`).reply(config => {
//   let productPartId = Number(config.id);
//   const productPartIndex = data.findIndex(pp => pp.id === productPartId);
//   data.splice(productPartIndex, 1);
//   return [
//     200,
//     {
//       message: 'Data Deleted successfully!!!',
//       succeeded: true,
//       data: data
//     }
//   ];
// });

// // DELETE: Deletes  Range
// mock.onDelete(`${PRODUCT_PARTS_API.delete_by_range}`).reply(config => {
//   // Get id from URL
//   const modifieddata = [...data];
//   const productPartIds = config.ids;
//   for (let index = 0; index < productPartIds.length; index++) {
//     const id = productPartIds[index];
//     const productPartIndex = modifieddata.findIndex(pp => pp.id === id);
//     modifieddata.splice(productPartIndex, 1);
//   }
//   return [
//     200,
//     {
//       message: 'Data Deleted successfully!!!',
//       succeeded: true,
//       data: modifieddata
//     }
//   ];
// });
