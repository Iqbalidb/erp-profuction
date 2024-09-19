/*
     Title: Reducers for PANEL_CHECK
     Description: Reducers for PANEL_CHECK
     Author: Iqbal Hossain
     Date: 22-January-2022
     Modified: 22-January-2022
*/

import {
  FETCH_BUNDLE_BY_STATUS,
  FETCH_CHECKED,
  FETCH_UNCHECKED,
  LOADING,
  SET_CHECKED_BUNDLE,
  SET_UNCHECKED_BUNDLE,
  SET_UNCHECKED_REJECT_BUNDLE,
  SHOW_BACK_DROP,
  TOGGLE_CHECKED_BUNDLE_DAMAGE_STATUS,
  TOGGLE_REJECT_MODAL,
  TOGGLE_UNCHECKED_BUNDLE_DAMAGE_STATUS,
  TOGGLE_UNCHECKED_MODAL,
  TOGGLE_UNCHECKED_REJECT_MODAL
} from './actionType';

const initialState = {
  items: [],
  uncheckedItems: [],
  checkedItems: [],
  queryData: [],
  total: 0,
  params: {},
  selectedItem: null,
  loading: false,
  selectedCheckedBundle: null,
  selectedUnCheckedBundle: null,
  selectedUnCheckedRejectBundle: null,
  isRejectModalOpen: false,
  isUnCheckedRejectModalOpen: false,
  isUnCheckedModalOpen: false,
  showBackdrop: false
};

export const panelCheckReducer = ( state = initialState, action ) => {
  const { type, payload } = action;
  switch ( type ) {
    case LOADING: {
      return {
        ...state,
        loading: payload
      };
    }
    case SHOW_BACK_DROP: {
      return {
        ...state,
        showBackdrop: payload
      };
    }
    case FETCH_BUNDLE_BY_STATUS:
      return {
        ...state,
        items: payload.items,
        total: payload.totalRecords
      };

    case FETCH_UNCHECKED: {
      const { uncheckedItems, totalRecords } = payload;
      const uncheckedItemsWithAdditionalProp = uncheckedItems.map( un => ( {
        ...un,
        isOpen: false
      } ) );
      return {
        ...state,
        uncheckedItems: uncheckedItemsWithAdditionalProp,
        total: totalRecords,
        params: action.params
      };
    }

    case FETCH_CHECKED: {
      const { checkedItems, totalRecords } = payload;
      const checkedItemsWithAditionalProp = checkedItems.map( ci => ( {
        ...ci,
        isOpen: false
      } ) );
      return {
        ...state,
        checkedItems: checkedItemsWithAditionalProp,
        total: totalRecords,
        params: action.params
      };
    }
    case SET_CHECKED_BUNDLE: {
      const { bundle } = payload;
      return {
        ...state,
        selectedCheckedBundle: bundle
      };
    }
    case SET_UNCHECKED_BUNDLE: {
      const { selectedRowId } = payload;
      return {
        ...state,
        selectedUnCheckedBundle: selectedRowId
      };
    }

    case SET_UNCHECKED_REJECT_BUNDLE: {
      const { bundles } = payload;
      return {
        ...state,
        selectedUnCheckedRejectBundle: bundles
      };
    }

    case TOGGLE_REJECT_MODAL: {
      return {
        ...state,
        isRejectModalOpen: !state.isRejectModalOpen
      };
    }

    case TOGGLE_UNCHECKED_MODAL: {
      return {
        ...state,
        isUnCheckedModalOpen: !state.isUnCheckedModalOpen
      };
    }
    case TOGGLE_UNCHECKED_REJECT_MODAL: {
      return {
        ...state,
        isUnCheckedRejectModalOpen: !state.isUnCheckedRejectModalOpen
      };
    }
    case TOGGLE_UNCHECKED_BUNDLE_DAMAGE_STATUS: {
      return {
        ...state
      };
    }
    case TOGGLE_CHECKED_BUNDLE_DAMAGE_STATUS: {
      return {
        ...state
      };
    }
    default:
      return state;
  }
};

/** Change Log
 * 22-Jan-2022(Iqbal):Add TOGGLE_PANEL_CHECK_SIDEBAR, FETCH_PANEL_CHECK_BY_QUERY, ADD_PANEL_CHECK, DELETE_PANEL_CHECK, FETCH_PANEL_CHECK_BY_ID, UPDATE_PANEL_CHECK, DELETE_PANEL_CHECK_BY_RANGE
 */
