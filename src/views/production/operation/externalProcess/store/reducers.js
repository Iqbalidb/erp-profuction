/*
     Title: Reducers for EXTERNAL_PROCESS
     Description: Reducers for EXTERNAL_PROCESS
     Author: Iqbal Hossain
     Date: 24-January-2022
     Modified: 24-January-2022
*/

import {
  FETCH_EXTERNAL_PROCESS,
  FETCH_EXTERNAL_PROCESS_BY_ID,
  FETCH_EXTERNAL_PROCESS_BY_QUERY,
  FETCH_EXTERNAL_PROCESS_BY_RANGE,
  FETCH_PARTIAL_BUNDLE_INFO_FOR_PASSED,
  FETCH_PARTIAL_BUNDLE_INFO_FOR_PENDING,
  FETCH_PARTIAL_BUNDLE_INFO_FOR_RECEIVED,
  FETCH_PARTIAL_BUNDLE_INFO_FOR_SEND,
  FETCH_PRODUCTION_SUB_PROCESS_BY_STATUS_FOR_DDL,
  LOADING,
  ON_PRODUCTION_PROCESS_CHANGE,
  RESET_EXTERNAL_PROCESS_STATE,
  TOGGLE_EXTERNAL_PROCESS_DETAILS_FOR_PENDING,
  TOGGLE_EXTERNAL_PROCESS_DETAILS_FOR_RECEIVED,
  TOGGLE_EXTERNAL_PROCESS_DETAILS_FOR_SEND,
  TOGGLE_EXTERNAL_PROCESS_PASSED_MODAL,
  TOGGLE_EXTERNAL_PROCESS_PENDING_MODAL,
  TOGGLE_EXTERNAL_PROCESS_SEND_MODAL
} from './actionType';

const initialState = {
  loading: false,
  items: [],
  queryData: [],
  total: 1,
  params: {},
  selectedItem: null,
  partialBundleInfoForPending: [],
  partialBundleInfoForSend: [],
  partialBundleInfoForReceived: [],
  partialBundleInfoPassed: [],
  productionSubProcessDropdownItems: [],
  selectedProductionSubProcess: null,
  isOpenExternalProcessPendingModal: false,
  isOpenExternalProcessPassedModal: false,
  isOpenExternalProcessSendModal: false
};

export const externalProcessReducer = ( state = initialState, action ) => {
  const { type, payload } = action;
  switch ( type ) {
    case LOADING: {
      return {
        ...state,
        loading: payload
      };
    }
    case FETCH_EXTERNAL_PROCESS:
      return { ...state, items: payload };
    case FETCH_EXTERNAL_PROCESS_BY_ID:
      return { ...state, selectedItem: payload.selectedItem };
    case FETCH_EXTERNAL_PROCESS_BY_QUERY:
      return {
        ...state,
        items: payload.items,
        total: payload.totalRecords,
        params: payload.params
      };

    case FETCH_PRODUCTION_SUB_PROCESS_BY_STATUS_FOR_DDL: {
      const { productionSubProcessDropdownItems } = payload;
      return {
        ...state,
        productionSubProcessDropdownItems
      };
    }

    case ON_PRODUCTION_PROCESS_CHANGE: {
      const { productionSubProcess } = payload;

      return {
        ...state,
        selectedProductionSubProcess: productionSubProcess
      };
    }

    case FETCH_PARTIAL_BUNDLE_INFO_FOR_PENDING: {
      const { partialBundleInfoForPending, totalRecords } = payload;
      return {
        ...state,
        partialBundleInfoForPending,
        total: totalRecords,
        params: action.params
      };
    }
    case FETCH_PARTIAL_BUNDLE_INFO_FOR_SEND: {
      const { partialBundleInfoForSend, totalRecords } = payload;
      return {
        ...state,
        partialBundleInfoForSend,
        total: totalRecords,
        params: action.params
      };
    }
    case FETCH_PARTIAL_BUNDLE_INFO_FOR_RECEIVED: {
      const { partialBundleInfoForReceived, totalRecords } = payload;
      return {
        ...state,
        partialBundleInfoForReceived,
        total: totalRecords,
        params: action.params
      };
    }
    case FETCH_PARTIAL_BUNDLE_INFO_FOR_PASSED: {
      const { partialBundleInfoPassed, totalRecords } = payload;
      return {
        ...state,
        partialBundleInfoPassed,
        total: totalRecords,
        params: action.params
      };
    }

    case TOGGLE_EXTERNAL_PROCESS_DETAILS_FOR_PENDING: {
      const { idx } = payload;
      const _partialBundleInfoForPending = [...state.partialBundleInfoForPending];
      const selectedPOD = _partialBundleInfoForPending[idx];
      selectedPOD.isOpen = !selectedPOD.isOpen;
      _partialBundleInfoForPending[idx] = selectedPOD;
      return {
        ...state,
        partialBundleInfoForPending: _partialBundleInfoForPending
      };
    }
    case TOGGLE_EXTERNAL_PROCESS_DETAILS_FOR_SEND: {
      const { idx } = payload;
      const _partialBundleInfoForSend = [...state.partialBundleInfoForSend];
      const selectedPOD = _partialBundleInfoForSend[idx];
      selectedPOD.isOpen = !selectedPOD.isOpen;
      _partialBundleInfoForSend[idx] = selectedPOD;
      return {
        ...state,
        partialBundleInfoForSend: _partialBundleInfoForSend
      };
    }
    case TOGGLE_EXTERNAL_PROCESS_DETAILS_FOR_RECEIVED: {
      const { idx } = payload;
      const _partialBundleInfoForReceived = [...state.partialBundleInfoForReceived];
      const selectedPOD = _partialBundleInfoForReceived[idx];
      selectedPOD.isOpen = !selectedPOD.isOpen;
      _partialBundleInfoForReceived[idx] = selectedPOD;
      return {
        ...state,
        partialBundleInfoForReceived: _partialBundleInfoForReceived
      };
    }
    case TOGGLE_EXTERNAL_PROCESS_PENDING_MODAL: {
      return {
        ...state,
        isOpenExternalProcessPendingModal: !state.isOpenExternalProcessPendingModal
      };
    }
    case TOGGLE_EXTERNAL_PROCESS_SEND_MODAL: {
      return {
        ...state,
        isOpenExternalProcessSendModal: !state.isOpenExternalProcessSendModal
      };
    }
    case TOGGLE_EXTERNAL_PROCESS_PASSED_MODAL: {
      return {
        ...state,
        isOpenExternalProcessPassedModal: !state.isOpenExternalProcessPassedModal
      };
    }
    case RESET_EXTERNAL_PROCESS_STATE: {
      return {
        ...state,
        partialBundleInfoForPending: []
      };
    }
    case FETCH_EXTERNAL_PROCESS_BY_RANGE:
      return { ...state, items: payload };
    default:
      return state;
  }
};

/** Change Log
 * 24-Jan-2022(Iqbal):Add FETCH_EXTERNAL_PROCESS_BY_QUERY, FETCH_EXTERNAL_PROCESS_BY_ID, FETCH_EXTERNAL_PROCESS_BY_RANGE
 */
