import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import axios from 'axios';
import classNames from 'classnames';
import ActionMenu from 'layouts/components/menu/action-menu';
import { Fragment, useEffect, useReducer, useState } from 'react';
import { Copy, Loader, Maximize2, Minimize2, MinusSquare } from 'react-feather';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { Button, Col, Collapse, CustomInput, Input, Label, NavItem, NavLink, Row, Table } from 'reactstrap';
import { baseAxios, merchandisingAxiosInstance } from 'services';
import { GARMENT_SIZE_GROUPS_API, PURCHASE_ORDERS_API, STYLES_API } from 'services/api-end-points/merchandising/v1';
import { CONTRAST_PARTS_API, PURCHASE_ORDER_DETAILS_API, STYLE_WISE_PRODUCT_PARTS_GROUP_API } from 'services/api-end-points/production/v1';
import { errorResponse, selectThemeColors } from 'utility/Utils';
import { mapArrayToDropdown, sleep } from 'utility/commonHelper';
import FormContentLayout from 'utility/custom/FormContentLayout';
import FormLayout from 'utility/custom/FormLayout';
import ErpDateInput from 'utility/custom/customController/ErpDateInput';
import { ErpInput } from 'utility/custom/customController/ErpInput';
import ErpSelect from 'utility/custom/customController/ErpSelect';
import { notify } from 'utility/custom/notifications';
import CustomInputBox from 'utility/custom/production/CustomInput';
import { formattedDate, serverDate } from 'utility/dateHelpers';
import '../../../../../assets/scss/production/form-page-custom-table.scss';
import '../../../../../assets/scss/production/general.scss';
import {
  CUT_QUANTITY_CHANGE,
  DATE_CHANGE,
  EXTRA_PERCENTAGE_CHANGE, LOADING_SIZE_COLOR_RATIO, LOAD_SIZE_COLOR_DETAILS,
  LOAD_STYLES, ON_COLOR_DETAIL_SIZE_CHANGE,
  ON_DUPLICATE_ROW,
  ON_FOCUS_COLOR_DETAILS_PRODUCT_PART,
  ON_PRODUCT_PART_CHANGE,
  ON_REMOVE_ROW,
  SIZE_GROUP_CHANGE,
  STYLE_CHANGE,
  TOGGLE_COLOR_DETAILS_CHECK,
  TOGGLE_PO_DETAILS
} from '../store/actionTypes';
import { initialFormState, productStockFormReducer } from '../store/reducers';
// import classes from '../styles/ProductPartsStockForm.module.scss';
const PartsStockCreate = () => {
  //#region Hooks
  const history = useHistory();
  const [state, dispatch] = useReducer( productStockFormReducer, initialFormState );
  const [iSubmitProgressCM, setISubmitProgressCM] = useState( false );
  const [isLoadingTableData, setIsLoadingTableData] = useState( false );
  //#endregion

  //#region Effects
  useEffect( () => {
    let isMounted = true;
    const controller = new AbortController();
    const fetchStyles = async () => {
      try {
        const res = await merchandisingAxiosInstance.get( STYLES_API.fetch_all, { signal: controller.signal } );
        const stylesDdl = mapArrayToDropdown( res.data.data, 'styleNo', 'id' );
        isMounted && dispatch( { type: LOAD_STYLES, payload: stylesDdl } );
      } catch ( err ) {
        notify( 'warning', 'server side error!!!' );
      }
    };
    fetchStyles();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [] );
  //#endregion

  //#region Events
  /**
   * For Start Date Change
   */
  const onStartDateChange = dates => {
    const date = dates[0];
    dispatch( { type: DATE_CHANGE, payload: { startDate: date } } );
  };
  /**
   * For Style Change
   */
  const onStyleChange = async style => {
    try {
      const styleDetailsReq = merchandisingAxiosInstance.get( `${STYLES_API.fetch_by_id}/${style.id}` );
      const poDetailsReq = merchandisingAxiosInstance.get( PURCHASE_ORDERS_API.fetch_PO_with_buyer_and_style( style.buyerId, style.id ) );
      // const productPartsReq = baseAxios.get(STYLE_WISE_PRODUCT_PARTS_GROUP_API.fetch_product_parts_by_style(style.id));

      const [styleDetailsRes, poDetailsRes] = await axios.all( [styleDetailsReq, poDetailsReq] );
      if ( styleDetailsRes.status === 200 && poDetailsRes.status === 200 ) {
        dispatch( {
          type: STYLE_CHANGE,
          payload: {
            style,
            styleDetails: styleDetailsRes.data,
            poDetails: poDetailsRes.data
          }
        } );
      } else {
        notify( 'warning', 'data not loaded yet!!!' );
      }
    } catch ( err ) {
      notify( 'warning', 'server side error!!!' );
    }
  };
  /**
   * For Size Group Change
   */
  const onSizeGroupChange = async sizeGroup => {
    setIsLoadingTableData( true );
    try {
      const res = await merchandisingAxiosInstance.get( `${GARMENT_SIZE_GROUPS_API.fetch_by_id}/${sizeGroup.id}` );
      const sizesInSizeGroup = res.data;
      dispatch( { type: SIZE_GROUP_CHANGE, payload: { sizeGroup, sizesInSizeGroup } } );
      setIsLoadingTableData( false );
    } catch ( error ) {
      errorResponse( error );
      setIsLoadingTableData( false );

    }
  };
  /**
   * For Toggle PO Details
   */
  const onTogglePoDetails = async poDetailIndex => {
    const hasLoadedColorRatio = Boolean( state.purchaseOrderDetailsBySizeGroup[poDetailIndex].colorDetails );
    if ( hasLoadedColorRatio ) {
      dispatch( { type: TOGGLE_PO_DETAILS, payload: { poDetailIndex } } );
    } else {
      dispatch( { type: LOADING_SIZE_COLOR_RATIO, payload: { poDetailIndex, toggle: true } } );
      const purchaseOrderId = state.purchaseOrderDetailsBySizeGroup[poDetailIndex].orderId;
      const styleId = state.purchaseOrderDetailsBySizeGroup[poDetailIndex].styleId;
      try {
        const res = await baseAxios.get( PURCHASE_ORDER_DETAILS_API.fetch_size_color_ration( purchaseOrderId, styleId ) );
        await sleep( 500 );
        dispatch( { type: LOADING_SIZE_COLOR_RATIO, payload: { poDetailIndex, toggle: false } } );
        if ( !res.data.succeeded ) {
          notify( 'warning', 'color ration not found!!' );
        } else {
          dispatch( { type: LOAD_SIZE_COLOR_DETAILS, payload: { poDetailIndex, colorDetails: res.data.data } } );
        }
      } catch ( err ) {
        notify( 'error', 'color ration not found!!' );
      }
    }
  };
  /**
   * For Toggle Color Details Checkbox
   */
  const onToggleColorDetailCheck = ( e, poDetailIndex, colorDetailIndex ) => {
    const { checked } = e.target;
    dispatch( { type: TOGGLE_COLOR_DETAILS_CHECK, payload: { checked, poDetailIndex, colorDetailIndex } } );
  };
  /**
   * For Clone Row
   */
  const onDuplicateRow = ( poDetailIndex, colorDetailIndex, colorDetail ) => {
    if ( colorDetail.selectedSize && colorDetail.selectedProductPart && colorDetail.inQuantity !== 0 ) {
      dispatch( { type: ON_DUPLICATE_ROW, payload: { poDetailIndex, colorDetailIndex, colorDetail } } );
    }
  };
  /**
   * For Remove Row
   */
  const onRemoveRow = ( poDetailIndex, colorDetailIndex ) => {
    dispatch( { type: ON_REMOVE_ROW, payload: { poDetailIndex, colorDetailIndex } } );
  };
  /**
   * For Size Change
   */
  const onColorDetailSizeChange = ( item, poDetailIndex, colorDetailIndex ) => {
    if ( item ) {
      dispatch( { type: ON_COLOR_DETAIL_SIZE_CHANGE, payload: { item, poDetailIndex, colorDetailIndex } } );
    }
  };
  /**
   * For Product Part Change
   */
  const onColorDetailProductPartChange = async ( item, poDetailIndex, colorDetailIndex ) => {
    if ( item ) {
      dispatch( { type: ON_PRODUCT_PART_CHANGE, payload: { item, poDetailIndex, colorDetailIndex } } );
    }
  };
  /**
 * For Get Product Part on Focus
 */
  const onFocusColorDetailProductPart = async ( poDetailIndex, colorDetailIndex, styleId, colorId, orderId ) => {
    const res = await baseAxios.get( STYLE_WISE_PRODUCT_PARTS_GROUP_API.fetch_product_parts_by_style_color( styleId, colorId, orderId ) );
    if ( res.data.succeeded ) {
      dispatch( {
        type: ON_FOCUS_COLOR_DETAILS_PRODUCT_PART,
        payload: {
          poDetailIndex,
          colorDetailIndex,
          styleId,
          colorId,
          productParts: res.data.data
        }
      } );
    }
  };
  /**
   * For Extra Percentage Change
   */
  const onExtraPercentageChange = ( e, poDetailIndex, colorDetailIndex ) => {
    const { value } = e.target;
    dispatch( { type: EXTRA_PERCENTAGE_CHANGE, payload: { value, poDetailIndex, colorDetailIndex } } );
  };
  /**
   * For Quantity Change
   */
  const onInQuantityChange = ( e, poDetailIndex, colorDetailIndex ) => {
    const { value } = e.target;
    dispatch( { type: CUT_QUANTITY_CHANGE, payload: { value, poDetailIndex, colorDetailIndex } } );
  };

  /**
   * Back to Prev Route
   */
  const handleCancel = () => {
    history.goBack();
  };
  /**
   * For Submission
   */
  const onSubmit = async e => {
    e.preventDefault();
    console.log( 'hi' );
    const poWithColorDetails = state.purchaseOrderDetailsBySizeGroup.filter( po => po.colorDetails && po.colorDetails.some( cd => cd.isChecked ) );
    const colorDetails = poWithColorDetails
      .map( pcd => pcd.colorDetails.map( cd => ( {
        ...cd,
        styleId: pcd.styleId,
        buyerId: pcd.buyerId,
        buyerName: pcd.buyerName,
        styleCategoryId: state.selectedStyleDetails.styleCategoryId,
        styleCategory: state.selectedStyleDetails.styleCategory,
        styleNo: state.selectedStyleDetails.styleNo,
        poNo: pcd.orderNumber,
        poId: pcd.orderId,
        destination: pcd.deliveryDestination,
        shipmentDate: serverDate( pcd.shipmentDate ),
        shipmentMode: pcd.shipmentMode,
        inspectionDate: serverDate( pcd.inspectionDate ),
        orderQty: pcd.orderQuantity,
        orderUOM: pcd.orderUOM,
        excessPercentage: pcd.excessQuantityPercentage.toString(),
        wastagePercentage: pcd.wastageQuantityPercentage.toString()
      } ) )
      )
      .flat()
      .filter( checkedColorDetail => checkedColorDetail.isChecked );
    const isValidAllColorDetails = colorDetails.every( cd => cd.selectedSize && cd.selectedProductPart && cd.inQuantity && cd.inQuantity > 0 );
    if ( state.selectedStyle && state.selectedSizeGroup && isValidAllColorDetails ) {

      const totalQty = colorDetails.reduce( ( acc, curr ) => acc + curr.inQuantity, 0 );
      const payload = {
        cuttingDate: serverDate( state.date ),
        cuttingType: 'Contrast',
        totalQuantity: totalQty,
        listContrastParts: colorDetails.map( cd => ( {
          styleId: cd.styleId,
          styleNo: cd.styleNo,
          buyerId: cd.buyerId,
          buyerName: cd.buyerName,
          styleCategoryId: cd.styleCategoryId,
          styleCategory: cd.styleCategory,
          poNo: cd.poNo,
          poId: cd.poId,
          destination: cd.destination,
          shipmentDate: cd.shipmentDate,
          shipmentMode: cd.shipmentMode,
          colorId: cd.colorId,
          colorName: cd.color,
          sizeId: cd.selectedSize?.value,
          sizeName: cd.selectedSize?.label,
          partGroupId: cd.selectedProductPart?.partGroupsId,
          partGroupName: cd.selectedProductPart?.partGroupsName,
          productPartsId: cd.selectedProductPart?.value,
          productPartsName: cd.selectedProductPart?.label,
          quantityIn: cd.inQuantity,
          quantityOut: 0
        } ) )
      };
      setISubmitProgressCM( true );

      try {
        const res = await baseAxios.post( CONTRAST_PARTS_API.create, payload );
        notify( 'success', 'Part stock has been added' );
        setISubmitProgressCM( false );
        handleCancel();

      } catch ( error ) {
        errorResponse( error );
        setISubmitProgressCM( false );
      }
    } else {
      notify( 'warning', 'Please fill all selected fields!!!' );
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
      id: 'parts-stock',
      name: 'Parts Stock',
      link: "/parts-stock",
      isActive: false,
      hidden: false
    },
    {
      id: 'parts-stock-new',
      name: 'New Parts Stock',
      link: "/parts-stock-new",
      isActive: true,
      hidden: false
    }
  ];
  //#endregion
  return (
    <>

      <ActionMenu breadcrumb={breadcrumb} title="Parts Stock">
        <NavItem className="mr-1">
          <NavLink tag={Button} size="sm" color="primary" type="submit" onClick={onSubmit}>
            Save
          </NavLink>
        </NavItem>
        <NavItem className="mr-1">
          <NavLink tag={Button} size="sm" color="secondary" onClick={handleCancel}>
            Cancel
          </NavLink>
        </NavItem>
      </ActionMenu>
      <UILoader
        blocking={iSubmitProgressCM}
        loader={<ComponentSpinner />}>
        <div className='general-form-container' >
          <FormLayout isNeedTopMargin={true} >
            <Row className="">
              <Col lg='12' className=''>
                <FormContentLayout title="Master Information">
                  <Col lg='4' md='6' xl='4'>
                    <ErpDateInput
                      classNames='mt-1'
                      label="Start Date"
                      id="date"
                      type="date"
                      maxDate={new Date()} name="date" value={state.date} onChange={onStartDateChange}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpSelect
                      label="Style"
                      classNames='mt-1'
                      name="style"
                      id="style"
                      isSearchable
                      theme={selectThemeColors}
                      options={state.styles}
                      isLoading={!state.styles.length}
                      value={state.selectedStyle}
                      className="erp-dropdown-select"
                      classNamePrefix="dropdown"
                      onChange={onStyleChange}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpSelect
                      label="Size Groups"
                      classNames='mt-1'
                      id="sizeGroup"
                      bsSize="sm"
                      maxMenuHeight="100px"
                      isSearchable
                      theme={selectThemeColors}
                      options={state.sizeGroups}
                      isLoading={!state.sizeGroups.length}
                      value={state.selectedSizeGroup}
                      className="erp-dropdown-select"
                      classNamePrefix="dropdown"
                      onChange={onSizeGroupChange}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="Style Category"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={state.selectedStyleDetails?.styleCategory}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="Buyer Name"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={state.selectedStyleDetails?.buyerName}
                    />
                  </Col>
                </FormContentLayout>
              </Col>
            </Row>
            <div className='p-1'>
              <FormContentLayout title="Details">
                <div className='p-1'>
                  {isLoadingTableData ? (
                    <div style={{ height: '350px' }}>
                      <ComponentSpinner />
                    </div>
                  ) : (
                    <Table bordered responsive className='table-container'>
                      <thead >
                        <tr className="text-center text-nowrap">
                          <th className="text-nowrap sm-width">
                            <strong>#</strong>
                          </th>
                          <th>
                            <strong>PO No</strong>
                          </th>
                          <th>
                            <strong>Destination</strong>
                          </th>
                          <th>
                            <strong>Inspection Date</strong>
                          </th>
                          <th>
                            <strong>Shipment Mode</strong>
                          </th>
                          <th>
                            <strong>Shipment Date</strong>
                          </th>

                          <th>
                            <strong>Order Qty</strong>
                          </th>
                          <th>
                            <strong>Order UOM</strong>
                          </th>

                          <th>
                            <strong>Excess Qty</strong>
                          </th>
                          <th>
                            <strong>Wastage Qty</strong>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-center">
                        {state.purchaseOrderDetailsBySizeGroup.length > 0 ? (
                          state.purchaseOrderDetailsBySizeGroup.map( ( pod, podetailIndex ) => (
                            <Fragment key={pod.fieldId}>
                              <tr>
                                <td className='sm-width'>
                                  <Button
                                    for="collapseId"
                                    tag={Label}
                                    onClick={() => onTogglePoDetails( podetailIndex )}
                                    className="btn-sm"
                                    color="flat-primary"
                                    disabled={pod.isLoadingSizeColorRatio}
                                  >
                                    {pod.isLoadingSizeColorRatio ? (
                                      <Loader size={14} color="#57C69D" />
                                    ) : pod.isOpen ? (
                                      <Minimize2 size={14} color="#57C69D" />
                                    ) : (
                                      <Maximize2 id="collapseId" size={14} color="#7367f0" />
                                    )}
                                  </Button>
                                </td>
                                <td>{pod.orderNumber}</td>
                                <td>{pod.deliveryDestination}</td>
                                <td>{formattedDate( pod.inspectionDate )}</td>
                                <td>{pod.shipmentMode}</td>
                                <td>{formattedDate( pod.shipmentDate )}</td>
                                <td>{pod.orderQuantity}</td>
                                <td>{pod.orderUOM}</td>
                                <td className='td-width'>{pod.excessQuantityPercentage}</td>
                                <td>{pod.wastageQuantityPercentage}</td>
                              </tr>
                              <tr>
                                <td colSpan={10} style={{ padding: '2px 10px !important', backgroundColor: '#fff', }}>
                                  <Collapse isOpen={pod.isOpen}>
                                    <Table bordered striped responsive className='table-container'>
                                      <thead >
                                        <tr>
                                          <th className="text-nowrap sm-width">#</th>
                                          <th>##</th>
                                          <th>Color</th>
                                          <th>Size</th>
                                          <th>Prodcut Parts</th>
                                          <th>Order Qty</th>
                                          <th>Extra%</th>
                                          <th>With Extra</th>
                                          {/* <th>Previous</th> */}
                                          <th>Quantity</th>
                                          <th>Balance</th>
                                        </tr>
                                      </thead>
                                      <tbody >
                                        {pod.colorDetails &&
                                          pod.colorDetails.length > 0 &&
                                          pod?.colorDetails.map( ( colorDetail, colorDetailIndex ) => {
                                            return (
                                              <tr key={`${colorDetail.fieldId}}`}>
                                                <td className="text-center sm-width">
                                                  <CustomInput
                                                    type="checkbox"
                                                    className="custom-control-primary"
                                                    id={`pod-${colorDetail.fieldId}`}
                                                    checked={colorDetail.isChecked}
                                                    inline
                                                    onChange={e => {
                                                      onToggleColorDetailCheck( e, podetailIndex, colorDetailIndex );
                                                    }}
                                                  />
                                                </td>
                                                <td className="text-center sm-width">
                                                  {colorDetail.isCloned ? (
                                                    <>
                                                      <Button

                                                        for="removeRow"
                                                        tag={Label}
                                                        onClick={() => onRemoveRow( podetailIndex, colorDetailIndex )}
                                                        className="btn-sm"
                                                        color="flat-danger"
                                                      >
                                                        <MinusSquare size={16} />
                                                      </Button>
                                                      <Button

                                                        for="dulplicateRow"
                                                        tag={Label}
                                                        onClick={() => onDuplicateRow( podetailIndex, colorDetailIndex, colorDetail )}
                                                        className="btn-sm"
                                                        color="flat-warning"
                                                      >
                                                        <Copy size={16} />
                                                      </Button>
                                                    </>
                                                  ) : (
                                                    <Button
                                                      for="dulplicateRow"
                                                      tag={Label}
                                                      onClick={() => onDuplicateRow( podetailIndex, colorDetailIndex, colorDetail )}
                                                      className="btn-sm"
                                                      color="flat-warning"
                                                    >
                                                      <Copy size={16} />
                                                    </Button>
                                                  )}
                                                </td>
                                                <td className="text-left">{colorDetail.color}</td>
                                                <td >
                                                  <Select
                                                    // maxMenuHeight="100px"
                                                    menuPosition="fixed"
                                                    isDisabled={!colorDetail.isChecked}
                                                    id="sizes-ddl"
                                                    theme={selectThemeColors}
                                                    options={colorDetail.sizes}
                                                    isLoading={!colorDetail.sizes.length}
                                                    value={colorDetail.selectedSize}
                                                    className="erp-dropdown-select w-100"
                                                    classNamePrefix="dropdown"
                                                    onChange={item => onColorDetailSizeChange( item, podetailIndex, colorDetailIndex )}
                                                  />
                                                </td>
                                                <td>
                                                  <Select
                                                    // maxMenuHeight="100px"
                                                    menuPosition="fixed"
                                                    isDisabled={!colorDetail.isChecked}
                                                    id="product-parts-ddl"
                                                    theme={selectThemeColors}
                                                    options={colorDetail?.productParts}
                                                    isLoading={!colorDetail.productParts.length}
                                                    value={colorDetail?.selectedProductPart}
                                                    className="erp-dropdown-select w-100"
                                                    classNamePrefix="dropdown"
                                                    onFocus={() => onFocusColorDetailProductPart(
                                                      podetailIndex,
                                                      colorDetailIndex,
                                                      pod.styleId,
                                                      colorDetail.colorId,
                                                      pod.orderId
                                                    )
                                                    }
                                                    onChange={item => onColorDetailProductPartChange( item, podetailIndex, colorDetailIndex )}
                                                  />
                                                </td>
                                                <td>{colorDetail.quantity}</td>
                                                <td style={{ textAlign: 'center' }}>
                                                  {colorDetail.isChecked ? (
                                                    <Input
                                                      id="extra"
                                                      type="number"
                                                      name="extra"
                                                      bsSize="sm"
                                                      className="w-100"
                                                      style={{ textAlign: 'center' }}
                                                      value={colorDetail.extraPercentage}
                                                      onSelect={e => e.target.select()}
                                                      onChange={e => onExtraPercentageChange( e, podetailIndex, colorDetailIndex )}
                                                    />
                                                  ) : (
                                                    colorDetail.extraPercentage
                                                  )}
                                                </td>
                                                <td>{colorDetail.withExtraQuantity}</td>
                                                {/* <td>{colorDetail.preQuantity}</td> */}
                                                <td className='td-width'>
                                                  {colorDetail.isChecked ? (
                                                    <CustomInputBox
                                                      bsSize="sm"
                                                      id="inQuantity"
                                                      type="number"
                                                      name="inQuantity"
                                                      value={colorDetail.inQuantity}
                                                      className={classNames( 'text-center w-100' )}
                                                      onChange={e => onInQuantityChange( e, podetailIndex, colorDetailIndex )}
                                                      isNumberOnly
                                                    />
                                                  ) : (
                                                    0
                                                  )}
                                                </td>

                                                <td>{colorDetail.balance}</td>
                                              </tr>
                                            );
                                          } )}
                                      </tbody>
                                    </Table>
                                  </Collapse>
                                </td>
                              </tr>
                            </Fragment>
                          ) )
                        ) : (
                          <tr className='text-center'>
                            <td colSpan={10}>There is no record to display</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
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

export default PartsStockCreate;
