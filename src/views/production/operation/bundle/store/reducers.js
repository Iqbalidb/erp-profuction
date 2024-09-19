/*
     Title: Reducers for BUNDLE
     Description: Reducers for BUNDLE
     Author: Alamgir Kabir
     Date: 19-July-2022
     Modified: 19-July-2022
*/

import { mapArrayToDropdown } from 'utility/commonHelper';
import { notify } from 'utility/custom/notifications';
import { v4 as uuid } from 'uuid';
import {
  ALL_CHECKED,
  ASSIGN_TO_SELECTED_ROW,
  ASSIGN_TO_STYLE_INFO,
  COLOR_CHANGE,
  CUTTING_CHANGE,
  CUT_PLAN_CHANGE,
  DATE_CHANGE,
  FETCH_BUNDLE,
  FETCH_BUNDLE_BY_ID,
  FETCH_BUNDLE_BY_QUERY,
  FETCH_BUNDLE_BY_RANGE,
  FETCH_CHECKED_BUNDLE_FOR_ASSIGN_SEWING,
  FETCH_PARTIAL_BUNDLE_FOR_ASSIGNED,
  FETCH_PARTIAL_BUNDLE_FOR_PASS,
  FETCH_PRODUCTION_SUB_PROCESS_BY_CURRENT_PROCESS_AND_STYLE,
  FETCH_PRODUCTION_SUB_PROCESS_BY_STATUS,
  LOADING,
  LOAD_COLORS,
  LOAD_CUTTINGS,
  LOAD_CUT_PLANS,
  LOAD_PRODUCT_PART,
  LOAD_SIZE,
  LOAD_STYLES,
  ON_PRODUCTION_SUB_PROCESS_CHANGE,
  ON_PRODUCTION_SUB_PROCESS_MODAL_DROP_DOWN_ITEM_CHANGE,
  PRODUCT_PART_CHANGE,
  RESET_BUNDLE_FORM_STATE,
  RESET_BUNDLE_STATE,
  SIZE_CHANGE,
  STYLE_CHANGE,
  TOGGLE_CHECKED_BUNDLE_FOR_ASSIGN_EXTERNAL,
  TOGGLE_CHECKED_BUNDLE_FOR_ASSIGN_SEWING,
  TOGGLE_CHECKED_BUNDLE_FOR_ASSIGN_TO,
  TOGGLE_COLOR_DETAILS_CHECK,
  TOGGLE_IS_BUNDLE_ASSIGN_TO_EXTERNAL_MODAL_OPEN,
  TOGGLE_PO_DETAILS
} from './actionType';

const initialState = {
  loading: false,
  items: [],
  checkBundleItemsForAssignExternal: [],
  checkBundleItemsForAssignSewing: [],
  queryData: [],
  total: 0,
  params: {},
  selectedItem: null,
  productionSubProcessDropdownItems: [],
  selectedProductionProcess: null,
  bundlePartialItemsForPass: [],
  bundlePartialItemsForAssigned: [],
  isBundleAssignToExternalModalOpen: false,
  selectedProductionSubProcessDropDownItems: [],
  selectedProductionSubProcess: null,
  styleInfo: null,
  selectedRows: []
};

