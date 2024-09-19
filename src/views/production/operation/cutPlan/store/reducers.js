/* eslint-disable no-mixed-operators */
/*
     Title: Reducers for CUT_PLAN
     Description: Reducers for CUT_PLAN
     Author: Iqbal Hossain
     Date: 06-January-2022
     Modified: 06-January-2022
*/
import _ from 'lodash';
import { mapArrayToDropdown } from 'utility/commonHelper';
import { notify } from 'utility/custom/notifications';
import { partsTypes } from 'utility/enums';
import { v4 as uuid } from 'uuid';
import {
  ADD_CUT_PLAN,
  DELETE_CUT_PLAN,
  DELETE_CUT_PLAN_BY_RANGE,
  FETCH_CUT_PLAN,
  FETCH_CUT_PLAN_BY_ID,
  FETCH_CUT_PLAN_BY_QUERY,
  LOADING,
  RESET_SELECTED_ITEM,
  TOGGLE_CUT_PLAN_CONFIRM_MODAL_OPEN,
  UPDATE_CUT_PLAN
} from './actionType';

const initialState = {
  loading: false,
  items: [],
  queryData: [],
  total: 1,
  params: {},
  selectedItem: null,
  isOpenConfirmModal: false
};

export const cutPlanReducer = ( state = initialState, action ) => {
  const { type, payload } = action;
  switch ( type ) {
    case LOADING: {
      return {
        ...state,
        loading: payload
      };
    }
    case RESET_SELECTED_ITEM: {
      return {
        ...state,
        selectedItem: null
      };
    }

    case FETCH_CUT_PLAN: {
      return { ...state, items: payload };
    }
    case FETCH_CUT_PLAN_BY_ID: {
      const { marker, masterData, productParts } = payload;
      const totalQuantityInCuttingDetails = masterData.cuttingDetailsList.reduce( ( acc, curr ) => ( acc += curr['totalQty'] ), 0 );
      return {
        ...state,
        selectedItem: {
          marker,
          masterData: { ...masterData, totalQuantityInCuttingDetails },
          productParts
        }
      };
    }
    case FETCH_CUT_PLAN_BY_QUERY: {
      return {
        ...state,
        items: payload.items,
        total: payload.totalRecords,
        params: payload.params
      };
    }

    case TOGGLE_CUT_PLAN_CONFIRM_MODAL_OPEN: {
      return { ...state, isOpenConfirmModal: payload };
    }
    case ADD_CUT_PLAN: {
      return { ...state, total: state.total + 1 };
    }
    case UPDATE_CUT_PLAN: {
      return { ...state, total: state.total + 1 };
    }
    case DELETE_CUT_PLAN: {
      return { ...state, items: payload };
    }
    case DELETE_CUT_PLAN_BY_RANGE: {
      return { ...state, items: payload };
    }
    default:
      return state;
  }
};

export const initialFormState = {
  date: new Date(),
  styles: [],
  selectedStyle: null,
  selectedStyleDetails: null,
  partTypes: [...partsTypes],
  productParts: [],
  selectedPartsType: null,
  purchaseOrderDetails: [],
  purchaseOrderDetailsBySizeGroup: [],
  sizeGroups: [],
  selectedSizeGroup: null,
  sizesInSizeGroup: [],
  totalSizeRatio: 0,
  length: '',
  width: '',
  cutPlanNo: '',
  startDate: '',
  style: '',
  styleCategory: '',
  BuyerName: '',
  totalQty: 0,
  totalLayCount: 0,
  isRunningCut: false,
  isRunningColor: false,
  layPerCut: 0
};
export const LOAD_STYLES = 'LOAD_STYLES';
export const DATE_CHANGE = ' DATE_CHANGE';
export const STYLE_CHANGE = 'STYLE_CHANGE';
export const SIZE_GROUP_CHANGE = 'SIZE_GROUP_CHANGE';
export const SIZE_QUANTITY_CHANGE = 'SIZE_QUANTITY_CHANGE';
export const PART_GROUPS_CHANGE = 'PART_GROUPS_CHANGE';
export const PARTS_TYPE_CHANGE = 'PARTS_TYPE_CHANGE';
export const LAY_PER_CUT_CHANGE = 'LAY_PER_CUT_CHANGE';
export const LENGTH_CHANGE = 'LENGTH_CHANGE';
export const WIDTH_CHANGE = 'WIDTH_CHANGE';
export const RUNNING_COLOR_CHECK_CHANGE = 'RUNNING_COLOR_CHECK_CHANGE';
export const RUNNING_CUT_CHECK_CHANGE = 'RUNNING_CUT_CHECK_CHANGE';
export const TOGGLE_PO_DETAILS = 'TOGGLE_PO_DETAILS';
export const LOADING_SIZE_COLOR_RATIO = 'LOADING_SIZE_COLOR_RATIO';
export const LOAD_SIZE_COLOR_DETAILS = 'LOAD_SIZE_COLOR_DETAILS';
export const TOGGLE_COLOR_DETAILS_CHECK = 'TOGGLE_COLOR_DETAILS_CHECK';
export const EXTRA_PERCENTAGE_CHANGE = 'EXTRA_PERCENTAGE_CHANGE';
export const CUT_QUANTITY_CHANGE = 'CUT_QUANTITY_CHANGE';
export const RESET_SELECTED_COLOR_DETAILS_ROW = 'RESET_SELECTED_COLOR_DETAILS_ROW';

