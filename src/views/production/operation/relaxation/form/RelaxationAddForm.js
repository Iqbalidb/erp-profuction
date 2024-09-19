/*
     Title: Relaxation Add Form
     Description: Relaxation Add Form
     Author: Alamgir Kabir
     Date: 15-May-2023
     Modified: 15-May-2023
*/
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import axios from 'axios';
import ActionMenu from 'layouts/components/menu/action-menu';
import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import { Copy, MinusSquare } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { Button, Col, CustomInput, Input, Label, NavItem, NavLink, Row, Table } from 'reactstrap';
import { dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { PURCHASE_ORDERS_API, STYLES_API } from 'services/api-end-points/merchandising/v1';
import { PART_GROUPS_API } from 'services/api-end-points/production/v1';
import { COLOR_INFO_API } from 'services/api-end-points/production/v1/colorInfo';
import { RELAXATION_API } from 'services/api-end-points/production/v1/relaxation';
import { errorResponse, selectThemeColors } from 'utility/Utils';
import { mapArrayToDropdown, sleep, stringifyConsole } from 'utility/commonHelper';
import FormLayout from 'utility/custom/FormLayout';
import { ErpInput } from 'utility/custom/customController/ErpInput';
import ErpSelect from 'utility/custom/customController/ErpSelect';
import FormContentLayout from 'utility/custom/customController/FormContentLayout';
import { notify } from 'utility/custom/notifications';
import { CustomInputRemarks } from 'utility/custom/production/CustomInputRemarks';
import { serverTime } from 'utility/dateHelpers';
import { v4 as uuid } from 'uuid';
import '../../../../../assets/scss/production/form-page-custom-table.scss';
import '../../../../../assets/scss/production/general.scss';

const RelaxationAddForm = () => {
  //#region Hooks
  const dispatch = useDispatch();
  const history = useHistory();
  const { iSubmitProgressCM
  } = useSelector( ( { commonReducers } ) => commonReducers );
  //#endregion

  //#region State
  const [remark, setRemark] = useState( '' );
  const [relaxationDetails, setRelaxationDetails] = useState( [] );
  const [styles, setStyles] = useState( [] );
  const [style, setStyle] = useState( null );
  const [purchaseOrders, setPurchaseOrders] = useState( [] );
  const [purchaseOrder, setPurchaseOrder] = useState( null );
  const [totalLengthYard, setTotalLengthYard] = useState( 0 );
  const [totalWidthYard, setTotalWidthYard] = useState( 0 );
  const [isLoadingTableData, setIsLoadingTableData] = useState( false );
  //#endregion

  //#region UDFs
  /**
   * Fetch Style Ddl
   */
  const fetchStylesUsedInRequisition = async () => {
    try {
      const res = await baseAxios.get( STYLES_API.fetch_style_used_in_requisition );
      const stylesDdl = mapArrayToDropdown( res.data.data, 'styleNo', 'styleId' );
      setStyles( stylesDdl );
    } catch ( err ) {
      notify( 'warning', 'server side error!!!' );
    }
  };

  //#region Effects
  useEffect( () => {
    fetchStylesUsedInRequisition();
  }, [] );
  //#endregion

  /**
   * On Change Style Order
   */
  const onStyleChange = async item => {
    if ( item ) {
      const isChange = item?.label !== style?.label;
      if ( isChange ) {
        setPurchaseOrders( [] );
        setPurchaseOrder( null );
        setRelaxationDetails( [] );
      }
      const res = await baseAxios.get( PURCHASE_ORDERS_API.fetch_used_po_in_requisition_by_style_id( item.styleId ) );
      const poDdl = mapArrayToDropdown( res.data.data, 'purchaseOrderNo', 'purchaseOrderId' );

      setPurchaseOrders( poDdl );
      setStyle( item );
    } else {
      setStyle( null );
      setPurchaseOrders( [] );
      setPurchaseOrder( null );
      setRelaxationDetails( [] );
    }
  };
  /**
   * For Change PO
   */
  const onPurchaseOrderChange = async item => {
    if ( item ) {
      const isChange = item?.label !== purchaseOrder?.label;
      if ( isChange ) {
        setRelaxationDetails( [] );
      }
      setIsLoadingTableData( true );
      await sleep( 500 );
      setPurchaseOrder( item );

      const colorReq = baseAxios.get( COLOR_INFO_API.fetch_color_in_relaxation_by_style_and_purchase_order_id( style.styleId, item.purchaseOrderId ) );
      const partGroupReq = baseAxios.get(
        PART_GROUPS_API.fetch_part_group_in_relaxation_by_style_and_purchase_order_id( style.styleId, item.purchaseOrderId )
      );
      const [colorResponse, partGroupResponse] = await axios.all( [colorReq, partGroupReq] );

      const colorDdl = mapArrayToDropdown( colorResponse.data.data, 'colorName', 'colorId' );
      const partGroupDdl = mapArrayToDropdown( partGroupResponse.data.data, 'fabricTypeName', 'fabricTypeId' );
      if ( colorDdl.length > 0 && partGroupDdl.length > 0 ) {
        const list = [
          {
            rowId: uuid(),
            colors: colorDdl,
            selectedColor: null,
            fabricTypes: partGroupDdl,
            selectedFabric: null,
            rollSlNo: '',
            startDate: new Date(),
            startTime: serverTime( new Date() ),
            lengthYard: 0,
            widthYard: 0,
            isChecked: false
          }
        ];
        setIsLoadingTableData( false );
        setRelaxationDetails( list );
      }
    } else {
      setPurchaseOrder( null );
      setRelaxationDetails( [] );
    }
  };
  /**
   * Toogle Checkbox
   */
  const handleToggleCheckbox = ( e, item, index ) => {
    const _relaxationDetails = [...relaxationDetails];
    const selectedItem = _relaxationDetails[index];

    selectedItem.isChecked = e.target.checked;
    _relaxationDetails[index] = selectedItem;
    setRelaxationDetails( _relaxationDetails );
  };
  /**
   * For Change Color
   */
  const onChangeColor = ( item, index ) => {
    const _relaxationDetails = [...relaxationDetails];

    const selectedItem = _relaxationDetails[index];
    selectedItem.selectedColor = item;
    _relaxationDetails[index] = selectedItem;
    setRelaxationDetails( _relaxationDetails );
  };
  /**
 * For Change Part Group
 */
  const onChangePartGroup = ( item, index ) => {
    const _relaxationDetails = [...relaxationDetails];

    const selectedItem = _relaxationDetails[index];
    selectedItem.selectedFabric = item;
    _relaxationDetails[index] = selectedItem;
    setRelaxationDetails( _relaxationDetails );
  };
  /**
 * For Change Role SL
 */
  const onRollSLNoChange = ( e, index ) => {
    const _relaxationDetails = [...relaxationDetails];

    const selectedItem = _relaxationDetails[index];
    selectedItem.rollSlNo = e.target.value;
    _relaxationDetails[index] = selectedItem;
    setRelaxationDetails( _relaxationDetails );
  };
  /**
 * For Change Length
 */
  const onLengthChange = ( e, index ) => {
    const _relaxationDetails = [...relaxationDetails];

    const selectedItem = _relaxationDetails[index];
    selectedItem.lengthYard = Number( e.target.value );

    const _totalLengthInyard = _relaxationDetails.reduce( ( acc, curr ) => acc + curr.lengthYard, 0 );
    setTotalLengthYard( _totalLengthInyard );

    _relaxationDetails[index] = selectedItem;
    setRelaxationDetails( _relaxationDetails );
  };
  /**
 * For Change Width
 */
  const onWidthChange = ( e, index ) => {
    const _relaxationDetails = [...relaxationDetails];

    const selectedItem = _relaxationDetails[index];
    selectedItem.widthYard = Number( e.target.value );

    const _totalWidthInyard = _relaxationDetails.reduce( ( acc, curr ) => acc + curr.widthYard, 0 );
    setTotalWidthYard( _totalWidthInyard );

    _relaxationDetails[index] = selectedItem;
    setRelaxationDetails( _relaxationDetails );
  };
  /**
 * For Change Start Date
 */
  const onStartDateChange = ( e, index ) => {
    const _relaxationDetails = [...relaxationDetails];

    const selectedItem = _relaxationDetails[index];

    selectedItem.startDate = e.target.value;
    _relaxationDetails[index] = selectedItem;
    setRelaxationDetails( _relaxationDetails );
  };
  /**
 * For Change Start Time
 */
  const onStartTimeChange = ( e, index ) => {
    const _relaxationDetails = [...relaxationDetails];
    const selectedItem = _relaxationDetails[index];
    selectedItem.startTime = e.target.value;
    _relaxationDetails[index] = selectedItem;
    setRelaxationDetails( _relaxationDetails );
  };
  /**
   * Add Row
   */
  const handleAddRow = ( item, index ) => {
    const _relaxationDetails = [...relaxationDetails];
    const selectedItem = _relaxationDetails[index];
    _relaxationDetails.splice( index + 1, 0, { ...selectedItem, rowId: uuid(), isCloned: true, isChecked: false } );
    if ( item.isChecked ) {
      const _totalLengthInyard = _relaxationDetails.reduce( ( acc, curr ) => acc + curr.lengthYard, 0 );
      setTotalLengthYard( _totalLengthInyard );

      const _totalWidthInyard = _relaxationDetails.reduce( ( acc, curr ) => acc + curr.widthYard, 0 );
      setTotalWidthYard( _totalWidthInyard );

      setRelaxationDetails( _relaxationDetails );
    }
  };
  /**
   * Remove Duplicate Row
   */
  const handleRemoveRow = ( item, index ) => {
    const _relaxationDetails = [...relaxationDetails];

    _relaxationDetails.splice( index, 1 );

    const _totalLengthInyard = _relaxationDetails.reduce( ( acc, curr ) => acc + curr.lengthYard, 0 );
    setTotalLengthYard( _totalLengthInyard );

    const _totalWidthInyard = _relaxationDetails.reduce( ( acc, curr ) => acc + curr.widthYard, 0 );
    setTotalWidthYard( _totalWidthInyard );

    setRelaxationDetails( _relaxationDetails );
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
    const checkedItems = relaxationDetails?.filter( rqd => rqd?.isChecked );
    const list = checkedItems?.map( item => ( {
      colorId: item?.selectedColor?.colorId,
      colorName: item?.selectedColor?.colorName,
      fabricTypeId: item?.selectedFabric?.value,
      fabricTypeName: item?.selectedFabric?.label,
      rollSlNo: item?.rollSlNo,
      startDate: item?.startDate,
      startTime: item?.startTime,
      startLengthInYard: item?.lengthYard,
      startWidthInYard: item?.widthYard,
      endLengthInYard: null,
      endWidthInYard: null,
      endDate: null,
      endTime: ''
    } ) );
    const payload = {
      styleNo: style?.label,
      styleId: style?.value,
      buyerId: purchaseOrder?.buyerId,
      buyerName: purchaseOrder?.buyerName,
      styleCategoryId: purchaseOrder?.styleCategoryId,
      styleCategory: purchaseOrder?.styleCategory,

      purchaseOrderId: purchaseOrder?.purchaseOrderId,
      purchaseOrderNo: purchaseOrder?.purchaseOrderNo,
      merchandiserName: purchaseOrder?.merchandiserName,
      merchandiserId: purchaseOrder?.merchandiserId,
      totalStartLength: totalLengthYard,
      totalStartWidth: totalWidthYard,
      totalEndLength: null,
      totalEndWidth: null,
      remarks: remark,

      list
    };
    stringifyConsole( payload );
    const isValidPayload = payload.list.some( rq => rq.startLengthInYard !== 0 || rq.startWidthInYard !== 0 );
    if ( purchaseOrder !== null && isValidPayload ) {
      dispatch( dataSubmitProgressCM( true ) );
      try {
        await baseAxios.post( RELAXATION_API.add, payload );
        notify( 'success', 'Relaxation has been added' );
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
      id: 'relaxation-list',
      name: 'Relaxation ',
      link: "/relaxation-list",
      isActive: false,
      hidden: false
    },

    {
      id: 'relaxation-new',
      name: 'New Relaxation',
      link: "/relaxation-new",
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

        <ActionMenu breadcrumb={breadcrumb} title="New Relaxation">
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
            <Row className="">
              <Col lg='12' className=''>
                <FormContentLayout title="Master Information">
                  <Col lg='4' md='6' xl='4'>
                    <ErpSelect
                      label="Style"
                      classNames='mt-1'
                      name="groupTypeName"
                      id="style"
                      isSearchable
                      // isClearable
                      theme={selectThemeColors}
                      options={styles}
                      isLoading={!styles.length}
                      className="erp-dropdown-select"
                      classNamePrefix="dropdown"
                      value={style}
                      onChange={onStyleChange}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpSelect
                      label="PO"
                      classNames='mt-1'
                      id="po"
                      bsSize="sm"
                      // isClearable
                      isSearchable
                      theme={selectThemeColors}
                      options={purchaseOrders}
                      isLoading={!purchaseOrders.length}
                      className="erp-dropdown-select"
                      classNamePrefix="dropdown"
                      value={purchaseOrder}
                      onChange={onPurchaseOrderChange}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="Requisition No"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={purchaseOrder?.requisitionNo}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="Buyer"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={purchaseOrder?.buyerName}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="Style Category"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={purchaseOrder?.styleCategory ? purchaseOrder.styleCategory : ''}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="Merchandiser"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={purchaseOrder?.merchandiserName}
                    />
                  </Col>
                </FormContentLayout>
              </Col>
            </Row>
            <div className='p-1'>
              <FormContentLayout title="Details">
                <div className='p-1'>
                  <Table bordered responsive className='table-container'>
                    <thead >
                      <tr className="text-center">
                        <th className="text-nowrap sm-width"> #</th>
                        <th className="text-nowrap md-width"> ##</th>
                        <th className="text-nowrap"> Color</th>
                        <th className="text-nowrap"> Fabric Type</th>
                        <th className="text-nowrap"> Roll. SL</th>
                        <th className="text-nowrap">Lenght(In Yards)</th>
                        <th className="text-nowrap">Width(In Yards)</th>
                        <th className="text-nowrap"> Start Date</th>
                        <th className="text-nowrap"> Start Time</th>
                      </tr>
                    </thead>
                    {isLoadingTableData ? (
                      <div style={{ height: '150px' }}>
                        <ComponentSpinner colSpanNo={8} />
                      </div>
                    ) : (
                      <>
                        <tbody>
                          {relaxationDetails.length > 0 ? (
                            relaxationDetails.map( ( reli, index ) => (
                              <Fragment key={index + 1}>
                                <tr className="text-center">
                                  <td>
                                    <CustomInput
                                      type="checkbox"
                                      className="custom-control-primary"
                                      id={`pod-${reli.rowId}`}
                                      checked={reli.isChecked}
                                      inline
                                      onChange={e => handleToggleCheckbox( e, reli, index )}
                                    />
                                  </td>
                                  <td className="sm-width-td">
                                    {reli.isCloned ? (
                                      <>
                                        <Button
                                          style={{ padding: '0.486rem 0.5rem' }}
                                          for="removeRow"
                                          tag={Label}
                                          onClick={() => handleRemoveRow( reli, index )}
                                          className="btn-sm"
                                          color="flat-danger"
                                        >
                                          <MinusSquare size={18} />
                                        </Button>
                                        <Button
                                          for="dulplicateRow"
                                          tag={Label}
                                          onClick={() => handleAddRow( reli, index )}
                                          className="btn-sm"
                                          color="flat-warning"
                                        >
                                          <Copy size={18} />
                                        </Button>
                                      </>
                                    ) : (
                                      <Button
                                        for="dulplicateRow"
                                        tag={Label}
                                        onClick={() => handleAddRow( reli, index )}
                                        className="btn-sm"
                                        color="flat-warning"
                                      >
                                        <Copy size={18} />
                                      </Button>
                                    )}
                                  </td>
                                  <td >
                                    <Select
                                      menuPosition="fixed"
                                      id="color"
                                      isDisabled={!reli.isChecked}
                                      theme={selectThemeColors}
                                      options={reli.colors}
                                      isLoading={!reli.colors}
                                      className="erp-dropdown-select "
                                      classNamePrefix="dropdown"
                                      value={reli.selectedColor}
                                      onChange={item => onChangeColor( item, index )}
                                    />
                                  </td>
                                  <td >
                                    <Select
                                      menuPosition="fixed"
                                      id="fabricType"
                                      isDisabled={!reli.isChecked}
                                      theme={selectThemeColors}
                                      options={reli.fabricTypes}
                                      isLoading={!reli.fabricTypes}
                                      className="erp-dropdown-select"
                                      classNamePrefix="dropdown"
                                      value={reli.selectedFabric}
                                      onChange={item => onChangePartGroup( item, index )}
                                    />
                                  </td>
                                  <td >
                                    <Input
                                      id="rollSlNo"
                                      type="text"
                                      bsSize="sm"
                                      disabled={!reli.isChecked}
                                      value={reli.rollSlNo}
                                      onChange={e => onRollSLNoChange( e, index )}
                                    />
                                  </td>
                                  <td >
                                    <Input
                                      id="lengthYard"
                                      className="w-100 text-center"
                                      type="number"
                                      bsSize="sm"
                                      disabled={!reli.isChecked}
                                      value={reli.lengthYard}
                                      onSelect={e => e.target.select()}
                                      onChange={e => onLengthChange( e, index )}
                                    />
                                  </td>
                                  <td >
                                    <Input
                                      id="widthYard"
                                      className="w-100 text-center"
                                      type="number"
                                      bsSize="sm"
                                      disabled={!reli.isChecked}
                                      value={reli.widthYard}
                                      onSelect={e => e.target.select()}
                                      onChange={e => onWidthChange( e, index )}
                                    />
                                  </td>
                                  <td >
                                    <Input
                                      id="startDate"
                                      className="w-100 text-center"
                                      type="date"
                                      bsSize="sm"
                                      disabled={!reli.isChecked}
                                      name="startDate"
                                      value={moment( reli.startDate ).format( 'YYYY-MM-DD' )}
                                      onChange={e => onStartDateChange( e, index )}
                                    />
                                  </td>
                                  <td >
                                    <Input
                                      id="criticalProcessName"
                                      className="w-100 text-center"
                                      type="time"
                                      bsSize="sm"
                                      disabled={!reli.isChecked}
                                      value={reli.startTime}
                                      onChange={e => onStartTimeChange( e, index )}
                                    />
                                  </td>
                                </tr>
                              </Fragment>
                            ) )
                          ) : (
                            <tr className='text-center'>
                              <td colSpan={9} className='td-width'>There is no record to display</td>
                            </tr>
                          )
                          }
                        </tbody>
                      </>
                    )}
                    {relaxationDetails.length > 0 && (
                      <tbody style={{ borderBottom: '2px solid #EBE9F1' }}>
                        <tr >
                          <td colSpan={5} className="text-right">
                            <Label for="name" className="td-width" >
                              Total
                            </Label>
                          </td>
                          <td className="text-center">
                            <Label for="name" >
                              {totalLengthYard}
                            </Label>
                          </td>
                          <td className="text-center">
                            <Label for="name" >
                              {totalWidthYard}
                            </Label>
                          </td>
                        </tr>
                      </tbody>
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

export default RelaxationAddForm;
