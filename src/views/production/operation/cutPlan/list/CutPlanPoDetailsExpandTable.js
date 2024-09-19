import React, { useEffect } from 'react';
import { MoreVertical } from 'react-feather';
import { useDispatch } from 'react-redux';
import { Input, Table, TabPane } from 'reactstrap';
import { fetchCutPlansByQuery } from '../store/actions';

const CutPlanPoDetailsExpandTable = props => {
  const {
    data: { details }
  } = props;
  const dispatch = useDispatch();

  //#region Effects
  useEffect( () => {
    dispatch( fetchCutPlansByQuery() );
  }, [dispatch] );
  //#endregion

  return (
    <div>
      <TabPane tabId="1">
        <div>
          <Table className="pre-costing-details-table table-bordered" size="sm" responsive={true}>
            <thead className="">
              <tr>
                <th className=" text-center">
                  <strong>Colors</strong>
                </th>
                <th className=" text-center">
                  <strong>Order Quantity</strong>
                </th>
                <th className=" text-center">
                  <strong>Extra %</strong>
                </th>
                <th className=" text-center">
                  <strong>With Extra%</strong>
                </th>
                <th className=" text-center">
                  <strong>Previous Qty</strong>
                </th>
                <th className=" text-center">
                  <strong>Lay Count</strong>
                </th>
                <th className=" text-center">
                  <strong>Total Qty</strong>
                </th>
                <th className=" text-center">
                  <strong>RC</strong>
                </th>
                <th className=" text-center">
                  <strong>Blance</strong>
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              {details.map( item => (
                <tr key={item.id}>
                  <td style={{ width: '105px' }}>{item.colors}</td>
                  <td style={{ width: '105px' }}>{item.orderQuantity}</td>
                  <td style={{ width: '105px' }}>
                    <Input id="" className="text-right" bsSize="sm" type="number" name="extra" placeholder="0" />
                  </td>
                  <td style={{ width: '105px' }}>{item.withExtra}</td>
                  <td style={{ width: '105px' }}>{item.previousQty}</td>
                  <td style={{ width: '105px' }}>{item.layCount}</td>
                  <td style={{ width: '105px' }}>
                    <Input id="" className="text-right" bsSize="sm" type="number" name="totalQty" placeholder={item.totalQty} />
                  </td>
                  <td style={{ width: '105px' }}>
                    <MoreVertical />
                  </td>
                  <td style={{ width: '105px' }}>{item.blance}</td>
                </tr>
              ) )}
            </tbody>
          </Table>
        </div>
      </TabPane>
    </div>
  );
};

export default CutPlanPoDetailsExpandTable;
