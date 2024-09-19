/*
   Title: Wash Details
   Description: Wash Details
   Author: Iqbal Hossain
   Date: 05-January-2022
   Modified: 05-January-2022
*/

import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import ActionMenu from 'layouts/components/menu/action-menu';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Col, NavItem, NavLink, Row, Table } from 'reactstrap';
import ErpDetailsInput from 'utility/custom/customController/ErpDetailsInput';
import FormContentLayout from 'utility/custom/customController/FormContentLayout';
import FormLayout from 'utility/custom/customController/FormLayout';
import { formattedDate } from 'utility/dateHelpers';
import { randomIdString } from 'utility/Utils';
import '../../../../../assets/scss/production/form-page-custom-table.scss';
import { fetchWashByMasterId } from '../store/actions';
const WashDetails = () => {
  //#region Hooks
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const { selectedWashItemByMasterId } = useSelector( ( { washReducer } ) => washReducer );
  const { isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );

  const selectedRow = location.state;
  //#endregion

  //#region State
  const [washingSendDetails, setWashingSendDetails] = useState( [] );
  const [totalSizeQty, setTotalSizeQty] = useState( 0 );
  const [totalProcessQty, setTotalProcessQty] = useState( 0 );
  const [totalAssignQty, setTotalAssignQty] = useState( 0 );
  //#endregion

  //#region Effects
  useEffect( () => {
    if ( selectedRow ) {
      dispatch( fetchWashByMasterId( selectedRow.id ) );
    }
  }, [dispatch, selectedRow] );

  useEffect( () => {
    if ( selectedWashItemByMasterId.length > 0 ) {
      const _totalSizeQty = selectedWashItemByMasterId.reduce( ( acc, curr ) => acc + curr.dayQuantity, 0 );
      const _totalProcessQty = selectedWashItemByMasterId.reduce( ( acc, curr ) => acc + curr.processedQuantity, 0 );
      const _totalAssignQty = selectedWashItemByMasterId.reduce( ( acc, curr ) => acc + curr.assignedQuantity, 0 );
      setTotalSizeQty( _totalSizeQty );
      setTotalProcessQty( _totalProcessQty );
      setTotalAssignQty( _totalAssignQty );
      setWashingSendDetails( selectedWashItemByMasterId );
    }
  }, [selectedWashItemByMasterId] );
  //#endregion

  //For  Cancel Route
  const handleCancel = () => {
    history.goBack();
  };

  //#region Breadcrumb
  const breadcrumb = [
    {
      id: 'home',
      name: 'Home',
      link: "/",
      isActive: false,
      hidden: false
    },

    {
      id: 'wash',
      name: 'Wash',
      link: "/wash",
      isActive: false,
      hidden: false
    },
    {
      id: 'wash-receive-details',
      name: 'Wash Receive Details',
      link: "/wash-receive-details",
      isActive: true,
      hidden: false
    }
  ];
  //#endregion
  return (
    <>
      <UILoader
        blocking={isDataProgressCM}
        loader={<ComponentSpinner />}>
        <ActionMenu breadcrumb={breadcrumb} title="Wash Send Details">
          <NavItem className="mr-1">
            <NavLink tag={Button} size="sm" color="secondary" onClick={handleCancel}>
              Cancel
            </NavLink>
          </NavItem>
        </ActionMenu>
        <FormLayout className="general-form-container p-0">
          <Row className="p-1">
            <Col lg='12' className=''>
              <FormContentLayout title="Master Information">
                <Col lg='3' md='6' xl='3'>
                  <ErpDetailsInput
                    id={randomIdString()}
                    label="Send Date"
                    classNames='mt-1'
                    value={formattedDate( selectedRow?.date )}
                  />
                  <ErpDetailsInput
                    id={randomIdString()}
                    label="Line"
                    classNames='mt-1'
                    value={selectedRow?.lineName}
                  />
                  <ErpDetailsInput
                    id={randomIdString()}
                    label="Remarks"
                    classNames='mt-1'
                    value={selectedRow?.remark}
                  />
                </Col>
                <Col lg='3' md='6' xl='3'>
                  <ErpDetailsInput
                    id={randomIdString()}
                    label="Buyer"
                    classNames='mt-1'
                    value={selectedRow?.buyerName}
                  />
                  <ErpDetailsInput
                    id={randomIdString()}
                    label="Floor"
                    classNames='mt-1'
                    value={selectedRow?.floorName}
                  />
                </Col>
                <Col lg='3' md='6' xl='3'>
                  <ErpDetailsInput
                    id={randomIdString()}
                    label="Style"
                    classNames='mt-1'
                    value={selectedRow?.styleNo}
                  />
                  <ErpDetailsInput
                    id={randomIdString()}
                    label="Color"
                    classNames='mt-1'
                    value={selectedRow?.colorName}
                  />
                </Col>
                <Col lg='3' md='6' xl='3'>
                  <ErpDetailsInput
                    id={randomIdString()}
                    label="Style Category"
                    classNames='mt-1'
                    value={selectedRow?.styleCategory}
                  />
                  <ErpDetailsInput
                    id={randomIdString()}
                    label="Process"
                    classNames='mt-1'
                    value={selectedRow?.processName}
                  />
                </Col>
              </FormContentLayout>
            </Col>
            <Col lg='12' className='mt-1'>
              <FormContentLayout title="Details">
                <div className='p-1'>
                  <Table bordered responsive className='table-container'>
                    <thead >
                      <tr className="text-center">
                        <th className="text-nowrap sm-width"> SL</th>

                        <th className="text-nowrap"> Size</th>
                        <th className="text-nowrap"> Assigned Quantity</th>
                        <th className="text-nowrap"> Processed Quantity</th>
                        <th className="text-nowrap"> Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {washingSendDetails?.map( ( pt, index ) => (
                        <Fragment key={pt.sizeId}>
                          <tr className="text-center ">
                            <td className='sm-width'>{index + 1}</td>

                            <td className='td-width'>{pt.sizeName}</td>
                            <td>{pt.assignedQuantity}</td>
                            <td>{pt.processedQuantity}</td>
                            <td>{pt.dayQuantity}</td>
                          </tr>
                        </Fragment>
                      ) )}
                      <tr className='text-center'>
                        <td colSpan={2} className="text-right">Total</td>
                        <td >{totalAssignQty}</td>
                        <td >{totalProcessQty}</td>
                        <td >{totalSizeQty}</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </FormContentLayout>
            </Col>
          </Row>
        </FormLayout>
      </UILoader>
    </>
  );
};

export default WashDetails;
