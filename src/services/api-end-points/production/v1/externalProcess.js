/*
     Title: external-process API
     Description: external-process API
     Author: Iqbal Hossain
     Date: 18-January-2022
     Modified: 18-January-2022
*/

export const EXTERNAL_PROCESS_API = {
  root: '/api/external-process',
  fetch_all: 'api/external-process/fetch-all',
  fetch_by_query: `/api/external-process/fetch-by-query`,
  fetch_by_id: `/api/external-process/fetch-by-id`,
  get_by_range: `/api/external-process/get-range`,
  fetch_pending_bundle_for_external_process: ( status, currentProcessId ) => `/api/production/ExternalProcess/GetPendingBundleForExternalProcess?status=${status}&currentProcessId=${currentProcessId}`,

  fetch_send_bundle_for_external_process: ( status, currentProcessId, condition ) => `/api/production/ExternalProcess/GetProcessedBundleExternalProcess?status=${status}&currentProcessId=${currentProcessId}&condition=${condition}`,

  fetch_receive_bundle_for_external_process: ( status, currentProcessId, condition ) => `/api/production/ExternalProcess/GetProcessedBundleExternalProcess?status=${status}&currentProcessId=${currentProcessId}&condition=${condition}`,
  fetch_passed_bundle_from_external_process: ( status, currentProcessId ) => `/api/production/ExternalProcess/GetPassedBundleExternalProcess?status=${status}&currentProcessId=${currentProcessId}`,

  send_bundle_to_external_process: `/api/production/ExternalProcess/SendBundleToExternalProcess`,

  receive_bundle_to_external_process: `/api/production/ExternalProcess/ReceiveBundleToExternalProcess`,
  passed_bundle_from_external_process: `/api/production/ExternalProcess/PassBundleFromExternalProcess`
};
