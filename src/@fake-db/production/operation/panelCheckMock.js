/*
     Title: Panel Check Mockup
     Description: Panel Check Mockup
     Author: Iqbal Hossain
     Date: 22-January-2022
     Modified: 22-January-2022
*/

import { paginateArray } from '@fake-db/utils';
import { PANEL_CHECK_API } from 'services/api-end-points/production/v1';
import { randomIdGenerator } from 'utility/Utils';
import mock from '../../mock';

const data = [
  {
    id: randomIdGenerator(),
    cutPlanNo: 'CP001',
    cutNo: '45',
    comboNo: '1',
    size: 'M',
    color: 'Red',
    isOpen: false,
    details: [
      {
        id: randomIdGenerator(),
        bundleNumber: '45-M-01-F',
        date: '23/11/2021',
        serialStart: 1,
        serialEnd: 25,
        quantity: 25,
        status: 'pending',
        hasReject: false,
        rejectInfo: '',
        checked: ''
      },
      {
        id: randomIdGenerator(),
        bundleNumber: '45-M-01-B',
        date: '23/11/2021',
        serialStart: 1,
        serialEnd: 25,
        quantity: 25,
        status: 'pending',
        hasReject: false,
        rejectInfo: '',
        checked: ''
      },
      {
        id: randomIdGenerator(),
        bundleNumber: '45-M-01-PO',
        date: '23/11/2021',
        serialStart: 1,
        serialEnd: 25,
        quantity: 25,
        status: 'pending',
        hasReject: false,
        rejectInfo: '',
        checked: ''
      },
      {
        id: randomIdGenerator(),
        bundleNumber: '45-M-01-Cuff',
        date: '23/11/2021',
        serialStart: 1,
        serialEnd: 25,
        quantity: 25,
        status: 'pending',
        hasReject: false,
        rejectInfo: '',
        checked: ''
      },
      {
        id: randomIdGenerator(),
        bundleNumber: '45-M-01-Coller',
        date: '23/11/2021',
        serialStart: 1,
        serialEnd: 25,
        quantity: 25,
        status: 'pending',
        hasReject: false,
        rejectInfo: '',
        checked: ''
      }
    ]
  },
  {
    id: randomIdGenerator(),
    cutPlanNo: 'CP002',
    cutNo: '45',
    comboNo: '2',
    size: 'M',
    color: 'Red',
    isOpen: false,
    details: [
      {
        id: randomIdGenerator(),
        bundleNumber: '45-M-01-F',
        date: '23/11/2021',
        serialStart: 1,
        serialEnd: 25,
        quantity: 25,
        status: 'pending',
        hasReject: false,
        rejectInfo: '',
        checked: ''
      },
      {
        id: randomIdGenerator(),
        bundleNumber: '45-M-01-B',
        date: '23/11/2021',
        serialStart: 1,
        serialEnd: 25,
        quantity: 25,
        status: 'pending',
        hasReject: false,
        rejectInfo: '',
        checked: ''
      },
      {
        id: randomIdGenerator(),
        bundleNumber: '45-M-01-PO',
        date: '23/11/2021',
        serialStart: 1,
        serialEnd: 25,
        quantity: 25,
        status: 'pending',
        hasReject: false,
        rejectInfo: '',
        checked: ''
      },
      {
        id: randomIdGenerator(),
        bundleNumber: '45-M-01-Cuff',
        date: '23/11/2021',
        serialStart: 1,
        serialEnd: 25,
        quantity: 25,
        status: 'pending',
        hasReject: false,
        rejectInfo: '',
        checked: ''
      },
      {
        id: randomIdGenerator(),
        bundleNumber: '45-M-01-Coller',
        date: '23/11/2021',
        serialStart: 1,
        serialEnd: 25,
        quantity: 25,
        status: 'pending',
        hasReject: false,
        rejectInfo: '',
        checked: ''
      }
    ]
  },
  {
    id: randomIdGenerator(),
    cutPlanNo: 'CP003',
    cutNo: '45',
    comboNo: 3,
    size: 'M',
    color: 'Red',
    isOpen: false,
    details: [
      {
        id: randomIdGenerator(),
        bundleNumber: '45-M-01-F',
        date: '23/11/2021',
        serialStart: 1,
        serialEnd: 25,
        quantity: 25,
        status: 'pending',
        hasReject: false,
        rejectInfo: '',
        checked: ''
      },
      {
        id: randomIdGenerator(),
        bundleNumber: '45-M-01-B',
        date: '23/11/2021',
        serialStart: 1,
        serialEnd: 25,
        quantity: 25,
        status: 'pending',
        hasReject: false,
        rejectInfo: '',
        checked: ''
      },
      {
        id: randomIdGenerator(),
        bundleNumber: '45-M-01-PO',
        date: '23/11/2021',
        serialStart: 1,
        serialEnd: 25,
        quantity: 25,
        status: 'pending',
        hasReject: false,
        rejectInfo: '',
        checked: ''
      },
      {
        id: randomIdGenerator(),
        bundleNumber: '45-M-01-Cuff',
        date: '23/11/2021',
        serialStart: 1,
        serialEnd: 25,
        quantity: 25,
        status: 'pending',
        hasReject: false,
        rejectInfo: '',
        checked: ''
      },
      {
        id: randomIdGenerator(),
        bundleNumber: '45-M-01-Coller',
        date: '23/11/2021',
        serialStart: 1,
        serialEnd: 25,
        quantity: 25,
        status: 'pending',
        hasReject: false,
        rejectInfo: '',
        checked: ''
      }
    ]
  }
];

