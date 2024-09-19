/*
     Title: Relaxation Requisition Receive Form
     Description: Relaxation Requisition Receive Form
     Author: Alamgir Kabir
     Date: 09-May-2023
     Modified: 09-May-2023
*/
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import ActionMenu from 'layouts/components/menu/action-menu';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Col, Input, Label, NavItem, NavLink, Row, Table } from 'reactstrap';
import { dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { REQUISITION_API } from 'services/api-end-points/production/v1/requisition';
import { stringifyConsole } from 'utility/commonHelper';
import ErpDateInput from 'utility/custom/customController/ErpDateInput';
import { ErpInput } from 'utility/custom/customController/ErpInput';
import FormContentLayout from 'utility/custom/customController/FormContentLayout';
import FormLayout from 'utility/custom/customController/FormLayout';
import { notify } from 'utility/custom/notifications';
import { CustomInputRemarks } from 'utility/custom/production/CustomInputRemarks';
import { serverDate } from 'utility/dateHelpers';
import { errorResponse } from 'utility/Utils';
import '../../../../../assets/scss/production/form-page-custom-table.scss';
import '../../../../../assets/scss/production/general.scss';
import { fetch_requisition_by_master_id } from '../store/actions';
const RelaxationRequisitionReceiveForm = () => {
  //#region Hooks
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const masterInfo = location.state;
  const masterId = location.state.id;
  const { selectedRequisitionItem } = useSelector( ( { requisitionReducer } ) => requisitionReducer );
  const { iSubmitProgressCM, isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
  //#endregion

  //#region States
  const [requisitionDetails, setRequisitionDetails] = useState( [] );
  const [remark, setRemark] = useState( '' );
  const [isLoadingTableData] = useState( false );
  const [totalQtyInYards, setTotalQtyInYards] = useState( 0 );
  const [totalQtyInRoll, setTotalQtyInRoll] = useState( 0 );
  const [totalReceiveYard, settotalReceiveYard] = useState( 0 );
  const [totalReceiveRoll, settotalReceiveRoll] = useState( 0 );
  const [receiveDate, setReceiveDate] = useState( new Date() );
  //#endregion

  //#region UDF's

  //#region Effects

  //For Requisition Details Get By Master masterId
  useEffect( () => {
    if ( masterId ) {
      dispatch( fetch_requisition_by_master_id( masterId ) );
    }
  }, [dispatch, masterId] );

  //For Requisition Details Set In State
  useEffect( () => {
    if ( selectedRequisitionItem.length > 0 ) {
      const modifiedRequisitionDetails = selectedRequisitionItem?.map( mrd => ( {
        ...mrd,
        receiveQuantityYard: mrd.quantityYard,
        receiveQuantityRoll: mrd.quantityRoll
      } ) );
      setRequisitionDetails( modifiedRequisitionDetails );
      setTotalQtyInYards( masterInfo?.totalQuantityYard );
      setTotalQtyInRoll( masterInfo?.totalQuantityRoll );
      settotalReceiveYard( masterInfo?.totalQuantityYard );
      settotalReceiveRoll( masterInfo?.totalQuantityRoll );
      setRemark( masterInfo?.remarks );
    }
  }, [masterInfo.remarks, masterInfo.totalQuantityRoll, masterInfo.totalQuantityYard, selectedRequisitionItem] );

  //#endregion

  //#region Events
  /**
   * On Change Requisition Receive Date
   */
  const onChangeReceivedDate = dates => {
    const date = dates[0];
    setReceiveDate( date );
  };

  /**
   * On Receive Yard Qty Change
   */
  const onReceiveYardQtyChange = ( e, index ) => {
    const _requisitionDetails = [...requisitionDetails];
    const selectedItem = _requisitionDetails[index];

    selectedItem.receiveQuantityYard = Number( e.target.value );

    const _totalReceiveQtyInyard = _requisitionDetails.reduce( ( acc, curr ) => acc + curr.receiveQuantityYard, 0 );
    settotalReceiveYard( _totalReceiveQtyInyard );

    _requisitionDetails[index] = selectedItem;
    setRequisitionDetails( _requisitionDetails );
  };
  /**
   * On Receive in roll Quantity Change
   */
  const onReceiveRollQtyChange = ( e, index ) => {
    const _requisitionDetails = [...requisitionDetails];
    const selectedItem = _requisitionDetails[index];

    selectedItem.receiveQuantityRoll = Number( e.target.value );

    const _totalReceiveQtyInRoll = _requisitionDetails.reduce( ( acc, curr ) => acc + curr.receiveQuantityRoll, 0 );
    settotalReceiveRoll( _totalReceiveQtyInRoll );

    _requisitionDetails[index] = selectedItem;
    setRequisitionDetails( _requisitionDetails );
  };
  /**
   * For Change Route
   */
  const handleCancel = () => {
    history.goBack();
  };
  /**
   * For Submission
   */
  const handleSubmit = async () => {
    const payload = {
      requisitionDate: serverDate( masterInfo?.requisitionDate ),
      receiveDate: serverDate( receiveDate ),
      styleId: masterInfo?.styleId,
      styleNo: masterInfo?.styleNo,
      styleCategoryId: masterInfo?.styleCategoryId,
      styleCategory: masterInfo?.styleCategory,
      buyerId: masterInfo?.buyerId,
      buyerName: masterInfo?.buyerName,
      purchaseOrderId: masterInfo?.purchaseOrderId,
      purchaseOrderNo: masterInfo?.purchaseOrderNo,
      merchandiserName: masterInfo?.merchandiserName,
      merchandiserId: masterInfo?.merchandiserId,
      totalQuantityYard: totalQtyInYards,
      totalQuantityRoll: totalQtyInRoll,
      totalReceiveYard,
      totalReceiveRoll,
      remarks: remark,
      list: requisitionDetails?.map( rqd => ( {
        id: rqd?.id,
        requisitionMasterId: masterId,
        colorId: rqd?.colorId,
        colorName: rqd?.colorName,
        fabricTypeId: rqd?.fabricTypeId,
        fabricTypeName: rqd?.fabricTypeName,
        quantityYard: rqd?.quantityYard,
        quantityRoll: rqd?.quantityRoll,
        receiveQuantityYard: rqd?.receiveQuantityYard,
        receiveQuantityRoll: rqd?.receiveQuantityRoll
      } ) )
    };
    stringifyConsole( payload );
    const isValidPayload = payload.list.some( rq => rq.receiveQuantityYard !== 0 || rq.receiveQuantityRoll !== 0 );

    if ( masterId !== null && isValidPayload ) {
      dispatch( dataSubmitProgressCM( true ) );
      try {
        await baseAxios.put( REQUISITION_API.receive, payload, {
          params: {
            id: masterId
          }
        } );
        notify( 'success', 'Requisition has been Receive Successfully' );
        dispatch( dataSubmitProgressCM( false ) );
        handleCancel();

      } catch ( error ) {
        errorResponse( error );
        dispatch( dataSubmitProgressCM( false ) );
      }
    } else {
      notify( 'warning', 'Please Provide all data!!!' );
    }
  };
  const breadcrumb = [
    {
      id: 'home',
      name: 'Home',
      link: "/",
      isActive: false,
      hidden: false
    },

    {
      id: 'requisition-list',
      name: 'Requisition',
      link: "/requisition-list",
      isActive: false,
      hidden: false
    },

    {
      id: 'requisition-receive',
      name: 'Requisition Receive',
      link: "/requisition-receive",
      isActive: true,
      hidden: false
    }
  ];
  return (
    <>
      <UILoader
        blocking={iSubmitProgressCM || isDataProgressCM}
        loader={<ComponentSpinner />}>
        <ActionMenu breadcrumb={breadcrumb} title=" Requisition Receive">
          <NavItem className="mr-1">
            <NavLink tag={Button} size="sm" color="primary" type="submit" onClick={handleSubmit}>
              Save
            </NavLink>
          </NavItem>
          <NavItem className="mr-1">
            <NavLink tag={Button} size="sm" color="secondary" onClick={handleCancel}>
              Cancel
            </NavLink>
          </NavItem>
        </ActionMenu>
        <div className='general-form-container'>
          <FormLayout>
            <Row className="p-1">
              <Col lg='12' className='mb-2 p-1'>
                <FormContentLayout title="Master Information">
                  <Col lg='4' md='6' xl='4'>
                    <ErpDateInput
                      classNames='mt-1'
                      label="Receive Date"
                      id="receiveDate"
                      type="date"
                      maxDate={new Date()} name="receiveDate" value={receiveDate} onChange={onChangeReceivedDate}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="Style"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={masterInfo?.styleNo}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="PO"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={masterInfo?.purchaseOrderNo}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="Buyer"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={masterInfo?.buyerName}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="Style Category"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={masterInfo?.styleCategory}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="Merchandiser"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={masterInfo?.merchandiserName}
                    />
                  </Col>
                </FormContentLayout>
              </Col>
            </Row>
            <div className='p-1'>
              <FormContentLayout title="Details">
                <div className='p-1'>
                  <Table bordered responsive className='table-container' >
                    <thead >
                      <tr className="text-center">
                        <th className="text-nowrap sm-width"> SL/No</th>
                        <th className="text-nowrap"> Fabric Type</th>
                        <th className="text-nowrap"> Color</th>
                        <th className="text-nowrap">Requisition Qty (In Yards)</th>
                        <th className="text-nowrap">Requisition (In Roll)</th>
                        <th className="text-nowrap"> Receive Qty (In Yards)</th>
                        <th className="text-nowrap">Receive Qty (In Roll)</th>
                      </tr>
                    </thead>
                    {isLoadingTableData ? (
                      <div style={{ height: '150px' }}>
                        <ComponentSpinner colSpanNo={8} />
                      </div>
                    ) : (
                      <>
                        <tbody>
                          {requisitionDetails.length > 0 ? (
                            requisitionDetails?.map( ( rqd, index ) => (
                              <Fragment key={index + 1}>
                                <tr className="text-center">
                                  <td >{index + 1}</td>
                                  <td >
                                    {rqd.fabricTypeName}
                                  </td>
                                  <td>
                                    {rqd.colorName}
                                  </td>
                                  <td>
                                    {rqd.quantityYard}
                                  </td>
                                  <td>
                                    {rqd.quantityRoll}
                                  </td>
                                  <td >
                                    <Input
                                      id="receiveQuantityYard"
                                      className="w-100 text-center"
                                      type="number"
                                      bsSize="sm"
                                      value={rqd?.receiveQuantityYard}
                                      onSelect={e => e.target.select()}
                                      onChange={e => onReceiveYardQtyChange( e, index )}
                                    />
                                  </td>

                                  <td >
                                    <Input
                                      id="receiveQuantityRoll"
                                      className="w-100 text-center"
                                      type="number"
                                      bsSize="sm"
                                      value={rqd?.receiveQuantityRoll}
                                      onSelect={e => e.target.select()}
                                      onChange={e => onReceiveRollQtyChange( e, index )}
                                    />
                                  </td>
                                </tr>
                              </Fragment>
                            ) )
                          ) : (
                            <tr className='text-center'>
                              <td colSpan={6} className='td-width'>There is no record to display</td>
                            </tr>
                          )
                          }
                        </tbody>
                        {requisitionDetails.length > 0 && (
                          <tbody className='text-center' style={{ borderBottom: '2px solid #EBE9F1' }}>
                            <tr>

                              <td className='td-width text-right' colSpan={5}>
                                <Label for="name"  >
                                  Total
                                </Label>
                              </td>
                              <td className="text-center">
                                <Label for="name" >
                                  {totalQtyInYards}
                                </Label>
                              </td>
                              <td className="text-center">
                                <Label for="name" >
                                  {totalQtyInRoll}
                                </Label>
                              </td>
                            </tr>
                          </tbody>
                        )}
                      </>
                    )}
                  </Table>
                  <div className='mt-2'>
                    <CustomInputRemarks label="Remaks" name="remark" value={remark} onChange={( e ) => setRemark( e.target.value )} />

                  </div>

                </div>

              </FormContentLayout>
            </div>
          </FormLayout>
        </div>
      </UILoader>

    </>
  );
};

export default RelaxationRequisitionReceiveForm;
/** Change Log
 *
 */
