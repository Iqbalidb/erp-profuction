
/**
 * Title: Finishing Add Form
 * Description: Finishing Add Form
 * Author: Iqbal Hossain
 * Date: 05-January-2022
 * Modified: 05-January-2022
 */
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import axios from 'axios';
import ActionMenu from 'layouts/components/menu/action-menu';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Col, Input, Label, NavItem, NavLink, Row, Table } from 'reactstrap';
import { dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { FINISHING_API } from 'services/api-end-points/production/v1/finishing';
import { TRANSFER_STORE_API } from 'services/api-end-points/production/v1/transfarStore';
import { errorResponse, selectThemeColors } from 'utility/Utils';
import { stringifyConsole } from 'utility/commonHelper';
import FormContentLayout from 'utility/custom/FormContentLayout';
import FormLayout from 'utility/custom/FormLayout';
import ErpDateInput from 'utility/custom/customController/ErpDateInput';
import { ErpInput } from 'utility/custom/customController/ErpInput';
import ErpSelect from 'utility/custom/customController/ErpSelect';
import { notify } from 'utility/custom/notifications';
import { CustomInputRemarks } from 'utility/custom/production/CustomInputRemarks';
import { serverDate } from 'utility/dateHelpers';
import { fillTimeSlotDdl } from 'views/production/configuration/timeSlots/store/actions';
import '../../../../../assets/scss/production/form-page-custom-table.scss';
import '../../../../../assets/scss/production/general.scss';
import {
  fetchBuyerByProductionProcessId,
  fetchOperatorByProductionProcessId,
  fetchProductionSubProcessByParentProcessIdAndStatus,
  fetchStyleByProductionProcessIdAndBuyerId,
  resetFinishingState
} from '../store/actions';
const FinishingAddForm = () => {
  //#region Hooks
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    finishingReducer: { productionSubProcessDdl, operatorDdl, buyerDdl, styleDdl },
    timeSlotReducer: { dropDownItems: timeSlotDdl },
    commonReducers: { iSubmitProgressCM, isDataProgressCM }

  } = useSelector( state => state );
  //#endregion
  console.log( isDataProgressCM );
  //#region States
  const parentProcessId = 'da39dad9-488f-446f-16d7-08da81002fc6';
  const [selectedProductionSubProcess, setSelectedProductionSubProcess] = useState( null );
  const [time, setTime] = useState( null );
  const [finishingDate, setFinishingDate] = useState( new Date() );
  const [remark, setRemark] = useState( '' );
  const [operatorDetails, setOperatorDetails] = useState( [] );
  const [buyers, setBuyers] = useState( [] );
  const [buyer, setBuyer] = useState( null );
  const [styles, setStyles] = useState( [] );
  const [style, setStyle] = useState( null );
  const [assignedQty, setAssignedQty] = useState( 0 );
  const [processQty, setProcessQty] = useState( 0 );
  const [remainingQty, setRemainingQty] = useState( 0 );
  const [totalQty, setTotalQty] = useState( 0 );
  const [totalPassedQty, setTotalPassedQty] = useState( 0 );
  const [totalDefectQty, setTotalDefectQty] = useState( 0 );
  const [totalRejectQty, setTotalRejectQty] = useState( 0 );
  //#endregion

  //#region Effects
  useEffect( () => {
    if ( parentProcessId ) {
      dispatch( fetchProductionSubProcessByParentProcessIdAndStatus( parentProcessId, true ) );
    }
  }, [dispatch] );

  /**
   * For Time Slot ddl
   */
  useEffect( () => {
    dispatch( fillTimeSlotDdl() );
  }, [dispatch] );

  /**
   * For Buyer Ddl
   */
  useEffect( () => {
    if ( buyerDdl.length > 0 ) {
      setBuyers( buyerDdl );
    } else {
      setBuyers( [] );
      setStyles( [] );
      setBuyer( null );
      setStyle( null );
    }
  }, [buyerDdl, dispatch] );

  /**
   * For Style Ddl
   */
  useEffect( () => {
    if ( styleDdl.length > 0 ) {
      setStyles( styleDdl );
    } else {
      setStyles( [] );
    }
  }, [dispatch, styleDdl] );

  /**
   * For Operator Details
   */
  useEffect( () => {
    if ( operatorDdl.length > 0 ) {
      const modifiedOperatorDetails = operatorDdl?.map( i => ( {
        ...i,
        totalCheck: 0,
        passQty: 0,
        defectQty: 0,
        rejectQty: 0
      } ) );
      setOperatorDetails( modifiedOperatorDetails );
    } else {
      setOperatorDetails( [] );
    }
  }, [dispatch, operatorDdl] );

  /**
   * For master data reset
   */
  useEffect( () => {
    if ( operatorDetails.length > 0 ) {
      const checkInspectQty = operatorDetails?.reduce( ( acc, curr ) => acc + curr.totalCheck, 0 );
      if ( checkInspectQty === 0 ) {
        setTotalQty( 0 );
        setTotalPassedQty( 0 );
        setTotalDefectQty( 0 );
        setTotalRejectQty( 0 );
      }
    }
  }, [operatorDetails] );
  //#endregion

  //#region Events
  /**
   * For Production Process Change
   */
  const handleChangeProductionSubProcess = item => {
    if ( item ) {
      const isChange = item?.label !== selectedProductionSubProcess?.label;
      if ( isChange ) {
        setBuyers( [] );
        setStyles( [] );
        setStyle( null );
        setBuyer( null );
        setAssignedQty( 0 );
        setRemainingQty( 0 );
        setProcessQty( 0 );
        setOperatorDetails( [] );
      }
      setSelectedProductionSubProcess( item );
      dispatch( fetchOperatorByProductionProcessId( item.id ) );
      dispatch( fetchBuyerByProductionProcessId( item.id ) );
    } else {
      setBuyers( [] );
      setStyles( [] );
      setStyle( null );
      setBuyer( null );
      setAssignedQty( 0 );
      setRemainingQty( 0 );
      setProcessQty( 0 );
      setOperatorDetails( [] );
    }
  };

  /**
   * For Buyer Change
   */
  const handleChangeBuyer = buyer => {
    if ( buyer ) {
      setBuyer( buyer );
      dispatch( fetchStyleByProductionProcessIdAndBuyerId( selectedProductionSubProcess?.id, buyer.buyerId ) );
    } else {
      setStyles( [] );
      setStyle( null );
      setBuyer( null );
      setAssignedQty( 0 );
      setRemainingQty( 0 );
      setProcessQty( 0 );
    }
  };

  /**
   * For Style Change
   */
  const handleChangeStyle = async style => {
    if ( style ) {
      const transferStoreRequest = baseAxios.get(
        TRANSFER_STORE_API.fetch_assigned_quantity_by_buyer_style_production_process_id( buyer.buyerId, style.styleId, selectedProductionSubProcess.id )
      );
      const finishingProcessedQtyRequest = baseAxios.get(
        FINISHING_API.fetch_finishing_processed_quantity( buyer.buyerId, style.styleId, selectedProductionSubProcess.id )
      );
      const [transferStoreResponse, finishingProcessedQtyResponse] = await axios.all( [transferStoreRequest, finishingProcessedQtyRequest] );

      const processedQty = finishingProcessedQtyResponse.data.data;
      const asgQty = transferStoreResponse.data.data;
      setProcessQty( processedQty );
      setAssignedQty( asgQty );
      setRemainingQty( asgQty - processedQty );
      setStyle( style );
    } else {
      setStyle( null );
      setAssignedQty( 0 );
      setRemainingQty( 0 );
      setProcessQty( 0 );
    }
  };

  //For Finishing Date Change
  const onFinishingDateChange = dates => {
    const date = dates[0];
    setFinishingDate( date );
  };

  //on Change Inspection/Check Qty
  const onTotalCheckChange = ( e, index ) => {
    const { value } = e.target;
    const _operatorDetails = [...operatorDetails];
    const selectedOperator = _operatorDetails[index];
    let checkQty = ( selectedOperator.totalCheck = +value );

    const totalQtyForCompareRemainingQty = _operatorDetails.reduce( ( acc, curr ) => acc + curr.totalCheck, 0 );

    if ( totalQtyForCompareRemainingQty > remainingQty ) {
      checkQty = 0;
      notify( 'warning', 'limit exceeds!!!' );
    }
    if ( checkQty === 0 ) {
      selectedOperator.passQty = 0;
      selectedOperator.defectQty = 0;
      selectedOperator.rejectQty = 0;
    }
    selectedOperator.totalCheck = checkQty;
    //reset master data
    const totalQty = _operatorDetails.reduce( ( acc, curr ) => acc + curr.totalCheck, 0 );
    const totalPassedQty = _operatorDetails.reduce( ( acc, curr ) => acc + curr.passQty, 0 );
    const totalDefectQty = _operatorDetails.reduce( ( acc, curr ) => acc + curr.defectQty, 0 );
    const totalRejectQty = _operatorDetails.reduce( ( acc, curr ) => acc + curr.rejectQty, 0 );

    setTotalQty( totalQty );
    setTotalPassedQty( totalPassedQty );
    setTotalDefectQty( totalDefectQty );
    setTotalRejectQty( totalRejectQty );

    _operatorDetails[index] = selectedOperator;
    setOperatorDetails( _operatorDetails );
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
    const _operatorDetails = [...operatorDetails];
    const selectedOperator = _operatorDetails[index];
    let passQuantity = ( selectedOperator.passQty = +value );
    const inspectionQuantity = selectedOperator.totalCheck;
    const defectQuantity = selectedOperator.defectQty;
    const rejectQuantity = selectedOperator.rejectQty;

    const compareInputValueWithInspectQty = sumofPassDefectAndRejectQty( passQuantity, defectQuantity, rejectQuantity );

    if ( compareInputValueWithInspectQty > inspectionQuantity ) {
      passQuantity = 0;
      notify( 'warning', 'limit exceeds!!!' );
    }
    selectedOperator.passQty = passQuantity;

    const totalPassQty = _operatorDetails.reduce( ( acc, curr ) => acc + curr.passQty, 0 );
    setTotalPassedQty( totalPassQty );

    _operatorDetails[index] = selectedOperator;
    setOperatorDetails( _operatorDetails );
  };

  //on Change Defect Quantity
  const onDefectQtyChange = ( e, index ) => {
    const { value } = e.target;
    const _operatorDetails = [...operatorDetails];
    const selectedOperator = _operatorDetails[index];
    let defectQuantity = ( selectedOperator.defectQty = +value );
    const inspectionQuantity = selectedOperator.totalCheck;
    const passQuantity = selectedOperator.passQty;
    const rejectQuantity = selectedOperator.rejectQty;

    const compareInputValueWithInspectQty = sumofPassDefectAndRejectQty( passQuantity, defectQuantity, rejectQuantity );

    if ( compareInputValueWithInspectQty > inspectionQuantity ) {
      defectQuantity = 0;
      notify( 'warning', 'limit exceeds!!!' );
    }
    selectedOperator.defectQty = defectQuantity;

    const totalDefectQty = _operatorDetails.reduce( ( acc, curr ) => acc + curr.defectQty, 0 );
    setTotalDefectQty( totalDefectQty );

    _operatorDetails[index] = selectedOperator;
    setOperatorDetails( _operatorDetails );
  };

  //on Change Reject Quantity
  const onRejectQtyChange = ( e, index ) => {
    const { value } = e.target;
    const _operatorDetails = [...operatorDetails];
    const selectedOperator = _operatorDetails[index];
    let rejectQuantity = ( selectedOperator.rejectQty = +value );
    const inspectionQuantity = selectedOperator.totalCheck;
    const passQuantity = selectedOperator.passQty;
    const defectQuantity = selectedOperator.defectQty;

    const compareInputValueWithInspectQty = sumofPassDefectAndRejectQty( passQuantity, defectQuantity, rejectQuantity );

    if ( compareInputValueWithInspectQty > inspectionQuantity ) {
      rejectQuantity = 0;
      notify( 'warning', 'limit exceeds!!!' );
    }
    selectedOperator.rejectQty = rejectQuantity;

    const totalRejectQty = _operatorDetails.reduce( ( acc, curr ) => acc + curr.rejectQty, 0 );
    setTotalRejectQty( totalRejectQty );

    _operatorDetails[index] = selectedOperator;
    setOperatorDetails( _operatorDetails );
  };
  //For Cancel
  const handleCancel = () => {
    history.goBack();
    dispatch( resetFinishingState() );
  };

  //For Form Submition
  const handleSubmit = async () => {
    const payload = {
      passedProcessId: selectedProductionSubProcess?.value,
      passedProcessName: selectedProductionSubProcess?.label,
      date: serverDate( finishingDate ),
      time: time?.label,
      buyerId: buyer?.value,
      buyerName: buyer?.label,
      styleId: style?.value,
      styleNo: style?.label,
      styleCategoryId: style?.styleCategoryId,
      styleCategory: style?.styleCategory,
      totalInspaction: totalQty,
      totalPassed: totalPassedQty,
      totalDefect: totalDefectQty,
      totalReject: totalRejectQty,
      remark,
      list: operatorDetails?.map( opt => ( {
        operatorId: opt?.id,
        operatorName: opt?.name,
        inspactionQuantity: opt?.totalCheck,
        passedQuantity: opt?.passQty,
        defectQuantity: opt?.defectQty,
        rejectQuantity: opt?.rejectQty
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
          const res = await baseAxios.post( FINISHING_API.add, payload );
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
      id: 'finishing-new',
      name: 'Finishing New ',
      link: "/finishing-new",
      isActive: true,
      hidden: false
    }
  ];
  //#endregion

  return (
    <>

      <UILoader
        blocking={iSubmitProgressCM}
        loader={<ComponentSpinner />}>

        <ActionMenu breadcrumb={breadcrumb} title="Finishing New">
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
                    <ErpSelect
                      label="Process Name"
                      classNames='mt-1'
                      menuPosition="fixed"
                      id="process"
                      isSearchable
                      theme={selectThemeColors}
                      options={productionSubProcessDdl}
                      className="erp-dropdown-select"
                      classNamePrefix="dropdown"
                      value={selectedProductionSubProcess}
                      onChange={data => handleChangeProductionSubProcess( data )}
                    />
                    <ErpSelect
                      label="Buyer"
                      classNames='mt-1'
                      id="buyer"
                      isSearchable
                      bsSize="sm"
                      theme={selectThemeColors}
                      options={buyers}
                      className="erp-dropdown-select"
                      classNamePrefix="dropdown"
                      value={buyer}
                      onChange={buyer => handleChangeBuyer( buyer )}
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
                    <ErpDateInput
                      classNames='mt-1'
                      id="finishingDate"
                      type="date"
                      maxDate={new Date()}
                      name="finishingDate"
                      label="Finishing Date"
                      value={finishingDate}
                      onChange={onFinishingDateChange}
                    />
                    <ErpSelect
                      label="Style"
                      classNames='mt-1'
                      id="style"
                      isSearchable
                      bsSize="sm"
                      theme={selectThemeColors}
                      options={styles}
                      className="erp-dropdown-select"
                      classNamePrefix="dropdown"
                      value={style}
                      onChange={style => handleChangeStyle( style )}
                    />
                    <ErpInput
                      classNames='mt-1'
                      label="Processed Quantity"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={processQty}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>

                    <ErpSelect
                      label="Time"
                      classNames='mt-1'
                      id="time"
                      isSearchable
                      theme={selectThemeColors}
                      options={timeSlotDdl}
                      className="erp-dropdown-select"
                      classNamePrefix="dropdown"
                      value={time}
                      onChange={data => {
                        setTime( data );
                      }}
                    />
                    <ErpInput
                      classNames='mt-1'
                      label="Style Category"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={style?.styleCategory}
                    />
                    <ErpInput
                      classNames='mt-1'
                      label="Remaining Quantity"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={remainingQty}
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
                          {operatorDetails?.length > 0 ? (
                            operatorDetails?.map( ( pt, index ) => (
                              <tr className="text-center" key={index}>
                                <td className='sm-width'>{index + 1}</td>
                                <td className='td-width'>
                                  <Input id="criticalProcessName" className="w-100" bsSize="sm" type="text" defaultValue={pt.name} disabled />
                                </td>

                                <td>
                                  <Input
                                    id="totalCheck"
                                    className="w-100 text-center"
                                    type="number"
                                    bsSize="sm"
                                    onSelect={e => e.target.select()}
                                    value={pt.totalCheck}
                                    onChange={e => onTotalCheckChange( e, index )}
                                  />
                                </td>
                                <td>
                                  <Input
                                    id="passQty"
                                    className="w-100 text-center"
                                    type="number"
                                    bsSize="sm"
                                    value={pt.passQty}
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
                                    value={pt.defectQty}
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
                                    value={pt.rejectQty}
                                    onSelect={e => e.target.select()}
                                    onChange={e => onRejectQtyChange( e, index )}
                                  />
                                </td>
                              </tr>
                            ) )
                          ) : (
                            <tr className='text-center'>
                              <td colSpan={6} className="td-width">There is no record to display</td>
                            </tr>
                          )}
                        </tbody>
                        <tbody >
                          {operatorDetails?.length > 0 && (
                            <tr className='text-center'>
                              <td colSpan={2} className='text-center'>
                                <Label for="name" >
                                  Total
                                </Label>
                              </td>
                              <td >
                                <Label for="name" >
                                  {totalQty}
                                </Label>
                              </td>
                              <td >
                                <Label for="name">
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
                    </>
                  )}

                </div>
              </FormContentLayout>
            </div>
          </FormLayout>
        </div>
      </UILoader>

    </>
  );
};

export default FinishingAddForm;