export const bundleReducer = ( state = initialState, action ) => {
  const { type, payload } = action;
  switch ( type ) {
    case LOADING: {
      return {
        ...state,
        loading: payload
      };
    }
    case FETCH_BUNDLE:
      return { ...state, items: payload };
    case FETCH_BUNDLE_BY_ID:
      return { ...state, selectedItem: payload.selectedItem };
    case FETCH_BUNDLE_BY_QUERY:
      return {
        ...state,
        items: payload.items,
        total: payload.totalRecords,
        params: action.params
      };
    case FETCH_BUNDLE_BY_RANGE:
      return { ...state, items: payload };

    case TOGGLE_CHECKED_BUNDLE_FOR_ASSIGN_TO: {
      const { checkBundleItemsForAssignExternal, totalRecords } = payload;
      return {
        ...state,
        checkBundleItemsForAssignExternal,
        total: totalRecords,
        params: action.params
      };
    }
    case FETCH_PRODUCTION_SUB_PROCESS_BY_STATUS: {
      const { productionSubProcessDropdownItems } = payload;
      return {
        ...state,
        productionSubProcessDropdownItems
      };
    }

    case FETCH_PARTIAL_BUNDLE_FOR_PASS: {
      const { bundlePartialItemsForPass, totalRecords } = payload;
      return {
        ...state,
        bundlePartialItemsForPass,
        total: totalRecords,
        params: action.params
      };
    }
    case FETCH_PARTIAL_BUNDLE_FOR_ASSIGNED: {
      const { bundlePartialItemsForAssigned, totalRecords } = payload;
      return {
        ...state,
        bundlePartialItemsForAssigned,
        total: totalRecords,
        params: action.params
      };
    }

    case FETCH_CHECKED_BUNDLE_FOR_ASSIGN_SEWING: {
      const { checkBundleItemsForAssignSewing, totalRecords } = payload;
      return {
        ...state,
        checkBundleItemsForAssignSewing,
        totalRecords
      };
    }

    case TOGGLE_CHECKED_BUNDLE_FOR_ASSIGN_EXTERNAL: {
      const { index, direction } = payload;
      const _checkBundleItemsForAssignExternal = [...state.bundlePartialItemsForPass];
      _checkBundleItemsForAssignExternal[index]['isOpen'] = !direction;
      return {
        ...state,
        checkBundleItemsForAssignExternal: _checkBundleItemsForAssignExternal
      };
    }

    case FETCH_PRODUCTION_SUB_PROCESS_BY_CURRENT_PROCESS_AND_STYLE: {
      const { selectedProductionSubProcessDropDownItems } = payload;
      const uniQueProductionSubProcessDropDownItems = Array.from(
        new Map( selectedProductionSubProcessDropDownItems.map( item => [item['id'], item] ) ).values()
      );
      const selectedProductionSubProcessDdl = mapArrayToDropdown( uniQueProductionSubProcessDropDownItems, 'name', 'id' );
      return {
        ...state,
        selectedProductionSubProcessDropDownItems: selectedProductionSubProcessDdl
      };
    }
    case ON_PRODUCTION_SUB_PROCESS_CHANGE: {
      const { productionSubProcess } = payload;
      return {
        ...state,
        selectedProductionProcess: productionSubProcess
      };
    }

    case ON_PRODUCTION_SUB_PROCESS_MODAL_DROP_DOWN_ITEM_CHANGE: {
      const { productionSubProcess } = payload;
      return {
        ...state,
        selectedProductionSubProcess: productionSubProcess
      };
    }
    case TOGGLE_CHECKED_BUNDLE_FOR_ASSIGN_SEWING: {
      const { index, direction } = payload;
      const _checkBundleItemsForAssignSewing = [...state.checkBundleItemsForAssignSewing];
      _checkBundleItemsForAssignSewing[index]['isOpen'] = !direction;
      return {
        ...state,
        checkBundleItemsForAssignSewing: _checkBundleItemsForAssignSewing
      };
    }

    case TOGGLE_IS_BUNDLE_ASSIGN_TO_EXTERNAL_MODAL_OPEN: {
      return {
        ...state,
        isBundleAssignToExternalModalOpen: !state.isBundleAssignToExternalModalOpen
      };
    }

    case ASSIGN_TO_STYLE_INFO: {
      const { boll, row } = payload;
      let _styleInfo = {};
      if ( boll ) {
        _styleInfo = row;
      }
      return {
        ...state,
        styleInfo: _styleInfo
      };
    }

    case ASSIGN_TO_SELECTED_ROW: {
      const { rowsId } = payload;
      return {
        ...state,
        selectedRows: rowsId
      };
    }
    case RESET_BUNDLE_STATE:
      return {
        ...state,
        bundlePartialItemsForPass: [],
        checkBundleItemsForAssignExternal: [],
        selectedProductionSubProcessDropDownItems: [],
        selectedProductionSubProcess: null,
        selectedProductionProcess: null
      };
    default:
      return state;
  }
};

export const initialFormState = {
  date: new Date(),
  startDate: '',
  styles: [],
  selectedStyle: null,
  cutPlans: [],
  selectedCutPlan: null,
  cuttings: [],
  selectedCutting: null,
  colors: [],
  selectedColor: null,
  sizes: [],
  selectedSize: null,
  productParts: [],
  selectedProductPart: null,
  poDetails: [],
  selectedPoDetails: [],
  isAllChecked: false
};

