/* eslint-disable no-unused-vars */
/* eslint-disable no-unreachable */

/**
 * Title: Cut Plan Add Form
 * Description: Cut Plan Add Form
 * Author: Iqbal Hossain
 * Date: 05-January-2022
 * Modified: 09-April-2022
 */

import classnames from 'classnames';
import ActionMenu from 'layouts/components/menu/action-menu';
import _ from 'lodash';
import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import { Loader, Maximize2, Minimize2, MoreVertical } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  Collapse,
  CustomInput,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  NavItem,
  NavLink,
  Row,
  Table
} from 'reactstrap';
import { baseAxios, merchandisingAxiosInstance } from 'services';
import { GARMENT_SIZE_GROUPS_API, PURCHASE_ORDERS_API, STYLES_API } from 'services/api-end-points/merchandising/v1';
import { CUT_PLAN_API, PURCHASE_ORDER_DETAILS_API, STYLE_WISE_PRODUCT_PARTS_GROUP_API } from 'services/api-end-points/production/v1';
import { isObjEmpty, selectThemeColors } from 'utility/Utils';
import { mapArrayToDropdown, stringifyConsole } from 'utility/commonHelper';
import { notify } from 'utility/custom/notifications';
import CustomDatePicker from 'utility/custom/production/CustomDatePicker';
import { formattedDate, serverDate } from 'utility/dateHelpers';
import { v4 as uuid } from 'uuid';
import SizeRatioDetails from '../details/SizeRatioDetails';
import ViewCutModal from '../details/ViewCutModal';
import classes from '../styles/CutPlanAddForm.module.scss';

