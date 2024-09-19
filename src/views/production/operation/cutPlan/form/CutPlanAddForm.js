import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import axios from 'axios';
import classNames from 'classnames';
import ActionMenu from 'layouts/components/menu/action-menu';
import _ from 'lodash';
import { Fragment, useEffect, useReducer, useState } from 'react';
import { Loader, Maximize2, Minimize2, MoreVertical, Pocket } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { Badge, Button, Col, Collapse, CustomInput, FormGroup, Input, Label, NavItem, NavLink, Row, Table } from 'reactstrap';
import { baseAxios, merchandisingAxiosInstance } from 'services';
import { GARMENT_SIZE_GROUPS_API, PURCHASE_ORDERS_API, STYLES_API } from 'services/api-end-points/merchandising/v1';
import { CUT_PLAN_API, PURCHASE_ORDER_DETAILS_API, STYLE_WISE_PRODUCT_PARTS_GROUP_API } from 'services/api-end-points/production/v1';
import { errorResponse, isObjEmpty, selectThemeColors } from 'utility/Utils';
import { mapArrayToDropdown, sleep, stringifyConsole } from 'utility/commonHelper';
import FormContentLayout from 'utility/custom/FormContentLayout';
import FormLayout from 'utility/custom/FormLayout';
import { notify } from 'utility/custom/notifications';
import CustomDatePicker from 'utility/custom/production/CustomDatePicker';
import CustomInputBox from 'utility/custom/production/CustomInput';
import { formattedDate, serverDate } from 'utility/dateHelpers';
import SizeRatioDetails from '../details/SizeRatioDetails';
import {
  CUT_QUANTITY_CHANGE,
  DATE_CHANGE,
  EXTRA_PERCENTAGE_CHANGE,
  LAY_PER_CUT_CHANGE,
  LENGTH_CHANGE,
  LOADING_SIZE_COLOR_RATIO,
  LOAD_SIZE_COLOR_DETAILS,
  LOAD_STYLES,
  PARTS_TYPE_CHANGE,
  PART_GROUPS_CHANGE,
  RESET_SELECTED_COLOR_DETAILS_ROW,
  RUNNING_COLOR_CHECK_CHANGE,
  RUNNING_CUT_CHECK_CHANGE,
  SIZE_GROUP_CHANGE,
  SIZE_QUANTITY_CHANGE,
  STYLE_CHANGE,
  TOGGLE_PO_DETAILS,
  WIDTH_CHANGE,
  cutPlanFormReducer,
  initialFormState
} from '../store/reducers';
import classes from '../styles/CutPlanAddForm.module.scss';

const CheckBoxInput = ( props ) => {
  const { marginTop, label, classNames, onChange, name, value, checked, ...rest } = props;
  return (
    <div className='general-form-container'>
      <div className={`${classNames} checkbox-input-container `}>
        <input
          type='checkbox'
          name={name}
          onChange={( e ) => onChange( e )}
          value={value}
          checked={checked}
          {...rest}
        />
        <Label check size='sm' className='font-weight-bolder ml-1' > {label}</Label>
      </div>
    </div>
  );
};