export const bundleFormReducer = ( state = initialFormState, action ) => {
  const { type, payload } = action;
  switch ( type ) {
    case LOAD_STYLES: {
      const { stylesDdl } = payload;
      return {
        ...state,
        styles: stylesDdl
      };
    }
    case LOAD_CUT_PLANS: {
      const { cutPlanDdl } = payload;
      return {
        ...state,
        cutPlans: cutPlanDdl
      };
    }
    case LOAD_CUTTINGS: {
      const { cuttingDdl } = payload;
      return {
        ...state,
        cuttings: cuttingDdl
      };
    }
    case LOAD_COLORS: {
      const { colorDdl } = payload;
      return {
        ...state,
        colors: colorDdl
      };
    }
    case LOAD_SIZE: {
      const { sizeDdl } = payload;
      return {
        ...state,
        sizes: sizeDdl
      };
    }
    case LOAD_PRODUCT_PART: {
      const { productPartDdl } = payload;
      return {
        ...state,
        productParts: productPartDdl
      };
    }
    case DATE_CHANGE: {
      const { startDate } = payload;
      return {
        ...state,
        date: startDate
      };
    }
    case STYLE_CHANGE: {
      const { style } = payload;

      return {
        ...state,
        selectedStyle: style,
        cutPlans: [],
        selectedCutPlan: null,
        cuttings: [],
        selectedCutting: null,
        colors: [],
        selectedColor: null,
        sizes: [],
        selectedSize: null,
        productParts: [],
        selectedProductPart: null,
        poDetails: [],
        isAllChecked: false
      };
    }

    case CUT_PLAN_CHANGE: {
      const { cutPlan } = payload;
      return {
        ...state,
        selectedCutPlan: cutPlan,
        cuttings: [],
        selectedCutting: null,
        colors: [],
        selectedColor: null,
        sizes: [],
        selectedSize: null,
        productParts: [],
        selectedProductPart: null,
        poDetails: [],
        isAllChecked: false
      };
    }

    case CUTTING_CHANGE: {
      const { cutting } = payload;
      return {
        ...state,
        selectedCutting: cutting,
        colors: [],
        selectedColor: null,
        sizes: [],
        selectedSize: null,
        productParts: [],
        selectedProductPart: null,
        poDetails: [],
        isAllChecked: false
      };
    }

    case COLOR_CHANGE: {
      const { color } = payload;
      return {
        ...state,
        selectedColor: color,
        sizes: [],
        selectedSize: null,
        productParts: [],
        selectedProductPart: null,
        poDetails: [],
        isAllChecked: false
      };
    }

    case SIZE_CHANGE: {
      const { size } = payload;
      return { ...state, selectedSize: size, productParts: [], selectedProductPart: null, poDetails: [], isAllChecked: false };
    }

    case PRODUCT_PART_CHANGE: {
      const { productPart, poDetails } = payload;
      return {
        ...state,
        isAllChecked: false,
        selectedProductPart: productPart,
        poDetails: poDetails?.map( pod => ( {
          ...pod,
          currentTotal: 0,
          rowId: uuid(),
          isAllChecked: false,
          bundles: pod?.bundles.map( bundle => ( { ...bundle, rowId: uuid(), isChecked: false } ) )
        } ) )
      };
    }

    case TOGGLE_PO_DETAILS: {
      const { poDetailIndex } = payload;
      const _podDetails = [...state.poDetails];
      const selectedPOD = _podDetails[poDetailIndex];
      selectedPOD.isOpen = !selectedPOD.isOpen;
      _podDetails[poDetailIndex] = selectedPOD;
      return {
        ...state,
        poDetails: _podDetails
      };
    }

    case TOGGLE_COLOR_DETAILS_CHECK: {
      const { checked, poDetailIndex, bundleIndex, currentQuantity } = payload;
      const _podDetails = [...state.poDetails];
      const selectedPOD = _podDetails[poDetailIndex];

      const podBalance = selectedPOD.balanceQuantity;
      const targetBundles = selectedPOD.bundles[bundleIndex];

      if ( checked ) {
        const previousSum = selectedPOD.bundles.filter( bundle => bundle.isChecked ).reduce( ( acc, curr ) => ( acc += curr.quantity ), 0 );
        const currentTotal = previousSum + currentQuantity;
        if ( currentTotal <= podBalance ) {
          targetBundles.isChecked = checked;
          selectedPOD.currentTotal = currentTotal;
        } else {
          notify( 'warning', 'limit exceeds !!!' );
        }
      } else {
        const previousSum = selectedPOD.bundles.filter( bundle => bundle.isChecked ).reduce( ( acc, curr ) => ( acc += curr.quantity ), 0 );
        const currentTotal = previousSum - currentQuantity;
        selectedPOD.currentTotal = currentTotal;
        targetBundles.isChecked = false;
      }

      //For All Check start
      const arrayLength = _podDetails[poDetailIndex]?.bundles?.length;
      const chkArrayLength = selectedPOD.bundles.filter( bundle => bundle.isChecked ).length;
      //For All Check end
      if ( chkArrayLength === arrayLength ) {
        selectedPOD.isAllChecked = true;
      } else {
        selectedPOD.isAllChecked = false;
      }

      return {
        ...state,
        poDetails: _podDetails
      };
    }
    case ALL_CHECKED: {
      const { checked, pod, poDetailIndex } = payload;
      const _podDetails = [...state.poDetails];

      const selectedPOD = _podDetails[poDetailIndex];
      const podBalance = selectedPOD.balanceQuantity;
      const modifiedBundle = selectedPOD.bundles.map( b => ( { ...b, isChecked: checked } ) );
      let currentTotal = 0;

      const prevSum = modifiedBundle.filter( f => f.isChecked ).reduce( ( acc, curr ) => ( acc += curr.quantity ), 0 );

      if ( prevSum <= podBalance ) {
        currentTotal = prevSum;
      } else {
        notify( 'warning', 'limit exceeds !!!' );
      }

      const isSameIndex = _podDetails.findIndex( object => {
        return object.poNo === pod.poNo;
      } );

      if ( isSameIndex !== -1 && currentTotal !== podBalance ) {
        _podDetails[isSameIndex].bundles = modifiedBundle;
        _podDetails[isSameIndex].currentTotal = currentTotal;
        _podDetails[isSameIndex].isAllChecked = checked;
        // _allCheck = checked;
      } else if ( isSameIndex !== -1 ) {
        _podDetails[isSameIndex].isAllChecked = !checked;
      }

      return {
        ...state,

        poDetails: _podDetails
      };
    }
    case RESET_BUNDLE_FORM_STATE: {
      const { state } = payload;

      return { state };
    }
    default: {
      return state;
    }
  }
};
