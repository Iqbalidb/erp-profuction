/*
     Title: Cut Plan Mockup
     Description: Cut Plan Mockup
     Author: Iqbal Hossain
     Date: 18-January-2022
     Modified: 18-January-2022
*/

import { paginateArray } from '@fake-db/utils';
import { CUT_PLAN_API } from 'services/api-end-points/production/v1';
import { randomIdGenerator } from 'utility/Utils';
import mock from '../../mock';

export const cutPlanPoDetails = [
  {
    id: 1,
    poNo: 'PO 01',
    destination: 'Africa',
    shipmentDate: '10-11-2021',
    shipmentMode: 'Air',
    inspectionDate: '10-11-2021',
    orderQty: 5000,
    orderUOM: 'PC',
    excess: 2,
    wastage: 2,
    details: [
      {
        id: 1,
        colors: 'Red',
        orderQuantity: 2000,
        extra: 2,
        withExtra: 2040,
        previousQty: 0,
        layCount: 200,
        totalQty: 1200,
        rc: '',
        blance: 840
      },
      {
        id: 2,
        colors: 'Green',
        orderQuantity: 3000,
        extra: 2,
        withExtra: 3060,
        previousQty: 0,
        layCount: 0,
        totalQty: 0,
        rc: '',
        blance: 3000
      }
    ]
  },
  {
    id: 2,
    poNo: 'PO 02',
    destination: 'India',
    shipmentDate: '11-11-2021',
    shipmentMode: 'Sea',
    inspectionDate: '11-11-2021',
    orderQty: 7000,
    orderUOM: 'PC',
    excess: 2,
    wastage: 2,
    details: [
      {
        id: 1,
        colors: 'Red',
        orderQuantity: 2000,
        extra: 2,
        withExtra: 2040,
        previousQty: 0,
        layCount: 200,
        totalQty: 1200,
        rc: '',
        blance: 840
      },
      {
        id: 2,
        colors: 'Green',
        orderQuantity: 3000,
        extra: 2,
        withExtra: 3060,
        previousQty: 0,
        layCount: 0,
        totalQty: 0,
        rc: '',
        blance: 3000
      }
    ]
  },
  {
    id: 3,
    poNo: 'PO 03',
    destination: 'Canada',
    shipmentDate: '12-11-2021',
    shipmentMode: 'Bus',
    inspectionDate: '12-11-2021',
    orderQty: 5241,
    orderUOM: 'PC',
    excess: 2,
    wastage: 2,
    details: [
      {
        id: 1,
        colors: 'Red',
        orderQuantity: 2000,
        extra: 2,
        withExtra: 2040,
        previousQty: 0,
        layCount: 200,
        totalQty: 1200,
        rc: '',
        blance: 840
      },
      {
        id: 2,
        colors: 'Green',
        orderQuantity: 3000,
        extra: 2,
        withExtra: 3060,
        previousQty: 0,
        layCount: 0,
        totalQty: 0,
        rc: '',
        blance: 3000
      }
    ]
  }
];

