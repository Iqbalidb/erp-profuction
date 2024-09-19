import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Card, Col, FormGroup, Label, Row } from 'reactstrap';
import { dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { WASH_RECEIVE_API } from 'services/api-end-points/production/v1/washReceive';
import { stringifyConsole } from 'utility/commonHelper';
import DualButtonModal from 'utility/custom/DualButtonModal';
import { notify } from 'utility/custom/notifications';
import { errorResponse, selectThemeColors } from 'utility/Utils';
import { fetchNextProductionSubProcessByCurrentProcessAndStyle, fetchWashReceiveItemByProcessId } from '../store/actions';
const WashReceiveModal = ( { isOpenWashPassedModal, selectedRowInfo, setIsOpenWashPassedModal, setSelectedRowInfo, setClearSelectedRows, lastPageInfo } ) => {
  //#region Hooks
  const dispatch = useDispatch();
  const { nextProductionSubProcessDropDownItems } = useSelector( ( { washReducer } ) => washReducer );
  const { iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
  //#endregion

  //#region States
  const [selectedProductionSubProcess, setSelectedProductionSubProcess] = useState( null );
  //#endregion

  //#region Effects
  useEffect( () => {
    if ( selectedRowInfo?.styleId && selectedRowInfo?.currentProcessId ) {
      dispatch( fetchNextProductionSubProcessByCurrentProcessAndStyle( selectedRowInfo?.currentProcessId, selectedRowInfo?.styleId, 'complete' ) );
    }
  }, [dispatch, selectedRowInfo.currentProcessId, selectedRowInfo.styleId] );
  //#endregion

  //#region Events
  /**
   * For Production Process Change
   */
  const onProductionSubProcessChange = item => {
    if ( item ) {
      setSelectedProductionSubProcess( item );
    }
  };
  /**
   * For Close Main Modal
   */
  const handleMainModalToggleClose = () => {
    setIsOpenWashPassedModal( !isOpenWashPassedModal );
  };

  /**
   * Close Modal
   */
  const handleModalSubmit = () => {
    setIsOpenWashPassedModal( !isOpenWashPassedModal );
  };
  /**
   * For Assign/Submission
   */
  const handleAssign = async e => {
    e.preventDefault();
    const payload = selectedRowInfo?.rowsId?.map( sr => sr.toString() );
    if ( selectedRowInfo?.rowsId?.length > 0 && selectedProductionSubProcess !== null ) {
      dispatch( dataSubmitProgressCM( true ) );
      try {
        stringifyConsole( payload );
        const res = await baseAxios.put( WASH_RECEIVE_API.pass, payload, {
          params: {
            nextProcessId: selectedProductionSubProcess?.id,
            nextProcessName: selectedProductionSubProcess?.name
          }
        } );
        notify( 'success', 'Data Submitted Successfully' );
        setClearSelectedRows( true );
        setSelectedRowInfo( [] );
        handleMainModalToggleClose();
        dispatch( fetchWashReceiveItemByProcessId( lastPageInfo ) );
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
        openModal={isOpenWashPassedModal}
        handleMainModelSubmit={handleModalSubmit}
        handleModalSubmit={handleAssign}
        handleMainModalToggleClose={handleMainModalToggleClose}
        submitText="Assign"
        title="Wash Assign To Next Process"
      >
        <UILoader
          blocking={iSubmitProgressCM}
          loader={<ComponentSpinner />}>
          <Card className="p-2">
            <Col xs="12" sm="12" md="12" lg="12" xl="12">
              <Row className="rounded rounded-3 mr-1">
                <FormGroup tag={Col} xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Label className="text-dark font-weight-bold" for="nextProcess" style={{ marginBottom: '0px' }}>
                    Next Process
                  </Label>
                  <Select
                    id="nextProcess"
                    bsSize="sm"
                    theme={selectThemeColors}
                    options={nextProductionSubProcessDropDownItems}
                    className="erp-dropdown-select"
                    classNamePrefix="dropdown"
                    value={selectedProductionSubProcess}
                    onChange={item => onProductionSubProcessChange( item )}
                  />{' '}
                </FormGroup>

              </Row>
              <p className="text-dark font-weight-bold">
                {selectedRowInfo?.rowsId?.length !== null ? `${selectedRowInfo?.rowsId?.length}  item selected` : null}
              </p>
            </Col>
          </Card>
        </UILoader>
      </DualButtonModal>
    </div>
  );
};

export default WashReceiveModal;
