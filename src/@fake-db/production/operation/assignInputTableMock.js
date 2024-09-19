/*
     Title: Assign Input Table Mockup
     Description: Assign Input Table Mockup
     Author: Iqbal Hossain
     Date: 26-January-2022
     Modified: 26-January-2022
*/

import { paginateArray } from '@fake-db/utils';
import { ASSIGN_INPUT_TABLE_API } from 'services/api-end-points/production/v1';
import { randomIdGenerator } from 'utility/Utils';
import mock from '../../mock';

const data = [
  {
    id: randomIdGenerator(),
    cutPlanNo: 'CP001',
    buyer: 'Kuper',
    style: 'AV56567',
    po: 'PO 01',
    styleCategory: 'T-Shirt',
    color: 'Red',
    shipmentDate: '10-11-2021',
    sizeRange: 'S-XL',
    isOpen: false,
    details: [
      {
        id: randomIdGenerator(),
        comboInfo: '45-M-01',
        parts: 'F,B,Cuff +4 more',
        serialStart: 1,
        serialEnd: 25,
        quantity: 24,
        receivedDate: '23/11/2021',
        rejectInfo: ''
      },
      {
        id: randomIdGenerator(),
        comboInfo: '45-M-02',
        parts: 'F,B,Cuff +4 more',
        serialStart: 1,
        serialEnd: 25,
        quantity: 25,
        receivedDate: '23/11/2021',
        rejectInfo: ''
      },
      {
        id: randomIdGenerator(),
        comboInfo: '45-L-01',
        parts: 'F,B,Cuff +4 more',
        serialStart: 1,
        serialEnd: 25,
        quantity: 24,
        receivedDate: '23/11/2021',
        rejectInfo: ''
      },
      {
        id: randomIdGenerator(),
        comboInfo: '45-L-02',
        parts: 'F,B,Cuff +4 more',
        serialStart: 1,
        serialEnd: 25,
        quantity: 25,
        receivedDate: '23/11/2021',
        rejectInfo: ''
      }
    ]
  },
  {
    id: randomIdGenerator(),
    cutPlanNo: 'CP002',
    buyer: 'IFG',
    style: 'AV1873',
    po: 'PO 02',
    styleCategory: 'Shorts',
    color: 'Red',
    shipmentDate: '10-11-2021',
    sizeRange: 'L-XXL',
    isOpen: false,
    details: [
      {
        id: randomIdGenerator(),
        comboInfo: '46-M-01',
        parts: 'F,B,Cuff +4 more',
        serialStart: 1,
        serialEnd: 25,
        quantity: 25,
        receivedDate: '23/11/2021',
        rejectInfo: ''
      },
      {
        id: randomIdGenerator(),
        comboInfo: '46-M-02',
        parts: 'F,B,Cuff +4 more',
        serialStart: 1,
        serialEnd: 25,
        quantity: 25,
        receivedDate: '23/11/2021',
        rejectInfo: ''
      },
      {
        id: randomIdGenerator(),
        comboInfo: '46-L-01',
        parts: 'F,B,Cuff +4 more',
        serialStart: 1,
        serialEnd: 25,
        quantity: 25,
        receivedDate: '23/11/2021',
        rejectInfo: ''
      }
    ]
  },
  {
    id: randomIdGenerator(),
    cutPlanNo: 'CP003',
    buyer: 'RICHLU',
    style: 'M7825',
    po: 'PO 03',
    styleCategory: 'Jeans',
    color: 'Red',
    shipmentDate: '13-11-2021',
    sizeRange: 'M-2XL',
    isOpen: false,
    details: [
      {
        id: randomIdGenerator(),
        comboInfo: '47-M-01',
        parts: 'F,B,Cuff +4 more',
        serialStart: 1,
        serialEnd: 25,
        quantity: 25,
        receivedDate: '23/11/2021',
        rejectInfo: ''
      },
      {
        id: randomIdGenerator(),
        comboInfo: '47-M-02',
        parts: 'F,B,Cuff +4 more',
        serialStart: 1,
        serialEnd: 25,
        quantity: 25,
        receivedDate: '23/11/2021',
        rejectInfo: ''
      }
    ]
  }
];

//GET ALL DATA
mock.onGet(`${ASSIGN_INPUT_TABLE_API.fetch_all}`).reply(200, data);

//GET: get single
mock.onGet(`${ASSIGN_INPUT_TABLE_API.fetch_by_id}`).reply(config => {
  const { id } = config;
  const res = data.find(e => e.id === id);
  return [200, { data: res, succeeded: true }];
});

//GET: get by query
mock.onGet(`${ASSIGN_INPUT_TABLE_API.fetch_by_query}`).reply(config => {
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

// GET: get Range
mock.onGet(`${ASSIGN_INPUT_TABLE_API.get_by_range}`).reply(config => {
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

/** Change Log
 * 26-Jan-2022(Iqbal): Create fetch_all, fetch_by_query and get_by_range
 */
