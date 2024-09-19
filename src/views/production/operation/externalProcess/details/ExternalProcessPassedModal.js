/*
     Title: External Process Passed Modal
     Description: External Process Passed Modal
     Author: Alamgir Kabir
     Date: 01-March-2023
     Modified: 01-March-2023
*/
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Card, Col, FormGroup, Label, Row } from 'reactstrap';
import { dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { EXTERNAL_PROCESS_API } from 'services/api-end-points/production/v1';
import DualButtonModal from 'utility/custom/DualButtonModal';
import { notify } from 'utility/custom/notifications';
import CustomDatePicker from 'utility/custom/production/CustomDatePicker';
import { serverDate } from 'utility/dateHelpers';
import { errorResponse, selectThemeColors } from 'utility/Utils';
import { fetchPartialBundleInfoForReceived, toggleExternalProcessPassedModal } from '../store/actions';

const ExternalProcessPassedModal = ( { setSelectedRowId, selectedPassedItems, setClearSelectedRows, lastPageInfo, } ) => {
  //#region Hooks
  const dispatch = useDispatch();
  const {
    externalProcessReducer: { isOpenExternalProcessPassedModal, selectedProductionSubProcess },
    bundleReducer: { selectedProductionSubProcessDropDownItems },
    commonReducers: { iSubmitProgressCM }
  } = useSelector( state => state );
  //#endregion

  //#region State
  const [passDate, setPassDate] = useState( new Date() );
  const [productionSubProcess, setProductionSubProcess] = useState( null );
  //#endregion

  //#region Events
  /**
   * For Date Change
   */
  const onExternalProcessPassedDateChange = dates => {
    const date = dates[0];
    setPassDate( date );
  };
  const onProductionSubProcessDropdownItemChange = item => {
    if ( item ) {
      setProductionSubProcess( item );
    }
  };
  /**
    * For Modal Close
    */
  const handleMainModalToggleClose = () => {
    dispatch( toggleExternalProcessPassedModal() );
  };
  /**
   * For Ok
   */
  const handleModalSubmit = () => {
    dispatch( toggleExternalProcessPassedModal() );
  };
  /**
   * For Send
   */
  const handlePassed = async () => {
    const payload = selectedPassedItems.map( m => m.toString() );
    dispatch( dataSubmitProgressCM( true ) );
    try {
      const res = await baseAxios.put( EXTERNAL_PROCESS_API.passed_bundle_from_external_process, payload, {
        params: {
          passDate: serverDate( passDate ),
          nextProcessId: productionSubProcess?.id,
          nextProcessName: productionSubProcess?.label
        }
      } );
      notify( 'success', 'Item has been restored' );
      setSelectedRowId( [] );
      setClearSelectedRows( true );
      handleMainModalToggleClose();
      dispatch( fetchPartialBundleInfoForReceived( selectedProductionSubProcess, lastPageInfo ) );
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
        openModal={isOpenExternalProcessPassedModal}
        // setOpenModal={!isOpenExternalProcessPendingModal}
        handleMainModelSubmit={handleModalSubmit}
        handleModalSubmit={handlePassed}
        handleMainModalToggleClose={handleMainModalToggleClose}
        submitText="Save"
        modalCloseText="Close"
        title="External Passed Item"
      >
        <UILoader
          blocking={iSubmitProgressCM}
          loader={<ComponentSpinner />}>
          <Card className="p-2">
            <Col xs="12" sm="12" md="12" lg="12" xl="12">
              <Row className="rounded rounded-3 mr-1">
                <FormGroup tag={Col} xs={12} sm={12} md={6} lg={6} xl={6}>
                  <CustomDatePicker
                    maxDate={new Date()}
                    name="passDate"
                    title="Assign Date"
                    value={passDate}
                    onChange={onExternalProcessPassedDateChange}
                  />
                </FormGroup>
                <FormGroup tag={Col} xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Label className="text-dark font-weight-bold" for="nextProcess" >
                    Next Process
                  </Label>
                  <Select

                    id="nextProcess"
                    bsSize="sm"
                    theme={selectThemeColors}
                    options={selectedProductionSubProcessDropDownItems}
                    className="erp-dropdown-select"
                    classNamePrefix="dropdown"
                    value={productionSubProcess}
                    onChange={item => onProductionSubProcessDropdownItemChange( item )}
                  />{' '}
                </FormGroup>
              </Row>
              <p className="text-dark font-weight-bold">{selectedPassedItems !== null ? `${selectedPassedItems.length}  item selected` : null}</p>
            </Col>
          </Card>
        </UILoader>
      </DualButtonModal>
    </div>
  );
};

export default ExternalProcessPassedModal;
