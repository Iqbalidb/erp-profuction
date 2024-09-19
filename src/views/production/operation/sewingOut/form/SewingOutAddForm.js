/**
 * Title: SewingOut Add Form
 * Description: SewingOut Add Form
 * Author: Iqbal Hossain
 * Date: 05-January-2022
 * Modified: 05-January-2022
 */

import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import ActionMenu from 'layouts/components/menu/action-menu';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Col, Input, NavItem, NavLink, Row, Table } from 'reactstrap';
import { dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { SEWING_OUT_API } from 'services/api-end-points/production/v1/sewingOut';
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
import { fillTimeSlotDdl } from 'views/production/configuration/timeSlots/store/actions';
import '../../../../../assets/scss/production/form-page-custom-table.scss';
import '../../../../../assets/scss/production/general.scss';
import {
  fetchAssignTargetByLineIdAndAssignDate,
  fetchLindDetailsForSewingInspection,
  fillBuyerDdlByLineId,
  fillStyleDdlByLineAndBuyerId
} from '../../sewingInspection/store/actions';
import { fetchColorByLineAndStyleId, fetchSizeInfo, resetSewingOutState } from '../store/actions';
const SewingOutAddForm = () => {
  //#region Hooks
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    timeSlotReducer: { dropDownItems: timeSlotDdl },
    floorReducer: { dropDownItems: floorDdl },
    commonReducers: { iSubmitProgressCM, isDataProgressCM },
    sewingOutReducer: { colorDdl, sizeInfo },
    sewingInspectionReducer: { assignTargetDetails, buyerDdlByLineId, styleDdlByLineAndBuyerId, lineDetailsForSewingInspection: lineDdl }
  } = useSelector( state => state );
  const { errors } = useForm();
  //#endregion

  //#region State
  const [sewingOutInfo, setSewingOutInfo] = useState( [] );
  const [sewingOutSizeInfo, setSewingOutSizeInfo] = useState( [] );
  const [totalSizeQty, setTotalSizeQty] = useState( 0 );
  const [floors, setFloors] = useState( [] );
  const [floor, setFloor] = useState( null );
  const [lines, setLines] = useState( [] );
  const [line, setLine] = useState( null );
  const [buyers, setBuyers] = useState( [] );
  const [buyer, setBuyer] = useState( null );
  const [styles, setStyles] = useState( [] );
  const [style, setStyle] = useState( null );
  const [timeSlots, setTimeSlots] = useState( [] );
  const [time, setTime] = useState( null );
  const [colors, setColors] = useState( [] );
  const [color, setColor] = useState( null );
  const [sewingOutDate, setSewingOutDate] = useState( new Date() );
  const [remarks, setRemarks] = useState( '' );
  const productionProcessId = '059eb699-2bf4-47b5-73e6-08da8100e2ef';
  //#endregion

  //#region Effects
  useEffect( () => {
    if ( assignTargetDetails ) {
      setSewingOutInfo( assignTargetDetails );
    }
  }, [assignTargetDetails] );
  useEffect( () => {
    if ( sizeInfo ) {
      const modifiedSizeInfo = sizeInfo?.map( si => ( { ...si, quantity: 0 } ) );
      setSewingOutSizeInfo( modifiedSizeInfo );
    }
  }, [sizeInfo] );

  /**
   * For Time Ddl
   * For Buyer Ddl
   * Get Process type by line id
   */
  useEffect( () => {
    dispatch( fillFloorDdl() );
    dispatch( fillTimeSlotDdl() );
  }, [dispatch] );

  useEffect( () => {
    if ( line ) {
      dispatch( fillBuyerDdlByLineId( line?.id ) );
    }
  }, [dispatch, line] );

  useEffect( () => {
    const modifiedInspectionDate = serverDate( sewingOutDate );
    if ( line?.id && modifiedInspectionDate ) {
      dispatch( fetchAssignTargetByLineIdAndAssignDate( line?.id, modifiedInspectionDate ) );
    }
  }, [dispatch, sewingOutDate, line] );

  /**
   * Floor Ddl
   */
  useEffect( () => {
    if ( floorDdl.length > 0 ) {
      setFloors( floorDdl );
    }
  }, [floorDdl] );

  /**
   * Floor Ddl
   */
  useEffect( () => {
    if ( timeSlotDdl.length > 0 ) {
      setTimeSlots( timeSlotDdl );
    }
  }, [timeSlotDdl] );

  /**
   * Line Ddl
   */
  useEffect( () => {
    if ( lineDdl.length > 0 ) {
      setLines( lineDdl );
    }
  }, [lineDdl] );
  /**
   * Style Ddl
   */
  useEffect( () => {
    if ( styleDdlByLineAndBuyerId.length > 0 ) {
      setStyles( styleDdlByLineAndBuyerId );
    }
  }, [styleDdlByLineAndBuyerId] );
  /**
   * Style Ddl
   */
  useEffect( () => {
    if ( colorDdl?.length > 0 ) {
      setColors( colorDdl );
    }
  }, [colorDdl] );
  /**
   * Buyer Ddl
   */
  useEffect( () => {
    if ( buyerDdlByLineId?.length > 0 ) {
      setBuyers( buyerDdlByLineId );
    }
  }, [buyerDdlByLineId] );
  //#endregion

  //#region Events
  /**
   * For Floor Change
   */
  const onChangeFloor = data => {
    if ( data ) {
      const isChange = data?.label !== floor?.label;
      if ( isChange ) {
        setFloor( data );
        setLine( null );
        setLines( [] );
        setSewingOutSizeInfo( [] );
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
      setStyles( [] );
      setStyle( null );
      setColor( null );
      setColors( [] );
      setSewingOutSizeInfo( [] );
    }
  };
  /**
 * For Line Change
 */
  const onChangeLine = line => {
    if ( line ) {
      setLine( line );
    } else {
      setLine( null );
      setTime( null );
      setTimeSlots( [] );
      setBuyer( null );
      setBuyers( [] );
      setStyles( [] );
      setStyle( null );
      setColor( null );
      setColors( [] );
      setSewingOutSizeInfo( [] );
    }
  };
  /**
   * For Time Change
   */
  const onTimeSlotChange = time => {
    if ( time ) {
      setTime( time );
    } else {
      setTime( null );
      setBuyer( null );
      setBuyers( [] );
      setBuyer( null );
      setStyles( [] );
      setStyle( null );
      setColor( null );
      setColors( [] );
      setSewingOutSizeInfo( [] );
    }
  };
  /**
   * For Buyer Change
   */
  const onChangeBuyer = data => {
    if ( data ) {
      dispatch( fillStyleDdlByLineAndBuyerId( line?.id, data?.buyerId ) );
      setBuyer( data );
    } else {
      setBuyer( null );
      setBuyer( null );
      setStyles( [] );
      setStyle( null );
      setColor( null );
      setColors( [] );
      setSewingOutSizeInfo( [] );
    }
  };

  /**
  * For Style Change
  */
  const onChangeStyle = data => {
    if ( data ) {
      setStyle( data );
      dispatch( fetchColorByLineAndStyleId( line?.id, data?.styleId ) );
    } else {
      setStyle( null );
      setColor( null );
      setColors( [] );
      setSewingOutSizeInfo( [] );
    }
  };
  //For OnChange Style
  const onChangeColor = data => {
    if ( data ) {
      dispatch( fetchSizeInfo( line?.id, style?.styleId, data?.colorId ) );
      setColor( data );
    } else {
      setColor( null );
      setSewingOutSizeInfo( [] );
      dispatch( resetSewingOutState() );
    }
  };

  //on Change Reject Quantity
  const onSizeQuantityChange = ( e, index ) => {
    const { value } = e.target;
    const _sewingOutSizeInfo = [...sewingOutSizeInfo];
    const selectedItem = _sewingOutSizeInfo[index];
    selectedItem.quantity = +value;
    _sewingOutSizeInfo[index] = selectedItem;
    const totalQty = _sewingOutSizeInfo.reduce( ( acc, curr ) => acc + curr.quantity, 0 );
    setTotalSizeQty( totalQty );
    setSewingOutSizeInfo( _sewingOutSizeInfo );
  };

  //on Change Inspection Date
  const onSewingOutDateChange = dates => {
    const date = dates[0];

    setSewingOutDate( date );
  };
  //handle Cancel
  const handleCancel = () => {
    dispatch( resetSewingOutState() );
    history.goBack();
  };
  //For Submission
  const handleSave = async () => {
    const payload = {
      date: serverDate( sewingOutDate ),
      time: time?.label,
      styleId: style?.value,
      styleNo: style?.label,
      styleCategoryId: style?.styleCategoryId,
      styleCategory: style?.styleCategory,
      buyerId: buyer?.value,
      buyerName: buyer?.label,
      colorId: color?.value,
      colorName: color?.label,
      floorId: sewingOutInfo?.floorId,
      floorName: sewingOutInfo?.floorName,
      lineId: sewingOutInfo?.lineId,
      lineName: sewingOutInfo?.lineName,
      zoneId: sewingOutInfo?.zoneId,
      zoneName: sewingOutInfo?.zoneName,
      ownerEmpCode: sewingOutInfo?.ownerEmpCode,
      ownerName: sewingOutInfo?.ownerName,
      machineCount: sewingOutInfo?.machineCount,
      targetValue: sewingOutInfo?.targetValue,
      totalQuantity: totalSizeQty,
      remark: remarks,
      list: sewingOutSizeInfo?.map( so => ( {
        sizeId: so.sizeId,
        sizeName: so.sizeName,
        hourQuantity: so.quantity
      } ) )
    };
    stringifyConsole( payload );
    if ( payload.buyerId && payload.styleId && payload.date && payload.time && payload.colorId && payload.totalQuantity > 0 ) {
      dispatch( dataSubmitProgressCM( true ) );
      try {
        const res = await baseAxios.post( SEWING_OUT_API.add, payload );
        notify( 'success', 'Successfully sewing Out' );
        dispatch( dataSubmitProgressCM( false ) );
        handleCancel();

      } catch ( error ) {
        errorResponse( error );
        dispatch( dataSubmitProgressCM( false ) );
      }
    } else {
      notify( 'warning', 'Please all information!!!' );
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
      id: 'sewing-out',
      name: 'Sewing Out ',
      link: "/sewing-out",
      isActive: false,
      hidden: false
    },
    {
      id: 'sewing-out-new',
      name: 'New Sewing Out ',
      link: "/sewing-out-new",
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

        <ActionMenu breadcrumb={breadcrumb} title="New Sewing Out">
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
            <Row>
              <Col lg='12' >
                <FormContentLayout title="Master Information">
                  <Col lg='4' md='6' xl='4'>
                    <ErpSelect
                      label="Floor"
                      classNames='mt-1'
                      name="floor"
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
                      label="Sewing Out Date"
                      name="sewingOutDate"
                      id="sewingOutDate"
                      type="date"
                      maxDate={new Date()}
                      value={sewingOutDate}
                      onChange={onSewingOutDateChange}
                    />
                    <ErpSelect
                      label="Style"
                      classNames='mt-1'
                      name="style"
                      id="style"
                      isSearchable
                      theme={selectThemeColors}
                      options={styles}
                      className="erp-dropdown-select"
                      classNamePrefix="dropdown"
                      value={style}
                      onChange={data => onChangeStyle( data )}
                    />

                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpSelect
                      label="Line"
                      classNames='mt-1'
                      name="line"
                      id="line"
                      isSearchable
                      theme={selectThemeColors}
                      options={lines}
                      className="erp-dropdown-select"
                      classNamePrefix="dropdown"
                      value={line}
                      onChange={data => onChangeLine( data )}
                    />
                    <ErpSelect
                      label="Line"
                      classNames='mt-1'
                      name="Time"
                      id="time"
                      isSearchable
                      theme={selectThemeColors}
                      options={timeSlots}
                      className="erp-dropdown-select"
                      classNamePrefix="dropdown"
                      value={time}
                      onChange={( time ) => onTimeSlotChange( time )}
                    />
                    <ErpInput
                      classNames='mt-1'
                      label="Style Category"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={style?.styleCategory}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="Zone Owner"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={sewingOutInfo?.ownerName}
                    />
                    <ErpSelect
                      label="Buyer"
                      classNames='mt-1'
                      name="buyer"
                      id="buyer"
                      isSearchable
                      theme={selectThemeColors}
                      options={buyers}
                      className="erp-dropdown-select"
                      classNamePrefix="dropdown"
                      value={buyer}
                      onChange={data => onChangeBuyer( data )}
                    />
                    <ErpSelect
                      label="Color"
                      classNames='mt-1'
                      name="color"
                      id="color"
                      isSearchable
                      theme={selectThemeColors}
                      options={colors}
                      className="erp-dropdown-select"
                      classNamePrefix="dropdown"
                      value={color}
                      onChange={data => onChangeColor( data )}
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
                            <th className="text-nowrap md-width"> SL</th>
                            <th className="text-nowrap"> Size</th>
                            <th className="text-nowrap"> Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sewingOutSizeInfo.length > 0 ? (
                            sewingOutSizeInfo?.map( ( pt, index ) => (
                              <Fragment key={pt.sizeId}>
                                <tr className="text-center">
                                  <td className='md-width'>{index + 1}</td>
                                  <td className='td-width'>
                                    <Input id="criticalProcessName" bsSize="sm" className="w-100 text-center" type="text" defaultValue={pt.sizeName} disabled />
                                  </td>

                                  <td>
                                    <Input
                                      id="rejectQty"
                                      className="w-100 text-center"
                                      type="number"
                                      bsSize="sm"
                                      value={pt.quantity}
                                      onSelect={e => e.target.select()}
                                      onChange={e => onSizeQuantityChange( e, index )}
                                    />
                                  </td>
                                </tr>
                              </Fragment>
                            ) )
                          ) : (
                            <tr className='text-center'>
                              <td colSpan={3} className="td-width">There is no record to display</td>
                            </tr>
                          )}
                        </tbody>
                        {
                          sewingOutSizeInfo.length > 0 &&
                          (
                            <tbody >
                              <tr >
                                <td className="td-width text-right" colSpan={2}>Total</td>
                                <td className="text-center ">{totalSizeQty}</td>
                              </tr>
                            </tbody>
                          )
                        }
                      </Table>
                      <div className='mt-2'>
                        <CustomInputRemarks label="Remaks" name="remarks" value={remarks} onChange={e => setRemarks( e.target.value )} />
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

export default SewingOutAddForm;
