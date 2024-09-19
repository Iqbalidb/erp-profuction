import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Card, Col, FormGroup, Label, Row } from 'reactstrap';
import { dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { BUNDLE_API } from 'services/api-end-points/production/v1';
import { stringifyConsole } from 'utility/commonHelper';
import DualButtonModal from 'utility/custom/DualButtonModal';
import { notify } from 'utility/custom/notifications';
import CustomDatePicker from 'utility/custom/production/CustomDatePicker';
import { serverDate } from 'utility/dateHelpers';
import { errorResponse, selectThemeColors } from 'utility/Utils';
import { fetchPartialBundleForPass, toggleAssignToExternalModalOpen } from '../store/actions';

const BundleAssignToExternalModal = ( { lastPageInfo, processInfo } ) => {

  //#region Hooks
  const dispatch = useDispatch();
  const { isBundleAssignToExternalModalOpen, selectedProductionSubProcessDropDownItems, selectedRows } = useSelector(
    ( { bundleReducer } ) => bundleReducer
  );
  const { iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
  //#endregion

  //#region States
  const [date, setDate] = useState( new Date() );
  const [productionSubProcess, setProductionSubProcess] = useState( null );

  //#endregion

  //#region Events
  const onAssignDateChange = dates => {
    const date = dates[0];
    setDate( date );
  };

  /**
   *  productionSubProcess Ddl
   */
  const onProductionSubProcessDropdownItemChange = productionSubProcess => {
    if ( productionSubProcess ) {
      setProductionSubProcess( productionSubProcess );
    }
  };

  /**
   * For Assign
   */
  const handleAssign = async e => {
    e.preventDefault();
    const payload = selectedRows.map( sr => sr.toString() );
    if ( selectedRows.length > 0 && productionSubProcess !== null ) {
      dispatch( dataSubmitProgressCM( true ) );
      try {
        stringifyConsole( payload );
        const res = await baseAxios.put( BUNDLE_API.update_bundle_by_bundle_pass_process, payload, {
          params: {
            nextProcessId: productionSubProcess?.id,
            nextProcessName: productionSubProcess?.label,
            passDate: serverDate( date )
          }
        } );
        notify( 'success', 'Bundle assign to afterward process' );
        dispatch( toggleAssignToExternalModalOpen() );
        dispatch( fetchPartialBundleForPass( processInfo, lastPageInfo ) );
        dispatch( dataSubmitProgressCM( false ) );
      } catch ( error ) {
        errorResponse( error );
        dispatch( dataSubmitProgressCM( false ) );
      }
    } else {
      notify( 'warning', 'please provide all information!!!' );
    }
  };

  /**
   * Close Modal
   */
  const handleMainModalToggleClose = () => {
    dispatch( toggleAssignToExternalModalOpen() );
  };

  /**
   * Close Modal
   */
  const handleModalSubmit = () => {
    dispatch( toggleAssignToExternalModalOpen() );
  };
  //#endregion
  return (
    <div>
      <DualButtonModal
        modalTypeClass="vertically-centered-modal"
        className="modal-dialog-centered modal-lg custom-modal"
        openModal={isBundleAssignToExternalModalOpen}
        handleMainModelSubmit={handleModalSubmit}
        handleModalSubmit={handleAssign}
        handleMainModalToggleClose={handleMainModalToggleClose}
        submitText="Assign"
        title="Bundle Assign To External Process"
      >
        <UILoader
          blocking={iSubmitProgressCM}
          loader={<ComponentSpinner />}>
          <Card className="p-2">
            <Col xs="12" sm="12" md="12" lg="12" xl="12">
              <Row className="rounded rounded-3 mr-1">
                <FormGroup tag={Col} xs={12} sm={12} md={6} lg={6} xl={6}>
                  <CustomDatePicker maxDate={new Date()} name="date" title="Assign Date" value={date} onChange={onAssignDateChange} />
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
                {/* <FormGroup tag={Col} xs={2}>
                <Button className="btn-icon mt-2" color="primary" onClick={handleAssign} outline>
                  Assign
                </Button>
              </FormGroup> */}
              </Row>
              <p className="text-dark font-weight-bold">{productionSubProcess !== null ? `${selectedRows.length}  item selected` : null}</p>
            </Col>
          </Card>
        </UILoader>
      </DualButtonModal>
    </div>
  );
};

export default BundleAssignToExternalModal;
