/* eslint-disable no-unreachable */
/*
   Title:  Bundle Add Form
   Description:  Bundle Add Form
   Author: Alamgir Kabir
   Date: 18-July-2022
   Modified: 18-July-2022
*/
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import ActionMenu from 'layouts/components/menu/action-menu';
import { Fragment, useEffect, useReducer, useState } from 'react';
import { Loader, Maximize2, Minimize2 } from 'react-feather';
import { useHistory } from 'react-router-dom';
import { Button, Col, Collapse, CustomInput, Label, NavItem, NavLink, Row, Table } from 'reactstrap';
import { baseAxios } from 'services';
import {
  BUNDLE_API,
  CUTTINGS_API,
  CUT_PLAN_API,
  STYLE_USE_INFO_API,
  STYLE_WISE_PRODUCT_PARTS_GROUP_API
} from 'services/api-end-points/production/v1';
import { COLOR_INFO_API } from 'services/api-end-points/production/v1/colorInfo';
import { SIZE_INFO_API } from 'services/api-end-points/production/v1/sizeInfo';
import { errorResponse, selectThemeColors } from 'utility/Utils';
import { mapArrayToDropdown, stringifyConsole } from 'utility/commonHelper';
import FormContentLayout from 'utility/custom/FormContentLayout';
import FormLayout from 'utility/custom/FormLayout';
import ErpDateInput from 'utility/custom/customController/ErpDateInput';
import ErpSelect from 'utility/custom/customController/ErpSelect';
import { notify } from 'utility/custom/notifications';
import { formattedDate, serverDate } from 'utility/dateHelpers';
import '../../../../../assets/scss/production/form-page-custom-table.scss';
import '../../../../../assets/scss/production/general.scss';
import {
  ALL_CHECKED,
  COLOR_CHANGE,
  CUTTING_CHANGE,
  CUT_PLAN_CHANGE,
  DATE_CHANGE,
  LOAD_COLORS,
  LOAD_CUTTINGS,
  LOAD_CUT_PLANS,
  LOAD_PRODUCT_PART,
  LOAD_SIZE,
  LOAD_STYLES,
  PRODUCT_PART_CHANGE,
  RESET_BUNDLE_FORM_STATE,
  SIZE_CHANGE,
  STYLE_CHANGE,
  TOGGLE_COLOR_DETAILS_CHECK,
  TOGGLE_PO_DETAILS
} from '../store/actionType';
import { bundleFormReducer, initialFormState } from '../store/reducers';
//#region Breadcrum
const breadcrumb = [
  {
    id: 'home',
    name: 'Home',
    link: "/",
    isActive: false,
    hidden: false
  },

  {
    id: 'bundle',
    name: 'Bundle List ',
    link: "/bundle",
    isActive: false,
    hidden: false
  },

  {
    id: 'bundle-new',
    name: 'New Bundle ',
    link: "/bundle-new",
    isActive: true,
    hidden: false
  }
];
//#endregion
const BundleAddForm = () => {
  //#region Hooks
  const history = useHistory();
  const [state, dispatch] = useReducer( bundleFormReducer, initialFormState );
  const [iSubmitProgressCM, setISubmitProgressCM] = useState( false );
  const [isTableDataLoading, setIsTableDataLoading] = useState( false );
  //#endregion
  const resetFormState = () => {
    dispatch( {
      type: RESET_BUNDLE_FORM_STATE,
      payload: {
        state: initialFormState
      }
    } );
    dispatch( { type: DATE_CHANGE, payload: { startDate: state.date } } );
    dispatch( { type: STYLE_CHANGE, payload: { style: null } } );
  };
  const fetchStyle = async () => {
    try {

      const res = await baseAxios.get( STYLE_USE_INFO_API.fetch_style_use_bundle_info );
      const stylesDdl = mapArrayToDropdown( res.data.data, 'styleNo', 'styleId' );
      dispatch( { type: LOAD_STYLES, payload: { stylesDdl } } );
    } catch ( error ) {
      notify( 'warning', 'Style not found!!!' );
    }
  };
  //#region Effects
  useEffect( () => {

    fetchStyle();
  }, [] );

  //#region

  //#region Events

  //For onStartDate Change
  const onStartDateChange = dates => {
    const date = dates[0];
    dispatch( { type: DATE_CHANGE, payload: { startDate: date } } );
  };
  //For onStyle Change
  const onStyleChange = async style => {
    if ( style ) {
      dispatch( { type: STYLE_CHANGE, payload: { style } } );
      try {
        const res = await baseAxios.get( CUT_PLAN_API.fetch_cut_plan_no_by_style_id( style.styleId ) );
        const cutPlanDdl = mapArrayToDropdown( res.data.data, 'cutPlanNo', 'cutPlanId' );
        dispatch( { type: LOAD_CUT_PLANS, payload: { cutPlanDdl } } );
      } catch ( error ) {
        notify( 'warning', 'Cut Plan not found!!!' );
      }
    } else {
      dispatch( { type: STYLE_CHANGE, payload: { style: null } } );
    }
  };
  //For onCutPlan Change
  const onCutPlanChange = async cutPlan => {
    if ( cutPlan ) {
      dispatch( { type: CUT_PLAN_CHANGE, payload: { cutPlan } } );
      try {
        const res = await baseAxios.get( CUTTINGS_API.fetch_cuttings_by_cut_plan_id( cutPlan.cutPlanId ) );
        const cuttingDdl = mapArrayToDropdown( res.data.data, 'cutNo', 'cuttingId' );

        dispatch( { type: LOAD_CUTTINGS, payload: { cuttingDdl } } );
      } catch ( error ) {
        notify( 'warning', 'Cuttings not found!!!' );
      }
    } else {
      dispatch( { type: CUT_PLAN_CHANGE, payload: { cutPlan: null } } );
    }
  };
  //For onCutting Change
  const onCuttingChange = async cutting => {
    if ( cutting ) {
      dispatch( {
        type: CUTTING_CHANGE,
        payload: { cutting }
      } );
      try {
        const res = await baseAxios.get( COLOR_INFO_API.fetch_color_by_cutting_id( cutting.cuttingId ) );

        const colorDdl = mapArrayToDropdown( res.data.data, 'colorName', 'colorId' );
        dispatch( { type: LOAD_COLORS, payload: { colorDdl } } );
      } catch ( error ) {
        notify( 'warning', 'Color not found!!!' );
      }
    } else {
      dispatch( {
        type: CUTTING_CHANGE,
        payload: { cutting: null }
      } );
    }
  };
  //For onColor Change
  const onColorChange = async color => {
    if ( color ) {
      dispatch( { type: COLOR_CHANGE, payload: { color } } );
      try {
        const res = await baseAxios.get( SIZE_INFO_API.fetch_size_info_by_cutting_and_color_id( state.selectedCutting.cuttingId, color.colorId ) );
        const sizeDdl = mapArrayToDropdown( res.data.data, 'sizeName', 'sizeId' );
        dispatch( { type: LOAD_SIZE, payload: { sizeDdl } } );

      } catch ( error ) {
        notify( 'warning', 'Size not found!!!' );
      }
    } else {
      dispatch( { type: COLOR_CHANGE, payload: { color: null } } );
    }
  };
  //For onSize Change
  const onSizeChange = async size => {
    if ( size ) {
      dispatch( { type: SIZE_CHANGE, payload: { size } } );
      try {
        const res = await baseAxios.get(
          STYLE_WISE_PRODUCT_PARTS_GROUP_API.fetch_product_parts_by_style_cutting_color_and_size_id(
            state.selectedStyle.styleId,
            state.selectedCutting.cuttingId,
            state.selectedColor.colorId,
            size.sizeId
          )
        );
        const productPartDdl = mapArrayToDropdown( res.data.data, 'productPartsName', 'productPartsId' );
        dispatch( { type: LOAD_PRODUCT_PART, payload: { productPartDdl } } );
      } catch ( error ) {
        notify( 'warning', 'Product Part not found!!!' );
      }
    } else {
      dispatch( { type: SIZE_CHANGE, payload: { size: null } } );
    }
  };
  //For onProduct Change
  const onProductPartChange = async productPart => {
    if ( productPart ) {
      setIsTableDataLoading( true );
      try {
        const poDetails = await baseAxios.get(
          BUNDLE_API.fetch_bundle_by_cutting_color_size_and_product_part_id(
            state.selectedCutting.cuttingId,
            state.selectedColor.colorId,
            state.selectedSize.sizeId,
            productPart.productPartsId
          )
        );
        if ( poDetails.data.data.length > 0 ) {
          dispatch( { type: PRODUCT_PART_CHANGE, payload: { productPart, poDetails: poDetails.data.data } } );
          setIsTableDataLoading( false );
        } else {
          notify( 'warning', 'No data  found for these selection!!!' );
          dispatch( { type: PRODUCT_PART_CHANGE, payload: { productPart: productPart } } );
          setIsTableDataLoading( false );
        }

      } catch ( error ) {
        notify( 'warning', 'Data not found!!!' );

      }
    } else {
      dispatch( { type: PRODUCT_PART_CHANGE, payload: { productPart: null } } );
      setIsTableDataLoading( false );

    }
  };
  /**
   * Toggle  Details Table
   */
  const onTogglePoDetails = poDetailIndex => {
    dispatch( { type: TOGGLE_PO_DETAILS, payload: { poDetailIndex } } );
  };
  /**
   * Toggle Check Color Details
   */
  const onToggleColorDetailCheck = ( e, poDetailIndex, bundleIndex, currentQuantity ) => {
    const { checked } = e.target;
    dispatch( { type: TOGGLE_COLOR_DETAILS_CHECK, payload: { checked, poDetailIndex, bundleIndex, currentQuantity } } );
  };

  /**
   * Toggle All Select
   */
  const onToggleSelectAll = ( e, pod, poDetailIndex ) => {
    const { checked } = e.target;
    dispatch( { type: ALL_CHECKED, payload: { checked, pod, poDetailIndex } } );
  };
  /**
   * For Submission
   */
  const handleSave = async () => {
    const payload = {
      listBundle: state.poDetails
        .map( pod => pod.bundles )
        .flat()
        .filter( bundle => bundle.isChecked )
        .map( item => {
          return {
            bundleNumber: item.bundleNumber,
            cutPlanId: item.cutPlanId,
            cutPlanNo: item.cutPlanNo,
            cuttingId: item.cuttingId,
            cutNo: item.cutNo,
            cuttingType: 'Contrast',
            styleId: item.styleId,
            styleNo: item.styleNo,
            buyerId: item.buyerId,
            buyerName: item.buyerName,
            styleCategoryId: item.styleCategoryId,
            styleCategory: item.styleCategory,
            sizeId: item.sizeId,
            sizeName: item.sizeName,
            productPartsId: state.selectedProductPart.value,
            productPartsName: state.selectedProductPart.label,
            productPartsShade: item.productPartsShade,
            poNo: item.poNo,
            poId: item.poId,
            destination: item.destination,
            shipmentDate: item.shipmentDate,
            shipmentMode: item.shipmentMode,
            date: serverDate( item.date ),
            serialStart: item.serialStart,
            serialEnd: item.serialEnd,
            quantity: item.quantity,
            checkDate: null,
            colorId: item.colorId,
            colorName: item.colorName,
            partGroupId: state.selectedProductPart.partGroupsId,
            partGroupName: state.selectedProductPart.partGroupsName,
            status: 'Pending',
            isChecked: false,
            hasReject: false,
            currentProcessId: item.currentProcessId,
            currentProcessName: item.currentProcessName
          };
        } )
    };
    stringifyConsole( payload );

    const isValidBundle = payload.listBundle.some( cd => cd );
    if ( state.selectedStyle && state.selectedProductPart && isValidBundle ) {
      setISubmitProgressCM( true );
      try {
        const res = await baseAxios.post( BUNDLE_API.add, payload );
        notify( 'success', 'Bundle has been added' );
        resetFormState();
        fetchStyle();
        setISubmitProgressCM( false );
      } catch ( err ) {
        errorResponse( err );
        setISubmitProgressCM( false );
      }
    } else {
      notify( 'warning', 'Please Provide all data!!!' );
    }
  };
  /**
   * Cancel Route
   */
  const handleCancel = () => {
    history.goBack();
  };
  //#endregion

  return (
    <>
      <UILoader
        blocking={iSubmitProgressCM}
        loader={<ComponentSpinner />}>
        <ActionMenu breadcrumb={breadcrumb} title="New Bundle">
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
            <Row className="">
              <Col lg='12' className=''>
                <FormContentLayout title="Master Information">
                  <Col lg='3' md='6' xl='3'>
                    <ErpDateInput
                      classNames='mt-1'
                      label="Start Date"
                      name="date"
                      id="date"
                      type="date"
                      maxDate={new Date()}
                      value={state.date} onChange={onStartDateChange}
                    />
                  </Col>
                  <Col lg='3' md='6' xl='3'>
                    <ErpSelect
                      label="Style"
                      classNames='mt-1'
                      name="style"
                      id="style"
                      isSearchable
                      theme={selectThemeColors}
                      options={state?.styles}
                      isLoading={!state?.styles?.length}
                      className="erp-dropdown-select"
                      classNamePrefix="dropdown"
                      value={state.selectedStyle}
                      onChange={item => onStyleChange( item )}
                    />
                  </Col>
                  <Col lg='3' md='6' xl='3'>
                    <ErpSelect
                      label="Cut Plan"
                      classNames='mt-1'
                      id="cutPlan"
                      isSearchable
                      theme={selectThemeColors}
                      options={state.cutPlans}
                      isLoading={!state?.cutPlans.length}
                      className="erp-dropdown-select"
                      classNamePrefix="dropdown"
                      value={state.selectedCutPlan}
                      onChange={item => onCutPlanChange( item )}
                    />
                  </Col>
                  <Col lg='3' md='6' xl='3'>
                    <ErpSelect
                      label="Cuttings"
                      classNames='mt-1'
                      id="cuttings"
                      isSearchable
                      theme={selectThemeColors}
                      options={state.cuttings}
                      isLoading={!state?.cuttings.length}
                      className="erp-dropdown-select"
                      classNamePrefix="dropdown"
                      value={state.selectedCutting}
                      onChange={item => onCuttingChange( item )}
                    />
                  </Col>
                  <Col lg='3' md='6' xl='3'>
                    <ErpSelect
                      label="Color"
                      classNames='mt-1'
                      id="color"
                      isSearchable
                      theme={selectThemeColors}
                      options={state.colors}
                      isLoading={!state?.colors.length}
                      className="erp-dropdown-select"
                      classNamePrefix="dropdown"
                      value={state.selectedColor}
                      onChange={item => onColorChange( item )}
                    />
                  </Col>
                  <Col lg='3' md='6' xl='3'>
                    <ErpSelect
                      label="Size"
                      classNames='mt-1'
                      id="size"
                      isSearchable
                      theme={selectThemeColors}
                      options={state.sizes}
                      isLoading={!state?.sizes.length}
                      className="erp-dropdown-select"
                      classNamePrefix="dropdown"
                      value={state.selectedSize}
                      onChange={item => onSizeChange( item )}
                    />
                  </Col>
                  <Col lg='3' md='6' xl='3'>
                    <ErpSelect
                      label="Parts"
                      classNames='mt-1'
                      id="parts"
                      isSearchable
                      theme={selectThemeColors}
                      options={state?.productParts}
                      isLoading={!state?.productParts?.length}
                      className="erp-dropdown-select"
                      classNamePrefix="dropdown"
                      value={state.selectedProductPart}
                      onChange={item => onProductPartChange( item )}
                    />
                  </Col>
                </FormContentLayout>
              </Col>
            </Row>
            <div className='p-1 pt-0'>
              <FormContentLayout title="Details" marginTop>
                <div className='p-1'>
                  {isTableDataLoading ? (
                    <div style={{ height: '350px' }}>
                      <ComponentSpinner />
                    </div>
                  ) : (
                    <Table bordered responsive className='table-container'>
                      <thead >
                        <tr className="text-center text-nowrap">
                          <th className='sm-width'>
                            <strong>#</strong>
                          </th>
                          <th>
                            <strong>PO No.</strong>
                          </th>
                          <th>
                            <strong>Style No</strong>
                          </th>
                          <th>
                            <strong>Buyer Name</strong>
                          </th>
                          <th>
                            <strong>Style Category</strong>
                          </th>
                          <th>
                            <strong>Destination</strong>
                          </th>
                          <th>
                            <strong>Shipment Date</strong>
                          </th>
                          <th>
                            <strong>Shipment Mode</strong>
                          </th>
                          <th>
                            <strong>Color Name</strong>
                          </th>
                          <th>
                            <strong>Size Name</strong>
                          </th>

                          <th>
                            <strong>Balance</strong>
                          </th>

                          <th>
                            <strong>Current Total</strong>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-center text-nowrap">
                        {state?.poDetails?.length > 0 ? (
                          state?.poDetails?.map( ( pod, podetailIndex ) => {
                            return (
                              <Fragment key={pod.rowId}>
                                <tr >
                                  <td className='sm-width'>
                                    <Button
                                      for="collapseId"
                                      tag={Label}
                                      onClick={() => onTogglePoDetails( podetailIndex )}
                                      className="btn-sm"
                                      color="flat-primary"
                                      disabled={pod.isLoadingSizeColorRatio}
                                    >
                                      {pod?.isLoadingSizeColorRatio ? (
                                        <Loader size={14} color="#57C69D" />
                                      ) : pod.isOpen ? (
                                        <Minimize2 size={14} color="#57C69D" />
                                      ) : (
                                        <Maximize2 id="collapseId" size={14} color="#7367f0" />
                                      )}
                                    </Button>
                                  </td>
                                  <td className='td-width'>{pod.poNo}</td>
                                  <td>{pod.styleNo}</td>
                                  <td>{pod.buyerName}</td>
                                  <td>{pod.styleCategory}</td>
                                  <td>{pod.destination}</td>
                                  <td>{formattedDate( pod.shipmentDate )}</td>
                                  <td>{pod.shipmentMode}</td>
                                  <td>{pod.colorName}</td>
                                  <td>{pod.sizeName}</td>
                                  <td>{pod.balanceQuantity}</td>
                                  <td>{pod.currentTotal}</td>
                                </tr>
                                <tr>
                                  <td colSpan={12} style={{ padding: '2px 10px !important', backgroundColor: '#fff' }}>
                                    <Collapse isOpen={pod.isOpen}>
                                      <Table bordered striped responsive className='table-container'>
                                        <thead >
                                          <tr>
                                            <th className='sm-width'>
                                              <CustomInput
                                                type="checkbox"
                                                className="custom-control-primary"
                                                id={`pod-${pod.rowId}`}
                                                checked={pod?.isAllChecked}
                                                // checked={state?.isAllChecked}
                                                inline
                                                onChange={e => onToggleSelectAll( e, pod, podetailIndex )}
                                              />
                                            </th>
                                            <th>Bundle No</th>
                                            <th>CutPlan No</th>
                                            <th>Cut No</th>
                                            <th>Product Parts Shade</th>
                                            <th>Current Process</th>
                                            <th>Date</th>
                                            <th>Serial Start</th>
                                            <th>Serial End</th>
                                            <th>Quantity</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {pod?.bundles &&
                                            pod?.bundles?.length > 0 &&
                                            pod?.bundles?.map( ( bundle, bundleIndex ) => {
                                              return (
                                                <tr key={bundle.rowId}>
                                                  <td className="text-center sm-width">
                                                    <CustomInput
                                                      type="checkbox"
                                                      className="custom-control-primary"
                                                      id={`pod-${bundle.rowId}`}
                                                      checked={bundle.isChecked}
                                                      inline
                                                      onChange={e => {
                                                        onToggleColorDetailCheck( e, podetailIndex, bundleIndex, bundle.quantity );
                                                      }}
                                                    />
                                                  </td>
                                                  <td className='td-width'>{bundle.bundleNumber}</td>
                                                  <td>{bundle.cutPlanNo}</td>
                                                  <td>{bundle.cutNo}</td>
                                                  <td>{bundle.productPartsShade}</td>
                                                  <td>{bundle.currentProcessName}</td>
                                                  <td>{formattedDate( bundle.date )}</td>
                                                  <td className='td-width'>{bundle.serialStart}</td>
                                                  <td>{bundle.serialEnd}</td>
                                                  <td>{bundle.quantity}</td>
                                                </tr>
                                              );
                                            } )}
                                        </tbody>
                                      </Table>
                                    </Collapse>
                                  </td>
                                </tr>
                              </Fragment>
                            );
                          } )
                        ) : (
                          <tr className='text-center'>
                            <td colSpan={12} className="td-width">There is no record to display</td>
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

export default BundleAddForm;
