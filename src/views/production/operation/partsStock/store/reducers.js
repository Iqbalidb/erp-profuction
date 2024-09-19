/* eslint-disable no-mixed-operators */
/*
   Title: Reducers for Parts Stock
   Description: Reducers for Parts Stock
   Author: Nasir Ahmed
   Date: 06-July-2022
   Modified: 06-July-2022
*/

import { mapArrayToDropdown } from 'utility/commonHelper';
import { notify } from 'utility/custom/notifications';
import { v4 as uuid } from 'uuid';
import { LOADING, RESET_SELECTED_ITEM } from '../../cutPlan/store/actionType';
import {
  ADD_PARTS_STOCK,
  CUT_QUANTITY_CHANGE,
  DATE_CHANGE,
  DELETE_PARTS_STOCK,
  DELETE_PARTS_STOCK_BY_RANGE,
  EXTRA_PERCENTAGE_CHANGE,
  FETCH_PARTS_STOCK,
  FETCH_PARTS_STOCK_BY_ID,
  FETCH_PARTS_STOCK_BY_QUERY,
  LOADING_SIZE_COLOR_RATIO,
  LOAD_SIZE_COLOR_DETAILS,
  LOAD_STYLES,
  ON_COLOR_DETAIL_SIZE_CHANGE,
  ON_DUPLICATE_ROW,
  ON_FOCUS_COLOR_DETAILS_PRODUCT_PART,
  ON_PRODUCT_PART_CHANGE,
  ON_REMOVE_ROW,
  RESET_SELECTED_COLOR_DETAILS_ROW,
  SIZE_GROUP_CHANGE,
  STYLE_CHANGE,
  TOGGLE_COLOR_DETAILS_CHECK,
  TOGGLE_PO_DETAILS,
  UPDATE_PARTS_STOCK
} from './actionTypes';

const initialState = {
  loading: false,
  items: [],
  queryData: [],
  total: 1,
  params: {},
  selectedItem: null,
  isOpenConfirmModal: false
};

export const initialFormState = {
  date: new Date(),
  styles: [],
  selectedStyle: null,
  selectedStyleDetails: null,
  productParts: [],
  purchaseOrderDetails: [],
  purchaseOrderDetailsBySizeGroup: [],
  sizeGroups: [],
  selectedSizeGroup: null,
  sizesInSizeGroup: [],
  startDate: '',
  style: '',
  styleCategory: '',
  BuyerName: ''
};

export const partsStockReducer = ( state = initialState, action ) => {
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

    case FETCH_PARTS_STOCK: {
      return { ...state, items: payload };
    }
    case FETCH_PARTS_STOCK_BY_ID: {
      return {
        ...state
      };
    }
    case FETCH_PARTS_STOCK_BY_QUERY: {
      return {
        ...state,
        items: payload.items,
        total: payload.totalRecords,
        params: action.params
      };
    }
    case ADD_PARTS_STOCK: {
      return { ...state, total: state.total + 1 };
    }
    case UPDATE_PARTS_STOCK: {
      return { ...state, total: state.total + 1 };
    }
    case DELETE_PARTS_STOCK: {
      return { ...state, items: payload };
    }
    case DELETE_PARTS_STOCK_BY_RANGE: {
      return { ...state, items: payload };
    }
    default:
      return state;
  }
};

