/*
     Title: Wash Mockup
     Description: Wash Mockup
     Author: Iqbal Hossain
     Date: 12-February-2022
     Modified: 12-February-2022
*/

import { paginateArray } from '@fake-db/utils';
import { WASH_API } from 'services/api-end-points/production/v1';
import { randomIdGenerator } from 'utility/Utils';
import mock from '../../mock';

const data = [
  {
    id: randomIdGenerator(),
    transferRef: 'TR001',
    transferRefDate: '30/11/2021',
    details: [
      {
        id: randomIdGenerator(),
        color: 'Red',
        size: 'M',
        receivedQty: 2000,
        hasReject: false,
        rejectInfo: ''
      },
      {
        id: randomIdGenerator(),
        color: 'Red',
        size: 'L',
        receivedQty: 3000,
        hasReject: false,
        rejectInfo: ''
      },
      {
        id: randomIdGenerator(),
        color: 'Black',
        size: 'L',
        receivedQty: 2000,
        hasReject: false,
        rejectInfo: ''
      }
    ]
  },
  {
    id: randomIdGenerator(),
    transferRef: 'TR001',
    transferRefDate: '30/11/2021',
    details: [
      {
        id: randomIdGenerator(),
        color: 'Red',
        size: 'M',
        receivedQty: 2000,
        hasReject: false,
        rejectInfo: ''
      },
      {
        id: randomIdGenerator(),
        color: 'Red',
        size: 'L',
        receivedQty: 3000,
        hasReject: false,
        rejectInfo: ''
      }
    ]
  },
  {
    id: randomIdGenerator(),
    transferRef: 'TR001',
    transferRefDate: '30/11/2021',
    details: [
      {
        id: randomIdGenerator(),
        color: 'Red',
        size: 'M',
        receivedQty: 2000,
        hasReject: false,
        rejectInfo: ''
      }
    ]
  }
];

//GET ALL DATA
mock.onGet(`${WASH_API.fetch_all}`).reply(200, data);

//GET: get single
mock.onGet(`${WASH_API.fetch_by_id}`).reply(config => {
  const { id } = config;
  const res = data.find(e => e.id === id);
  return [200, { data: res, succeeded: true }];
});

//GET: get by query
mock.onGet(`${WASH_API.fetch_by_query}`).reply(config => {
  const { q = '', rowsPerPage = 10, page = 1, status = null } = config;
  const queryLowered = q.toLowerCase();
  const filteredData = data.filter(
    item => item.transferRef.toLowerCase().includes(queryLowered) || item.status === (status === '' ? item.status : status)
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
mock.onGet(`${WASH_API.get_by_range}`).reply(config => {
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
      message: 'Data Passed successfully!!!',
      succeeded: true,
      data: modifieddata
    }
  ];
});
