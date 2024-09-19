/*
     Title: Sewing Out Modal
     Description: Sewing Out Modal
     Author: Alamgir Kabir
     Date: 28-November-2022
     Modified: 28-November-2022
*/

import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Card, CardBody, Col, FormGroup, Label, Row } from 'reactstrap';
import { dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { SEWING_OUT_API } from 'services/api-end-points/production/v1/sewingOut';
import { stringifyConsole } from 'utility/commonHelper';
import DualButtonModal from 'utility/custom/DualButtonModal';
import { notify } from 'utility/custom/notifications';
import { errorResponse, selectThemeColors } from 'utility/Utils';
import { fetchProductionSubProcessByCurrentProcessAndStyle } from '../../bundle/store/actions';
import { fetchTodaysSewingOut } from '../store/actions';

const SewingOutModal = props => {
  //#region Hooks
  const dispatch = useDispatch();
  const { selectedProductionSubProcessDropDownItems } = useSelector( ( { bundleReducer } ) => bundleReducer );
  const { iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
  //#endregion

  //#region States
  const { openModal, setOpenModal, data, styleId, setSelectedRowId, setClearSelectedRows, lastPageInfo } = props;
  const currentProcessId = '059eb699-2bf4-47b5-73e6-08da8100e2ef';
  const [nextProcess, setNextProcess] = useState( null );
  //#endregion

  //#region  Effects
  useEffect( () => {
    if ( currentProcessId && styleId ) {
      dispatch( fetchProductionSubProcessByCurrentProcessAndStyle( currentProcessId, styleId, 'complete' ) );
    }
  }, [dispatch, styleId] );
  //#endregion

  //#region Events
  /**
   * For Production Process Change
   */
  const onProductionSubProcessDropdownItemChange = item => {
    setNextProcess( item );
  };
  /**
   * For Modal Close
   */
  const handleMainModalToggleClose = () => {
    setOpenModal( !openModal );
  };
  /**
   * For Modal Submit
   */
  const handleModalSubmit = () => {
    setOpenModal( !openModal );
  };

  /**
   * For Assign
   */
  const handleAssign = async () => {
    const payload = data.map( sr => sr.toString() );
    if ( data.length > 0 && nextProcess !== null ) {
      dispatch( dataSubmitProgressCM( true ) );

      try {
        stringifyConsole( payload );
        const res = await baseAxios.put( SEWING_OUT_API.pass_sewing_out, payload, {
          params: {
            nextProcessId: nextProcess?.id,
            nextProcessName: nextProcess?.name
          }
        } );
        notify( 'success', 'Item has been send to afterward process' );
        handleModalSubmit();
        setSelectedRowId( [] );
        setClearSelectedRows( true );
        dispatch( fetchTodaysSewingOut( lastPageInfo ) );
        dispatch( dataSubmitProgressCM( false ) );


      } catch ( error ) {
        errorResponse( error );
        dispatch( dataSubmitProgressCM( false ) );
      }
    } else {
      notify( 'warning', 'please provide all information!!!' );
    }
  };
  //#endregion
  return (
    <div>
      <DualButtonModal
        modalTypeClass="vertically-centered-modal"
        className="modal-dialog-centered modal-lg custom-modal"
        openModal={openModal}
        setOpenModal={setOpenModal}
        handleMainModelSubmit={handleModalSubmit}
        handleModalSubmit={handleAssign}
        handleMainModalToggleClose={handleMainModalToggleClose}
        title="Sewing Out Afterward  Process"
        submitText="Assign"
      >
        <UILoader
          blocking={iSubmitProgressCM}
          loader={<ComponentSpinner />}>
          <Card>
            <CardBody>
              <Row className="rounded rounded-3 mr-1">
                <FormGroup tag={Col} xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Label className="text-dark font-weight-bold" for="nextProcess" style={{ marginBottom: '0px' }}>
                    Next Process
                  </Label>
                  <Select
                    id="nextProcess"
                    bsSize="sm"
                    theme={selectThemeColors}
                    options={selectedProductionSubProcessDropDownItems}
                    className="erp-dropdown-select"
                    classNamePrefix="dropdown"
                    value={nextProcess}
                    onChange={item => onProductionSubProcessDropdownItemChange( item )}
                  />{' '}
                </FormGroup>
              </Row>
              <p className="text-dark font-weight-bold">{data !== null ? `${data.length}  item selected` : null}</p>
            </CardBody>
          </Card>
        </UILoader>
      </DualButtonModal>
    </div>
  );
};

export default SewingOutModal;
