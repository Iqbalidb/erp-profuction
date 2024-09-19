/*
     Title: Production Process Mock
     Description: Production Process Mock
     Author: Iqbal Hossain
     Date: 09-January-2022
     Modified: 09-January-2022
*/

import { paginateArray } from '@fake-db/utils';
import { PRODUCTION_PROCESS_API } from 'services/api-end-points/production/v1';
import { randomIdGenerator } from 'utility/Utils';
import mock from '../../mock';

const data = [
  {
    id: 1,
    productionProcessName: 'Cutting',
    processType: 'Partial',
    description: 'This is Cutting',
    status: 'active'
  },
  {
    id: 2,
    productionProcessName: 'Print',
    processType: 'Complete',
    description: 'This is Print',
    status: 'active'
  },
  {
    id: 3,
    productionProcessName: 'Wash',
    processType: 'Partial',
    description: 'This is Wash',
    status: 'inactive'
  }
];

//GET ALL DATA
mock.onGet(`${PRODUCTION_PROCESS_API.fetch_all}`).reply(200, data);

//GET: get single
mock.onGet(`${PRODUCTION_PROCESS_API.fetch_by_id}`).reply(config => {
  const { id } = config;
  const productionProcess = data.find(e => e.id === id);
  return [200, productionProcess, { succeeded: true }];
});

//GET: get by query
mock.onGet(`${PRODUCTION_PROCESS_API.fetch_by_query}`).reply(config => {
  const { q = '', rowsPerPage = 10, page = 1, status = null } = config;
  const queryLowered = q.toLowerCase();
  const filteredData = data.filter(
    pp => pp.productionProcessName.toLowerCase().includes(queryLowered) || pp.status === (status === '' ? pp.status : status)
  );
  return [
    200,
    {
      data: paginateArray(data, rowsPerPage, page),
      totalRecords: filteredData.length,
      succeeded: true
    }
  ];
});

//POST: Add new
mock.onPost(`${PRODUCTION_PROCESS_API.add}`).reply(config => {
  const res = JSON.parse(config.data);
  res.id = randomIdGenerator();
  data.unshift(res);
  return [201, { message: 'Data Added Successfully!!', succeeded: true, data: res }];
});

//POST: update
mock.onPost(`${PRODUCTION_PROCESS_API.update}`).reply(config => {
  const updateItem = JSON.parse(config.data).data;
  updateItem.id = Number(updateItem.id);
  const res = data.find(e => e.id === Number(updateItem.id));
  Object.assign(res, updateItem);
  return [200, { message: 'Data Updated Successfully!!', succeeded: true, data: res }];
});

//DELETE: delete
mock.onDelete(`${PRODUCTION_PROCESS_API.delete}`).reply(config => {
  let getId = Number(config.id);
  const itemIndex = data.findIndex(item => item.id === getId);
  data.splice(itemIndex, 1);
  return [
    200,
    {
      message: 'Data Deleted Successfully!!!',
      succeeded: true,
      data: data
    }
  ];
});

// DELETE: Deletes  Range
mock.onDelete(`${PRODUCTION_PROCESS_API.delete_by_range}`).reply(config => {
  // Get id from URL
  const modifieddata = [...data];
  const ids = config.ids;
  for (let index = 0; index < ids.length; index++) {
    const id = ids[index];
    const itemIndex = modifieddata.findIndex(item => item.id === id);
    modifieddata.splice(itemIndex, 1);
  }
  return [
    200,
    {
      message: 'Data Deleted successfully!!!',
      succeeded: true,
      data: modifieddata
    }
  ];
});
