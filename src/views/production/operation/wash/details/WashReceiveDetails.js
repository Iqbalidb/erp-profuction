/*
     Title: Wash Receive Details
     Description: Wash Receive Details
     Author: Alamgir Kabir
     Date: 06-February-2023
     Modified: 06-February-2023
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
import CustomPreLoader from 'utility/custom/CustomPreLoader';
import { formattedDate } from 'utility/dateHelpers';
import { randomIdString } from 'utility/Utils';
import '../../../../../assets/scss/production/form-page-custom-table.scss';
import { fetchWashReceiveByMasterId } from '../store/actions';

const WashReceiveDetails = () => {
  //#region Hooks
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const { selectedWashReceiveItemByMasterId } = useSelector( ( { washReducer } ) => washReducer );
  const { isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
  const selectedRow = location.state;

  //#region State
  const [washingSendDetails, setWashingSendDetails] = useState( [] );
  const [totalReceiveQuantity, setTotalReceiveQuantity] = useState( 0 );
  const [totalRejectQuantity, setTotalRejectQuantity] = useState( 0 );
  const [totalResendQuantity, setTotalResendQuantity] = useState( 0 );
  //#endregion

  //#region Effects
  useEffect( () => {
    if ( selectedRow ) {
      dispatch( fetchWashReceiveByMasterId( selectedRow.id ) );
    }
  }, [dispatch, selectedRow] );

  useEffect( () => {
    if ( selectedWashReceiveItemByMasterId.length > 0 ) {
      const _totalReceivedQty = selectedWashReceiveItemByMasterId?.reduce( ( acc, curr ) => acc + curr.receiveQuantity, 0 );
      const _totalRejectQty = selectedWashReceiveItemByMasterId?.reduce( ( acc, curr ) => acc + curr.rejectQuantity, 0 );
      const _totalResendQty = selectedWashReceiveItemByMasterId?.reduce( ( acc, curr ) => acc + curr.resendQuantity, 0 );

      setTotalReceiveQuantity( _totalReceivedQty );
      setTotalRejectQuantity( _totalRejectQty );
      setTotalResendQuantity( _totalResendQty );
      setWashingSendDetails( selectedWashReceiveItemByMasterId );
    }
  }, [selectedWashReceiveItemByMasterId] );
  //#endregion

  //For  Cancel Route
  const handleCancel = () => {
    history.goBack();
  };
  /**
   * Loader
   */
  if ( !selectedWashReceiveItemByMasterId ) {
    return (
      <div>
        <CustomPreLoader />
      </div>
    );
  }
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
        <ActionMenu breadcrumb={breadcrumb} title="Wash Receive Details">
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
                    label="Receive Date"
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
              <FormContentLayout title="Wash Receive Details">
                <div className='p-1'>
                  <Table bordered responsive className='table-container'>
                    <thead >
                      <tr className="text-center">
                        <th className="text-nowrap sm-width"> SL</th>

                        <th className="text-nowrap"> Size</th>
                        <th className="text-nowrap"> Received Qty</th>
                        <th className="text-nowrap"> Reject Qty</th>
                        <th className="text-nowrap"> Resend Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {washingSendDetails?.map( ( pt, index ) => (
                        <Fragment key={pt.sizeId}>
                          <tr className="text-center ">
                            <td className='sm-width'>{index + 1}</td>

                            <td className='td-width'>{pt.sizeName}</td>
                            <td>{pt.receiveQuantity}</td>
                            <td>{pt.rejectQuantity}</td>
                            <td>{pt.resendQuantity}</td>
                          </tr>
                        </Fragment>
                      ) )}
                      <tr className='text-center'>
                        <td colSpan={2} className="text-right">Total</td>
                        <td >{totalReceiveQuantity}</td>
                        <td >{totalRejectQuantity}</td>
                        <td >{totalResendQuantity}</td>
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

export default WashReceiveDetails;
