/*
     Title: Relaxation Requisition Add Form
     Description: Relaxation Requisition Add Form
     Author: Alamgir Kabir
     Date: 30-March-2023
     Modified: 30-March-2023
*/
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import axios from 'axios';
import ActionMenu from 'layouts/components/menu/action-menu';
import { Fragment, useState } from 'react';
import { Copy, MinusSquare } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { Button, Col, CustomInput, Input, Label, NavItem, NavLink, Row, Table } from 'reactstrap';
import { dataProgressCM, dataSubmitProgressCM, getStyleDropdown } from 'redux/actions/common';
import { baseAxios, merchandisingAxiosInstance } from 'services';
import { PURCHASE_ORDERS_API, STYLES_API } from 'services/api-end-points/merchandising/v1';
import { PURCHASE_ORDER_DETAILS_API } from 'services/api-end-points/production/v1';
import { REQUISITION_API } from 'services/api-end-points/production/v1/requisition';
import { errorResponse, selectThemeColors } from 'utility/Utils';
import { mapArrayToDropdown, stringifyConsole } from 'utility/commonHelper';
import FormLayout from 'utility/custom/FormLayout';
import ErpDateInput from 'utility/custom/customController/ErpDateInput';
import { ErpInput } from 'utility/custom/customController/ErpInput';
import ErpSelect from 'utility/custom/customController/ErpSelect';
import FormContentLayout from 'utility/custom/customController/FormContentLayout';
import { notify } from 'utility/custom/notifications';
import { CustomInputRemarks } from 'utility/custom/production/CustomInputRemarks';
import { serverDate } from 'utility/dateHelpers';
import { v4 as uuid } from 'uuid';
import '../../../../../assets/scss/production/form-page-custom-table.scss';
import '../../../../../assets/scss/production/general.scss';
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
    id: 'requisition-list',
    name: 'Requisition',
    link: "/requisition-list",
    isActive: false,
    hidden: false
  },

  {
    id: 'requisition-new',
    name: 'New Requisition',
    link: "/requisition-new",
    isActive: true,
    hidden: false
  }
];
const RelaxationRequisitionAddForm = () => {
  //#region Hooks
  const dispatch = useDispatch();
  const history = useHistory();
  const { iSubmitProgressCM, isDataProgressCM
  } = useSelector( ( { commonReducers } ) => commonReducers );

  //#endregion
  const { stylesDropdowncm, isStyleDropdowncm } = useSelector( ( { commonReducers } ) => commonReducers );

  //#region States
  const [requisitionDetails, setRequisitionDetails] = useState( [] );
  const [styles, setStyles] = useState( [] );
  const [style, setStyle] = useState( null );
  const [styleDetails, setStyleDetails] = useState( null );
  const [purchaseOrders, setPurchaseOrders] = useState( [] );
  const [purchaseOrder, setPurchaseOrder] = useState( null );
  const [requisitionDate, setRequisitionDate] = useState( new Date() );
  const [remark, setRemark] = useState( '' );
  const [totalQtyInYards, setTotalQtyInYards] = useState( 0 );
  const [totalQtyInRoll, setTotalQtyInRoll] = useState( 0 );
  //#endregion

  //#region UDF's

  /**
   * Fetch Style Ddl
   */
  const fetchStyles = async () => {
    try {
      const res = await merchandisingAxiosInstance.get( STYLES_API.fetch_all );
      const stylesDdl = mapArrayToDropdown( res.data.data, 'styleNo', 'id' );
      setStyles( stylesDdl );
    } catch ( err ) {
      notify( 'warning', 'server side error!!!' );
    }
  };
  const handleStyleDropdown = () => {
    dispatch( getStyleDropdown() );

  };
  //#region Effects

  //#endregion

  //#region Events

  /**
   * On Change Requisition Date
   */
  const onChangeRequisitionDate = dates => {
    const date = dates[0];
    setRequisitionDate( date );
  };

  /**
   * On Change Style Order
   */
  const
    onStyleChange = async item => {
      if ( item ) {
        const isChange = item?.label !== style?.label;
        if ( isChange ) {
          setPurchaseOrder( null );
          setRequisitionDetails( [] );
        }

        const styleDetailsReq = merchandisingAxiosInstance.get( `${STYLES_API.fetch_by_id}/${item.id}` );
        const poDetailsReq = merchandisingAxiosInstance.get( PURCHASE_ORDERS_API.fetch_PO_with_buyer_and_style( item.buyerId, item.id ) );
        const [styleDetailsRes, poDetailsRes] = await axios.all( [styleDetailsReq, poDetailsReq] );

        setStyleDetails( styleDetailsRes?.data );

        const poDdl = mapArrayToDropdown( poDetailsRes.data, 'orderNumber', 'orderId' );
        setPurchaseOrders( poDdl );
        setStyle( item );
      } else {
        setStyle( null );
        setPurchaseOrder( null );
        setPurchaseOrders( [] );
        setRequisitionDetails( [] );
      }
    };
  /**
   * On Change Purchase Order
   */
  const onPurchaseOrderChange = async item => {
    if ( item ) {
      const isChange = item?.label !== purchaseOrder?.label;
      if ( isChange ) {
        setRequisitionDetails( [] );
      }
      setPurchaseOrder( item );
      dispatch( dataProgressCM( true ) );
      const res = await baseAxios.get( PURCHASE_ORDER_DETAILS_API.fetch_size_color_ration( item?.orderId, style?.id ) );
      const modifiedData = res.data.data.map( item => ( {
        ...item,
        rowId: uuid(),
        requiredQtyInRoll: 0,
        requiredQtyInYards: 0,
        isChecked: false,
        selectedGroupPart: null,
        getPartGroupDto: item.getPartGroupDto.map( pt => ( { ...pt, label: pt.name, value: pt.id } ) )
      } ) );

      setRequisitionDetails( modifiedData );
      dispatch( dataProgressCM( false ) );
    } else {
      setPurchaseOrder( null );
      setRequisitionDetails( [] );
    }
  };
  /**
   * Toogle Checkbox
   */
  const handleToggleCheckbox = ( e, item, index ) => {
    const _requisitionDetails = [...requisitionDetails];
    const selectedItem = _requisitionDetails[index];

    selectedItem.isChecked = e.target.checked;
    _requisitionDetails[index] = selectedItem;
    setRequisitionDetails( _requisitionDetails );
  };
  /**
   * On Fabric Change
   */
  const onChangePartGroupDto = ( item, index ) => {
    const _requisitionDetails = [...requisitionDetails];
    const _partGroupDto = _requisitionDetails.map( pgt => ( { ...pgt } ) );
    const selectedItem = _partGroupDto[index];

    selectedItem.selectedGroupPart = item;
    _requisitionDetails[index] = selectedItem;
    setRequisitionDetails( _requisitionDetails );
  };
  /**
   * On Yard Qty Change
   */
  const onYardQtyChange = ( e, index ) => {
    const _requisitionDetails = [...requisitionDetails];
    const selectedItem = _requisitionDetails[index];

    selectedItem.requiredQtyInYards = Number( e.target.value );

    const _totalQtyInyard = _requisitionDetails.reduce( ( acc, curr ) => acc + curr.requiredQtyInYards, 0 );
    setTotalQtyInYards( _totalQtyInyard );

    _requisitionDetails[index] = selectedItem;
    setRequisitionDetails( _requisitionDetails );
  };
  /**
   * On Require Quantity Change
   */
  const onRollQtyChange = ( e, index ) => {
    const _requisitionDetails = [...requisitionDetails];
    const selectedItem = _requisitionDetails[index];

    selectedItem.requiredQtyInRoll = Number( e.target.value );

    const _totalQtyInRoll = _requisitionDetails.reduce( ( acc, curr ) => acc + curr.requiredQtyInRoll, 0 );
    setTotalQtyInRoll( _totalQtyInRoll );

    _requisitionDetails[index] = selectedItem;
    setRequisitionDetails( _requisitionDetails );
  };
  /**
   * Add Row
   */
  const handleAddRow = ( item, index ) => {
    const _requisitionDetails = [...requisitionDetails];
    const selectedItem = _requisitionDetails[index];

    _requisitionDetails.splice( index + 1, 0, { ...selectedItem, rowId: uuid(), isCloned: true, isChecked: true } );
    if ( item.isChecked && item.selectedGroupPart !== null && item.requiredQtyInRoll !== 0 ) {
      const _totalQtyInyard = _requisitionDetails.reduce( ( acc, curr ) => acc + curr.requiredQtyInYards, 0 );
      setTotalQtyInYards( _totalQtyInyard );

      const _totalQtyInRoll = _requisitionDetails.reduce( ( acc, curr ) => acc + curr.requiredQtyInRoll, 0 );
      setTotalQtyInRoll( _totalQtyInRoll );

      setRequisitionDetails( _requisitionDetails );
    }
  };
  /**
   * Remove Duplicate Row
   */
  const handleRemoveRow = ( item, index ) => {
    const _requisitionDetails = [...requisitionDetails];

    _requisitionDetails.splice( index, 1 );
    const _totalQtyInyard = _requisitionDetails.reduce( ( acc, curr ) => acc + curr.requiredQtyInYards, 0 );
    setTotalQtyInYards( _totalQtyInyard );

    const _totalQtyInRoll = _requisitionDetails.reduce( ( acc, curr ) => acc + curr.requiredQtyInRoll, 0 );
    setTotalQtyInRoll( _totalQtyInRoll );

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
    const checkedItems = requisitionDetails?.filter( rqd => rqd?.isChecked );
    const list = checkedItems?.map( item => ( {
      colorId: item.colorId,
      colorName: item.color,
      fabricTypeId: item?.selectedGroupPart?.value,
      fabricTypeName: item?.selectedGroupPart?.label,
      quantityYard: item?.requiredQtyInYards,
      quantityRoll: item?.requiredQtyInRoll
    } ) );
    const payload = {
      requisitionDate: serverDate( requisitionDate ),
      styleNo: style?.label,
      styleId: style?.value,
      styleCategoryId: styleDetails?.styleCategoryId,
      styleCategory: styleDetails?.styleCategory,
      buyerId: style?.buyerId,
      buyerName: style?.buyerName,
      purchaseOrderId: purchaseOrder?.orderId,
      purchaseOrderNo: purchaseOrder?.orderNumber,
      merchandiserName: style?.merchandiser,
      merchandiserId: styleDetails?.merchandiserId,
      totalQuantityYard: totalQtyInYards,
      totalQuantityRoll: totalQtyInRoll,
      remarks: remark,
      list
    };
    stringifyConsole( payload );
    const isValidPayload = payload.list.some( rq => rq.quantityRoll !== 0 || rq.quantityYard !== 0 );

    if ( purchaseOrder !== null && isValidPayload ) {
      dispatch( dataSubmitProgressCM( true ) );
      try {
        const res = await baseAxios.post( REQUISITION_API.add, payload );
        notify( 'success', 'Requisition has been added' );
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
  return (
    <>
      <UILoader
        blocking={iSubmitProgressCM}
        loader={<ComponentSpinner />}>
        <ActionMenu breadcrumb={breadcrumb} title="New Requisition">
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
              <Col lg='12' >
                <FormContentLayout title="Master Information">
                  <Col lg='4' md='6' xl='4'>
                    <ErpDateInput
                      classNames='mt-1'
                      label="Requisition Date"
                      id="requisitionDate"
                      type="date"
                      maxDate={new Date()}
                      name="requisitionDate"
                      value={requisitionDate}
                      onChange={onChangeRequisitionDate}
                    />
                  </Col>
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
                      onFocus={fetchStyles}
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
                      label="Buyer"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={style?.buyerName}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="Style Category"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={style?.styleCategory ? style.styleCategory : ''}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="Merchandiser"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={style?.merchandiser}
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
                        <th className="text-nowrap sm-width"> #</th>
                        <th className="text-nowrap md-width"> ##</th>
                        <th className="text-nowrap"> Color</th>
                        <th className="text-nowrap"> Fabric Type</th>
                        <th className="text-nowrap">Requisition Qty (In Yards)</th>
                        <th className="text-nowrap">Requisition Qty (In Roll)</th>
                      </tr>
                    </thead>
                    {isDataProgressCM ? (
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
                                  <td >
                                    <CustomInput
                                      type="checkbox"
                                      className="custom-control-primary"
                                      id={`pod-${rqd.rowId}`}
                                      checked={rqd.isChecked}
                                      inline
                                      bsSize="sm"
                                      onChange={e => handleToggleCheckbox( e, rqd, index )}
                                    />
                                  </td>
                                  <td className="sm-width-td">
                                    {rqd.isCloned ? (
                                      <>
                                        <Button.Ripple
                                          // style={{ padding: '0.486rem 0.5rem' }}
                                          for="removeRow"
                                          tag={Label}
                                          onClick={() => handleRemoveRow( rqd, index )}
                                          className="btn-sm"
                                          bsSize="sm"
                                          color="flat-danger"
                                        >
                                          <MinusSquare size={16} />
                                        </Button.Ripple>
                                        <Button.Ripple
                                          for="dulplicateRow"
                                          tag={Label}
                                          onClick={() => handleAddRow( rqd, index )}
                                          className="btn-sm"
                                          color="flat-warning"
                                          bsSize="sm"
                                        >
                                          <Copy size={16} />
                                        </Button.Ripple>
                                      </>
                                    ) : (
                                      <Button.Ripple
                                        for="dulplicateRow"
                                        tag={Label}
                                        onClick={() => handleAddRow( rqd, index )}
                                        className="btn-sm"
                                        color="flat-warning"
                                        bsSize="sm"
                                      >
                                        <Copy size={16} />
                                      </Button.Ripple>
                                    )}
                                  </td>
                                  <td>
                                    <Input id="criticalProcessName" className="td-width text-center" type="text" bsSize="sm" value={rqd?.color} disabled />
                                  </td>
                                  <td >
                                    <Select
                                      menuPosition="fixed"
                                      id="fabricType"
                                      bsSize="sm"
                                      theme={selectThemeColors}
                                      options={rqd?.getPartGroupDto}
                                      isDisabled={!rqd.isChecked}
                                      className="erp-dropdown w-100"
                                      classNamePrefix="dropdown"
                                      value={rqd.selectedGroupPart}
                                      onChange={item => onChangePartGroupDto( item, index )}
                                    />
                                  </td>
                                  <td>
                                    <Input
                                      id="requiredQtyInYards"
                                      className="td-width text-center"
                                      type="number"
                                      bsSize="sm"
                                      disabled={!rqd.isChecked}
                                      value={rqd?.requiredQtyInYards}
                                      onSelect={e => e.target.select()}
                                      onChange={e => onYardQtyChange( e, index )}
                                    />
                                  </td>
                                  <td>
                                    <Input
                                      id="requiredQtyInRoll"
                                      className="w-100 text-center"
                                      type="number"
                                      bsSize="sm"
                                      disabled={!rqd.isChecked}
                                      value={rqd?.requiredQtyInRoll}
                                      onSelect={e => e.target.select()}
                                      onChange={e => onRollQtyChange( e, index )}
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
                              <td className='td-width text-right' colSpan={4}>
                                <Label for="name" className=" text-dark font-weight-bolder " >
                                  Total
                                </Label>
                              </td>
                              <td className="text-center">
                                <Label for="name" className=" text-dark font-weight-bolder ">
                                  {totalQtyInYards}
                                </Label>
                              </td>
                              <td className="text-center">
                                <Label for="name" className=" text-dark font-weight-bolder ">
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

export default RelaxationRequisitionAddForm;
/** Change Log
 *
 */
