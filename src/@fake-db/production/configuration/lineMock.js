/*
     Title: LINE API and fake Data
     Description: LINE API and fake Data
     Author: Iqbal Hossain
     Date: 06-January-2022
     Modified: 06-January-2022
*/

import { paginateArray } from '@fake-db/utils';
import { LINE_API } from 'services/api-end-points/production/v1';
import { randomIdGenerator } from 'utility/Utils';
import mock from '../../mock';

const data = [
  {
    id: 1,
    lineNumber: 'Line01',
    description: 'This is Line 01',
    status: 'active'
  },
  {
    id: 2,
    lineNumber: 'Line02',
    description: 'This is Line 02',
    status: 'active'
  },
  {
    id: 3,
    lineNumber: 'Line03',
    description: 'This is Line 03',
    status: 'inactive'
  },
  {
    id: 4,
    lineNumber: 'Line04',
    description: 'This is Line 04',
    status: 'active'
  },
  {
    id: 5,
    lineNumber: 'Line05',
    description: 'This is Line 05',
    status: 'inactive'
  },
  {
    id: 6,
    lineNumber: 'Line06',
    description: 'This is Line 06',
    status: 'active'
  },
  {
    id: 7,
    lineNumber: 'Line07',
    description: 'This is Line 07',
    status: 'active'
  },
  {
    id: 8,
    lineNumber: 'Line08',
    description: 'This is Line 08',
    status: 'inactive'
  }
];

//GET ALL DATA
mock.onGet(`${LINE_API.fetch_all}`).reply(200, data);

//GET: get single
mock.onGet(`${LINE_API.fetch_by_id}`).reply(config => {
  const { id } = config;
  const res = data.find(e => e.id === id);
  return [200, { succeeded: true, data: res }];
});

//GET: get by query
mock.onGet(`${LINE_API.fetch_by_query}`).reply(config => {
  const { q = '', rowsPerPage = 10, page = 1, status = null } = config;
  const queryLowered = q.toLowerCase();
  const filteredData = data.filter(
    item => item.lineNumber.toLowerCase().includes(queryLowered) || item.status === (status === '' ? item.status : status)
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
mock.onPost(`${LINE_API.add}`).reply(config => {
  const res = JSON.parse(config.data);
  res.id = randomIdGenerator();
  data.unshift(res);
  return [201, { message: 'Data Added Successfully!!', succeeded: true, data: res }];
});

//POST: update
mock.onPost(`${LINE_API.update}`).reply(config => {
  const updateItem = JSON.parse(config.data).data;
  updateItem.id = Number(updateItem.id);
  const res = data.find(e => e.id === Number(updateItem.id));
  Object.assign(res, updateItem);
  return [200, { message: 'Data Updated Successfully!!', succeeded: true, data: res }];
});

//DELETE: delete
mock.onDelete(`${LINE_API.delete}`).reply(config => {
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
mock.onDelete(`${LINE_API.delete_by_range}`).reply(config => {
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
