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
import { fetchPartialBundleInfoForSend, toggleExternalProcessSendModal } from '../store/actions';

const ExternalProcessSendModal = ( { selectedReceiveItems, setSelectedRowId, setClearSelectedRows, lastPageInfo } ) => {
  //#region Hooks
  const dispatch = useDispatch();
  const { isOpenExternalProcessSendModal, selectedProductionSubProcess } = useSelector( ( { externalProcessReducer } ) => externalProcessReducer );
  const { iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );

  //#endregion

  //#region State
  const [receiveDate, setReceiveDate] = useState( new Date() );
  //#endregion

  //#region Events
  /**
   * On Receive Date Change
   */
  const onReceiveDateChange = dates => {
    const date = dates[0];
    setReceiveDate( date );
  };
  // for Close
  const handleMainModalToggleClose = () => {
    dispatch( toggleExternalProcessSendModal() );
  };
  // for Cancel
  const handleMainModelSubmit = () => {
    dispatch( toggleExternalProcessSendModal() );
  };
  /**
   * For Submission
   */
  const handleModalSubmit = async () => {
    const payload = selectedReceiveItems.map( m => m.toString() );
    dispatch( dataSubmitProgressCM( true ) );

    try {
      const res = await baseAxios.put( EXTERNAL_PROCESS_API.receive_bundle_to_external_process, payload, {
        params: { passDate: serverDate( receiveDate ) }
      } );


      notify( 'success', 'Item has been receive from external process' );
      setSelectedRowId( [] );
      setClearSelectedRows( true );
      handleMainModalToggleClose();
      dispatch( fetchPartialBundleInfoForSend( selectedProductionSubProcess, lastPageInfo ) );
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
        openModal={isOpenExternalProcessSendModal}
        setOpenModal={!isOpenExternalProcessSendModal}
        handleModalSubmit={handleModalSubmit}
        handleMainModelSubmit={handleMainModelSubmit}
        handleMainModalToggleClose={handleMainModalToggleClose}
        modalCloseText="Close"
        submitText="Received"
        title="Receive Item From  External Process"
      >
        <UILoader
          blocking={iSubmitProgressCM}
          loader={<ComponentSpinner />}>
          <Card className="p-2">
            <Form>
              <Col xs="12" sm="12" md="12" lg="12" xl="12">
                <Row className="rounded rounded-3 mr-1">
                  <FormGroup tag={Col} xs={12} sm={12} md={12} lg={12} xl={12}>
                    <CustomDatePicker name="receiveDate" title="Receive Date" value={receiveDate} onChange={onReceiveDateChange} />
                  </FormGroup>

                </Row>
                <p className="text-dark font-weight-bold">
                  {selectedReceiveItems?.length !== null ? `${selectedReceiveItems?.length}  item selected` : null}
                </p>
              </Col>

            </Form>
          </Card>
        </UILoader>
      </DualButtonModal>
    </div>
  );
};

export default ExternalProcessSendModal;
