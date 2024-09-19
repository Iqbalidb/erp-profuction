/*
     Title: Finishing Passed Reject Info
     Description: Finishing Passed Reject Info
     Author: Alamgir Kabir
     Date: 06-March-2022
     Modified: 06-March-2022
*/

import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Card, CardBody, Col, FormGroup, Label, Row } from 'reactstrap';
import { dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { FINISHING_API } from 'services/api-end-points/production/v1/finishing';
import { stringifyConsole } from 'utility/commonHelper';
import DualButtonModal from 'utility/custom/DualButtonModal';
import { notify } from 'utility/custom/notifications';
import { errorResponse, selectThemeColors } from 'utility/Utils';
import { fetchProductionSubProcessByCurrentProcessAndStyle } from '../../bundle/store/actions';
import { fetchFinishingByProductionSubProcessId } from '../store/actions';

const FinishingPassedModal = props => {
  const {
    openModal,
    setOpenModal,
    data,
    styleId,
    setSelectedRowId,
    setClearSelectedRows,
    selectedProductionSubProcess,
    setSelectedProductionSubProcess,
    lastPageInfo
  } = props;
  //#region Hooks
  const dispatch = useDispatch();
  const { selectedProductionSubProcessDropDownItems } = useSelector( ( { bundleReducer } ) => bundleReducer );
  const { iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );

  //#endregion

  //#region States
  const [nextProcess, setNextProcess] = useState( null );
  //#endregion

  //#region  Effects
  useEffect( () => {
    if ( selectedProductionSubProcess && styleId ) {
      dispatch( fetchProductionSubProcessByCurrentProcessAndStyle( selectedProductionSubProcess.id, styleId, 'complete' ) );
    }
  }, [dispatch, selectedProductionSubProcess, styleId] );
  //#endregion

  //#region Events
  /**
   *For Production Sub Process Change
   */
  const onProductionSubProcessDropdownItemChange = item => {
    setNextProcess( item );
  };
  /**
     *For Finishing Close Modal
   */
  const handleMainModalToggleClose = () => {
    setOpenModal( !openModal );
  };
  /**
      *For Submit Finishing
  */
  const handleModalSubmit = () => {
    setOpenModal( !openModal );
  };
  /**
   * Assign Finishing Modal Items
   */
  const handleAssign = async () => {
    const payload = data.map( sr => sr.toString() );
    if ( data.length > 0 && nextProcess !== null ) {
      dispatch( dataSubmitProgressCM( true ) );
      try {
        stringifyConsole( payload );
        const res = await baseAxios.put( FINISHING_API.pass_finishing, payload, {
          params: {
            nextProcessId: nextProcess?.id,
            nextProcessName: nextProcess?.name
          }
        } );

        notify( 'success', 'Data Submitted Successfully' );

        handleModalSubmit();
        setSelectedRowId( [] );
        setClearSelectedRows( true );
        setSelectedProductionSubProcess( null );
        dispatch( fetchFinishingByProductionSubProcessId( lastPageInfo ) );
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
        title="Finishing Next Process"
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

export default FinishingPassedModal;
