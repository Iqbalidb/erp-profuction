import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Col, Form, FormGroup, Row } from 'reactstrap';
import { dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { EXTERNAL_PROCESS_API } from 'services/api-end-points/production/v1';
import DualButtonModal from 'utility/custom/DualButtonModal';
import { notify } from 'utility/custom/notifications';
import CustomDatePicker from 'utility/custom/production/CustomDatePicker';
import { serverDate } from 'utility/dateHelpers';
import { errorResponse } from 'utility/Utils';
import { fetchPartialBundleInfoForPending, toggleExternalProcessPendingModal } from '../store/actions';

const ExternalProcessPendingModal = ( { setSelectedRowId, selectedSendItems, setClearSelectedRows, lastPageInfo } ) => {
  //#region Hooks
  const dispatch = useDispatch();
  const { isOpenExternalProcessPendingModal, selectedProductionSubProcess } = useSelector( ( { externalProcessReducer } ) => externalProcessReducer );
  const { iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );

  //#endregion

  //#region State
  const [sendDate, setSendDate] = useState( new Date() );
  //#endregion

  //#region Events
  /**
   * For Date Change
   */
  const onSendDateChange = dates => {
    const date = dates[0];
    setSendDate( date );
  };
  /**
   * For Modal Close
   */
  const handleMainModalToggleClose = () => {
    dispatch( toggleExternalProcessPendingModal() );
  };
  /**
   * For Ok
   */
  const handleMainModelSubmit = () => {
    dispatch( toggleExternalProcessPendingModal() );
  };
  /**
   * For Send
   */
  const handleModalSubmit = async () => {
    const payload = selectedSendItems.map( m => m.toString() );
    dispatch( dataSubmitProgressCM( true ) );
    try {
      const res = await baseAxios.put( EXTERNAL_PROCESS_API.send_bundle_to_external_process, payload, { params: { passDate: serverDate( sendDate ) } } );
      notify( 'success', 'Item has been send to external process' );
      setSelectedRowId( [] );
      setClearSelectedRows( true );
      handleMainModalToggleClose();
      dispatch( fetchPartialBundleInfoForPending( selectedProductionSubProcess, lastPageInfo ) );
      dispatch( dataSubmitProgressCM( false ) );
    } catch ( error ) {
      errorResponse( error );
      dispatch( dataSubmitProgressCM( false ) );
    }
  };
  //#endregion
  return (
    <div>
      <DualButtonModal
        modalTypeClass="vertically-centered-modal"
        className="modal-dialog-centered modal-lg custom-modal"
        openModal={isOpenExternalProcessPendingModal}
        // setOpenModal={!isOpenExternalProcessPendingModal}
        handleMainModelSubmit={handleMainModelSubmit}
        handleModalSubmit={handleModalSubmit}
        handleMainModalToggleClose={handleMainModalToggleClose}
        modalCloseText="Close"
        submitText="Send"
        title="Send To External Process"
      >
        <UILoader
          blocking={iSubmitProgressCM}
          loader={<ComponentSpinner />}>
          <Card className="p-2">
            <Form>
              <Col xs="12" sm="12" md="12" lg="12" xl="12">
                <Row className="rounded rounded-3 mr-1">
                  <FormGroup tag={Col} xs={12} sm={12} md={12} lg={12} xl={12}>
                    <CustomDatePicker name="sendDate" title="Send Date" value={sendDate} onChange={onSendDateChange} />
                  </FormGroup>

                </Row>
                <p className="text-dark font-weight-bold">{selectedSendItems?.length !== null ? `${selectedSendItems?.length}  item selected` : null}</p>
              </Col>

            </Form>
          </Card>
        </UILoader>
      </DualButtonModal>
    </div>
  );
};

export default ExternalProcessPendingModal;