export const cutPlanFormReducer = ( state = initialFormState, action ) => {
  const { type, payload } = action;
  switch ( type ) {
    case LOAD_STYLES: {
      return { ...state, styles: payload };
    }

    case DATE_CHANGE: {
      const { startDate } = payload;
      return {
        ...state,
        date: startDate
      };
    }

    case STYLE_CHANGE: {
      const { style, cutPlanNo, styleDetails, poDetails } = payload;
      const sizeGroupsDDL = mapArrayToDropdown( styleDetails.styleSizeGroups, 'name', 'id' );
      const purchaseOrderDetails = poDetails.map( pod => ( {
        ...pod,
        isOpen: false,
        isLoadingSizeColorRatio: false,
        fieldId: uuid()
      } ) );
      return {
        ...state,
        selectedStyle: style,
        cutPlanNo,
        selectedStyleDetails: styleDetails,
        sizeGroups: sizeGroupsDDL,
        selectedProductParts: [],
        selectedSizeGroup: null,
        sizesInSizeGroup: [],
        purchaseOrderDetails: [...purchaseOrderDetails],
        purchaseOrderDetailsBySizeGroup: [],
        productParts: [],
        totalSizeRatio: 0,
        layPerCut: 0,
        width: '',
        length: ''
      };
    }

    case SIZE_GROUP_CHANGE: {
      const { sizeGroup, sizesInSizeGroup } = payload;

      const sizeGroupId = sizeGroup.id;
      const poDetailsByBySizeGroup = state.purchaseOrderDetails.filter( pod => pod.sizeGroupId === sizeGroupId );
      const sizes = sizesInSizeGroup.sizes.map( s => ( { ...s, ratio: 0 } ) );
      return {
        ...state,
        selectedSizeGroup: sizeGroup,
        sizesInSizeGroup: sizes,
        purchaseOrderDetailsBySizeGroup: poDetailsByBySizeGroup,
        totalSizeRatio: 0,
        layPerCut: 0,
        width: '',
        length: ''
      };
    }

    case SIZE_QUANTITY_CHANGE: {
      const { value, sizeIndex } = payload;
      const _sizesInSizeGroup = _.cloneDeep( state.sizesInSizeGroup );
      const targetSize = _sizesInSizeGroup[sizeIndex];
      targetSize.ratio = Number( value );
      _sizesInSizeGroup[sizeIndex] = targetSize;

      const totalRatioQuantity = _sizesInSizeGroup.reduce( ( acc, curr ) => {
        acc += curr['ratio'] ? curr['ratio'] : 0;
        return acc;
      }, 0 );

      const _podDetails = [...state.purchaseOrderDetailsBySizeGroup].map( pod => {
        if ( pod.colorDetails ) {
          pod.colorDetails.map( cd => {
            cd.isChecked = false;
            cd.extraPercentage = 0;
            cd.withExtraQuantity = cd.quantity;
            cd.layCount = 0;
            cd.totalQuantity = 0;
            cd.balance = cd.quantity - cd.preQuantity;
            return cd;
          } );
        }
        return pod;
      } );

      return {
        ...state,
        sizesInSizeGroup: [..._sizesInSizeGroup],
        totalSizeRatio: totalRatioQuantity,
        purchaseOrderDetailsBySizeGroup: _podDetails,
        totalLayCount: 0,
        totalQty: 0
      };
    }

    case PART_GROUPS_CHANGE: {
      const { partGroup, productParts, podetailIndex, colorDetailIdx, previousQuantity } = payload;
      const _podDetails = [...state.purchaseOrderDetailsBySizeGroup];
      const targetPODetail = _podDetails[podetailIndex];
      const targetColorDetail = targetPODetail.colorDetails[colorDetailIdx];

      if ( state.productParts.length === 0 ) {
        state.productParts = productParts;
        targetColorDetail.isChecked = true;
        targetColorDetail.partGroup = partGroup;
        targetColorDetail.preQuantity = previousQuantity;
        targetColorDetail.balance = targetColorDetail.withExtraQuantity - ( targetColorDetail.preQuantity + targetColorDetail.totalQuantity );
      } else {
        if ( state.productParts.length === productParts.length ) {
          const isPartAreSame = _.isEqual( state.productParts, productParts );
          if ( isPartAreSame ) {
            targetColorDetail.isChecked = true;
            targetColorDetail.partGroup = partGroup;
            targetColorDetail.preQuantity = previousQuantity;
            targetColorDetail.balance = targetColorDetail.withExtraQuantity - ( targetColorDetail.preQuantity + targetColorDetail.totalQuantity );
          } else {
            targetColorDetail.isChecked = false;
            targetColorDetail.partGroup = null;
            notify( 'warning', 'Product Parts does not match!!' );
          }
        } else {
          targetColorDetail.isChecked = false;
          targetColorDetail.partGroup = null;
          targetColorDetail.extraPercentage = 0;
          targetColorDetail.withExtraQuantity = targetColorDetail.quantity;
          targetColorDetail.layCount = 0;
          targetColorDetail.totalQuantity = 0;
          targetColorDetail.balance = targetColorDetail.quantity - targetColorDetail.preQuantity;
          notify( 'warning', 'Product Parts does not match!!' );
        }
      }

      const hasAllUnchecked = _podDetails
        .filter( po => po.colorDetails && po.colorDetails.length > 0 )
        .map( pod => pod.colorDetails )
        .flat()
        .every( cd => !cd.isChecked );

      return {
        ...state,
        selectedProductParts: productParts,
        purchaseOrderDetailsBySizeGroup: _podDetails,
        ...( hasAllUnchecked && { productParts: [] } )
      };
    }

    case PARTS_TYPE_CHANGE: {
      const { partsType } = payload;
      return {
        ...state,
        selectedPartsType: partsType
      };
    }

    case LAY_PER_CUT_CHANGE: {
      const { layPerCut } = payload;
      return {
        ...state,
        layPerCut
      };
    }

    case LENGTH_CHANGE: {
      const { length } = payload;
      return {
        ...state,
        length
      };
    }

    case WIDTH_CHANGE: {
      const { width } = payload;
      return {
        ...state,
        width
      };
    }

    case RUNNING_COLOR_CHECK_CHANGE: {
      const { checked } = payload;
      return {
        ...state,
        isRunningColor: checked
      };
    }

    case RUNNING_CUT_CHECK_CHANGE: {
      const { checked } = payload;
      return {
        ...state,
        isRunningCut: checked
      };
    }

    case LOADING_SIZE_COLOR_RATIO: {
      const { poDetailIndex, toggle } = payload;
      const _podDetails = [...state.purchaseOrderDetailsBySizeGroup];
      const selectedPOD = _podDetails[poDetailIndex];
      selectedPOD.isLoadingSizeColorRatio = toggle;
      _podDetails[poDetailIndex] = selectedPOD;
      return {
        ...state,
        purchaseOrderDetailsBySizeGroup: _podDetails
      };
    }

    case LOAD_SIZE_COLOR_DETAILS: {
      const { poDetailIndex, colorDetails } = payload;
      const _podDetails = [...state.purchaseOrderDetailsBySizeGroup];
      const selectedPOD = _podDetails[poDetailIndex];
      selectedPOD.isOpen = true;
      selectedPOD.colorDetails = colorDetails.map( cd => ( {
        ...cd,
        fieldId: uuid(),
        totalQuantity: 0,
        isChecked: false,
        getPartGroupDto: mapArrayToDropdown( cd.getPartGroupDto, 'name', 'id' ),
        partGroup: null,
        extraPercentage: 0,
        withExtraQuantity: cd.quantity,
        balance: cd.quantity - cd.preQuantity
      } ) );
      _podDetails[poDetailIndex] = selectedPOD;
      return {
        ...state,
        purchaseOrderDetailsBySizeGroup: _podDetails
      };
    }

    case TOGGLE_PO_DETAILS: {
      const { poDetailIndex } = payload;
      const _podDetails = [...state.purchaseOrderDetailsBySizeGroup];
      const selectedPOD = _podDetails[poDetailIndex];
      selectedPOD.isOpen = !selectedPOD.isOpen;
      _podDetails[poDetailIndex] = selectedPOD;
      return {
        ...state,
        purchaseOrderDetailsBySizeGroup: _podDetails
      };
    }

    case RESET_SELECTED_COLOR_DETAILS_ROW: {
      const { poDetailIndex, colorDetailIndex } = payload;

      const _podDetails = [...state.purchaseOrderDetailsBySizeGroup];

      _podDetails.map( ( pod, podIndex ) => {
        if ( podIndex === poDetailIndex ) {
          pod.colorDetails.map( ( cd, cdIndex ) => {
            if ( cdIndex === colorDetailIndex ) {
              cd.isChecked = false;
              cd.preQuantity = 0;
              cd.partGroup = null;
              cd.extraPercentage = 0;
              cd.withExtraQuantity = cd.quantity;
              cd.layCount = 0;
              cd.totalQuantity = 0;
              cd.balance = cd.quantity - cd.preQuantity;
            }
            return cd;
          } );
        }
        return pod;
      } );
      const hasAllUnchecked = _podDetails
        .filter( po => po.colorDetails && po.colorDetails.length > 0 )
        .map( pod => pod.colorDetails )
        .flat()
        .every( cd => !cd.isChecked );

      return {
        ...state,
        purchaseOrderDetailsBySizeGroup: _podDetails,
        ...( hasAllUnchecked && { productParts: [] } )
      };
    }

    case EXTRA_PERCENTAGE_CHANGE: {
      const { value, poDetailIndex, colorDetailIndex } = payload;
      const _podDetails = _.cloneDeep( state.purchaseOrderDetailsBySizeGroup );

      const targetPODetail = _podDetails[poDetailIndex];
      const targetColorDetail = targetPODetail.colorDetails[colorDetailIndex];
      //#region properties mutation
      const _extraPercentage = Number( value );
      targetColorDetail.extraPercentage = _extraPercentage;
      targetColorDetail.withExtraQuantity = Number(
        Math.ceil( targetColorDetail.quantity + ( targetColorDetail.quantity * targetColorDetail.extraPercentage ) / 100 )
      );
      targetColorDetail.balance = targetColorDetail.withExtraQuantity - ( targetColorDetail.preQuantity + targetColorDetail.totalQuantity );
      if ( targetColorDetail.balance < targetColorDetail.totalQuantity ) {
        targetColorDetail.totalQuantity = 0;
        targetColorDetail.layCount = 0;
      }
      targetColorDetail.balance = targetColorDetail.withExtraQuantity - ( targetColorDetail.preQuantity + targetColorDetail.totalQuantity );
      //test
      const chedkedItems = targetPODetail?.colorDetails?.filter( item => item.isChecked );
      let totalLayCount = 0;
      let totalQuantity = 0;
      for ( let i = 0; i < chedkedItems.length; i++ ) {
        const item = chedkedItems[i];
        totalLayCount += item.layCount;
        totalQuantity += item.totalQuantity;
      }
      //#endregion
      targetPODetail.colorDetails[colorDetailIndex] = targetColorDetail;
      _podDetails[poDetailIndex] = targetPODetail;
      return {
        ...state,
        totalQty: totalQuantity,
        totalLayCount,
        purchaseOrderDetailsBySizeGroup: _podDetails
      };
    }

    case CUT_QUANTITY_CHANGE: {
      const { value, poDetailIndex, colorDetailIndex } = payload;

      const _podDetails = _.cloneDeep( state.purchaseOrderDetailsBySizeGroup );
      const targetPODetail = _podDetails[poDetailIndex];
      const targetColorDetail = targetPODetail.colorDetails[colorDetailIndex];

      //#region properties mutation for color details

      // set cut quantity
      let cutQuantity = value ? Number( value ) : 0;
      const comparativeQuantity = targetColorDetail.extraPercentage === 0 ? targetColorDetail.quantity : targetColorDetail.withExtraQuantity;
      if ( cutQuantity > comparativeQuantity - targetColorDetail.preQuantity ) {
        notify( 'warning', 'Quantity exceeded!!!' );
        cutQuantity = 0;
      }
      targetColorDetail.totalQuantity = cutQuantity;

      // set cut layCount
      const layCount = Number.isInteger( cutQuantity / state.totalSizeRatio ) ? cutQuantity / state.totalSizeRatio : 0;
      targetColorDetail.layCount = layCount;

      // set balance
      const balanceQuantity = comparativeQuantity - ( targetColorDetail.preQuantity + targetColorDetail.totalQuantity );
      targetColorDetail.balance = balanceQuantity;

      //#endregion

      targetPODetail.colorDetails[colorDetailIndex] = targetColorDetail;
      _podDetails[poDetailIndex] = targetPODetail;

      //#region total cut quantity and total lay
      const checkedItems = _podDetails
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
      //#endregion

      return {
        ...state,
        purchaseOrderDetailsBySizeGroup: _podDetails,
        totalQty: totalQuantity,
        totalLayCount
      };
    }

    default:
      return state;
  }
};

/** Change Log
 * 08-Jan-2022(Iqbal):Add TOGGLE_CUT_PLAN_SIDEBAR, FETCH_CUT_PLAN_BY_QUERY, ADD_CUT_PLAN, DELETE_CUT_PLAN, FETCH_CUT_PLAN_BY_ID, UPDATE_CUT_PLAN, DELETE_CUT_PLAN_BY_RANGE
 */