export const details = [
  {
    id: 11,
    bundleNumber: '45-M-01-F',
    date: '23/11/2021',
    serialStart: 1,
    serialEnd: 25,
    quantity: 25,
    status: 'pending',
    hasReject: false,
    rejectInfo: '',
    checked: ''
  },
  {
    id: 12,
    bundleNumber: '45-M-01-B',
    date: '23/11/2021',
    serialStart: 1,
    serialEnd: 25,
    quantity: 25,
    status: 'pending',
    hasReject: false,
    rejectInfo: '',
    checked: ''
  },
  {
    id: 13,
    bundleNumber: '45-M-01-PO',
    date: '23/11/2021',
    serialStart: 1,
    serialEnd: 25,
    quantity: 25,
    status: 'pending',
    hasReject: false,
    rejectInfo: '',
    checked: ''
  },
  {
    id: 14,
    bundleNumber: '45-M-01-Cuff',
    date: '23/11/2021',
    serialStart: 1,
    serialEnd: 25,
    quantity: 25,
    status: 'pending',
    hasReject: false,
    rejectInfo: '',
    checked: ''
  },
  {
    id: 15,
    bundleNumber: '45-M-01-Coller',
    date: '23/11/2021',
    serialStart: 1,
    serialEnd: 25,
    quantity: 25,
    status: 'pending',
    hasReject: false,
    rejectInfo: '',
    checked: ''
  }
];

//GET ALL DATA
mock.onGet(`${PANEL_CHECK_API.fetch_all}`).reply(200, data);

//GET: get single
mock.onGet(`${PANEL_CHECK_API.fetch_by_id}`).reply(config => {
  const { id } = config;
  const res = data.find(e => e.id === id);
  return [200, { data: res, succeeded: true }];
});

//GET: get by query
mock.onGet(`${PANEL_CHECK_API.fetch_by_query}`).reply(config => {
  const { q = '', rowsPerPage = 10, page = 1, status = null } = config;
  const queryLowered = q.toLowerCase();
  const filteredData = data.filter(
    item => item.cutPlanNo.toLowerCase().includes(queryLowered) || item.status === (status === '' ? item.status : status)
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