const CutPlanAddFormNew = () => {
  //#region Hooks
  const history = useHistory();
  const { register, errors, handleSubmit } = useForm();
  //#endregion

  //#region State
  const [state, dispatch] = useReducer( cutPlanFormReducer, initialFormState );
  const [sizeRatioModal, setSizeRatioModal] = useState( false );
  const [ratioQty, setRatioQty] = useState( [] );
  const [iSubmitProgressCM, setISubmitProgressCM] = useState( false );
  const [isLoadingTableData, setIsLoadingTableData] = useState( false );

  //#endregion

  //#region Effects
  /**
   * Load Style
   */

  useEffect( () => {
    let isMounted = true;
    const controller = new AbortController();
    const fetchStyles = async () => {
      try {
        const res = await baseAxios.get( STYLES_API.fetch_style_used_in_relaxation, {
          signal: controller.signal,
        } );
        const stylesDdl = mapArrayToDropdown( res.data.data, "styleNo", "styleId" );
        isMounted && dispatch( { type: LOAD_STYLES, payload: stylesDdl } );
      } catch ( err ) {
        notify( "warning", "server side error!!!" );
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
      const cutPlanNoReq = baseAxios.get( CUT_PLAN_API.fetch_cut_plan_no_by_style, { params: { id: style.styleId, styleNo: style.styleNo } } );
      const styleDetailsReq = merchandisingAxiosInstance.get( `${STYLES_API.fetch_by_id}/${style.styleId
        }` );
      const poDetailsReq = merchandisingAxiosInstance.get( PURCHASE_ORDERS_API.fetch_PO_with_buyer_and_style( style.buyerId, style.styleId ) );
      const [cutPlanNoRes, styleDetailsRes, poDetailsRes] = await axios.all( [cutPlanNoReq, styleDetailsReq, poDetailsReq] );

      if ( cutPlanNoRes.status === 200 && styleDetailsRes.status === 200 && poDetailsRes.status === 200 ) {
        dispatch( {
          type: STYLE_CHANGE,
          payload: {
            style,
            cutPlanNo: cutPlanNoRes.data.data,
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
    } catch ( err ) {
      notify( 'warning', 'server side error!!!' );
      setIsLoadingTableData( false );
    }
  };
  /**
  * For Size Quantity Change
  */
  const onSizeQuantityChange = ( e, sizeIndex ) => {
    const { value } = e.target;
    const oldValue = state.sizesInSizeGroup[sizeIndex]['ratio'];
    const regex = /^\d*(?:[0-9]\d*)?$/; // integers only

    const validInput = regex.test( value ) ? value : oldValue;
    if ( validInput !== oldValue ) {
      dispatch( { type: SIZE_QUANTITY_CHANGE, payload: { value: Number( validInput ), sizeIndex } } );
    }
  };
  /**
  * For Product Part Change
  */
  const onPartsTypeChange = item => {
    dispatch( { type: PARTS_TYPE_CHANGE, payload: { partsType: item } } );
  };
  /**
  * For Lay Change
  */
  const onLayPerChange = e => {
    const { value } = e.target;
    const _state = { ...state };
    const oldValue = _state.layPerCut;
    const regex = /^\d*(?:[0-9]\d*)?$/; // integers only

    const validInput = regex.test( value ) ? value : oldValue;
    let updatedLay = validInput;
    if ( updatedLay > _state.totalLayCount ) {
      notify( 'warning', 'Quantity exceeded!!!' );
      updatedLay = 0;
    }
    if ( updatedLay !== oldValue ) {
      dispatch( { type: LAY_PER_CUT_CHANGE, payload: { layPerCut: Number( updatedLay ) } } );
    }
  };
  /**
  * For Width Change
  */
  const onWidthChange = e => {
    const { value } = e.target;
    dispatch( { type: WIDTH_CHANGE, payload: { width: Number( value ) } } );
  };
  /**
   * For Length Change
   */
  const onLengthChange = e => {
    const { value } = e.target;
    dispatch( { type: LENGTH_CHANGE, payload: { length: Number( value ) } } );
  };
  /**
   * For Running Color Checkbox Change
   */
  const onRunningColorCheckChange = e => {
    const { checked } = e.target;
    dispatch( { type: RUNNING_COLOR_CHECK_CHANGE, payload: { checked } } );
  };
  /**
   * For Running Cut Checkbox Change
   */
  const onRunningCutCheckChange = e => {
    const { checked } = e.target;
    dispatch( { type: RUNNING_CUT_CHECK_CHANGE, payload: { checked } } );
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
   * For Part Group Change
   */
  const onPartGroupChange = async ( item, styleId, orderId, colorId, podetailIndex, colorDetailIdx ) => {
    if ( item ) {

      const partGroupId = item.id;
      try {
        const styleWiseProductPartsgroupReq = baseAxios.get(
          STYLE_WISE_PRODUCT_PARTS_GROUP_API.fetch_product_parts_by_style_color_partGroup( styleId, colorId, partGroupId )
        );
        const poDetailsPrevQtyCheckReq = baseAxios.get( PURCHASE_ORDER_DETAILS_API.get_previous_quantity( orderId, colorId, partGroupId ) );
        const [styleWiseProductPartsgroupRes, poDetailsPrevQtyCheckRes] = await axios.all( [styleWiseProductPartsgroupReq, poDetailsPrevQtyCheckReq] );
        dispatch( {
          type: PART_GROUPS_CHANGE,
          payload: {
            partGroup: item,
            productParts: styleWiseProductPartsgroupRes.data.data,
            podetailIndex,
            colorDetailIdx,
            previousQuantity: poDetailsPrevQtyCheckRes.data.data
          }
        } );
      } catch ( err ) {
        notify( 'warning', 'server side error!!!' );
      }
    } else {
      dispatch( {
        type: RESET_SELECTED_COLOR_DETAILS_ROW,
        payload: {
          poDetailIndex: podetailIndex,
          colorDetailIndex: colorDetailIdx
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
   * For Cut Quantity Change
   */
  const onCutQuantityChange = ( e, poDetailIndex, colorDetailIndex ) => {
    const { value } = e.target;
    const oldValue = state.purchaseOrderDetailsBySizeGroup[poDetailIndex].colorDetails[colorDetailIndex]['totalQuantity'];
    const regex = /^\d*(?:[0-9]\d*)?$/; // integers only

    const validInput = regex.test( value ) ? value : oldValue;
    if ( validInput !== oldValue ) {
      dispatch( { type: CUT_QUANTITY_CHANGE, payload: { value, poDetailIndex, colorDetailIndex } } );
    }
  };
  /**
   * For Size Ratio Change In Modal
   */
  const hanldeSizeRatioModalToggle = ( cutqty, state ) => {
    const _state = { ...state };
    const ratioqty = cutqty / _state.totalSizeRatio;
    const _sizeratio = _state?.sizesInSizeGroup?.map( sd => ( {
      ...sd,
      quantity: ratioqty * parseInt( sd.ratio )
    } ) );
    setRatioQty( _sizeratio );
    setSizeRatioModal( !sizeRatioModal );
  };
  /**
 * For back to prev route
 */
  const handleCancel = () => {
    history.goBack();
  };
  /**
 * For Submission
 */
  const onSubmit = async () => {
    if ( isObjEmpty( errors ) ) {
      const sizes = state.sizesInSizeGroup.map( size => ( {
        sizeId: size.sizeId,
        sizeName: size.size,
        ratio: size.ratio,
        quantity: 0
      } ) );
      const poWithColorDetails = state.purchaseOrderDetailsBySizeGroup.filter( po => po.colorDetails && po.colorDetails.some( cd => cd.isChecked ) );
      const poAndFilteredColorDetails = poWithColorDetails?.map( pcd => ( {
        ...pcd,
        colorDetails: pcd.colorDetails
          .filter( cd => cd.isChecked )
          .map( item => ( {
            ...item,
            poNo: pcd.orderNumber,
            poId: pcd.orderId,
            // poNo: pcd.buyerOrderNumber,
            // poDetailsId: pcd.detailId,
            destination: pcd.deliveryDestination,
            shipmentDate: serverDate( pcd.shipmentDate ),
            shipmentMode: pcd.shipmentMode,
            inspectionDate: serverDate( pcd.inspectionDate ),
            orderQty: pcd.orderQuantity,
            orderUOM: pcd.orderUOM,
            excessPercentage: pcd.excessQuantityPercentage.toString(),
            wastagePercentage: pcd.wastageQuantityPercentage.toString()
          } ) )
      } ) );
      const modifiedPoColorDetailsComb = poAndFilteredColorDetails.flatMap( mopcd => {
        const colorDetails = mopcd.colorDetails.map( col => {
          const coppieItem = Object.assign( {}, col );
          coppieItem.partGroupName = col.partGroup.label;
          coppieItem.partGroupId = col.partGroup.value;
          coppieItem.colorName = col.color;
          coppieItem.withExtra = col.withExtraQuantity;
          coppieItem.colorQty = col.quantity;
          coppieItem.extraPercentage = col.extraPercentage;
          coppieItem.layPerCut = col.layCount;
          coppieItem.remainingQty = col.layCount;
          coppieItem.totalQty = col.totalQuantity;

          delete coppieItem.balance;
          delete coppieItem.color;
          delete coppieItem.fieldId;
          delete coppieItem.isChecked;
          delete coppieItem.layCount;
          delete coppieItem.preQuantity;
          delete coppieItem.totalQuantity;
          delete coppieItem.withExtraQuantity;
          delete coppieItem.quantity;
          delete coppieItem.getPartGroupDto;
          return coppieItem;
        } );
        return colorDetails;
      } );

      const { layPerCut, isRunningCut, isRunningColor } = state;
      let listingQty = [];
      let coppiedCombo = _.cloneDeep( modifiedPoColorDetailsComb );

      if ( isRunningColor ) {
        coppiedCombo = _.cloneDeep( _.sortBy( modifiedPoColorDetailsComb, ['colorName'] ) );
      }
      if ( isRunningCut ) {
        const totalLayCount = modifiedPoColorDetailsComb.reduce( ( acc, curr ) => ( acc = acc + curr.layPerCut ), 0 );
        const fullSteps = parseInt( totalLayCount / layPerCut );
        const remainingQty = totalLayCount % layPerCut;
        const cutSteps = [];
        let stepCount = 1;
        while ( stepCount <= fullSteps ) {
          cutSteps.push( layPerCut );
          stepCount++;
        }
        if ( remainingQty !== 0 ) {
          cutSteps.push( remainingQty );
        }
        let runningIndex = 0;
        let nextRemaining = 0;
        const combo3 = cutSteps.map( step => {
          const cuttingDetails = [];
          const runningItem = coppiedCombo[runningIndex];
          if ( nextRemaining > 0 ) {
            runningItem.remainingQty = nextRemaining;
          }
          if ( step <= runningItem.remainingQty ) {
            const innerItem = { ...runningItem };
            innerItem.layPerCut = step;
            innerItem.totalQty = innerItem.layPerCut * state.totalSizeRatio;
            runningItem.layPerCut = step;
            nextRemaining = runningItem.remainingQty - step;
            if ( nextRemaining <= 0 ) {
              runningIndex = runningIndex + 1;
            }
            delete innerItem.remainingQty;
            cuttingDetails.push( innerItem );
          } else {
            const newInnerItem = { ...runningItem };
            newInnerItem.layPerCut = runningItem.remainingQty;
            newInnerItem.totalQty = newInnerItem.layPerCut * state.totalSizeRatio;
            // runningItem.isComplete = true;

            delete newInnerItem.remainingQty;
            cuttingDetails.push( newInnerItem );

            runningIndex = runningIndex + 1;
            nextRemaining = 0;
            let stepRemaining = step - runningItem.remainingQty;
            while ( stepRemaining > 0 ) {
              const nextItem = coppiedCombo[runningIndex];
              const nextInnerItem = { ...nextItem };
              if ( nextRemaining > 0 ) {
                nextInnerItem.remainingQty = nextRemaining;
              }

              if ( stepRemaining <= nextInnerItem.remainingQty ) {
                nextInnerItem.layPerCut = stepRemaining;
                nextInnerItem.totalQty = nextInnerItem.layPerCut * state.totalSizeRatio;

                nextRemaining = nextItem.remainingQty - stepRemaining;
                if ( nextRemaining <= 0 ) {
                  runningIndex = runningIndex + 1;
                }
                stepRemaining = stepRemaining - nextInnerItem.layPerCut;

                delete nextInnerItem.remainingQty;
                cuttingDetails.push( nextInnerItem );
              } else {
                nextInnerItem.layPerCut = nextInnerItem.remainingQty;
                nextInnerItem.totalQty = nextInnerItem.layPerCut * state.totalSizeRatio;
                runningIndex = runningIndex + 1;
                stepRemaining = stepRemaining - nextInnerItem.layPerCut;

                delete nextInnerItem.remainingQty;
                cuttingDetails.push( nextInnerItem );
              }
            }

            // cuttingDetails.push(newInnerItem, nextInnerItem);
          }
          return { cutNo: '', tableNo: '', comboQty: 0, layPerCut: step, cuttingDetails };
        } );
        listingQty = combo3;
      } else {
        const combo4 = coppiedCombo
          .map( com => {
            const cuttingDetails = [];
            const fullSteps = com.remainingQty <= layPerCut ? 0 : parseInt( com.remainingQty / layPerCut );
            const updatedRemainingQty = com.remainingQty <= layPerCut ? com.remainingQty : parseInt( com.remainingQty % layPerCut );
            const _cutSteps = [];
            let stepCount = 1;
            while ( stepCount <= fullSteps ) {
              _cutSteps.push( layPerCut );
              stepCount++;
            }
            if ( updatedRemainingQty !== 0 ) {
              _cutSteps.push( updatedRemainingQty );
            }
            _cutSteps.forEach( step => {
              const innerItem = { ...com };
              innerItem.layPerCut = step;
              innerItem.totalQty = step * state.totalSizeRatio;
              delete innerItem.remainingQty;
              delete innerItem.isComplete;
              const obj = {
                cutNo: '',
                tableNo: '',
                comboQty: 0,
                layPerCut: step,
                cuttingDetails: [{ ...innerItem }]
              };
              cuttingDetails.push( obj );
            } );
            return cuttingDetails;
          } )
          .flat();
        listingQty = combo4;
      }
      const payload = {
        cutPlanNo: state.cutPlanNo,
        startDate: serverDate( state.date ),
        styleId: state.selectedStyle.styleId,
        styleNo: state.selectedStyleDetails.styleNumber,
        buyerId: state.selectedStyleDetails.buyerId,
        buyerName: state.selectedStyleDetails.buyerName,
        styleCategoryId: state.selectedStyleDetails.styleCategoryId,
        styleCategory: state.selectedStyleDetails.styleCategory,
        sizeGroupId: state.selectedSizeGroup.value,
        sizeGroupName: state.selectedSizeGroup.label,
        layPerCut: state.layPerCut,
        totalLay: state.totalLayCount,
        totalQuantity: state.totalQty,
        isRunningCut,
        isColorGroup: isRunningColor,
        status: true,
        marker: {
          length: state.length,
          width: state.width,
          totalQty: state.totalSizeRatio,
          markerSize: sizes
        },
        listCutting: listingQty.map( item => ( { ...item, cuttingType: state.selectedPartsType ? state.selectedPartsType.value : '' } ) ),
        productPartsInCutPlan: state.selectedProductParts.map( pp => ( {
          productPartsId: pp.productPartsId,
          productPartsName: pp.productPartsName
        } ) )
      };
      stringifyConsole( payload );
      if ( state.selectedPartsType ) {
        setISubmitProgressCM( true );
        try {
          await baseAxios.post( CUT_PLAN_API.add, payload );
          notify( 'success', 'Cut Plan has been added' );
          setISubmitProgressCM( false );
          handleCancel();
        } catch ( error ) {
          errorResponse( error );
          setISubmitProgressCM( false );
        }
      } else {
        notify( 'warning', 'Please Provide all data!!!' );
      }
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
      id: 'cut-plan',
      name: 'Cut Plan',
      link: "/cut-plan",
      isActive: false,
      hidden: false
    },
    {
      id: 'cut-plan-new',
      name: 'New Cut Plan',
      link: "/cut-plan-new",
      isActive: true,
      hidden: false
    }
  ];
  //#endregion
  return (
    <div>


      <ActionMenu breadcrumb={breadcrumb} title="New Cut Plan">
        <NavItem className="mr-1">
          <NavLink tag={Button} size="sm" color="primary" type="submit">
            Save
          </NavLink>
        </NavItem>
        <NavItem className="mr-1">
          <NavLink
            tag={Button}
            size="sm"
            color="secondary"
            onClick={() => {
              history.goBack();
            }}
          >
            Cancel
          </NavLink>
        </NavItem>
      </ActionMenu>
      <UILoader
        blocking={iSubmitProgressCM}
        loader={<ComponentSpinner />}>
        <FormLayout isNeedTopMargin={true}>
          {/* Left section start */}
          <Row>
            {/* Left section start */}
            <Col xs="12" sm="12" md="12" lg="6" xl="6">
              <Row className="border rounded rounded-3 mr-1">
                {/* badge start */}
                <FormGroup tag={Col} xs={12} sm={12} md={12} lg={12} xl={12} className="mt-1">
                  <Badge color="primary">{`Master Information`}</Badge>
                </FormGroup>
                {/* badge end */}

                {/* plan no start */}
                <FormGroup tag={Col} xs="6">
                  <Label className="text-dark font-weight-bold" for="cutPlanNo">
                    Cut Plan No
                  </Label>
                  <Input id="cutPlanNo" type="text" bsSize="sm" name="cutPlanNo" placeholder="Plan No" disabled value={state.cutPlanNo} />
                </FormGroup>
                {/* plan no end */}

                {/* date start */}
                <FormGroup tag={Col} xs="6" className="text-nowrap text-dark font-weight-bold">
                  <CustomDatePicker maxDate={new Date()} name="date" title="Start Date" value={state.date} onChange={onStartDateChange} />
                </FormGroup>
                {/* date end */}

                {/* style dropdown start */}
                <FormGroup tag={Col} xs="6">
                  <Label className="text-dark font-weight-bold" for="style">
                    Style
                  </Label>
                  <Select
                    maxMenuHeight="240px"
                    id="style"
                    isSearchable
                    bsSize="sm"
                    theme={selectThemeColors}
                    options={state.styles}
                    isLoading={!state.styles.length}
                    value={state.selectedStyle}
                    className="erp-dropdown-select"
                    classNamePrefix="dropdown"
                    onChange={onStyleChange}

                  />
                </FormGroup>
                {/* style dropdown end */}

                {/* size group dropdown start */}
                <FormGroup tag={Col} xs="6">
                  <Label className="text-dark font-weight-bold" for="sizeGroups">
                    Size Groups
                  </Label>
                  <Select
                    id="sizeGroups"
                    isSearchable
                    bsSize="sm"
                    theme={selectThemeColors}
                    options={state.sizeGroups}
                    isLoading={!state.sizeGroups.length}
                    value={state.selectedSizeGroup}
                    className="erp-dropdown-select"
                    classNamePrefix="dropdown"
                    onChange={onSizeGroupChange}
                  />
                </FormGroup>
                {/* size group dropdown end */}

                {/* parts type dropdown start */}
                <FormGroup tag={Col} xs="6">
                  <Label className="text-dark font-weight-bold" for="partsType">
                    Cutting Type
                  </Label>
                  <Select
                    id="partsType"
                    isSearchable
                    bsSize="sm"
                    theme={selectThemeColors}
                    options={state.partTypes}
                    value={state.selectedPartsType}
                    className="erp-dropdown-select"
                    classNamePrefix="dropdown"
                    onChange={onPartsTypeChange}

                  />
                </FormGroup>
                {/* parts type dropdown end */}

                {/* style category start */}
                <FormGroup tag={Col} xs="6">
                  <Label className="text-dark font-weight-bold" for="styleCategory">
                    Style Category
                  </Label>
                  <Input
                    id="styleCategory"
                    type="text"
                    name="styleCategory"
                    bsSize="sm"
                    placeholder="Style Category"
                    defaultValue={state.selectedStyleDetails?.styleCategory}
                    disabled
                  />
                </FormGroup>
                {/* style category end */}

                {/* buyer name start */}
                <FormGroup tag={Col} xs="6">
                  <Label className="text-dark font-weight-bold" for="buyerName">
                    Buyer Name
                  </Label>
                  <Input
                    id="buyerName"
                    type="text"
                    name="buyerName"
                    bsSize="sm"
                    placeholder="Buyer Name"
                    disabled
                    defaultValue={state.selectedStyleDetails?.buyerName}
                  />
                </FormGroup>
                {/* buyer name end */}

                {/* total product quantity start */}
                <FormGroup tag={Col} xs="6">
                  <Label className="text-dark font-weight-bold" for="totalQty">
                    Total Quanity
                  </Label>
                  <Input id="totalQty" type="text" name="totalQty" bsSize="sm" placeholder="Total Quanity" value={state.totalQty} disabled />
                </FormGroup>
                {/* total product quantity end */}

                {/* total lay quantity start */}
                <FormGroup tag={Col} xs="6">
                  <Label className="text-dark font-weight-bold" for="totalLayCount">
                    Total Lay Count
                  </Label>
                  <Input id="totalLayCount" type="text" name="totalLayCount" bsSize="sm" placeholder="Total Lay Count" value={state.totalLayCount} disabled />
                </FormGroup>
                {/* total lay quantity end */}

                {/* lay per cut start */}
                <FormGroup tag={Col} xs="6">
                  <Label className="text-dark font-weight-bold" for="layPerCut">
                    Lay Per Cut
                  </Label>
                  <CustomInputBox
                    id="layPerCut"
                    type="number"
                    name="layPerCut"
                    bsSize="sm"
                    onSelect={e => e.target.select()}
                    disabled={!state.totalLayCount > 0}
                    value={state.layPerCut}
                    innerRef={register( { required: true, min: 1 } )}
                    invalid={errors.layPerCut && true}
                    className={classNames( { 'is-invalid': errors['layPerCut'] } )}
                    onChange={onLayPerChange}
                    isNumberOnly
                  />
                </FormGroup>
                {/* lay per cut end */}

                {/* mixed or running color start */}
                <FormGroup tag={Col} xs="6" className="mt-2 d-flex justify-content-start">
                  <FormGroup className="mt-1">
                    <CustomInput
                      name="isColorGroup"
                      id="isColorGroup"
                      type="checkbox"
                      className="custom-control-primary text-nowrap text-dark font-weight-bold"
                      label="Is Running Color"
                      checked={state.isRunningColor}
                      onChange={onRunningColorCheckChange}
                      inline
                    />
                  </FormGroup>
                  <FormGroup className="mt-1">
                    <CustomInput
                      type="checkbox"
                      className="custom-control-primary text-nowrap text-dark font-weight-bold"
                      name="isRunningCut"
                      id="isRunningCut"
                      label="Is Running Cut"
                      checked={state?.isRunningCut}
                      onChange={onRunningCutCheckChange}
                      inline
                    />
                  </FormGroup>
                </FormGroup>
                {/* mixed or running color end */}

                {/* Product Parts Start */}
                <FormGroup tag={Col} xs={12} sm={12} md={6} lg={6} xl={6} className="mt-1">
                  <div className="divider divider-start" style={{ textAlign: 'left' }}>
                    <div className="divider-text text-dark font-weight-bold" style={{ padding: '0 0.5rem 0 0', marginTop: '0.5rem' }}>
                      Product Parts:
                    </div>
                  </div>
                  <div className="row ">
                    {state.productParts.map( item => (
                      <div key={item.productPartsId} className="col-lg-6 col-md-6 col-sm-6">
                        <Pocket size={16} /> {item.productPartsName}
                      </div>
                    ) )}
                  </div>
                </FormGroup>
                {/* Product Parts End*/}
              </Row>
            </Col>
            {/* Left section end */}

            {/* Right section start */}
            <Col xs="12" sm="12" md="12" lg="6" xl="6">
              <Row className="border rounded rounded-3">
                {/* badge start */}
                <FormGroup tag={Col} xs={12} sm={12} md={12} lg={12} xl={12} className="mt-1">
                  <Badge color="primary">{`Size Wise Ratio`}</Badge>
                </FormGroup>
                {/* badge end */}

                {/* size ration start */}
                <FormGroup tag={Col} xs="6">
                  <Input type="button" bsSize="sm" value="Size" disabled />
                </FormGroup>
                <FormGroup tag={Col} xs="6">
                  <Input type="button" bsSize="sm" value="Ratio" disabled />
                </FormGroup>
                {isLoadingTableData ? (
                  <div style={{ height: '250px' }}>
                    <ComponentSpinner />
                  </div>
                ) : (
                  state.sizesInSizeGroup?.map( ( s, sizeIndex ) => (
                    <Fragment key={s.sizeId}>
                      <FormGroup tag={Col} xs="6">
                        <Input type="text" bsSize="sm" defaultValue={s.size} className="text-center" disabled />
                      </FormGroup>
                      <FormGroup tag={Col} xs="6">
                        <CustomInputBox
                          className="text-center"
                          id={`style-size-${s.sizeId}`}
                          type="number"
                          bsSize="sm"
                          name={`style-size-${s.sizeId}`}
                          value={s.ratio}
                          onSelect={e => e.target.select()}
                          onChange={e => onSizeQuantityChange( e, sizeIndex )}
                          isNumberOnly
                        />
                      </FormGroup>
                    </Fragment>
                  ) )
                )}
                <FormGroup tag={Col} xs="6">
                  <Input type="text" value="Total" bsSize="sm" className="text-center" disabled />
                </FormGroup>
                <FormGroup tag={Col} xs="6">
                  <Input type="text" value={state.totalSizeRatio} bsSize="sm" className="text-center" disabled />
                </FormGroup>
                {/* size ration end */}

                {/* length and withd start */}
                <FormGroup tag={Col} xs="6">
                  <Label className="text-dark font-weight-bold" for="width">
                    Width (In Yeards)
                  </Label>
                  <CustomInputBox
                    id="width"
                    type="number"
                    name="width"
                    bsSize="sm"
                    value={state.width}
                    onSelect={e => e.target.select()}
                    innerRef={register( { required: true, min: 1 } )}
                    invalid={errors.width && true}
                    className={classNames( { 'is-invalid': errors['width'] }, 'text-center' )}
                    onChange={onWidthChange}
                    isNumberOnly
                  />
                </FormGroup>
                <FormGroup tag={Col} xs="6">
                  <Label className="text-dark font-weight-bold" for="length">
                    Length (In Yeards)
                  </Label>
                  <CustomInputBox
                    name="length"
                    id="length"
                    type="number"
                    bsSize="sm"
                    value={state.length}
                    onSelect={e => e.target.select()}
                    innerRef={register( { required: true, min: 1 } )}
                    invalid={errors.length && true}
                    className={classNames( { 'is-invalid': errors['length'] }, 'text-center' )}
                    onChange={onLengthChange}
                    isNumberOnly
                  />
                </FormGroup>
                {/* length and withd end */}
              </Row>
            </Col>
            {/* Right section end */}
          </Row>
          {/* Right section end */}

          {/* po details start */}
          <FormContentLayout title='PO Details' marginTop>
            <FormGroup tag={Col} xs={12} sm={12} md={12} lg={12} xl={12}>
              {isLoadingTableData ? (
                <div style={{ height: '150px' }}>
                  <ComponentSpinner />
                </div>
              ) : (
                <Table className={classes.poDetailsTable} size="sm" responsive>
                  <thead className={` table-bordered ${classes.stickyTableHead}`}>
                    <tr className="text-center">
                      <th style={{ minWidth: '4px' }}>
                        <strong>#</strong>
                      </th>
                      <th>
                        <strong>PO No.</strong>
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
                            <td style={{ minWidth: '4px' }}>
                              <Button
                                for="collapseId"
                                tag={Label}
                                onClick={() => onTogglePoDetails( podetailIndex )}
                                className="btn-sm"
                                color="flat-primary"
                                disabled={pod.isLoadingSizeColorRatio}
                              >
                                {pod.isLoadingSizeColorRatio ? (
                                  <Loader size={15} color="#57C69D" />
                                ) : pod.isOpen ? (
                                  <Minimize2 size={15} color="#57C69D" />
                                ) : (
                                  <Maximize2 id="collapseId" size={15} color="#7367f0" />
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
                            <td>{pod.excessQuantityPercentage}</td>
                            <td>{pod.wastageQuantityPercentage}</td>
                          </tr>
                          <tr>
                            <td colSpan={10} style={{ padding: '2px 10px !important', backgroundColor: '#fff' }}>
                              <Collapse isOpen={pod.isOpen}>
                                <Table className={classes.childTable}>
                                  <thead className="thead-light table-bordered">
                                    <tr>
                                      <th>Fabric Type</th>
                                      <th>#</th>
                                      <th>Color</th>
                                      <th>Order Qty</th>
                                      <th>Extra%</th>
                                      <th>With Extra</th>
                                      <th>Previous</th>
                                      <th>Lay Count</th>
                                      <th>Cut Qty</th>
                                      <th>RC</th>
                                      <th>Balance</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {pod.colorDetails &&
                                      pod.colorDetails.length > 0 &&
                                      pod?.colorDetails.map( ( colorDetail, colorDetailIdx ) => {
                                        return (
                                          <tr key={colorDetail.fieldId}>
                                            <td className="text-center">
                                              <Select
                                                menuPosition="fixed"
                                                id="fabricType"
                                                // isSearchable
                                                // isClearable
                                                bsSize="sm"
                                                theme={selectThemeColors}
                                                options={colorDetail.getPartGroupDto}
                                                value={colorDetail.partGroup}
                                                className="erp-dropdown-select"
                                                classNamePrefix="dropdown"
                                                onChange={item => {
                                                  onPartGroupChange( item, pod.styleId, pod.orderId, colorDetail.colorId, podetailIndex, colorDetailIdx );
                                                }}
                                              />
                                            </td>
                                            <td className="text-center">
                                              <CustomInput
                                                type="checkbox"
                                                disabled
                                                className="custom-control-primary"
                                                id={`pod-${colorDetail.fieldId}`}
                                                checked={colorDetail.isChecked}
                                                inline
                                                onChange={() => {
                                                  // onToggleColorDetailsCheck(e, podetailIndex, colorDetailIdx, colorDetail);
                                                }}
                                              />
                                            </td>
                                            <td className="text-left">{colorDetail.color}</td>
                                            <td>{colorDetail.quantity}</td>
                                            {/* <td>{colorDetail.adjustedQuantity}</td> */}
                                            <td style={{ maxWidth: '20px' }}>
                                              {colorDetail.isChecked ? (
                                                <Input
                                                  id="extra"
                                                  type="number"
                                                  name="extra"
                                                  bsSize="sm"
                                                  className={classes.inputBoxCenterAlign}
                                                  value={colorDetail.extraPercentage}
                                                  onSelect={e => e.target.select()}
                                                  onChange={e => onExtraPercentageChange( e, podetailIndex, colorDetailIdx )}
                                                />
                                              ) : (
                                                colorDetail.extraPercentage
                                              )}
                                            </td>
                                            <td>{colorDetail.withExtraQuantity}</td>
                                            <td>{colorDetail.preQuantity}</td>
                                            <td>{colorDetail.layCount}</td>
                                            <td style={{ maxWidth: '20px' }}>
                                              {colorDetail.isChecked ? (
                                                <>
                                                  <Input
                                                    id={`totalQuantity${colorDetail.fieldId}`}
                                                    type="text"
                                                    name={`totalQuantity${colorDetail.fieldId}`}
                                                    bsSize="sm"
                                                    value={colorDetail.totalQuantity}
                                                    // onSelect={e => e.target.select()}
                                                    innerRef={register( { required: true, min: 1 } )}
                                                    invalid={errors[`totalQuantity${colorDetail.fieldId}`] && true}
                                                    className={classNames(
                                                      { 'is-invalid': errors[`totalQuantity${colorDetail.fieldId}`] },
                                                      'text-center'
                                                    )}
                                                    onChange={e => onCutQuantityChange( e, podetailIndex, colorDetailIdx )}
                                                  />
                                                </>
                                              ) : colorDetail.totalQuantity === '' ? (
                                                0
                                              ) : (
                                                colorDetail.totalQuantity
                                              )}
                                            </td>
                                            <td>

                                              {colorDetail.totalQuantity !== 0 && colorDetail.layCount !== 0 && state.totalSizeRatio !== 0 ? (
                                                <MoreVertical
                                                  className="cursor-pointer"
                                                  onClick={() => hanldeSizeRatioModalToggle( colorDetail.totalQuantity, state )}
                                                />
                                              ) : (
                                                <MoreVertical />
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
                      <tr className='text-center '>
                        <td colSpan={10} >There is no record to display</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              )}

            </FormGroup>
          </FormContentLayout>

          <hr />
        </FormLayout>

        {/* po details end */}
        {sizeRatioModal && <SizeRatioDetails openModal={sizeRatioModal} setOpenModal={setSizeRatioModal} ratioQty={ratioQty} />}
      </UILoader>
    </div>
  );
};

export default CutPlanAddFormNew;
