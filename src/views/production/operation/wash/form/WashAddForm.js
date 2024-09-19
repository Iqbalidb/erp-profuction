/**
 * Title: Wash Add Form
 * Description: Wash Add Form
 * Author: Iqbal Hossain
 * Date: 05-January-2022
 * Modified: 05-January-2022
 */

import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import ActionMenu from 'layouts/components/menu/action-menu';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Col, Input, Label, NavItem, NavLink, Row, Table } from 'reactstrap';
import { dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { WASH_API } from 'services/api-end-points/production/v1';
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
import '../../../../../assets/scss/production/form-page-custom-table.scss';
import '../../../../../assets/scss/production/general.scss';
import { fetchProductionSubProcessByParentProcessIdAndStatus } from '../../finishing/store/actions';
import { fetchLindDetailsForSewingInspection, fillBuyerDdlByLineId, fillStyleDdlByLineAndBuyerId } from '../../sewingInspection/store/actions';
import { fetchColorByLineAndStyleId } from '../../sewingOut/store/actions';
import { fetchSizeInfoByProcessStyleColorAndLineId, resetWashingState } from '../store/actions';
const WashAddForm = () => {
  //#region Hooks
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    floorReducer: { dropDownItems: floorDdl },
    finishingReducer: { productionSubProcessDdl },
    sewingOutReducer: { colorDdl },
    commonReducers: { iSubmitProgressCM, isDataProgressCM },
    washReducer: { sizeDetailsForWash },
    sewingInspectionReducer: { buyerDdlByLineId, styleDdlByLineAndBuyerId, lineDetailsForSewingInspection: lineDdl }
  } = useSelector( state => state );

  //#endregion

  //#region States
  const parentProcessId = '5d8944b9-1a66-4eae-16d6-08da81002fc6';
  const productionProcessId = '059eb699-2bf4-47b5-73e6-08da8100e2ef';
  const [productionSubProcess, setProductionSubProcess] = useState( [] );
  const [selectedProductionSubProcess, setSelectedProductionSubProcess] = useState( null );
  const [washDate, setWashDate] = useState( new Date() );
  const [remark, setRemark] = useState( '' );
  const [floors, setFloors] = useState( [] );
  const [floor, setFloor] = useState( null );
  const [lines, setLines] = useState( [] );
  const [line, setLine] = useState( null );

  const [buyers, setBuyers] = useState( [] );
  const [buyer, setBuyer] = useState( null );
  const [styles, setStyles] = useState( [] );
  const [style, setStyle] = useState( null );

  const [colors, setColors] = useState( [] );
  const [color, setColor] = useState( null );
  const [washingSizeInfo, setwashingSizeInfo] = useState( [] );
  const [totalSizeQty, setTotalSizeQty] = useState( 0 );
  const [totalAssignQty, setTotalAssignQty] = useState( 0 );
  const [totalProcssQty, setTotalProcssQty] = useState( 0 );
  const [isLoadingTableData, setIsLoadingTableData] = useState( false );

  //#endregion

  //#region Effects

  /**
   * For Ddl Process
   */
  useEffect( () => {
    if ( parentProcessId ) {
      dispatch( fetchProductionSubProcessByParentProcessIdAndStatus( parentProcessId, true ) );
    }
  }, [dispatch] );

  /**
   * For Ddl Floor
   */
  useEffect( () => {
    if ( floorDdl?.length > 0 ) {
      setFloors( floorDdl );
    }
  }, [dispatch, floorDdl] );

  /**
   * For Set Ddl Process
   */
  useEffect( () => {
    if ( productionSubProcessDdl?.length > 0 ) {
      setProductionSubProcess( productionSubProcessDdl );
    }
  }, [dispatch, productionSubProcessDdl] );

  /**
   * For Ddl Line
   */
  useEffect( () => {
    if ( lineDdl?.length > 0 ) {
      setLines( lineDdl );
    }
  }, [dispatch, lineDdl] );

  /**
   * For Ddl Buyer
   */
  useEffect( () => {
    if ( buyerDdlByLineId?.length > 0 ) {
      setBuyers( buyerDdlByLineId );
    }
  }, [dispatch, buyerDdlByLineId] );

  /**
   * For Ddl Style
   */
  useEffect( () => {
    if ( styleDdlByLineAndBuyerId.length ) {
      setStyles( styleDdlByLineAndBuyerId );
    }
  }, [styleDdlByLineAndBuyerId] );

  /**
   * For Ddl Color
   */
  useEffect( () => {
    if ( colorDdl?.length ) {
      setColors( colorDdl );
    }
  }, [colorDdl] );

  /**
   * For Sizes
   */

  useEffect( () => {
    if ( sizeDetailsForWash.length > 0 && selectedProductionSubProcess !== null && color !== null ) {
      const modifiedSizeInfo = sizeDetailsForWash?.map( si => ( { ...si, quantity: 0 } ) );
      const _totalAssignQty = modifiedSizeInfo.reduce( ( acc, curr ) => acc + curr.assignedQuantity, 0 );
      const _totalProcessQty = modifiedSizeInfo.reduce( ( acc, curr ) => acc + curr.processedQuantity, 0 );
      setwashingSizeInfo( modifiedSizeInfo );
      setTotalAssignQty( _totalAssignQty );
      setTotalProcssQty( _totalProcessQty );
    } else {
      setwashingSizeInfo( [] );
    }
  }, [color, selectedProductionSubProcess, sizeDetailsForWash] );
  //#region Events

  //For Production Process Change
  const handleChangeProductionSubProcess = item => {
    if ( item ) {
      const isChange = item?.label !== selectedProductionSubProcess?.label;
      if ( isChange ) {
        setSelectedProductionSubProcess( item );

        setFloor( null );
        setFloors( [] );
        setLines( [] );
        setLine( null );
        setBuyer( null );
        setBuyers( [] );
        setStyle( null );
        setStyles( [] );
        setColor( null );
        setColors( [] );
        setwashingSizeInfo( [] );
      }
      setSelectedProductionSubProcess( item );
      dispatch( fillFloorDdl() );
    } else {
      setSelectedProductionSubProcess( null );
      setFloor( null );
      setFloors( [] );
      setLines( [] );
      setLine( null );
      setBuyer( null );
      setBuyers( [] );
      setStyle( null );
      setStyles( [] );
      setColor( null );
      setColors( [] );
      setwashingSizeInfo( [] );
    }
  };

  /**
   * For onChange Floor
   */
  const onChangeFloor = item => {
    if ( item ) {
      const isChange = item?.label !== floor?.label;
      if ( isChange ) {
        setFloor( item );
        setLines( [] );
        setLine( null );
        setBuyer( null );
        setBuyers( [] );
        setStyle( null );
        setStyles( [] );
        setColor( null );
        setColors( [] );
        setwashingSizeInfo( [] );
        dispatch( fetchLindDetailsForSewingInspection( item.id, productionProcessId ) );
      }
      setFloor( item );
      dispatch( fetchLindDetailsForSewingInspection( item.id, productionProcessId ) );
    } else {
      setFloor( null );
      setLines( [] );
      setLine( null );
      setBuyer( null );
      setBuyers( [] );
      setStyle( null );
      setStyles( [] );
      setColor( null );
      setColors( [] );
      setwashingSizeInfo( [] );
    }
  };

  /**
   * For onChange Line
   */
  const onChangeLine = item => {
    if ( item ) {
      const isChange = item?.label !== line?.label;
      if ( isChange ) {
        setLine( item );
        setBuyer( null );
        setBuyers( [] );
        setStyle( null );
        setStyles( [] );
        setColor( null );
        setColors( [] );
        setwashingSizeInfo( [] );
        dispatch( fillBuyerDdlByLineId( item?.id ) );
      }
      setLine( item );
      dispatch( fillBuyerDdlByLineId( item?.id ) );
    } else {
      setLine( null );
      setBuyer( null );
      setBuyers( [] );
      setStyle( null );
      setStyles( [] );
      setColor( null );
      setColors( [] );
      setwashingSizeInfo( [] );
    }
  };

  /**
   * For onChange Buyer
   */
  const onChangeBuyer = data => {
    if ( data ) {
      const isChange = data?.label !== buyer?.label;
      if ( isChange ) {
        setBuyer( data );
        setStyle( null );
        setStyles( [] );
        setColor( null );
        setColors( [] );
        setwashingSizeInfo( [] );
        dispatch( fillStyleDdlByLineAndBuyerId( line?.id, data?.buyerId ) );
      }
      dispatch( fillStyleDdlByLineAndBuyerId( line?.id, data?.buyerId ) );
      setBuyer( data );
    } else {
      setBuyer( null );
      setStyle( null );
      setStyles( [] );
      setColor( null );
      setColors( [] );
      setwashingSizeInfo( [] );
    }
  };

  /**
   * For onChange Style
   */
  const onChangeStyle = data => {
    if ( data ) {
      const isChange = data?.label !== style?.label;
      if ( isChange ) {
        setStyle( data );
        setColor( null );
        setColors( [] );
        setwashingSizeInfo( [] );
        dispatch( fetchColorByLineAndStyleId( line?.id, data?.styleId ) );
      }
      setStyle( data );
      dispatch( fetchColorByLineAndStyleId( line?.id, data?.styleId ) );
    } else {
      setStyle( null );
      setColor( null );
      setColors( [] );
      setwashingSizeInfo( [] );
    }
  };

  /**
   * For onChange Color
   */

  // const test = () =>
  //   useCallback((processId, styleId, colorId, lineId) => {
  //     dispatch(fetchSizeInfoByProcessStyleColorAndLineId(processId, styleId, colorId, lineId));
  //   }, []);

  const onChangeColor = data => {
    if ( data ) {
      const isChange = data?.label !== color?.label;
      if ( isChange ) {
        dispatch( fetchSizeInfoByProcessStyleColorAndLineId( selectedProductionSubProcess?.id, style?.styleId, data?.colorId, line?.id ) );
        setColor( data );
      }
    } else {
      setColor( null );
      setwashingSizeInfo( [] );
    }
  };

  /**
   * For onChange Washing Date
   */
  const onWashDateChange = dates => {
    const date = dates[0];
    setWashDate( date );
  };

  /**
   * For onChange Quantity
   */
  const onSizeQuantityChange = ( e, index ) => {
    const { value } = e.target;
    const _sewingOutSizeInfo = [...washingSizeInfo];
    const selectedItem = _sewingOutSizeInfo[index];
    const assignQty = selectedItem.assignedQuantity;
    const processQty = selectedItem.processedQuantity;
    const validQty = assignQty - processQty;

    let inputQuantity = +value;
    if ( inputQuantity > validQty ) {
      inputQuantity = 0;
      notify( 'warning', 'limit exceeds!!!' );
    }
    selectedItem.quantity = inputQuantity;
    _sewingOutSizeInfo[index] = selectedItem;
    const totalQty = _sewingOutSizeInfo.reduce( ( acc, curr ) => acc + curr.quantity, 0 );
    setTotalSizeQty( totalQty );
    setwashingSizeInfo( _sewingOutSizeInfo );
  };
  /**
   * For Change Route
   */
  const handleCancel = () => {
    history.goBack();
  };
  /**
   * For Washing Form Submit
   */
  const handleSubmit = async () => {
    const payload = {
      processId: selectedProductionSubProcess?.value,
      processName: selectedProductionSubProcess?.label,
      date: serverDate( washDate ),
      buyerId: buyer?.value,
      buyerName: buyer?.label,
      styleId: style?.value,
      styleNo: style?.label,
      colorId: color?.value,
      colorName: color?.label,
      floorId: floor?.value,
      floorName: floor?.label,
      lineId: line?.value,
      lineName: line?.label,
      styleCategoryId: style?.styleCategoryId,
      styleCategory: style?.styleCategory,
      totalQuantity: totalSizeQty,
      remark,
      list: washingSizeInfo?.map( wsi => ( {
        sizeId: wsi?.sizeId,
        sizeName: wsi?.sizeName,
        dayQuantity: wsi?.quantity
      } ) )
    };
    stringifyConsole( payload );
    const isMasterData = payload.processId && payload.styleCategoryId && payload.date;
    if ( isMasterData ) {
      const isInspectQty = payload.list.some( s => s.dayQuantity !== 0 );
      if ( isInspectQty ) {
        dispatch( dataSubmitProgressCM( true ) );
        try {
          const res = await baseAxios.post( WASH_API.add, payload );
          notify( 'success', 'Data Submitted Successfully!!!' );
          resetWashingState();
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
      id: 'wash',
      name: 'Wash',
      link: "/wash",
      isActive: false,
      hidden: false
    },
    {
      id: 'wash-new',
      name: 'Wash Send New',
      link: "/wash-new",
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
        <ActionMenu breadcrumb={breadcrumb} title="Wash Send New">
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
                    <ErpSelect
                      label="Process Name"
                      classNames='mt-1'
                      menuPosition="fixed"
                      id="process"
                      isSearchable
                      theme={selectThemeColors}
                      isLoading={!productionSubProcessDdl.length}
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
                      isLoading={!buyers.length}
                      options={buyers}
                      className="erp-dropdown-select"
                      classNamePrefix="dropdown"
                      value={buyer}
                      onChange={data => onChangeBuyer( data )}
                    />
                  </Col>
                  <Col lg='3' md='6' xl='3'>
                    <ErpSelect
                      label="Floor"
                      classNames='mt-1'
                      id="floor"
                      isSearchable
                      bsSize="sm"
                      theme={selectThemeColors}
                      isLoading={!floors.length}
                      options={floors}
                      className="erp-dropdown-select"
                      classNamePrefix="dropdown"
                      value={floor}
                      onChange={data => onChangeFloor( data )}
                    />
                    <ErpSelect
                      label="Style"
                      classNames='mt-1'
                      id="style"
                      isSearchable
                      bsSize="sm"
                      theme={selectThemeColors}
                      isLoading={!styles.length}
                      options={styles}
                      className="erp-dropdown-select"
                      classNamePrefix="dropdown"
                      value={style}
                      onChange={data => onChangeStyle( data )}
                    />
                  </Col>
                  <Col lg='3' md='6' xl='3'>
                    <ErpSelect
                      label="Line"
                      classNames='mt-1'
                      id="line"
                      bsSize="sm"
                      isSearchable
                      theme={selectThemeColors}
                      isLoading={!lines.length}
                      options={lines}
                      className="erp-dropdown-select"
                      classNamePrefix="dropdown"
                      value={line}
                      onChange={data => onChangeLine( data )}
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
                    <ErpDateInput
                      classNames='mt-1'
                      id="sendDate"
                      type="date"
                      maxDate={new Date()}
                      name="sendDate"
                      label="Send Date"
                      value={washDate} onChange={onWashDateChange}
                    />
                    <ErpSelect
                      label="Color"
                      classNames='mt-1'
                      id="color"
                      isSearchable
                      theme={selectThemeColors}
                      isLoading={!colors.length}
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
                      <Table bordered className='table-container'>
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
                          {washingSizeInfo.length > 0 ? (
                            washingSizeInfo?.map( ( pt, index ) => (
                              <Fragment key={pt.sizeId}>
                                <tr className="text-center">
                                  <td className='sm-width'>{index + 1}</td>

                                  <td className='td-width'>
                                    <Input id="criticalProcessName" className="w-100 text-center" type="text" bsSize="sm" value={pt?.sizeName} disabled />
                                  </td>
                                  <td>
                                    <Input id="criticalProcessName" bsSize="sm" className="w-100 text-center" type="text" value={pt?.assignedQuantity} disabled />
                                  </td>
                                  <td>
                                    <Input id="criticalProcessName" bsSize="sm" className="w-100 text-center" type="text" value={pt?.processedQuantity} disabled />
                                  </td>

                                  <td>
                                    <Input
                                      id="rejectQty"
                                      className="w-100 text-center"
                                      type="number"
                                      bsSize="sm"
                                      value={pt?.quantity}
                                      onSelect={e => e.target.select()}
                                      onChange={e => onSizeQuantityChange( e, index )}
                                    />
                                  </td>
                                </tr>
                              </Fragment>
                            ) )
                          ) : (
                            <tr className='text-center'>
                              <td colSpan={5} className="td-width">There is no record to display</td>
                            </tr>
                          )
                          }
                        </tbody>
                        <tbody >
                          {washingSizeInfo.length > 0 && (
                            <>
                              {washingSizeInfo.length > 0 && (
                                <tr className="text-center">
                                  <td colSpan={2} className="text-right mr-1">
                                    <Label for="name" >
                                      Total
                                    </Label>
                                  </td>
                                  <td>
                                    <Label for="totalAssignQty" >
                                      {totalAssignQty}
                                    </Label>
                                  </td>
                                  <td>
                                    <Label for="totalProcssQty" >
                                      {totalProcssQty}
                                    </Label>
                                  </td>
                                  <td>
                                    <Label for="totalSizeQty" >
                                      {totalSizeQty}
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

export default WashAddForm;