const CutPlanAddForm = () => {
  //#region Hooks
  const { replace } = useHistory();
  const { register, errors, control, handleSubmit } = useForm();
  //#endregion
  //#region States
  const [styles, setStyles] = useState( [] );
  const [style, setStyle] = useState( null );
  const [productParts, setProductParts] = useState( [] );
  const [productPart, setProductPart] = useState( null );
  const [styleDetails, setStyleDetails] = useState( null );
  const [purchaseOrderDetails, setPurchaseOrderDetails] = useState( [] );
  const [filteredPurchaseOrderDetails, setFilteredPurchaseOrderDetails] = useState( [] );
  const [masterInfo, setMasterInfo] = useState( {
    cutPlanNo: '',
    startDate: '',
    style: '',
    styleCategory: '',
    BuyerName: '',
    totalQty: 0,
    totalLayCount: 0,
    isRunningCut: false,
    isRunningColor: false,
    layPerCut: ''
  } );
  const [sizeInfo, setSizeInfo] = useState( { total: 0, width: '', length: '', totalQty: 0 } );
  const [sizeGroups, setSizeGroups] = useState( [] );
  const [sizeGroup, setSizeGroup] = useState( null );
  const [date, setDate] = useState( new Date() );
  const [sizeRatioModal, setSizeRatioModal] = useState( false );
  const [cutModal, setCutModal] = useState( false );
  const [ratioQty, setRatioQty] = useState( [] );
  const [cloned, setCloned] = useState( [] );
  //#endregion

  //#region UDF's

  //Fetch Style Details
  const fetchStyleDetails = async ( styleId, poDetailsCallback ) => {
    try {
      const styleDetailsRes = await merchandisingAxiosInstance.get( `${STYLES_API.fetch_by_id}/${styleId}` );

      const styleDetails = styleDetailsRes.data;
      const sizeGroupsDDL = mapArrayToDropdown( styleDetails.styleSizeGroups, 'GroupName', 'Id' );
      setStyleDetails( styleDetails );
      setSizeGroups( sizeGroupsDDL );
      poDetailsCallback( styleDetails.buyerId, styleId );
    } catch ( err ) {
      notify( 'warning', 'server side error!!!' );
    }
  };

  //Fetch Product Parts
  const fetchProductPartDetails = async item => {
    try {
      const productPartsRes = await baseAxios.get( STYLE_WISE_PRODUCT_PARTS_GROUP_API.fetch_product_parts_by_style_id, {
        params: { styleId: item.id }
      } );
      const productPartDetails = productPartsRes.data.data;
      const productPartsDDL = mapArrayToDropdown( productPartDetails, 'productPartsName', 'productPartsId' );
      setProductParts( productPartsDDL );
    } catch ( err ) {
      notify( 'warning', 'server side error!!!' );
    }
  };

  //Fetch PO Details
  const fetchPoDetails = async ( buyerId, styleId ) => {
    try {
      const poDetailsRes = await merchandisingAxiosInstance.get( PURCHASE_ORDERS_API.fetch_PO_with_buyer_and_style( buyerId, styleId ) );
      const poDetails = poDetailsRes.data.map( pod => ( {
        ...pod,
        isOpen: false,
        isLoadingSizeColorRatio: false,
        fieldId: uuid()
      } ) );

      setPurchaseOrderDetails( poDetails );
    } catch ( err ) {
      notify( 'warning', 'server side error!!!' );
    }
  };
  //Fetch Cut Plan No
  const fetchCutPlanNo = async item => {
    try {
      const res = await baseAxios.get( CUT_PLAN_API.fetch_cut_plan_no_by_style, {
        params: { id: item.id, styleNo: item.styleNo }
      } );
      setMasterInfo( { ...masterInfo, cutPlanNo: res.data.data } );
    } catch ( err ) {
      notify( 'warning', 'server side error!!!' );
    }
  };

  //Fetch Size Details

  const fetchSizes = async sizeGroupId => {
    try {
      const res = await merchandisingAxiosInstance.get( `${GARMENT_SIZE_GROUPS_API.fetch_by_id}/${sizeGroupId}` );
      setSizeInfo( {
        ...sizeInfo,
        sizesDetails: { ...res.data, sizes: [...res.data.sizes.map( m => ( { ...m, ratio: '', quantity: 0, fieldId: uuid() } ) )] }
      } );
    } catch ( err ) {
      notify( 'warning', 'server side error!!!' );
    }
  };
  //#endregion

  //#region Effects
  useEffect( () => {
    const fetchStyles = async () => {
      try {
        const res = await merchandisingAxiosInstance.get( STYLES_API.fetch_all );
        const stylesDdl = mapArrayToDropdown( res.data.data, 'styleNo', 'id' );
        setStyles( stylesDdl );
      } catch ( err ) {
        notify( 'warning', 'server side error!!!' );
      }
    };
    fetchStyles();
  }, [] );
  //#endregion

  //#region Events

  //For Style Change

  const onStyleChange = async ( item, styleDetailsCallback ) => {
    if ( item ) {
      setStyle( item );
      setSizeGroup( null );
      setSizeInfo( { ...sizeInfo, sizesDetails: {} } );
      setFilteredPurchaseOrderDetails( [] );
      styleDetailsCallback( item.id, fetchPoDetails );
      fetchCutPlanNo( item );
      fetchProductPartDetails( item );
    } else {
      setStyleDetails( null );
      setStyle( null );
      setPurchaseOrderDetails( [] );
      setMasterInfo( { ...masterInfo, cutPlanNo: '' } );
      setSizeGroup( null );
      setSizeInfo( { ...sizeInfo, sizesDetails: {} } );
      setFilteredPurchaseOrderDetails( [] );
      setProductPart( null );
    }
  };

  //For Start Date Change
  const onStartDateChange = date => {
    const dates = date[0];
    setDate( dates );
  };

  //For Size Group Change
  const onSizeGroupChange = ( item, sizeGroupCallBack ) => {
    if ( item ) {
      const sizeGroupId = item.Id;
      const filteredPoDetails = purchaseOrderDetails.filter( pod => pod.sizeGroupId === sizeGroupId );
      if ( !filteredPoDetails.length ) {
        notify( 'warning', 'PO details not found!!!' );
      }
      setFilteredPurchaseOrderDetails( filteredPoDetails );
      setCloned( filteredPoDetails );
      setSizeGroup( item );
      sizeGroupCallBack( item.Id );
    } else {
      setSizeGroup( null );
      setSizeInfo( { ...sizeInfo, sizesDetails: {} } );
      setFilteredPurchaseOrderDetails( [] );
      setProductPart( null );
    }
  };

  //For Product Parts Change
  const onProductPartsChange = item => {
    if ( item ) {
      setProductPart( item );
      setMasterInfo( {
        ...masterInfo,
        totalQty: 0,
        totalLayCount: 0,
        layPerCut: ''
      } );
      setFilteredPurchaseOrderDetails( cloned );
    }
  };

  //For PO Details Toggle
  const togglePoDetails = async idx => {
    // check if the clicked item has loaded color details
    const hasLoadedColorRatio = filteredPurchaseOrderDetails[idx].colorDetails && filteredPurchaseOrderDetails[idx].colorDetails.length > 0;
    if ( hasLoadedColorRatio ) {
      const _poDetails = _.cloneDeep( filteredPurchaseOrderDetails );
      const clickedItem = _poDetails[idx];
      clickedItem.isOpen = !clickedItem.isOpen;
      _poDetails[idx] = clickedItem;
      setFilteredPurchaseOrderDetails( _poDetails );
    } else {
      const _orderDetails = _.cloneDeep( filteredPurchaseOrderDetails );
      const clickedItem = _orderDetails[idx];

      clickedItem.isLoadingSizeColorRatio = true;
      _orderDetails[idx] = clickedItem;
      setFilteredPurchaseOrderDetails( _orderDetails );

      try {
        const res = await baseAxios.get( PURCHASE_ORDER_DETAILS_API.fetch_size_color_ration, {
          params: { id: clickedItem.detailId }
        } );
        const _poDetails = _.cloneDeep( filteredPurchaseOrderDetails );
        const poclickedItem = _poDetails[idx];
        setTimeout( () => {
          if ( !res.data ) {
            poclickedItem.isLoadingSizeColorRatio = false;
            poclickedItem.isOpen = true;

            notify( 'warning', 'server side error!!!' );
          }
          poclickedItem.isLoadingSizeColorRatio = false;
          poclickedItem.isOpen = !poclickedItem.isOpen;
          poclickedItem.colorDetails = res.data.data.map( item => ( {
            ...item,
            fieldId: uuid(),
            totalQuantity: '',
            isChecked: false,
            extraPercentage: 0,
            // hasError: false,
            withExtraQuantity: item.quantity,

            balance: item.quantity - item.preQuantity
          } ) );

          _poDetails[idx] = poclickedItem;
          setFilteredPurchaseOrderDetails( _poDetails );
        }, 500 );
      } catch ( err ) {
        notify( 'warning', 'server side error!!!' );
      }
    }
  };
  //For Color Details Toggle Check
  const toggleCheck = async ( e, podIdx, colorDetailIdx, sizeGroupId, colorDetail ) => {
    const { checked } = e.target;
    const _poDetails = _.cloneDeep( filteredPurchaseOrderDetails );
    const poLine = _poDetails[podIdx];
    const _colorDetails = [...poLine.colorDetails];
    const colorDetailLine = { ..._colorDetails[colorDetailIdx] };
    if ( checked ) {
      const payload = {
        styleId: style.id,
        styleColorId: colorDetail.colorId,
        productPartIds: productPart?.map( pp => pp?.productPartsId )?.join( ',' )
      };
      try {
        const res = await baseAxios.get( STYLE_WISE_PRODUCT_PARTS_GROUP_API.CheckProductPartsIsSameColor, { params: payload } );
        if ( res.data.succeeded ) {
          if ( res.data.data ) {
            colorDetailLine.isChecked = checked;
          } else {
            notify( 'warning', 'color not same!!!' );
          }
        } else {
          notify( 'warning', 'server side error!!!' );
        }
      } catch ( err ) {
        notify( 'warning', 'server side error!!!' );
      }
    } else {
      setMasterInfo( {
        ...masterInfo,
        totalQty: masterInfo.totalQty - colorDetailLine.totalQuantity,
        totalLayCount: masterInfo.totalLayCount - colorDetailLine.layCount
      } );
      colorDetailLine.isChecked = checked;
      colorDetailLine.extraPercentage = 0;
      colorDetailLine.withExtraQuantity = colorDetailLine.quantity;
      colorDetailLine.totalQuantity = 0;
      colorDetailLine.layCount = 0;
      colorDetailLine.balance = colorDetailLine.quantity - colorDetailLine.preQuantity;
    }
    _colorDetails[colorDetailIdx] = colorDetailLine;
    _poDetails[podIdx] = { ...poLine, colorDetails: _colorDetails };
    setFilteredPurchaseOrderDetails( _poDetails );
  };

  //For Extra Percentage Change
  const onExtraPercentageChange = ( e, podIndex, colorDetailsIndex ) => {
    const { value } = e.target;
    const _poDetails = [...filteredPurchaseOrderDetails];
    const poLine = _poDetails[podIndex];
    const colorDetails = [...poLine.colorDetails];
    const colorDetailsLine = colorDetails[colorDetailsIndex];
    colorDetailsLine.extraPercentage = +value;
    colorDetailsLine.withExtraQuantity = Math.ceil( ( colorDetailsLine.quantity + ( colorDetailsLine.quantity * +colorDetailsLine.extraPercentage ) ) / 100 );
    const balanceQty = colorDetailsLine.withExtraQuantity - ( colorDetailsLine.preQuantity + colorDetailsLine.totalQuantity );

    colorDetailsLine.balance = balanceQty;
    colorDetails[colorDetailsIndex] = colorDetailsLine;
    _poDetails[podIndex] = { ...poLine, colorDetails: colorDetails };
    setFilteredPurchaseOrderDetails( _poDetails );
  };

  //For Cut Quantity Change
  const onCutQuantityChange = ( e, podIndex, colorDetailIndex ) => {
    const { value } = e.target;
    // const regx = /^[+-]?\d*(?:[.,]\d*)?$/;
    const podetails = [...filteredPurchaseOrderDetails];
    const poLine = podetails[podIndex];
    const colorDetails = [...poLine.colorDetails];
    const colorLine = colorDetails[colorDetailIndex];
    // const validInputWidth = regx.test(value) ? value : sizeInfo.width;

    let cutQuantity = value ? +value : 0;
    const comparativeQuantity = colorLine.extraPercentage === 0 ? colorLine.quantity : colorLine.withExtraQuantity;
    if ( cutQuantity > comparativeQuantity - colorLine.preQuantity ) {
      notify( 'warning', 'Quantity exceeded!!!' );
      cutQuantity = 0;
    }
    const layCount = Number.isInteger( cutQuantity / sizeInfo.total ) ? cutQuantity / sizeInfo.total : 0;
    colorLine.totalQuantity = cutQuantity;
    colorLine.layCount = layCount;
    const balanceQuantity = comparativeQuantity - ( colorLine.preQuantity + colorLine.totalQuantity );
    colorLine.balance = balanceQuantity;

    colorDetails[colorDetailIndex] = colorLine;
    podetails[podIndex] = { ...poLine, colorDetails: colorDetails };

    const checkedItems = podetails
      .reduce( ( acc, curr ) => {
        curr.colorDetails?.map( colorDetail => acc.push( colorDetail ) );
        return acc;
      }, [] )
      .filter( item => item.isChecked );

    let totalLayCount = 0;
    let totalQuantity = 0;
    for ( let i = 0; i < checkedItems.length; i++ ) {
      const item = checkedItems[i];
      totalLayCount += item.layCount;
      totalQuantity += item.totalQuantity;
    }

    setFilteredPurchaseOrderDetails( podetails );
    setMasterInfo( { ...masterInfo, totalLayCount: totalLayCount, totalQty: totalQuantity } );
  };

  //For Lay Per Cut Change
  const onLayPerCutChange = e => {
    const { value } = e.target;
    const regx = /^[+-]?\d*(?:[.,]\d*)?$/;
    const validInput = regx.test( value ) ? +value : masterInfo.layPerCut;
    let updatedLay = validInput;

    if ( updatedLay > masterInfo.totalLayCount ) {
      notify( 'warning', 'Quantity exceeded!!!' );
      updatedLay = 0;
    }
    const _sizes = [...sizeInfo.sizesDetails.sizes.map( m => m )];

    const updatedSizeInfo = _sizes.map( sz => ( {
      ...sz,
      quantity: updatedLay * sz.ratio
    } ) );
    const totalQty = updatedSizeInfo.reduce( ( acc, curr ) => {
      acc += +curr.quantity;
      return acc;
    }, 0 );

    setSizeInfo( { ...sizeInfo, totalQty: totalQty, sizesDetails: { sizes: [...updatedSizeInfo] } } );
    setMasterInfo( { ...masterInfo, layPerCut: updatedLay } );
  };

  //For Width Change
  const onWidthChange = e => {
    const { value } = e.target;
    const regx = /^[+-]?\d*(?:[.,]\d*)?$/;
    const validInputWidth = regx.test( value ) ? +value : sizeInfo?.width;
    setSizeInfo( { ...sizeInfo, width: validInputWidth } );
  };
  //For Length Change
  const onLengthChange = e => {
    const { value } = e.target;
    const regx = /^[+-]?\d*(?:[.,]\d*)?$/;
    const validInputLength = regx.test( value ) ? +value : sizeInfo.length;
    setSizeInfo( { ...sizeInfo, length: validInputLength } );
  };

  //For Size Quantity Change
  const onSizeQuantityChange = ( e, sizeIndex ) => {
    const { value } = e.target;
    const regx = /^[+-]?\d*(?:[.,]\d*)?$/;
    const _filteredPurchaseOrderDetails = [...filteredPurchaseOrderDetails];
    const emptyCutQty = _filteredPurchaseOrderDetails?.map( m => ( {
      ...m,
      colorDetails: m?.colorDetails?.map( n => ( {
        ...n,
        layCount: 0,
        totalQuantity: 0
      } ) )
    } ) );
    setFilteredPurchaseOrderDetails( emptyCutQty );
    setMasterInfo( { ...masterInfo, totalLayCount: 0, totalQty: 0, layPerCut: '' } );

    const _sizes = [...sizeInfo.sizesDetails.sizes.map( m => m )];
    const selectedSize = _sizes[sizeIndex];
    const validInputRatio = regx.test( value ) ? +value : selectedSize.ratio;
    selectedSize.ratio = validInputRatio;
    const updatedQty = masterInfo.layPerCut * selectedSize.ratio;
    selectedSize.quantity = updatedQty;
    const total = _sizes.reduce( ( acc, curr ) => {
      acc += +curr.ratio;
      return acc;
    }, 0 );
    const totalQty = _sizes.reduce( ( acc, curr ) => {
      acc += +curr.quantity;
      return acc;
    }, 0 );

    _sizes[sizeIndex] = selectedSize;
    setSizeInfo( {
      ...sizeInfo,
      total: total,
      totalQty: totalQty
    } );
  };

  const onFocusCutQuantity = () => {
    if ( !sizeInfo.total ) {
      notify( 'warning', 'Size info not found!!!' );
    }
  };

  // Size Ration Modal Toggle Open
  const hanldeSizeRatioModalToggle = ( cutqty, sizeinfo ) => {
    const _sizeinfo = { ...sizeinfo };
    const ratioqty = cutqty / _sizeinfo.total;
    const _sizeratio = _sizeinfo?.sizesDetails?.sizes?.map( sd => ( {
      ...sd,
      quantity: ratioqty * parseInt( sd.ratio )
    } ) );

    setRatioQty( _sizeratio );
    setSizeRatioModal( !sizeRatioModal );
  };
  const hanldeCutModalModalToggle = () => {
    setCutModal( !cutModal );
  };
  //For Submit Cut Plan
  const onSubmit = async () => {
    if ( isObjEmpty( errors ) ) {
      const sizes = sizeInfo?.sizesDetails?.sizes?.map( m => ( {
        sizeId: m.id,
        sizeName: m.size,
        ratio: m.ratio,
        quantity: 0
      } ) );

      const poAndColorDetails = filteredPurchaseOrderDetails.filter( po => po.colorDetails && po.colorDetails.some( cd => cd.isChecked ) );
      const poAndFilteredColorDetails = poAndColorDetails?.map( pcd => ( {
        ...pcd,
        colorDetails: pcd.colorDetails
          .filter( cd => cd.isChecked )
          .map( item => ( {
            ...item,
            poNo: pcd.buyerOrderNumber,
            poDetailsId: pcd.detailId,
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
          return coppieItem;
        } );
        return colorDetails;
      } );
      const { totalLayCount, layPerCut, isRunningCut, isRunningColor } = masterInfo;
      let listingQty = [];
      if ( isRunningColor ) {
        const coppiedCombo2 = _.cloneDeep( _.sortBy( modifiedPoColorDetailsComb, ['colorName'] ) );
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
          const combo1 = cutSteps.map( ( step, index, arr ) => {
            const cuttingDetails = [];
            const runningItem = coppiedCombo2[runningIndex];
            if ( step <= runningItem.remainingQty ) {
              const innerItem = { ...runningItem };
              innerItem.layPerCut = step;
              runningItem.layPerCut = step;
              runningItem.remainingQty = runningItem.remainingQty - step;
              delete innerItem.remainingQty;
              cuttingDetails.push( innerItem );
            } else {
              const newInnerItem = { ...runningItem };
              newInnerItem.layPerCut = runningItem.remainingQty;
              runningItem.isComplete = true;
              runningIndex = runningIndex + 1;
              const nextItem = coppiedCombo2[runningIndex];
              const nextInnerItem = { ...nextItem };
              nextInnerItem.layPerCut = step - runningItem.remainingQty;
              nextItem.remainingQty = nextItem.layPerCut - nextInnerItem.layPerCut;
              delete newInnerItem.remainingQty;
              delete nextInnerItem.remainingQty;
              cuttingDetails.push( newInnerItem, nextInnerItem );
            }
            return { cutNo: '', tableNo: '', comboQty: 0, layPerCut: step, cuttingDetails };
          } );
          listingQty = combo1;
        } else {
          const combo2 = coppiedCombo2.map( ( com, comIndx ) => {
            const cuttingDetails = [];
            const fullSteps = com.remainingQty <= layPerCut ? 0 : parseInt( com.remainingQty / layPerCut );
            const remainingQty = com.remainingQty <= layPerCut ? com.remainingQty : parseInt( com.remainingQty % layPerCut );

            const _cutSteps = [];
            let stepCount = 1;
            while ( stepCount <= fullSteps ) {
              _cutSteps.push( layPerCut );
              stepCount++;
            }
            if ( remainingQty !== 0 ) {
              _cutSteps.push( remainingQty );
            }
            _cutSteps.forEach( step => {
              const innerItem = { ...com };
              innerItem.layPerCut = step;
              innerItem.totalQty = step * sizeInfo.total;
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
          } );
          listingQty = combo2.flat();
        }
      } else {
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
          const coppiedCombo = _.cloneDeep( modifiedPoColorDetailsComb );
          let runningIndex = 0;
          const combo3 = cutSteps.map( ( step, index, arr ) => {
            const cuttingDetails = [];
            const runningItem = coppiedCombo[runningIndex];
            if ( step <= runningItem.remainingQty ) {
              const innerItem = { ...runningItem };
              innerItem.layPerCut = step;
              runningItem.layPerCut = step;
              runningItem.remainingQty = runningItem.remainingQty - step;
              delete innerItem.remainingQty;
              cuttingDetails.push( innerItem );
            } else {
              const newInnerItem = { ...runningItem };
              newInnerItem.layPerCut = runningItem.remainingQty;
              runningItem.isComplete = true;
              runningIndex = runningIndex + 1;
              const nextItem = coppiedCombo[runningIndex];
              const nextInnerItem = { ...nextItem };
              nextInnerItem.layPerCut = step - runningItem.remainingQty;
              nextItem.remainingQty = nextItem.layPerCut - nextInnerItem.layPerCut;
              delete newInnerItem.remainingQty;
              delete nextInnerItem.remainingQty;
              cuttingDetails.push( newInnerItem, nextInnerItem );
            }
            return { cutNo: '', tableNo: '', comboQty: 0, layPerCut: step, cuttingDetails };
          } );
          listingQty = combo3;
        } else {
          const coppiedCombo = _.cloneDeep( modifiedPoColorDetailsComb );
          const combo4 = coppiedCombo
            .map( ( com, comIndx ) => {
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
                innerItem.totalQty = step * sizeInfo.total;
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
      }

      const payload = {
        cutPlanNo: masterInfo?.cutPlanNo,
        startDate: serverDate( date ),
        styleId: styleDetails?.id,
        styleNo: styleDetails?.styleNumber,
        buyerId: styleDetails?.buyerId,
        buyerName: styleDetails?.buyerName,
        styleCategoryId: styleDetails?.styleCategoryId,
        styleCategory: styleDetails?.styleCategory,
        sizeGroupId: sizeGroup?.value,
        sizeGroupName: sizeGroup?.label,
        layPerCut: masterInfo?.layPerCut,
        totalLay: masterInfo?.totalLayCount,
        totalQuantity: masterInfo?.totalQty,
        isRunningCut: isRunningCut,
        isColorGroup: isRunningColor,
        status: true,
        marker: {
          length: sizeInfo?.length,
          width: sizeInfo?.width,
          totalQty: sizeInfo?.total,
          markerSize: sizes
        },
        listCutting: listingQty,
        productPartsInCutPlan: productPart.map( pp => ( {
          productPartsId: pp.productPartsId,
          productPartsName: pp.productPartsName
        } ) )
      };
      stringifyConsole( payload, null, 2 );
      return;
      try {
        const res = await baseAxios.post( CUT_PLAN_API.add, payload );
        if ( res.data ) {
          notify( 'success', 'Data Submitted Successfully' );
          handleCancel();
        }
      } catch ( error ) {
        notify( 'error', 'Something went wrong!! Please try again' );
      }
    }
  };

  const handleCancel = () => {
    replace( '/cut-plan' );
  };
  //#endregion
  return (
    <Fragment>
      <Card className="p-1 mt-3">
        <CardBody>
          <Form onSubmit={handleSubmit( onSubmit )}>
            <ActionMenu title="New Cut Plan">
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
                    replace( '/cut-plan' );
                  }}
                >
                  Cancel
                </NavLink>
              </NavItem>
            </ActionMenu>
            <Row>
              <Col xs="12" sm="12" md="12" lg="6" xl="6">
                <Row className="border rounded rounded-3 mr-1">
                  <FormGroup tag={Col} xs={12} sm={12} md={12} lg={12} xl={12} className="mt-n1">
                    <Badge color="primary">{`Master Information`}</Badge>
                  </FormGroup>
                  <FormGroup tag={Col} xs="6">
                    <Label className="text-dark font-weight-bold" for="cutPlanNo">
                      Cut Plan No
                    </Label>
                    <Input id="cutPlanNo" type="text" name="cutPlanNo" placeholder="Cut Plan No" disabled value={masterInfo.cutPlanNo} />
                    {errors && errors.cutPlanNo && <FormFeedback>Cut Plan No is required!</FormFeedback>}
                  </FormGroup>
                  <FormGroup tag={Col} xs="6" className="text-nowrap text-dark font-weight-bold">
                    <CustomDatePicker
                      name="date"
                      minDate={moment().toDate()}
                      title="Start Date"
                      value={date}
                      onChange={onStartDateChange}
                    // {...register('date', { required: true })}
                    // className={classnames({
                    //   'is-invalid': date
                    // })}
                    />
                    <p>{errors?.date?.message}</p>
                  </FormGroup>
                  <FormGroup tag={Col} xs="6">
                    <Label className="text-dark font-weight-bold" for="style">
                      Style
                    </Label>

                    <Select
                      id="style"
                      isSearchable
                      isClearable
                      bsSize="sm"
                      isSelected
                      maxMenuHeight="200px"
                      menuPlacement="bottom"
                      theme={selectThemeColors}
                      options={styles}
                      value={style}
                      // control={control}
                      classNamePrefix="select"
                      onChange={item => onStyleChange( item, fetchStyleDetails )}
                    // {...register('style', { required: true })}
                    // className={classnames({
                    //   'is-invalid': styles !== null && style === null
                    // })}
                    />
                    {errors && errors.style && <FormFeedback>Style is required!</FormFeedback>}
                  </FormGroup>

                  <FormGroup tag={Col} xs="6">
                    <Label className="text-dark font-weight-bold" for="sizeGroups">
                      Size Groups
                    </Label>
                    <Select
                      id="sizeGroups"
                      isSearchable
                      isClearable
                      bsSize="sm"
                      theme={selectThemeColors}
                      isDisabled={!styleDetails}
                      options={sizeGroups}
                      value={sizeGroup}
                      classNamePrefix="select"
                      onChange={item => onSizeGroupChange( item, fetchSizes )}
                    // {...register('sizeGroup', { required: true })}
                    // className={classnames({
                    //   'is-invalid': sizeGroups !== null && sizeGroup === null
                    // })}
                    />
                    {errors && errors.sizeGroup && <FormFeedback>Size Group is required!</FormFeedback>}
                  </FormGroup>
                  <FormGroup tag={Col} xs="6">
                    <Label className="text-dark font-weight-bold" for="productParts">
                      Product Parts
                    </Label>
                    <Select
                      id="productParts"
                      isSearchable
                      isClearable
                      isMulti
                      bsSize="sm"
                      isDisabled={!styleDetails || !sizeGroup}
                      theme={selectThemeColors}
                      options={productParts}
                      value={productPart}
                      classNamePrefix="select"
                      onChange={item => onProductPartsChange( item )}
                    // {...register('productPart', { required: true })}
                    // className={classnames({
                    //   'is-invalid': productParts !== null && productPart === null
                    // })}
                    />
                    {errors && errors.productPart && <FormFeedback>Product Parts is required!</FormFeedback>}
                  </FormGroup>
                  <FormGroup tag={Col} xs="6">
                    <Label className="text-dark font-weight-bold" for="styleCategory">
                      Style Category
                    </Label>
                    <Input
                      id="styleCategory"
                      type="text"
                      name="styleCategory"
                      placeholder="Style Category"
                      defaultValue={styleDetails?.styleCategory}
                      disabled
                    />
                  </FormGroup>
                  <FormGroup tag={Col} xs="6">
                    <Label className="text-dark font-weight-bold" for="buyerName">
                      Buyer Name
                    </Label>
                    <Input id="buyerName" type="text" name="buyerName" placeholder="Buyer Name" disabled defaultValue={styleDetails?.buyerName} />
                  </FormGroup>
                  <FormGroup tag={Col} xs="6">
                    <Label className="text-dark font-weight-bold" for="totalQty">
                      Total Quanity
                    </Label>
                    <Input id="totalQty" type="text" name="totalQty" placeholder="Total Quanity" value={masterInfo.totalQty} disabled />
                  </FormGroup>
                  <FormGroup tag={Col} xs="6">
                    <Label className="text-dark font-weight-bold" for="totalLayCount">
                      Total Lay Count
                    </Label>
                    <Input
                      id="totalLayCount"
                      type="text"
                      name="totalLayCount"
                      placeholder="Total Lay Count"
                      value={masterInfo.totalLayCount}
                      disabled
                    />
                  </FormGroup>

                  <FormGroup tag={Col} xs="6">
                    <Label className="text-dark font-weight-bold" for="layPerCut">
                      Lay Per Cut
                    </Label>
                    <Input
                      id="layPerCut"
                      type="text"
                      name="layPerCut"
                      disabled={!masterInfo.totalLayCount > 0}
                      value={masterInfo.layPerCut}
                      // onSelect={e => e.target.select()}
                      onChange={e => onLayPerCutChange( e )}
                      innerRef={register( { required: true } )}
                      invalid={errors.layPerCut && true}
                      className={classnames( { 'is-invalid': errors['layPerCut'] } )}
                    />
                    {errors && errors.layPerCut && <FormFeedback>Lay Per Cut is required!</FormFeedback>}
                  </FormGroup>

                  <FormGroup tag={Col} xs="12" className="mt-2 d-flex justify-content-start">
                    <FormGroup className="mt-1">
                      <CustomInput
                        name="isColorGroup"
                        id="isColorGroup"
                        type="checkbox"
                        className="custom-control-primary text-nowrap text-dark font-weight-bold"
                        label="Is Assort Color"
                        checked={masterInfo?.isRunningColor}
                        onChange={e => setMasterInfo( { ...masterInfo, isRunningColor: e.target.checked } )}
                        inline
                      />
                    </FormGroup>
                    <FormGroup className="mt-1">
                      <CustomInput
                        type="checkbox"
                        className="custom-control-primary text-nowrap text-dark font-weight-bold"
                        name="isRunningCut"
                        id="isRunningCut"
                        label="Is Running"
                        checked={masterInfo?.isRunningCut}
                        onChange={e => setMasterInfo( { ...masterInfo, isRunningCut: e.target.checked } )}
                        inline
                      />
                    </FormGroup>
                  </FormGroup>
                </Row>
              </Col>

              <Col xs="12" sm="12" md="12" lg="6" xl="6">
                <Row className="border rounded rounded-3">
                  <FormGroup tag={Col} xs={12} sm={12} md={12} lg={12} xl={12} className="mt-n1">
                    <Badge color="primary">{`Size Wise Ratio`}</Badge>
                  </FormGroup>
                  <FormGroup tag={Col} xs="6">
                    <Input type="button" value="Size" disabled />
                  </FormGroup>
                  <FormGroup tag={Col} xs="6">
                    <Input type="button" value="Ratio" disabled />
                  </FormGroup>
                  {/* <FormGroup tag={Col} xs="4">
                     <Input type="button" value="Quantity" disabled />
                   </FormGroup> */}
                  {/*  */}
                  {sizeInfo?.sizesDetails?.sizes?.map( ( s, sizeIdx ) => (
                    <Fragment key={s.sizeId}>
                      <FormGroup tag={Col} xs="6">
                        <Input type="text" defaultValue={s.size} className="text-center" disabled />
                      </FormGroup>
                      <FormGroup tag={Col} xs="6">
                        <Input
                          className="text-center"
                          id={`style-size-${s.fieldId}`}
                          type="text"
                          name={`style-size-${s.fieldId}`}
                          disabled={!filteredPurchaseOrderDetails.length}
                          value={s.ratio}
                          // onSelect={e => e.target.select()}
                          onChange={e => onSizeQuantityChange( e, sizeIdx )}
                          innerRef={register( { required: true } )}
                          invalid={errors[`style-size-${s.fieldId}`] && true}
                        // invalid={errors[`totalQuantity${colorDetail.fieldId}`] && true}
                        />
                        {errors && errors[`style-size-${s.fieldId}`] && <FormFeedback>Ratio is required!</FormFeedback>}
                      </FormGroup>
                      {/* <FormGroup tag={Col} xs="4">
                         <Input id={`style-size-${s.sizeId}`} type="number" name="quantity" disabled value={s.quantity} />
                       </FormGroup> */}
                    </Fragment>
                  ) )}

                  {/*  */}

                  <FormGroup tag={Col} xs="6">
                    <Input type="text" value="Total" className="text-center" disabled />
                  </FormGroup>
                  <FormGroup tag={Col} xs="6">
                    <Input type="text" value={sizeInfo?.total} className="text-center" disabled />
                  </FormGroup>

                  <FormGroup tag={Col} xs="6">
                    <Label className="text-dark font-weight-bold" for="width">
                      Width
                    </Label>
                    <Input
                      id={`${sizeInfo?.width}`}
                      type="text"
                      name="width"
                      value={sizeInfo?.width}
                      onChange={onWidthChange}
                      innerRef={register( { required: true } )}
                      invalid={errors.width && true}
                      className={classnames( { 'is-invalid': errors['width'] } )}
                    />
                    {errors && errors.width && <FormFeedback>Width is Required!</FormFeedback>}
                  </FormGroup>
                  <FormGroup tag={Col} xs="6">
                    <Label className="text-dark font-weight-bold" for="length">
                      Length
                    </Label>
                    <Input
                      name="length"
                      id="length"
                      type="text"
                      value={sizeInfo?.length}
                      // onSelect={e => e.target.select()}
                      onChange={onLengthChange}
                      // onChange={e => setSizeInfo({ ...sizeInfo, length: Number(e.target.value) })}
                      innerRef={register( { required: true } )}
                      invalid={errors.length && true}
                      className={classnames( { 'is-invalid': errors['length'] } )}
                    />
                    {errors && errors.length && <FormFeedback>Length is Required!</FormFeedback>}
                  </FormGroup>
                </Row>
              </Col>
              <hr />
            </Row>

            <Row className="border rounded rounded-3 mt-1">
              <FormGroup tag={Col} xs={12} sm={12} md={12} lg={12} xl={12} className="mt-n1">
                <Badge color="primary">{`PO Details`}</Badge>
              </FormGroup>
              <FormGroup tag={Col} xs={12} sm={12} md={12} lg={12} xl={12}>
                <Table className={classes.poDetailsTable} size="sm" responsive>
                  <thead className={`thead-dark table-bordered ${classes.stickyTableHead}`}>
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
                    {filteredPurchaseOrderDetails.map( ( pod, podIdx ) => (
                      <Fragment key={pod.fieldId}>
                        <tr>
                          <td style={{ minWidth: '4px' }}>
                            <Button
                              for="collapseId"
                              tag={Label}
                              onClick={() => togglePoDetails( podIdx )}
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
                          <td>{pod.buyerOrderNumber}</td>
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
                                    pod?.colorDetails.map( ( colorDetail, colorDetailIdx ) => (
                                      <tr key={colorDetail.colorId}>
                                        <td className="text-center">
                                          <CustomInput
                                            type="checkbox"
                                            className="custom-control-primary"
                                            id={`pod-${colorDetail.fieldId}`}
                                            checked={colorDetail.isChecked}
                                            inline
                                            onChange={e => toggleCheck( e, podIdx, colorDetailIdx, pod.sizeGroupId, colorDetail )}
                                          />
                                        </td>
                                        <td className="text-left">{colorDetail.color}</td>
                                        <td>{colorDetail.quantity}</td>
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
                                              onChange={e => onExtraPercentageChange( e, podIdx, colorDetailIdx )}
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
                                                // className={classes.inputBoxCenterAlign}
                                                value={colorDetail.totalQuantity}
                                                onFocus={onFocusCutQuantity}
                                                // onSelect={e => e.target.select()}
                                                onChange={e => onCutQuantityChange( e, podIdx, colorDetailIdx )}
                                                innerRef={register( { required: true } )}
                                                invalid={errors[`totalQuantity${colorDetail.fieldId}`] && true}
                                                className={
                                                  ( classnames( { 'is-invalid': errors[`totalQuantity${colorDetail.fieldId}`] } ),
                                                    classes.inputBoxCenterAlign )
                                                }
                                              />
                                            </>
                                          ) : colorDetail.totalQuantity === '' ? (
                                            0
                                          ) : (
                                            colorDetail.totalQuantity
                                          )}
                                        </td>
                                        <td>
                                          {colorDetail.totalQuantity !== 0 && colorDetail.layCount !== 0 && sizeInfo.total !== 0 ? (
                                            <MoreVertical
                                              className="cursor-pointer"
                                              onClick={() => hanldeSizeRatioModalToggle( colorDetail.totalQuantity, sizeInfo )}
                                            />
                                          ) : (
                                            <MoreVertical />
                                          )}
                                        </td>
                                        <td>{colorDetail.balance}</td>
                                      </tr>
                                    ) )}
                                </tbody>
                              </Table>
                            </Collapse>
                          </td>
                        </tr>
                      </Fragment>
                    ) )}
                  </tbody>
                </Table>
              </FormGroup>
              <hr />
            </Row>
          </Form>
        </CardBody>
        {sizeRatioModal && <SizeRatioDetails openModal={sizeRatioModal} setOpenModal={setSizeRatioModal} ratioQty={ratioQty} />}

        {cutModal && <ViewCutModal openModal={cutModal} setOpenModal={setCutModal} />}
      </Card>
    </Fragment>
  );
};

export default CutPlanAddForm;

/**
 * 23-Jan-2022 : add collapsible table in Cut plan create form
 * 26-Jan-2022 : add toggle checkbox, define cut qty, define size ratio with reset feature
 * 27-Jan-2022 : add cut size ratio modal
 * 09-Apr-2022 : add api data for styles ddl and po details
 **/