export const productStockFormReducer = ( state = initialFormState, action ) => {
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
      const { style, styleDetails, poDetails } = payload;

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
        selectedStyleDetails: styleDetails,
        sizeGroups: sizeGroupsDDL,
        // productParts: productPartsDDL,
        selectedProductParts: [],
        selectedSizeGroup: null,
        sizesInSizeGroup: [],
        purchaseOrderDetails: [...purchaseOrderDetails],
        purchaseOrderDetailsBySizeGroup: [],
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

      const sizes = mapArrayToDropdown( sizesInSizeGroup.sizes, 'size', 'sizeId' );
      if ( !poDetailsByBySizeGroup.length ) {
        notify( 'warning', 'No Po found!!!' );
      }
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
        inQuantity: 0,
        isChecked: false,
        sizes: state.sizesInSizeGroup,
        selectedSize: null,
        productParts: state.productParts,
        selectedProductPart: null,
        partGroup: null,
        extraPercentage: 0,
        preQuantity: 0,
        withExtraQuantity: cd.quantity,
        balance: cd.quantity - cd.preQuantity
      } ) );
      _podDetails[poDetailIndex] = selectedPOD;
      return {
        ...state,
        purchaseOrderDetailsBySizeGroup: _podDetails
      };
    }

    case TOGGLE_COLOR_DETAILS_CHECK: {
      const { checked, poDetailIndex, colorDetailIndex } = payload;
      const _podDetails = [...state.purchaseOrderDetailsBySizeGroup];
      const selectedPOD = _podDetails[poDetailIndex];
      selectedPOD['colorDetails'][colorDetailIndex]['isChecked'] = checked;
      return {
        ...state,
        purchaseOrderDetailsBySizeGroup: _podDetails
      };
    }

    case ON_DUPLICATE_ROW: {
      const { poDetailIndex, colorDetailIndex, colorDetail } = payload;
      const _podDetails = [...state.purchaseOrderDetailsBySizeGroup];
      const selectedPOD = _podDetails[poDetailIndex];
      selectedPOD['colorDetails'].splice( colorDetailIndex + 1, 0, { ...colorDetail, fieldId: uuid(), isCloned: true } );
      return {
        ...state,
        purchaseOrderDetailsBySizeGroup: _podDetails
      };
    }
    case ON_REMOVE_ROW: {
      const { poDetailIndex, colorDetailIndex } = payload;
      const _podDetails = [...state.purchaseOrderDetailsBySizeGroup];
      const selectedPOD = _podDetails[poDetailIndex];
      selectedPOD['colorDetails'].splice( colorDetailIndex, 1 );

      return {
        ...state,
        purchaseOrderDetailsBySizeGroup: _podDetails
      };
    }

    case ON_COLOR_DETAIL_SIZE_CHANGE: {
      const { item, poDetailIndex, colorDetailIndex } = payload;
      const _podDetails = [...state.purchaseOrderDetailsBySizeGroup];
      const selectedPOD = _podDetails[poDetailIndex];
      selectedPOD['colorDetails'][colorDetailIndex]['selectedSize'] = item;
      return {
        ...state,
        purchaseOrderDetailsBySizeGroup: _podDetails
      };
    }

    case ON_PRODUCT_PART_CHANGE: {
      const { item, poDetailIndex, colorDetailIndex } = payload;
      const _podDetails = [...state.purchaseOrderDetailsBySizeGroup];
      const selectedPOD = _podDetails[poDetailIndex];
      const selectedColorDetail = selectedPOD['colorDetails'][colorDetailIndex];
      selectedColorDetail['selectedProductPart'] = item;
      // selectedColorDetail['preQuantity'] = prevQuantity;
      return {
        ...state,
        purchaseOrderDetailsBySizeGroup: _podDetails
      };
    }
    case ON_FOCUS_COLOR_DETAILS_PRODUCT_PART: {
      const { poDetailIndex, colorDetailIndex, productParts } = payload;
      const productPartsDDL = mapArrayToDropdown( productParts, 'productPartsName', 'productPartsId' );
      const _podDetails = [...state.purchaseOrderDetailsBySizeGroup];
      const selectedPOD = _podDetails[poDetailIndex];
      const selectedColorDetail = selectedPOD['colorDetails'][colorDetailIndex];
      selectedColorDetail['productParts'] = productPartsDDL;
      // selectedColorDetail['selectedProductPart'] = productPartsDDL;
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
      const _podDetails = [...state.purchaseOrderDetailsBySizeGroup];
      const selectedPOD = _podDetails[poDetailIndex];
      const selectedColorDetail = selectedPOD['colorDetails'][colorDetailIndex];

      const _extraPercentage = Number( value );

      selectedColorDetail['extraPercentage'] = _extraPercentage;
      selectedColorDetail['withExtraQuantity'] = Math.ceil(
        selectedColorDetail['quantity'] + ( selectedColorDetail['quantity'] * selectedColorDetail['extraPercentage'] ) / 100
      );

      selectedColorDetail['balance'] =
        selectedColorDetail['withExtraQuantity'] - ( selectedColorDetail['preQuantity'] + selectedColorDetail['totalQuantity'] );

      return {
        ...state,
        purchaseOrderDetailsBySizeGroup: _podDetails
      };
    }

    case CUT_QUANTITY_CHANGE: {
      const { value, poDetailIndex, colorDetailIndex } = payload;
      const _podDetails = [...state.purchaseOrderDetailsBySizeGroup];
      const selectedPOD = _podDetails[poDetailIndex];
      const selectedColorDetail = selectedPOD['colorDetails'][colorDetailIndex];
      //#region properties mutation for color details

      // set cut quantity
      let cutQuantity = value ? Number( value ) : 0;
      const comparativeQuantity =
        selectedColorDetail['extraPercentage'] === 0 ? selectedColorDetail['quantity'] : selectedColorDetail['withExtraQuantity'];
      if ( cutQuantity > comparativeQuantity - selectedColorDetail['preQuantity'] ) {
        notify( 'warning', 'Quantity exceeded!!!' );
        cutQuantity = 0;
      }
      selectedColorDetail['inQuantity'] = cutQuantity;

      // // set balance
      const balanceQuantity = comparativeQuantity - ( selectedColorDetail['preQuantity'] + selectedColorDetail['inQuantity'] );
      selectedColorDetail['balance'] = balanceQuantity;

      //#endregion

      return {
        ...state,
        purchaseOrderDetailsBySizeGroup: _podDetails
        // totalQty: totalQuantity
      };
    }

    default:
      return state;
  }
};
