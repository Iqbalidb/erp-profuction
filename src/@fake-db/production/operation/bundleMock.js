/*
     Title: Bundle Mockup
     Description: Bundle Mockup
     Author: Iqbal Hossain
     Date: 23-January-2022
     Modified: 23-January-2022
*/

import { paginateArray } from '@fake-db/utils';
import { BUNDLE_API } from 'services/api-end-points/production/v1';
import mock from '../../mock';

const data = [
  {
    id: 1,
    cutPlanNo: 'CP001',
    color: 'Red',
    comboInfo: '45-M-01',
    parts: 'F,B,Cuff +4 more',
    serialStart: 1,
    serialEnd: 25,
    quantity: 25
  },
  {
    id: 2,
    cutPlanNo: 'CP002',
    color: 'Red',
    comboInfo: '45-M-02',
    parts: 'F,B,Cuff +4 more',
    serialStart: 26,
    serialEnd: 50,
    quantity: 25
  },
  {
    id: 3,
    cutPlanNo: 'CP003',
    color: 'Red',
    comboInfo: '45-L-01',
    parts: 'F,B,Cuff +4 more',
    serialStart: 51,
    serialEnd: 75,
    quantity: 25
  },
  {
    id: 4,
    cutPlanNo: 'CP004',
    color: 'Red',
    comboInfo: '45-L-02',
    parts: 'F,B,Cuff +4 more',
    serialStart: 76,
    serialEnd: 100,
    quantity: 25
  },
  {
    id: 5,
    cutPlanNo: 'CP005',
    color: 'Red',
    comboInfo: '46-M-01',
    parts: 'F,B,Cuff +4 more',
    serialStart: 101,
    serialEnd: 125,
    quantity: 25
  }
];

export const assignEPData = [
  {
    id: 1,
    cutPlanNo: 'CP001',
    bundleNumber: '45-M-01-F',
    date: '23/11/2021',
    serialStart: 1,
    serialEnd: 25,
    quantity: 25,
    checkedDate: '23/11/2021',
    damageInfo: '',
    status: 'Pending'
  },
  {
    id: 2,
    cutPlanNo: 'CP001',
    bundleNumber: '45-M-01-B',
    date: '23/11/2021',
    serialStart: 1,
    serialEnd: 25,
    quantity: 25,
    checkedDate: '23/11/2021',
    damageInfo: '',
    status: 'Pending'
  },
  {
    id: 3,
    cutPlanNo: 'CP001',
    bundleNumber: '45-M-01-PO',
    date: '23/11/2021',
    serialStart: 1,
    serialEnd: 25,
    quantity: 25,
    checkedDate: '23/11/2021',
    damageInfo: '',
    status: 'Pending'
  },
  {
    id: 4,
    cutPlanNo: 'CP001',
    bundleNumber: '45-M-01-Cuff',
    date: '23/11/2021',
    serialStart: 1,
    serialEnd: 25,
    quantity: 25,
    checkedDate: '23/11/2021',
    damageInfo: '',
    status: 'Pending'
  },
  {
    id: 5,
    cutPlanNo: 'CP001',
    bundleNumber: '45-M-01-Coller',
    date: '23/11/2021',
    serialStart: 1,
    serialEnd: 25,
    quantity: 25,
    checkedDate: '23/11/2021',
    damageInfo: '',
    status: 'Pending'
  }
];

//GET ALL DATA
mock.onGet(`${BUNDLE_API.fetch_all}`).reply(200, data);

//GET: get single
mock.onGet(`${BUNDLE_API.fetch_by_id}`).reply(config => {
  const { id } = config;
  const res = data.find(e => e.id === id);
  return [200, { data: res, succeeded: true }];
});

//GET: get by query
mock.onGet(`${BUNDLE_API.fetch_by_query}`).reply(config => {
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
mock.onGet(`${BUNDLE_API.get_by_range}`).reply(config => {
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
      message: 'Data Assigned successfully!!!',
      succeeded: true,
      data: modifieddata
    }
  ];
});
