/*
     Title: Assign Target Table Mockup
     Description: Assign Target Table Mockup
     Author: Iqbal Hossain
     Date: 27-January-2022
     Modified: 27-January-2022
*/

import { paginateArray } from '@fake-db/utils';
import { ASSIGN_TARGET_API } from 'services/api-end-points/production/v1';
import { randomIdGenerator } from 'utility/Utils';
import mock from '../../mock';

const data = [
  {
    id: randomIdGenerator(),
    lineNumber: 'Line 01',
    noOfMachine: 25,
    target: 0,
    status: 'Active',
    manage: ''
  },
  {
    id: randomIdGenerator(),
    lineNumber: 'Line 02',
    noOfMachine: 25,
    target: 0,
    status: 'Active',
    manage: ''
  },
  {
    id: randomIdGenerator(),
    lineNumber: 'Line 03, Line 04',
    noOfMachine: 25,
    target: 0,
    status: 'Active',
    manage: ''
  },
  {
    id: randomIdGenerator(),
    lineNumber: 'Line 05',
    noOfMachine: 25,
    target: 0,
    status: 'Active',
    manage: ''
  },
  {
    id: randomIdGenerator(),
    lineNumber: 'Line 06',
    noOfMachine: 25,
    target: 0,
    status: 'Active',
    manage: ''
  },
  {
    id: randomIdGenerator(),
    lineNumber: 'Line 07',
    noOfMachine: 25,
    target: 0,
    status: 'Active',
    manage: ''
  },
  {
    id: randomIdGenerator(),
    lineNumber: 'Line 08',
    noOfMachine: 25,
    target: 0,
    status: 'Active',
    manage: ''
  }
];

//GET ALL DATA
mock.onGet(`${ASSIGN_TARGET_API.fetch_all}`).reply(200, data);

//GET: get single
mock.onGet(`${ASSIGN_TARGET_API.fetch_by_id}`).reply(config => {
  const { id } = config;
  const res = data.find(e => e.id === id);
  return [200, { data: res, succeeded: true }];
});

//GET: get by query
mock.onGet(`${ASSIGN_TARGET_API.fetch_by_query}`).reply(config => {
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

// GET: get Range
mock.onPost(`${ASSIGN_TARGET_API.get_by_range}`).reply(config => {
  // Get id from URL
  const modifieddata = [...data];
  const dataObj = JSON.parse(config.data);
  for (let index = 0; index < dataObj.ids.length; index++) {
    const obj = modifieddata.find(item => item.id === dataObj.ids[index]);
    obj.target = dataObj.target;
  }
  return [
    200,
    {
      message: 'Target Assigned successfully!!!',
      succeeded: true,
      data: modifieddata
    }
  ];
});

/** Change Log
 * 27-Jan-2022(Iqbal): Create fetch_all, fetch_by_query and get_by_range
 */