const data = [
  {
    id: 1,
    cutPlanNo: 'CP001',
    startDate: '18-Jan-2022',
    buyer: 'Kuper',
    style: 'AV56567',
    styleCategory: 'T-Shirt',
    totalLay: '400',
    totalQuantity: '2400',
    status: 'active',
    details: [
      {
        id: 1,
        cutNumber: '45',
        po: 'PO 101',
        color: 'Red',
        width: 3,
        total: 13,
        length: '12',
        sizes: [
          {
            id: randomIdGenerator(),
            name: 'S',
            qty: 5
          },
          {
            id: randomIdGenerator(),
            name: 'M',
            qty: 3
          },
          {
            id: randomIdGenerator(),
            name: 'L',
            qty: 5
          }
        ],
        lay: '200',
        quantity: '1200'
      },
      {
        id: 2,
        cutNumber: '46',
        po: 'PO 102',
        color: 'Red',
        width: 3,
        length: '12',
        total: 13,
        lay: '200',
        sizes: [
          {
            id: randomIdGenerator(),
            name: 'S',
            qty: 5
          },
          {
            id: randomIdGenerator(),
            name: 'M',
            qty: 3
          },
          {
            id: randomIdGenerator(),
            name: 'L',
            qty: 5
          }
        ],
        quantity: '1200'
      }
    ]
  },
  {
    id: 2,
    cutPlanNo: 'CP002',
    startDate: '18-Jan-2022',
    buyer: 'IFG',
    style: 'AV1873',
    styleCategory: 'Shorts',
    totalLay: '600',
    totalQuantity: '6000',
    status: 'active',
    details: [
      {
        id: 1,
        cutNumber: '47',
        po: 'PO 101',
        color: 'Red',
        width: 3,
        length: '12',
        total: 8,
        lay: '200',
        sizes: [
          {
            id: randomIdGenerator(),
            name: 'L',
            qty: 5
          },
          {
            id: randomIdGenerator(),
            name: 'XL',
            qty: 3
          }
        ],
        quantity: '1200'
      }
    ]
  },
  {
    id: 3,
    cutPlanNo: 'CP003',
    startDate: '18-Jan-2022',
    buyer: 'RICHLU',
    style: 'M7825',
    styleCategory: 'Jeans',
    totalLay: '500',
    totalQuantity: '5000',
    status: 'inactive',
    details: [
      {
        id: 1,
        cutNumber: '48',
        po: 'PO 101',
        color: 'Red',
        width: 3,
        length: '12',
        total: 13,
        lay: '200',
        sizes: [
          {
            id: randomIdGenerator(),
            name: 'XL',
            qty: 5
          },
          {
            id: randomIdGenerator(),
            name: 'XXL',
            qty: 3
          },
          {
            id: randomIdGenerator(),
            name: '3XL',
            qty: 5
          }
        ],
        quantity: '1200'
      },
      {
        id: 2,
        cutNumber: '49',
        po: 'PO 102',
        color: 'Red',
        width: 3,
        total: 13,
        length: '12',
        sizes: [
          {
            id: randomIdGenerator(),
            name: 'S',
            qty: 5
          },
          {
            id: randomIdGenerator(),
            name: 'M',
            qty: 3
          },
          {
            id: randomIdGenerator(),
            name: 'L',
            qty: 5
          }
        ],
        lay: '200',
        quantity: '1200'
      },
      {
        id: 3,
        cutNumber: '50',
        po: 'PO 103',
        color: 'Red',
        width: 3,
        length: '12',
        lay: '200',
        total: 5,
        sizes: [
          {
            id: randomIdGenerator(),
            name: 'S',
            qty: 5
          }
        ],
        quantity: '1200'
      }
    ]
  }
];

//GET ALL DATA
mock.onGet(`${CUT_PLAN_API.fetch_all}`).reply(200, data);

//GET: get single
mock.onGet(CUT_PLAN_API.fetch_by_id).reply(config => {
  const { id } = config;
  const { details } = config;
  const res = data.find(e => e.id === id);
  const resDetails = res.details.find(d => d.id === details.id);
  const modifyData = { ...res, details: resDetails };
  return [200, { data: modifyData, succeeded: true }];
});

//GET: get by query
mock.onGet(`${CUT_PLAN_API.fetch_by_query}`).reply(config => {
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

//POST: Add new
mock.onPost(`${CUT_PLAN_API.add}`).reply(config => {
  const res = JSON.parse(config.data);
  res.id = randomIdGenerator();
  data.unshift(res);
  return [201, { message: 'Data Added Successfully!!', succeeded: true, data: res }];
});

//POST: update
mock.onPost(`${CUT_PLAN_API.update}`).reply(config => {
  const updateItem = JSON.parse(config.data).data;
  updateItem.id = Number(updateItem.id);
  const res = data.find(e => e.id === Number(updateItem.id));
  Object.assign(res, updateItem);
  return [200, { message: 'Data Updated Successfully!!', succeeded: true, data: res }];
});

//DELETE: delete
mock.onDelete(`${CUT_PLAN_API.delete}`).reply(config => {
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
mock.onDelete(`${CUT_PLAN_API.delete_by_range}`).reply(config => {
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
