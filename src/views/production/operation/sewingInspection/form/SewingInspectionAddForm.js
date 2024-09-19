/**
 * Title: SewingInspection Add Form
 * Description: SewingInspection Add Form
 * Author: Iqbal Hossain
 * Date: 05-January-2022
 * Modified: 05-January-2022
 */

import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import ActionMenu from 'layouts/components/menu/action-menu';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Col, Input, NavItem, NavLink, Row, Table } from 'reactstrap';
import { dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { SEWING_INSPECTION_API } from 'services/api-end-points/production/v1';
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
import { fillFloorDdl } from 'views/production/configuration/floor/store/actions';
import { fetchCriticalProcessInLinesByLineId, resetCriticalProcessState } from 'views/production/configuration/line/store/actions';
import { fillTimeSlotDdl } from 'views/production/configuration/timeSlots/store/actions';
import '../../../../../assets/scss/production/form-page-custom-table.scss';
import '../../../../../assets/scss/production/general.scss';
import {
  fetchAssignTargetByLineIdAndAssignDate,
  fetchLindDetailsForSewingInspection,
  fillBuyerDdlByLineId,
  fillStyleDdlByLineAndBuyerId,
  resetSewingInspectionState
} from '../store/actions';
const SewingInspectionAddForm = () => {
  //#region Hooks
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    timeSlotReducer: { dropDownItems: timeSlotDdl },
    commonReducers: { iSubmitProgressCM, isDataProgressCM },
    floorReducer: { dropDownItems: floorDdl },
    lineReducer: { loadCriticalProcessInLinesData },
    sewingInspectionReducer: { assignTargetDetails, buyerDdlByLineId, styleDdlByLineAndBuyerId, lineDetailsForSewingInspection: lineDdl }
  } = useSelector( state => state );
  const { errors } = useForm();
  //#endregion

  //#region State
  const [sewingInspectionInfo, setSewingInspectionInfo] = useState( null );
  const [floors, setFloors] = useState( [] );
  const [floor, setFloor] = useState( null );
  const [lines, setLines] = useState( [] );
  const [line, setLine] = useState( null );
  const [buyers, setBuyers] = useState( [] );
  const [buyer, setBuyer] = useState( null );
  const [styles, setStyles] = useState( [] );
  const [style, setStyle] = useState( null );
  const [processTypes, setProcessTypes] = useState( [] );
  const [timeSlots, setTimeSlots] = useState();
  const [time, setTime] = useState( null );
  const [inspectionDate, setInspectionDate] = useState( new Date() );
  const [remarks, setRemarks] = useState( '' );
  const productionProcessId = '059eb699-2bf4-47b5-73e6-08da8100e2ef';
  //#endregion
  console.log( processTypes );
  //#region Effects
  useEffect( () => {
    if ( assignTargetDetails ) {
      setSewingInspectionInfo( assignTargetDetails );
    }
  }, [assignTargetDetails] );

  /**
   * For Time Ddl
   * For Buyer Ddl
   * Get Process type by line id
   */
  useEffect( () => {
    dispatch( fillFloorDdl() );
    dispatch( fillTimeSlotDdl() );
  }, [dispatch] );

  /**
   * For  Line Ddl
   */
  useEffect( () => {
    if ( line ) {
      dispatch( fillBuyerDdlByLineId( line?.id ) );
    }
  }, [dispatch, line] );

  /**
 * For Set Floor Ddl
 */
  useEffect( () => {
    if ( floorDdl.length > 0 ) {
      setFloors( floorDdl );
    }
  }, [floorDdl] );

  /**
 * For Set Line Ddl
 */
  useEffect( () => {
    if ( lineDdl.length > 0 ) {
      setLines( lineDdl );
    }
  }, [lineDdl] );

  /**
 * For Set Time Slot Ddl
 */
  useEffect( () => {
    if ( timeSlotDdl.length > 0 ) {
      setTimeSlots( timeSlotDdl );
    }
  }, [timeSlotDdl] );

  /**
 * For Set Buyer Ddl
 */
  useEffect( () => {
    if ( buyerDdlByLineId.length > 0 ) {
      setBuyers( buyerDdlByLineId );
    }
  }, [buyerDdlByLineId] );

  /**
   * Get Target
   */
  useEffect( () => {
    const modifiedInspectionDate = serverDate( inspectionDate );
    if ( line?.id && modifiedInspectionDate ) {
      dispatch( fetchAssignTargetByLineIdAndAssignDate( line?.id, modifiedInspectionDate ) );
    }
  }, [dispatch, inspectionDate, line] );

  /**
   * Process Types Information
   */
  useEffect( () => {
    if ( loadCriticalProcessInLinesData.length ) {
      const modifiedData = loadCriticalProcessInLinesData?.map( i => ( {
        ...i,
        productionPerHour: 0,
        previousProduction: 0,
        totalCheck: 0,
        passQty: 0,
        defectQty: 0,
        rejectQty: 0
      } ) );
      setProcessTypes( modifiedData );
    }
  }, [loadCriticalProcessInLinesData] );

  /**
   * Style Ddl
   */
  useEffect( () => {
    if ( styleDdlByLineAndBuyerId.length ) {
      setStyles( styleDdlByLineAndBuyerId );
    }
  }, [styleDdlByLineAndBuyerId] );

  //#endregion

  //#region Events

  /**
 * For On Change Floor
 */
  const onChangeFloor = data => {
    if ( data ) {
      const isChange = data?.label !== floor?.label;
      if ( isChange ) {
        setLine( null );
        setLines( [] );
        setFloor( data );
        dispatch( fetchLindDetailsForSewingInspection( data.id, productionProcessId ) );
      }

      setFloor( data );
      dispatch( fetchLindDetailsForSewingInspection( data.id, productionProcessId ) );
    } else {
      setFloor( null );
      setLine( null );
      setLines( [] );
      setTime( null );
      setTimeSlots( [] );
      setBuyer( null );
      setBuyers( [] );
      setStyle( null );
      setStyles( [] );
      setProcessTypes( [] );
    }
  };

  /**
 * For On Change Line
 */
  const onChangeLine = line => {
    if ( line ) {
      setLine( line );
      dispatch( fetchCriticalProcessInLinesByLineId( line?.id ) );
    } else {
      setLine( null );
      setTime( null );
      setTimeSlots( [] );
      setBuyer( null );
      setBuyers( [] );
      setStyle( null );
      setStyles( [] );
      setProcessTypes( [] );
    }
  };

  /**
 * For On Change Buyer
 */
  const onChangeBuyer = data => {
    if ( data ) {
      dispatch( fillStyleDdlByLineAndBuyerId( line?.id, data?.buyerId ) );

      setBuyer( data );
    } else {
      setBuyer( null );
      setStyle( null );
      setStyles( [] );
      setProcessTypes( [] );
    }
  };

  /**
 * For On Change Style
 */
  const onChangeStyle = data => {
    if ( data ) {
      setStyle( data );
    } else {
      setStyle( null );
      setProcessTypes( [] );
    }
  };

  /**
  * For On Change Time Slot
  */
  const OnChangeTimeSlot = time => {
    if ( time ) {
      setTime( time );
    } else {
      setTime( null );
      setBuyer( null );
      setBuyers( [] );
      setStyle( null );
      setStyles( [] );
      setProcessTypes( [] );
    }
  };

  /**
   * For On Change Inspection Date
   */
  const onInspectionDateChange = dates => {
    const date = dates[0];
    setInspectionDate( date );
  };

  /**
   * on Change Production Per hour
   */
  const onChangeProductionPerHour = ( e, index ) => {
    const { value } = e.target;
    const _processTypes = [...processTypes];
    const selectedProcessType = _processTypes[index];
    selectedProcessType.productionPerHour = +value;
    _processTypes[index] = selectedProcessType;
    setProcessTypes( _processTypes );
  };

  /**
   *on Change previour Production
   */
  const onPreviourProductionChange = ( e, index ) => {
    const { value } = e.target;
    const _processTypes = [...processTypes];
    const selectedProcessType = _processTypes[index];
    selectedProcessType.previousProduction = +value;
    _processTypes[index] = selectedProcessType;
    setProcessTypes( _processTypes );
  };

  /**
   * on Change Inspection/Check Qty
   */
  const onTotalCheckChange = ( e, index ) => {
    const { value } = e.target;
    const _processTypes = [...processTypes];
    const selectedProcessType = _processTypes[index];
    selectedProcessType.totalCheck = +value;
    _processTypes[index] = selectedProcessType;
    setProcessTypes( _processTypes );
  };

  /**
   * Sum of Pass,Defect and Reject Quantity
   */
  const sumofPassDefectAndRejectQty = ( passQty, defectQty, rejectQty ) => {
    const passedQuantity = Number( passQty );
    const defectQuantity = Number( defectQty );
    const rejectQuantity = Number( rejectQty );
    const sumQty = passedQuantity + defectQuantity + rejectQuantity;
    return sumQty;
  };

  /**
   * on Change Passed Quantity
   */
  const onPassQtyChange = ( e, index ) => {
    const { value } = e.target;
    const _processTypes = [...processTypes];
    const selectedProcessType = _processTypes[index];
    let passQuantity = ( selectedProcessType.passQty = +value );
    const inspectionQuantity = selectedProcessType.totalCheck;
    const defectQuantity = selectedProcessType.defectQty;
    const rejectQuantity = selectedProcessType.rejectQty;

    const compareInputValueWithInspectQty = sumofPassDefectAndRejectQty( passQuantity, defectQuantity, rejectQuantity );

    if ( compareInputValueWithInspectQty > inspectionQuantity ) {
      passQuantity = 0;
      notify( 'warning', 'limit exceeds!!!' );
    }
    selectedProcessType.passQty = passQuantity;
    _processTypes[index] = selectedProcessType;
    setProcessTypes( _processTypes );
  };

  /**
   * on Change Defect Quantity
   */
  const onDefectQtyChange = ( e, index ) => {
    const { value } = e.target;
    const _processTypes = [...processTypes];
    const selectedProcessType = _processTypes[index];
    let defectQuantity = ( selectedProcessType.defectQty = +value );
    const inspectionQuantity = selectedProcessType.totalCheck;
    const passQuantity = selectedProcessType.passQty;
    const rejectQuantity = selectedProcessType.rejectQty;

    const compareInputValueWithInspectQty = sumofPassDefectAndRejectQty( passQuantity, defectQuantity, rejectQuantity );

    if ( compareInputValueWithInspectQty > inspectionQuantity ) {
      defectQuantity = 0;
      notify( 'warning', 'limit exceeds!!!' );
    }
    selectedProcessType.defectQty = defectQuantity;
    _processTypes[index] = selectedProcessType;
    setProcessTypes( _processTypes );
  };

  /**
   * on Change Reject Quantity
   */
  const onRejectQtyChange = ( e, index ) => {
    const { value } = e.target;
    const _processTypes = [...processTypes];
    const selectedProcessType = _processTypes[index];
    let rejectQuantity = ( selectedProcessType.rejectQty = +value );
    const inspectionQuantity = selectedProcessType.totalCheck;
    const passQuantity = selectedProcessType.passQty;
    const defectQuantity = selectedProcessType.defectQty;

    const compareInputValueWithInspectQty = sumofPassDefectAndRejectQty( passQuantity, defectQuantity, rejectQuantity );

    if ( compareInputValueWithInspectQty > inspectionQuantity ) {
      rejectQuantity = 0;
      notify( 'warning', 'limit exceeds!!!' );
    }
    selectedProcessType.rejectQty = rejectQuantity;
    _processTypes[index] = selectedProcessType;
    setProcessTypes( _processTypes );
  };


  /**
   * handle Cancel
   */
  const handleCancel = () => {
    dispatch( resetCriticalProcessState() );
    dispatch( resetSewingInspectionState() );
    history.goBack();
  };

  /**
   * For Submission
   */
  const handleSave = async () => {
    const payload = {
      date: serverDate( inspectionDate ),
      time: time?.label,
      styleId: style?.value,
      styleNo: style?.label,
      styleCategoryId: style?.styleCategoryId,
      styleCategory: style?.styleCategory,
      buyerId: buyer?.value,
      buyerName: buyer?.label,
      floorId: sewingInspectionInfo?.floorId,
      floorName: sewingInspectionInfo?.floorName,
      lineId: sewingInspectionInfo?.lineId,
      lineName: sewingInspectionInfo?.lineName,
      zoneId: sewingInspectionInfo?.zoneId,
      zoneName: sewingInspectionInfo?.zoneName,
      ownerEmpCode: sewingInspectionInfo?.ownerEmpCode,
      ownerName: sewingInspectionInfo?.ownerName,
      machineCount: sewingInspectionInfo?.machineCount,
      targetValue: sewingInspectionInfo?.targetValue,
      remark: remarks,
      list: processTypes?.map( pt => ( {
        criticalProcessId: pt.criticalProcessId,
        criticalProcessName: pt.criticalProcessName,
        processType: pt.processType,
        hourProduction: pt.productionPerHour,
        previousProduction: pt.previousProduction,
        inspectionQuantity: pt.totalCheck,
        passedQuantity: pt.passQty,
        defectQuantity: pt.defectQty,
        rejectQuantity: pt.rejectQty
      } ) )
    };
    stringifyConsole( payload );

    const isInpectQuantityValid = payload?.list.every( e => e.inspectionQuantity === e.passedQuantity + e.defectQuantity + e.rejectQuantity );

    if ( payload.buyerId && payload.styleId && payload.date && payload.time && isInpectQuantityValid ) {
      dispatch( dataSubmitProgressCM( true ) );
      try {
        const res = await baseAxios.post( SEWING_INSPECTION_API.add, payload );
        notify( 'success', 'Sewing Inspection has been added' );
        dispatch( dataSubmitProgressCM( false ) );
        handleCancel();

      } catch ( error ) {
        errorResponse( error );
        dispatch( dataSubmitProgressCM( false ) );
      }
    } else {
      notify( 'warning', 'Please provide all information!!!' );
    }
  };
  //#endregion

  /**
   * For Breadcrumb
   */
  const breadcrumb = [
    {
      id: 'home',
      name: 'Home',
      link: "/",
      isActive: false,
      hidden: false
    },

    {
      id: 'sewing-inspection',
      name: 'Sewing Inspection ',
      link: "/sewing-inspection",
      isActive: false,
      hidden: false
    },
    {
      id: 'sewing-inspection-new',
      name: 'New Sewing Inspection ',
      link: "/sewing-inspection-new",
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

        <ActionMenu breadcrumb={breadcrumb} title="New Sewing Inspection">
          <NavItem className="mr-1">
            <NavLink tag={Button} size="sm" color="primary" type="submit" onClick={handleSave}>
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
            <Row >
              <Col lg='12' >
                <FormContentLayout title="Master Information">
                  <Col lg='3' md='6' xl='3'>
                    <ErpSelect
                      label="Floor"
                      classNames='mt-1'
                      id="floor"
                      isSearchable
                      theme={selectThemeColors}
                      options={floors}
                      className="erp-dropdown-select"
                      classNamePrefix="dropdown"
                      value={floor}
                      onChange={data => onChangeFloor( data )}
                    />
                    <ErpDateInput
                      classNames='mt-1'
                      label="Inspection Date"
                      id="inspectionDate"
                      type="date"
                      maxDate={new Date()}
                      value={inspectionDate}
                      onChange={onInspectionDateChange}
                    />
                    <ErpInput
                      classNames='mt-1'
                      label="Machine"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={sewingInspectionInfo?.machineCount}
                    />

                  </Col>
                  <Col lg='3' md='6' xl='3'>
                    <ErpSelect
                      label="Line"
                      classNames='mt-1'
                      id="line"
                      isClearable
                      theme={selectThemeColors}
                      options={lines}
                      className="erp-dropdown-select"
                      classNamePrefix="dropdown"
                      value={line}
                      onChange={data => onChangeLine( data )}
                    />
                    <ErpSelect
                      label="Time"
                      classNames='mt-1'
                      id="time"
                      isSearchable
                      isClearable
                      theme={selectThemeColors}
                      options={timeSlots}
                      className="erp-dropdown-select"
                      classNamePrefix="dropdown"
                      value={time}
                      onChange={( time ) => OnChangeTimeSlot( time )}
                    />
                    <ErpInput
                      classNames='mt-1'
                      label="Style Category"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={style?.styleCategory}
                    />

                  </Col>
                  <Col lg='3' md='6' xl='3'>
                    <ErpInput
                      classNames='mt-1'
                      label="Zone Owner"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={sewingInspectionInfo?.ownerName}
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
                      onChange={data => onChangeBuyer( data )}
                    />


                  </Col>
                  <Col lg='3' md='6' xl='3'>
                    <ErpInput
                      classNames='mt-1'
                      label="Target Qty"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={sewingInspectionInfo?.targetValue}
                    />
                    <ErpSelect
                      label="Style"
                      classNames='mt-1'
                      id="style"
                      isSearchable
                      isClearable
                      theme={selectThemeColors}
                      options={styles}
                      className="erp-dropdown-select"
                      classNamePrefix="dropdown"
                      value={style}
                      onChange={data => onChangeStyle( data )}
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
                      <Table bordered responsive className='table-container'>

                        <thead >
                          <tr className="text-center">
                            <th className="text-nowrap"> Process Name</th>
                            <th className="text-nowrap"> Process Type</th>
                            <th className="text-nowrap">Production/hour</th>
                            <th className="text-nowrap"> Previous Repair</th>
                            <th className="text-nowrap">Inspection</th>
                            <th className="text-nowrap">Passed Quantity</th>
                            <th className="text-nowrap">Defect Quantity</th>
                            <th className="text-nowrap">Reject Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {processTypes.length > 0 ? (
                            processTypes?.map( ( pt, index ) => (
                              <tr className="text-center" key={pt.id}>
                                <td className='td-width'>
                                  <Input id="criticalProcessName" bsSize="sm" className="w-100" type="text" defaultValue={pt.criticalProcessName} disabled />
                                </td>
                                <td>
                                  <Input id="processType" bsSize="sm" className="w-100" type="text" defaultValue={pt.processType} disabled />
                                </td>

                                <td>
                                  <Input
                                    bsSize="sm"
                                    id="totalProduction"
                                    className="w-100 text-center"
                                    type="number"
                                    onSelect={e => e.target.select()}
                                    value={pt.productionPerHour}
                                    onChange={e => onChangeProductionPerHour( e, index )}
                                  />
                                </td>
                                <td>
                                  <Input
                                    bsSize="sm"
                                    id="repariFromLastHour"
                                    className="w-100 text-center"
                                    type="number"
                                    onSelect={e => e.target.select()}
                                    value={pt.previousProduction}
                                    onChange={e => onPreviourProductionChange( e, index )}
                                  />
                                </td>
                                <td>
                                  <Input
                                    bsSize="sm"
                                    id="totalCheck"
                                    className="w-100 text-center"
                                    type="number"
                                    onSelect={e => e.target.select()}
                                    value={pt.totalCheck}
                                    onChange={e => onTotalCheckChange( e, index )}
                                  />
                                </td>
                                <td>
                                  <Input
                                    bsSize="sm"
                                    id="passQty"
                                    className="w-100 text-center"
                                    type="number"
                                    value={pt.passQty}
                                    onSelect={e => e.target.select()}
                                    onChange={e => onPassQtyChange( e, index )}
                                  />
                                </td>
                                <td>
                                  <Input
                                    bsSize="sm"
                                    id="defectQty"
                                    className="w-100 text-center"
                                    type="number"
                                    value={pt.defectQty}
                                    onSelect={e => e.target.select()}
                                    onChange={e => onDefectQtyChange( e, index )}
                                  />
                                </td>
                                <td className='td-width'>
                                  <Input
                                    bsSize="sm"
                                    id="rejectQty"
                                    className="w-100 text-center"
                                    type="number"
                                    value={pt.rejectQty}
                                    onSelect={e => e.target.select()}
                                    onChange={e => onRejectQtyChange( e, index )}
                                  />
                                </td>
                              </tr>
                            ) )
                          ) : (
                            <tr className='text-center'>
                              <td colSpan={8} className="td-width">There is no record to display</td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                      <div className='mt-2'>
                        <CustomInputRemarks label="Remaks" name="remark" value={remarks} onChange={e => setRemarks( e.target.value )} />
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

export default SewingInspectionAddForm;
