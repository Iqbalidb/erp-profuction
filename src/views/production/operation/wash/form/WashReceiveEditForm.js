/*
     Title: Wash Receive Edit Form
     Description: Wash Receive Edit Form
     Author: Alamgir Kabir
     Date: 07-February-2023
     Modified: 07-February-2023
*/
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import ActionMenu from 'layouts/components/menu/action-menu';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Col, Input, Label, NavItem, NavLink, Row, Table } from 'reactstrap';
import { dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { WASH_RECEIVE_API } from 'services/api-end-points/production/v1/washReceive';
import { errorResponse } from 'utility/Utils';
import { stringifyConsole } from 'utility/commonHelper';
import CustomPreLoader from 'utility/custom/CustomPreLoader';
import FormContentLayout from 'utility/custom/FormContentLayout';
import FormLayout from 'utility/custom/FormLayout';
import { ErpInput } from 'utility/custom/customController/ErpInput';
import { notify } from 'utility/custom/notifications';
import { CustomInputRemarks } from 'utility/custom/production/CustomInputRemarks';
import { formattedDate, serverDate } from 'utility/dateHelpers';
import '../../../../../assets/scss/production/form-page-custom-table.scss';
import '../../../../../assets/scss/production/general.scss';
import { fetchWashReceiveByMasterId } from '../store/actions';
const WashReceiveEditForm = () => {
  //#region Hooks
  const history = useHistory();
  const location = useLocation();
  const selectedRow = location.state;
  const dispatch = useDispatch();
  const { selectedWashReceiveItemByMasterId } = useSelector( ( { washReducer } ) => washReducer );
  const { iSubmitProgressCM, isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );

  //#endregion

  //#region State
  const [washingSizeInfo, setwashingSizeInfo] = useState( [] );
  const [totalReceiveQuantity, setTotalReceiveQuantity] = useState( 0 );
  const [totalRejectQuantity, setTotalRejectQuantity] = useState( 0 );
  const [totalResendQuantity, setTotalResendQuantity] = useState( 0 );
  const [remark, setRemark] = useState( selectedRow?.remark );
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

      setwashingSizeInfo( selectedWashReceiveItemByMasterId );
      setTotalReceiveQuantity( _totalReceivedQty );
      setTotalRejectQuantity( _totalRejectQty );
      setTotalResendQuantity( _totalResendQty );
    }
  }, [selectedWashReceiveItemByMasterId] );
  //#endregion

  /**
   * For onChange Quantity
   */
  const onReceiveQuantityChange = ( e, index ) => {
    const { value } = e.target;
    let inputQuantity = +value;
    const _washingSizeInfo = [...washingSizeInfo];
    const selectedItem = _washingSizeInfo[index];

    // const _receiveQty = selectedItem.todayReceived;
    const _totalSendQty = selectedItem.totalSend;
    // const _totalResend = selectedItem.totalResend;
    // const _totalSendAndResendQty = _totalSendQty + _totalResend;
    const _totalReceivedQty = +selectedItem.totalReceived;
    const _totalReject = +selectedItem.totalReject;
    const _totalReceivedAndReject = Number( _totalReceivedQty + _totalReject );
    const _todayLimitQty = Number( _totalSendQty - _totalReceivedAndReject );
    const _todayRejectQty = selectedItem.rejectQuantity;
    const _todayResendQty = selectedItem.resendQuantity;
    const validQty = inputQuantity + _todayRejectQty + _todayResendQty;

    if ( validQty <= _todayLimitQty ) {
      selectedItem.receiveQuantity = inputQuantity;
    } else {
      inputQuantity = 0;
      notify( 'warning', 'limit exceeds!!!' );
    }
    selectedItem.receiveQuantity = inputQuantity;
    _washingSizeInfo[index] = selectedItem;
    const totalReceivedQty = _washingSizeInfo.reduce( ( acc, curr ) => acc + curr.receiveQuantity, 0 );
    setTotalReceiveQuantity( totalReceivedQty );
    setwashingSizeInfo( _washingSizeInfo );
  };

  /**
   * For onChange Quantity
   */
  const onRejectQuantityChange = ( e, index ) => {
    const { value } = e.target;
    let inputQuantity = +value;
    const _washingSizeInfo = [...washingSizeInfo];
    const selectedItem = _washingSizeInfo[index];

    const _totalSendQty = selectedItem.totalSend;
    // const _totalResend = selectedItem.totalResend;
    // const _totalSendAndResendQty = _totalSendQty + _totalResend;
    const _totalReceivedQty = +selectedItem.totalReceived;
    const _totalReject = +selectedItem.totalReject;
    const _totalReceivedAndReject = Number( _totalReceivedQty + _totalReject );
    const _todaytLimitQty = Number( _totalSendQty - _totalReceivedAndReject );
    const _todayReceivedQty = selectedItem.receiveQuantity;
    const _todayResendQty = selectedItem.resendQuantity;
    const validQty = inputQuantity + _todayReceivedQty + _todayResendQty;
    if ( validQty <= _todaytLimitQty ) {
      selectedItem.rejectQuantity = inputQuantity;
    } else {
      inputQuantity = 0;
      notify( 'warning', 'limit exceeds!!!' );
    }
    selectedItem.rejectQuantity = inputQuantity;
    _washingSizeInfo[index] = selectedItem;
    const totalRejectQty = _washingSizeInfo.reduce( ( acc, curr ) => acc + curr.rejectQuantity, 0 );
    setTotalRejectQuantity( totalRejectQty );
    setwashingSizeInfo( _washingSizeInfo );
  };

  /**
   * For onChange Quantity
   */
  const onResendQuantityChange = ( e, index ) => {
    const { value } = e.target;
    let inputQuantity = +value;
    const _washingSizeInfo = [...washingSizeInfo];
    const selectedItem = _washingSizeInfo[index];
    const _totalSendQty = selectedItem.totalSend;

    const _totalReceivedQty = +selectedItem.totalReceived;
    const _totalReject = +selectedItem.totalReject;
    const _totalReceivedAndReject = Number( _totalReceivedQty + _totalReject );
    const _todaytLimitQty = Number( _totalSendQty - _totalReceivedAndReject );
    const _todayReceivedQty = selectedItem.receiveQuantity;
    const _todayRejectQty = selectedItem.rejectQuantity;
    const validQty = inputQuantity + _todayReceivedQty + _todayRejectQty;
    if ( validQty <= _todaytLimitQty ) {
      selectedItem.resendQuantity = inputQuantity;
    } else {
      inputQuantity = 0;
      notify( 'warning', 'limit exceeds!!!' );
    }
    selectedItem.resendQuantity = inputQuantity;
    _washingSizeInfo[index] = selectedItem;
    const totalResendQty = _washingSizeInfo.reduce( ( acc, curr ) => acc + curr.resendQuantity, 0 );
    setTotalResendQuantity( totalResendQty );
    setwashingSizeInfo( _washingSizeInfo );
  };
  //For Cancel Route
  const handleCancel = () => {
    history.goBack();
  };
  /**
   * For Washing Form Submit
   */
  const handleSubmit = async () => {
    const payload = {
      date: serverDate( selectedRow?.date ),
      processId: selectedRow?.processId,
      processName: selectedRow?.processName,
      styleId: selectedRow?.styleId,
      styleNo: selectedRow?.styleNo,
      styleCategoryId: selectedRow?.styleCategoryId,
      styleCategory: selectedRow?.styleCategory,
      buyerId: selectedRow?.buyerId,
      buyerName: selectedRow?.buyerName,
      colorId: selectedRow?.colorId,
      colorName: selectedRow?.colorName,
      floorId: selectedRow?.floorId,
      floorName: selectedRow?.floorName,
      lineId: selectedRow?.lineId,
      lineName: selectedRow?.lineName,
      totalReceive: totalReceiveQuantity,
      totalReject: totalRejectQuantity,
      totalResend: totalResendQuantity,

      remark,
      list: washingSizeInfo?.map( wsd => ( {
        id: wsd?.id,
        washingReceiveMasterId: selectedRow?.id,
        sizeId: wsd?.sizeId,
        sizeName: wsd.sizeName,
        receiveQuantity: wsd.receiveQuantity,
        rejectQuantity: wsd.rejectQuantity,
        resendQuantity: wsd.resendQuantity
      } ) )
    };
    stringifyConsole( payload );
    const isMasterData = payload.processId && payload.styleCategoryId && payload.date;
    if ( isMasterData ) {
      const isListValue = payload.list.some( sv => sv.receiveQuantity > 0 || sv.rejectQuantity > 0 || sv.resendQuantity > 0 );
      if ( isListValue ) {
        dispatch( dataSubmitProgressCM( true ) );
        try {
          const res = await baseAxios.put( WASH_RECEIVE_API.update, payload, { params: { id: selectedRow?.id } } );
          notify( 'success', 'Data Updated Successfully!!!' );
          dispatch( dataSubmitProgressCM( false ) );
          handleCancel();
        } catch ( error ) {
          errorResponse( error );
          dispatch( dataSubmitProgressCM( false ) );
        }
      } else {
        notify( 'warning', 'Please fill all fields!!!' );
      }
    } else {
      notify( 'warning', 'Please fill all fields!!!' );
    }
  };
  //#endregion

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
      id: 'wash-receive-edit',
      name: 'Wash Receive Edit',
      link: "/wash-receive-edit",
      isActive: true,
      hidden: false
    }
  ];
  //#endregion
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
  return (
    <>
      <UILoader
        blocking={iSubmitProgressCM || isDataProgressCM}
        loader={<ComponentSpinner />}>
        <ActionMenu breadcrumb={breadcrumb} title="Wash Receive Edit">
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
          <FormLayout isNeedTopMargin={true}>
            <Row>
              <Col lg='12'>
                <FormContentLayout title="Master Information">
                  <Col lg='3' md='6' xl='3'>
                    <ErpInput
                      classNames='mt-1'
                      label="Receive Date"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={formattedDate( selectedRow?.date )}
                    />

                  </Col>
                  <Col lg='3' md='6' xl='3'>
                    <ErpInput
                      classNames='mt-1'
                      label="Buyer"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={selectedRow?.buyerName}
                    />
                  </Col>
                  <Col lg='3' md='6' xl='3'>
                    <ErpInput
                      classNames='mt-1'
                      label="Style"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={selectedRow?.styleNo}
                    />
                  </Col>
                  <Col lg='3' md='6' xl='3'>
                    <ErpInput
                      classNames='mt-1'
                      label="Style Category"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={selectedRow?.styleCategory}
                    />
                  </Col>
                  <Col lg='3' md='6' xl='3'>
                    <ErpInput
                      classNames='mt-1'
                      label="Line"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={selectedRow?.lineName}
                    />
                  </Col>
                  <Col lg='3' md='6' xl='3'>
                    <ErpInput
                      classNames='mt-1'
                      label="Floor"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={selectedRow?.floorName}
                    />
                  </Col>
                  <Col lg='3' md='6' xl='3'>
                    <ErpInput
                      classNames='mt-1'
                      label="Color"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={selectedRow?.colorName}
                    />
                  </Col>
                  <Col lg='3' md='6' xl='3'>
                    <ErpInput
                      classNames='mt-1'
                      label="Process"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={selectedRow?.processName}
                    />
                  </Col>
                </FormContentLayout>
              </Col>
            </Row>
            <div className='p-1'>
              <FormContentLayout title="Details">
                <div className='p-1'>
                  {isDataProgressCM ? (
                    <div style={{ height: '350px' }}>
                      <ComponentSpinner />
                    </div>
                  ) : (
                    <>
                      <Table size="sm" bordered className='table-container'>
                        <thead >
                          <tr className="text-center">
                            <th className="text-nowrap sm-width"> SL</th>
                            <th className="text-nowrap"> Size</th>
                            <th className="text-nowrap">Total Send Qty</th>
                            {/* <th className="text-nowrap"> Previous Resend Qty</th> */}
                            <th className="text-nowrap"> Total Receive Qty</th>
                            <th className="text-nowrap"> Total Reject Qty</th>
                            <th className="text-nowrap"> Received Qty</th>
                            <th className="text-nowrap"> Reject Qty</th>
                            <th className="text-nowrap"> Resend Qty</th>
                          </tr>
                        </thead>
                        <tbody>
                          {washingSizeInfo.length > 0 &&
                            washingSizeInfo?.map( ( pt, index ) => (
                              <Fragment key={pt.sizeId}>
                                <tr className="text-center">
                                  <td className='sm-width'>{index + 1}</td>
                                  <td>
                                    <Input id="criticalProcessName" className="w-100 text-center" type="text" bsSize="sm" value={pt?.sizeName} disabled />
                                  </td>
                                  <td>
                                    <Input id="rejectQty" className="w-100 text-center" type="number" bsSize="sm" value={pt?.totalSend} disabled />
                                  </td>

                                  <td>
                                    <Input id="rejectQty" className="w-100 text-center" type="number" bsSize="sm" value={pt?.totalReceived} disabled />
                                  </td>
                                  <td>
                                    <Input id="rejectQty" className="w-100 text-center" type="number" bsSize="sm" value={pt?.totalReject} disabled />
                                  </td>
                                  <td>
                                    <Input
                                      id="rejectQty"
                                      className="w-100 text-center"
                                      type="number"
                                      bsSize="sm"
                                      value={pt?.receiveQuantity}
                                      onSelect={e => e.target.select()}
                                      onChange={e => onReceiveQuantityChange( e, index )}
                                    />
                                  </td>

                                  <td>
                                    <Input
                                      id="rejectQty"
                                      className="w-100 text-center"
                                      type="number"
                                      bsSize="sm"
                                      value={pt?.rejectQuantity}
                                      onSelect={e => e.target.select()}
                                      onChange={e => onRejectQuantityChange( e, index )}
                                    />
                                  </td>
                                  <td>
                                    <Input
                                      id="rejectQty"
                                      className="w-100 text-center"
                                      type="number"
                                      bsSize="sm"
                                      value={pt?.resendQuantity}
                                      onSelect={e => e.target.select()}
                                      onChange={e => onResendQuantityChange( e, index )}
                                    />
                                  </td>
                                </tr>
                              </Fragment>
                            ) )}
                        </tbody>
                        <tbody >
                          {washingSizeInfo.length > 0 && (
                            <>
                              {washingSizeInfo.length > 0 && (
                                <tr className='text-center'>

                                  <td colSpan={5} className="td-width text-right">
                                    <Label for="name" >
                                      Total
                                    </Label>
                                  </td>
                                  <td>
                                    <Label for="totalAssignQty" >
                                      {totalReceiveQuantity}
                                    </Label>
                                  </td>
                                  <td>
                                    <Label for="totalProcssQty" >
                                      {totalRejectQuantity}
                                    </Label>
                                  </td>

                                  <td>
                                    <Label for="totalSizeQty" >
                                      {totalResendQuantity}
                                    </Label>
                                  </td>
                                </tr>
                              )}
                            </>
                          )}
                        </tbody>
                      </Table>
                      <div className='mt-2'>
                        <CustomInputRemarks label="Remaks" name="remark" value={remark} onChange={( e ) => setRemark( e.target.value )} />
                      </div>
                    </> )}
                </div>
              </FormContentLayout>
            </div>

          </FormLayout>
        </div>

      </UILoader>
    </>
  );
};

export default WashReceiveEditForm;
