/**
 * Title: Finishing Edit Form
 * Description: Finishing Edit Form
 * Author: Iqbal Hossain
 * Date: 05-January-2022
 * Modified: 05-January-2022
 */

import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import axios from 'axios';
import ActionMenu from 'layouts/components/menu/action-menu';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Col, Input, Label, NavItem, NavLink, Row, Table } from 'reactstrap';
import { dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { FINISHING_API } from 'services/api-end-points/production/v1/finishing';
import { TRANSFER_STORE_API } from 'services/api-end-points/production/v1/transfarStore';
import { errorResponse } from 'utility/Utils';
import { stringifyConsole } from 'utility/commonHelper';
import FormContentLayout from 'utility/custom/FormContentLayout';
import FormLayout from 'utility/custom/FormLayout';
import { ErpInput } from 'utility/custom/customController/ErpInput';
import { notify } from 'utility/custom/notifications';
import { CustomInputRemarks } from 'utility/custom/production/CustomInputRemarks';
import { formattedDate, serverDate } from 'utility/dateHelpers';
import '../../../../../assets/scss/production/form-page-custom-table.scss';
import '../../../../../assets/scss/production/general.scss';
import { fetchFinishingDetailsByMasterId } from '../store/actions';
const FinishingEditForm = () => {
  //#region Hooks
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const {
    finishingReducer: { selectedItems },
    commonReducers: { iSubmitProgressCM, isDataProgressCM }
  } = useSelector( state => state );
  //#endregion

  //#region States
  const [assignedQty, setAssignedQty] = useState( 0 );
  const [processQty, setProcessQty] = useState( 0 );
  const [remainingQty, setRemainingQty] = useState( 0 );
  const [totalQty, setTotalQty] = useState( 0 );
  const [totalPassedQty, setTotalPassedQty] = useState( 0 );
  const [totalDefectQty, setTotalDefectQty] = useState( 0 );
  const [totalRejectQty, setTotalRejectQty] = useState( 0 );
  const [remark, setRemark] = useState( '' );
  const [finishingDetails, setFinishingDetails] = useState( [] );
  const masterId = location.state.id;
  const finishingMasterInfo = location.state;
  //#endregion

  //#region UDFs
  const fetchStoreAndProcessQty = useCallback( async () => {
    const transferStoreRequest = baseAxios.get(
      TRANSFER_STORE_API.fetch_assigned_quantity_by_buyer_style_production_process_id(
        finishingMasterInfo.buyerId,
        finishingMasterInfo.styleId,
        finishingMasterInfo.passedProcessId
      )
    );
    const finishingProcessedQtyRequest = baseAxios.get(
      FINISHING_API.fetch_finishing_processed_quantity( finishingMasterInfo.buyerId, finishingMasterInfo.styleId, finishingMasterInfo.passedProcessId )
    );
    const [transferStoreResponse, finishingProcessedQtyResponse] = await axios.all( [transferStoreRequest, finishingProcessedQtyRequest] );

    const processedQty = finishingProcessedQtyResponse.data.data;
    const asgQty = transferStoreResponse.data.data;
    setProcessQty( processedQty );
    setAssignedQty( asgQty );
    setRemainingQty( asgQty - processedQty + finishingMasterInfo.totalInspaction );
  }, [finishingMasterInfo.buyerId, finishingMasterInfo.passedProcessId, finishingMasterInfo.styleId, finishingMasterInfo.totalInspaction] );

  //#endregion

  //#region Effects
  useEffect( () => {
    if ( masterId ) {
      dispatch( fetchFinishingDetailsByMasterId( masterId ) );
      fetchStoreAndProcessQty();
      setTotalQty( finishingMasterInfo.totalInspaction );
      setTotalPassedQty( finishingMasterInfo.totalPassed );
      setTotalDefectQty( finishingMasterInfo.totalDefect );
      setTotalRejectQty( finishingMasterInfo.totalReject );
      setRemark( finishingMasterInfo.remark );
    }
  }, [
    dispatch,
    fetchStoreAndProcessQty,
    finishingMasterInfo.remark,
    finishingMasterInfo.totalDefect,
    finishingMasterInfo.totalInspaction,
    finishingMasterInfo.totalPassed,
    finishingMasterInfo.totalReject,
    masterId
  ] );

  useEffect( () => {
    if ( selectedItems.length > 0 ) {
      setFinishingDetails( selectedItems );
    }
  }, [dispatch, selectedItems] );

  //#endregion

  //#region Events

  //on Change Inspection/Check Qty
  const onTotalCheckChange = ( e, index ) => {
    const { value } = e.target;
    const _finishingDetails = [...finishingDetails];
    const selectedOperator = _finishingDetails[index];
    let checkQty = ( selectedOperator.inspactionQuantity = +value );

    const totalQtyForCompareRemainingQty = _finishingDetails.reduce( ( acc, curr ) => acc + curr.inspactionQuantity, 0 );

    if ( totalQtyForCompareRemainingQty > remainingQty ) {
      checkQty = 0;
      notify( 'warning', 'limit exceeds!!!' );
    }
    if ( checkQty === 0 ) {
      selectedOperator.passedQuantity = 0;
      selectedOperator.defectQuantity = 0;
      selectedOperator.rejectQuantity = 0;
    }

    selectedOperator.inspactionQuantity = checkQty;
    //reset master data
    const totalQty = _finishingDetails.reduce( ( acc, curr ) => acc + curr.inspactionQuantity, 0 );
    const totalPassedQty = _finishingDetails.reduce( ( acc, curr ) => acc + curr.passedQuantity, 0 );
    const totalDefectQty = _finishingDetails.reduce( ( acc, curr ) => acc + curr.defectQuantity, 0 );
    const totalRejectQty = _finishingDetails.reduce( ( acc, curr ) => acc + curr.rejectQuantity, 0 );

    setTotalQty( totalQty );
    setTotalPassedQty( totalPassedQty );
    setTotalDefectQty( totalDefectQty );
    setTotalRejectQty( totalRejectQty );

    _finishingDetails[index] = selectedOperator;
    setFinishingDetails( _finishingDetails );
  };

  //Sum of Pass,Defect and Reject Quantity
  const sumofPassDefectAndRejectQty = ( passQty, defectQty, rejectQty ) => {
    const passedQuantity = Number( passQty );
    const defectQuantity = Number( defectQty );
    const rejectQuantity = Number( rejectQty );
    const sumQty = passedQuantity + defectQuantity + rejectQuantity;
    return sumQty;
  };
  //on Change Passed Quantity
  const onPassQtyChange = ( e, index ) => {
    const { value } = e.target;
    const _finishingDetails = [...finishingDetails];
    const selectedOperator = _finishingDetails[index];
    let passQuantity = ( selectedOperator.passedQuantity = +value );
    const inspectionQuantity = selectedOperator.inspactionQuantity;
    const defectQuantity = selectedOperator.defectQuantity;
    const rejectQuantity = selectedOperator.rejectQuantity;

    const compareInputValueWithInspectQty = sumofPassDefectAndRejectQty( passQuantity, defectQuantity, rejectQuantity );

    if ( compareInputValueWithInspectQty > inspectionQuantity ) {
      passQuantity = 0;
      notify( 'warning', 'limit exceeds!!!' );
    }
    selectedOperator.passedQuantity = passQuantity;

    const totalPassQty = _finishingDetails.reduce( ( acc, curr ) => acc + curr.passedQuantity, 0 );
    setTotalPassedQty( totalPassQty );

    _finishingDetails[index] = selectedOperator;
    setFinishingDetails( _finishingDetails );
  };

  //on Change Defect Quantity
  const onDefectQtyChange = ( e, index ) => {
    const { value } = e.target;
    const _finishingDetails = [...finishingDetails];
    const selectedOperator = _finishingDetails[index];
    let defectQuantity = ( selectedOperator.defectQuantity = +value );
    const inspectionQuantity = selectedOperator.inspactionQuantity;
    const passQuantity = selectedOperator.passedQuantity;
    const rejectQuantity = selectedOperator.rejectQuantity;

    const compareInputValueWithInspectQty = sumofPassDefectAndRejectQty( passQuantity, defectQuantity, rejectQuantity );

    if ( compareInputValueWithInspectQty > inspectionQuantity ) {
      defectQuantity = 0;
      notify( 'warning', 'limit exceeds!!!' );
    }
    selectedOperator.defectQuantity = defectQuantity;

    const totalDefectQty = _finishingDetails.reduce( ( acc, curr ) => acc + curr.defectQuantity, 0 );
    setTotalDefectQty( totalDefectQty );

    _finishingDetails[index] = selectedOperator;
    setFinishingDetails( _finishingDetails );
  };

  //on Change Reject Quantity
  const onRejectQtyChange = ( e, index ) => {
    const { value } = e.target;
    const _finishingDetails = [...finishingDetails];
    const selectedOperator = _finishingDetails[index];
    let rejectQuantity = ( selectedOperator.rejectQuantity = +value );
    const inspectionQuantity = selectedOperator.inspactionQuantity;
    const passQuantity = selectedOperator.passedQuantity;
    const defectQuantity = selectedOperator.defectQuantity;

    const compareInputValueWithInspectQty = sumofPassDefectAndRejectQty( passQuantity, defectQuantity, rejectQuantity );

    if ( compareInputValueWithInspectQty > inspectionQuantity ) {
      rejectQuantity = 0;
      notify( 'warning', 'limit exceeds!!!' );
    }
    selectedOperator.rejectQuantity = rejectQuantity;

    const totalRejectQty = _finishingDetails.reduce( ( acc, curr ) => acc + curr.rejectQuantity, 0 );
    setTotalRejectQty( totalRejectQty );

    _finishingDetails[index] = selectedOperator;
    setFinishingDetails( _finishingDetails );
  };

  //For Cancel
  const handleCancel = () => {
    history.goBack();
  };
  //For Form Submition
  const handleSubmit = async () => {
    const payload = {
      passedProcessId: finishingMasterInfo?.passedProcessId,
      passedProcessName: finishingMasterInfo?.passedProcessName,
      date: serverDate( finishingMasterInfo?.date ),
      time: finishingMasterInfo?.time,
      buyerId: finishingMasterInfo?.buyerId,
      buyerName: finishingMasterInfo?.buyerName,
      styleId: finishingMasterInfo?.styleId,
      styleNo: finishingMasterInfo?.styleNo,
      styleCategoryId: finishingMasterInfo?.styleCategoryId,
      styleCategory: finishingMasterInfo?.styleCategory,
      totalInspaction: totalQty,
      totalPassed: totalPassedQty,
      totalDefect: totalDefectQty,
      totalReject: totalRejectQty,
      remark,
      list: finishingDetails?.map( opt => ( {
        id: opt.id,
        finishingMasterId: masterId,
        operatorId: opt?.operatorId,
        operatorName: opt?.operatorName,
        inspactionQuantity: opt?.inspactionQuantity,
        passedQuantity: opt?.passedQuantity,
        defectQuantity: opt?.defectQuantity,
        rejectQuantity: opt?.rejectQuantity
      } ) )
    };
    stringifyConsole( payload );
    const isMasterData = payload.passedProcessId && payload.time && payload.styleCategoryId && payload.date;
    if ( isMasterData ) {
      const isValidPayload = payload.list.every( e => e.inspactionQuantity === e.passedQuantity + e.defectQuantity + e.rejectQuantity );
      const isInspectQty = payload.list.some( s => s.inspactionQuantity !== 0 );
      if ( isValidPayload && isInspectQty ) {
        dispatch( dataSubmitProgressCM( true ) );
        try {
          const res = await baseAxios.put( FINISHING_API.update, payload, { params: { id: masterId } } );
          notify( 'success', 'Data Submitted Successfully!!!' );
          dispatch( dataSubmitProgressCM( false ) );
          handleCancel();
        } catch ( error ) {
          errorResponse( error );
          dispatch( dataSubmitProgressCM( false ) );
        }
      } else {
        notify( 'warning', 'Inspect quantity and others value not matched!!!' );
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
      id: 'finishing',
      name: 'Finishing',
      link: "/finishing",
      isActive: false,
      hidden: false
    },

    {
      id: 'finishing-edit',
      name: 'Finishing Edit ',
      link: "/finishing-edit",
      isActive: true,
      hidden: false
    }
  ];
  //#endregion
  return (
    <>

      <UILoader
        blocking={iSubmitProgressCM || isDataProgressCM}
        loader={<ComponentSpinner />}>

        <ActionMenu breadcrumb={breadcrumb} title="Finishing Edit">
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
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="Process Name"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={finishingMasterInfo?.passedProcessName}
                    />
                    <ErpInput
                      classNames='mt-1'
                      label="Buyer"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={finishingMasterInfo?.buyerName}
                    />
                    <ErpInput
                      classNames='mt-1'
                      label="Assigned Quantity"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={assignedQty}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="Date"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={formattedDate( finishingMasterInfo?.date )} />
                    <ErpInput
                      classNames='mt-1'
                      label="Style"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={finishingMasterInfo?.styleNo} />
                    <ErpInput
                      classNames='mt-1'
                      label="Processed Quantity"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={processQty} />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="Time"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={finishingMasterInfo?.time} />
                    <ErpInput
                      classNames='mt-1'
                      label="Style Category"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={finishingMasterInfo?.styleCategory} />
                    <ErpInput
                      classNames='mt-1'
                      label="Remaining And Current Quantity"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={remainingQty} />
                  </Col>
                </FormContentLayout>
              </Col>
            </Row>
            <div className='p-1'>
              <FormContentLayout title="Details">
                <div className='p-1'>
                  <Table bordered className='table-container'>
                    <thead >
                      <tr className="text-center">
                        <th className="text-nowrap sm-width"> SL</th>
                        <th className="text-nowrap"> Operator Name</th>
                        <th className="text-nowrap">Inspection/hour</th>
                        <th className="text-nowrap">Passed Quantity</th>
                        <th className="text-nowrap">Defect Quantity</th>
                        <th className="text-nowrap">Reject Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {finishingDetails?.map( ( pt, index ) => (
                        <tr className="text-center" key={index}>
                          <td className='sm-width'>{index + 1}</td>
                          <td className='td-width'>
                            <Input id="criticalProcessName" className="w-100 text-center" bsSize="sm" type="text" defaultValue={pt.operatorName} disabled />
                          </td>
                          <td>
                            <Input
                              id="totalCheck"
                              className="w-100 text-center"
                              type="number"
                              bsSize="sm"
                              onSelect={e => e.target.select()}
                              value={pt.inspactionQuantity}
                              onChange={e => onTotalCheckChange( e, index )}
                            />
                          </td>
                          <td>
                            <Input
                              id="passQty"
                              bsSize="sm"
                              className="w-100 text-center"
                              type="number"
                              value={pt.passedQuantity}
                              onSelect={e => e.target.select()}
                              onChange={e => onPassQtyChange( e, index )}
                            />
                          </td>
                          <td>
                            <Input
                              id="defectQty"
                              className="w-100 text-center"
                              type="number"
                              bsSize="sm"
                              value={pt.defectQuantity}
                              onSelect={e => e.target.select()}
                              onChange={e => onDefectQtyChange( e, index )}
                            />
                          </td>
                          <td>
                            <Input
                              id="rejectQty"
                              className="w-100 text-center"
                              type="number"
                              bsSize="sm"
                              value={pt.rejectQuantity}
                              onSelect={e => e.target.select()}
                              onChange={e => onRejectQtyChange( e, index )}
                            />
                          </td>
                        </tr>
                      ) )}
                    </tbody>
                    <tbody style={{ borderBottom: '2px solid #EBE9F1' }}>
                      {finishingDetails.length > 0 && (
                        <tr className='text-center'>
                          <td className='td-width' colSpan={2}>
                            <Label for="name"  >
                              Total
                            </Label>
                          </td>
                          <td >
                            <Label for="name" >
                              {totalQty}
                            </Label>
                          </td>
                          <td >
                            <Label for="name" >
                              {totalPassedQty}
                            </Label>
                          </td>
                          <td >
                            <Label for="name" >
                              {totalDefectQty}
                            </Label>
                          </td>
                          <td >
                            <Label for="name" >
                              {totalRejectQty}
                            </Label>
                          </td>
                        </tr>
                      )}
                    </tbody>
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

export default FinishingEditForm;
