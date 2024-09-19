/*
     Title: Sewing Inspection Mock
     Description: Sewing Inspection Mock
     Author: Iqbal Hossain
     Date: 29-January-2022
     Modified: 29-January-2022
*/

import { paginateArray } from '@fake-db/utils';
import { SEWING_INSPECTION_API } from 'services/api-end-points/production/v1';
import { randomIdGenerator } from 'utility/Utils';
import mock from '../../mock';

const data = [
  {
    id: randomIdGenerator(),
    zoneOwner: 'Md. Alamgir',
    lineNumber: 'Line 01',
    noOfMachine: 25,
    status: 'Active',
    date: '',
    time: '',
    targetQty: 25,
    remarks: '',
    details: [
      {
        id: randomIdGenerator(),
        criticalProcess: 'CP 01',
        totalCheck: '',
        passQty: '',
        defectQty: ''
      },
      {
        id: randomIdGenerator(),
        criticalProcess: 'CP 02',
        totalCheck: '',
        passQty: '',
        defectQty: ''
      },
      {
        id: randomIdGenerator(),
        criticalProcess: 'CP End',
        totalCheck: '',
        passQty: '',
        defectQty: ''
      }
    ]
  },
  {
    id: randomIdGenerator(),
    zoneOwner: 'Md. Elias',
    lineNumber: 'Line 02',
    noOfMachine: 25,
    status: 'Active',
    date: '',
    time: '',
    targetQty: 25,
    remarks: '',
    details: [
      {
        id: randomIdGenerator(),
        criticalProcess: 'CP 01',
        totalCheck: '',
        passQty: '',
        defectQty: ''
      },
      {
        id: randomIdGenerator(),
        criticalProcess: 'CP 02',
        totalCheck: '',
        passQty: '',
        defectQty: ''
      },
      {
        id: randomIdGenerator(),
        criticalProcess: 'CP End',
        totalCheck: '',
        passQty: '',
        defectQty: ''
      }
    ]
  },
  {
    id: randomIdGenerator(),
    zoneOwner: 'S.M. Moin',
    lineNumber: 'Line 03, Line 04',
    noOfMachine: 25,
    status: 'Active',
    date: '',
    time: '',
    targetQty: 25,
    remarks: '',
    details: [
      {
        id: randomIdGenerator(),
        criticalProcess: 'CP 01',
        totalCheck: '',
        passQty: '',
        defectQty: ''
      },
      {
        id: randomIdGenerator(),
        criticalProcess: 'CP 02',
        totalCheck: '',
        passQty: '',
        defectQty: ''
      },
      {
        id: randomIdGenerator(),
        criticalProcess: 'CP End',
        totalCheck: '',
        passQty: '',
        defectQty: ''
      }
    ]
  }
];

//GET ALL DATA
mock.onGet(`${SEWING_INSPECTION_API.fetch_all}`).reply(200, data);

//GET: get single
mock.onGet(`${SEWING_INSPECTION_API.fetch_by_id}`).reply(config => {
  const { id } = config;
  const res = data.find(e => e.id === id);
  return [200, { data: res, succeeded: true }];
});

//GET: get by query
mock.onGet(`${SEWING_INSPECTION_API.fetch_by_query}`).reply(config => {
  const { q = '', rowsPerPage = 10, page = 1, status = null } = config;
  const queryLowered = q.toLowerCase();
  const filteredData = data.filter(
    item => item.zoneOwner.toLowerCase().includes(queryLowered) || item.status === (status === '' ? item.status : status)
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
