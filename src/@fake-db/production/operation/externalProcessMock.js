/*
     Title: External Process Mockup
     Description: External Process Mockup
     Author: Iqbal Hossain
     Date: 24-January-2022
     Modified: 24-January-2022
*/

import { paginateArray } from '@fake-db/utils';
import { EXTERNAL_PROCESS_API } from 'services/api-end-points/production/v1';
import mock from '../../mock';

const data = [
  {
    id: 1,
    transferRef: 'TR001',
    transferRefDate: '30/11/2021',
    transferTo: 'Cutting',
    details: [
      {
        id: 1,
        bundleNumber: '45-M-01-F',
        date: '23/11/2021',
        serialStart: 1,
        serialEnd: 25,
        receivedQty: 25,
        sendQty: 24,
        hasReject: false,
        rejectInfo: ''
      },
      {
        id: 2,
        bundleNumber: '45-M-01-F',
        date: '23/11/2021',
        serialStart: 1,
        serialEnd: 25,
        receivedQty: 25,
        sendQty: 24,
        hasReject: false,
        rejectInfo: ''
      }
    ]
  },
  {
    id: 2,
    transferRef: 'TR002',
    transferRefDate: '30/11/2021',
    transferTo: 'Cutting',
    details: [
      {
        id: 1,
        bundleNumber: '45-M-01-F',
        date: '23/11/2021',
        serialStart: 1,
        serialEnd: 25,
        receivedQty: 25,
        sendQty: 24,
        hasReject: false,
        rejectInfo: ''
      },
      {
        id: 2,
        bundleNumber: '45-M-01-F',
        date: '23/11/2021',
        serialStart: 1,
        serialEnd: 25,
        receivedQty: 25,
        sendQty: 24,
        hasReject: false,
        rejectInfo: ''
      },
      {
        id: 3,
        bundleNumber: '45-M-01-F',
        date: '23/11/2021',
        serialStart: 1,
        serialEnd: 25,
        receivedQty: 25,
        sendQty: 24,
        hasReject: false,
        rejectInfo: ''
      }
    ]
  },
  {
    id: 3,
    transferRef: 'TR003',
    transferRefDate: '30/11/2021',
    transferTo: 'Cutting',
    details: [
      {
        id: 1,
        bundleNumber: '45-M-01-F',
        date: '23/11/2021',
        serialStart: 1,
        serialEnd: 25,
        receivedQty: 25,
        sendQty: 24,
        hasReject: false,
        rejectInfo: ''
      }
    ]
  }
];

//GET ALL DATA
mock.onGet(`${EXTERNAL_PROCESS_API.fetch_all}`).reply(200, data);

//GET: get single
mock.onGet(`${EXTERNAL_PROCESS_API.fetch_by_id}`).reply(config => {
  const { id } = config;
  const res = data.find(e => e.id === id);
  return [200, { data: res, succeeded: true }];
});

//GET: get by query
mock.onGet(`${EXTERNAL_PROCESS_API.fetch_by_query}`).reply(config => {
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
mock.onGet(`${EXTERNAL_PROCESS_API.get_by_range}`).reply(config => {
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
