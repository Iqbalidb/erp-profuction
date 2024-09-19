/*
     Title: Reject Info
     Description: Reject Info
     Author: Iqbal Hossain
     Date: 25-January-2022
     Modified: 25-January-2022
*/

import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Col, Form, FormGroup, Row } from 'reactstrap';
import { dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { PANEL_CHECK_API } from 'services/api-end-points/production/v1';
import { stringifyConsole } from 'utility/commonHelper';
import DualButtonModal from 'utility/custom/DualButtonModal';
import { notify } from 'utility/custom/notifications';
import CustomDatePicker from 'utility/custom/production/CustomDatePicker';
import { serverDate } from 'utility/dateHelpers';
import { errorResponse } from 'utility/Utils';
import { fetchUnchecked, setUnCheckedBundle, toggleUncheckedModal } from '../store/actions';
const
  PanelCheckUnCheckedInfo = props => {
    const { setSelectedRowId, setClearSelectedRows, lastPageInfo } = props;
    //#region Hooks
    const { selectedUnCheckedBundle, isUnCheckedModalOpen } = useSelector( ( { panelCheckReducer } ) => panelCheckReducer );
    const { iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );

    const dispatch = useDispatch();
    //#endregion

    //#region State
    const [date, setDate] = useState( new Date() );
    //#endregion

    //#region  Events

    // add new row
    const handleChecked = async () => {
      const payload = selectedUnCheckedBundle.map( m => m.toString() );
      stringifyConsole( payload );
      dispatch( dataSubmitProgressCM( true ) );

      try {
        const res = await baseAxios.put( PANEL_CHECK_API.update_bundle_by_bundle_check_status, payload, { params: { checkDate: serverDate( date ) } } );
        if ( res.data.succeeded ) {
          notify( 'success', 'Data Submitted Successfully' );
          dispatch( toggleUncheckedModal() );
          dispatch( setUnCheckedBundle( null ) );
          dispatch( fetchUnchecked( lastPageInfo ) );
          setSelectedRowId( [] );
          setClearSelectedRows( true );
          dispatch( dataSubmitProgressCM( false ) );

        }
      } catch ( error ) {
        errorResponse( error );
        dispatch( dataSubmitProgressCM( false ) );
      }
    };
    /**
     * Change Check Date
     */
    const onCheckDateChange = dates => {
      const date = dates[0];
      setDate( date );
    };
    // for modal close
    const handleMainModalToggleClose = () => {
      dispatch( toggleUncheckedModal() );
      dispatch( setUnCheckedBundle( null ) );
      dispatch( fetchUnchecked() );
    };
    // for modal close
    const handleMainModelSubmit = () => {
      dispatch( toggleUncheckedModal() );
      dispatch( setUnCheckedBundle( null ) );
      dispatch( fetchUnchecked() );
    };

    //#endregion

    return (
      <div>
        <DualButtonModal
          modalTypeClass="vertically-centered-modal"
          className="modal-dialog-centered modal-lg custom-modal"
          openModal={isUnCheckedModalOpen}
          setOpenModal={!isUnCheckedModalOpen}
          handleMainModelSubmit={handleMainModelSubmit}
          handleModalSubmit={handleChecked}
          handleMainModalToggleClose={handleMainModalToggleClose}
          submitText="Checked"
          title="Panel Check Unchecked Item "
        >
          <UILoader
            blocking={iSubmitProgressCM}
            loader={<ComponentSpinner />}>
            <Card className="p-2">
              <Form>
                <Col xs="12" sm="12" md="12" lg="12" xl="12">
                  <Row className="rounded rounded-3 mr-1">
                    <FormGroup tag={Col} xs={12} sm={12} md={12} lg={12} xl={12}>
                      <CustomDatePicker name="date" title="Check Date" value={date} onChange={onCheckDateChange} />
                    </FormGroup>
                    {/* <FormGroup tag={Col} xs={2}>
                  <Button className="btn-icon mt-2" color="primary" onClick={handleChecked} outline>
                    Checked
                  </Button>
                </FormGroup> */}
                  </Row>
                </Col>
              </Form>
            </Card>
          </UILoader>
        </DualButtonModal>
      </div>
    );
  };

export default PanelCheckUnCheckedInfo;

/** Change Log
 * 25-Jan-2022(Iqbal): Reject info modal create
 */
