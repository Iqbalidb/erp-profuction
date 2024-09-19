/*
     Title: Assign Input Table Info
     Description: Assign Input Table Info
     Author: Iqbal Hossain
     Date: 26-January-2022
     Modified: 26-January-2022
*/

import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import classnames from 'classnames';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { Card, CardBody, Col, FormFeedback, FormGroup, Input, Label, Row } from 'reactstrap';
import { dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { ASSIGN_INPUT_TABLE_API } from 'services/api-end-points/production/v1';
import DualButtonModal from 'utility/custom/DualButtonModal';
import { notify } from 'utility/custom/notifications';
import CustomDatePicker from 'utility/custom/production/CustomDatePicker';
import { serverDate } from 'utility/dateHelpers';
import { errorResponse, selectThemeColors } from 'utility/Utils';
import { fillFloorDdl } from 'views/production/configuration/floor/store/actions';
import { fillLineDdlByZoneGroupId } from 'views/production/configuration/line/store/actions';
import { fillZoneDdlByFloorIdAndProductionProcessId } from 'views/production/configuration/zone/store/actions';
import { assignInputTablePendingModalOpen, fetchAssignInputForPending } from '../store/actions';
const AssignInputTableInfo = ( { lastPageInfo } ) => {
  //#region Hooks
  const dispatch = useDispatch();
  const {
    assignInputTableReducer: { isOpenAssignInputPendingModal, selecRowData },
    floorReducer: { dropDownItems: floorDdl },
    lineReducer: { lineDdlWithByZoneGroup },
    commonReducers: { iSubmitProgressCM },
    zoneReducer: { zoneDdlItemWithFloorAndProductionProcess }
  } = useSelector( state => state );
  const { register, errors } = useForm();
  //#endregion
  const rowsId = selecRowData?.selectedRows?.map( item => item.id );
  const selectedProductionProcess = '059eb699-2bf4-47b5-73e6-08da8100e2ef';
  const currentProcess = selecRowData?.selectedRows?.map( item => item.currentProcessId );
  const uniQueCurrentProcess = new Set( currentProcess );
  const currentProcessId = [...uniQueCurrentProcess].toString();
  //#region State
  const [zoneOwner, setZoneOwner] = useState( null );
  const [floors, setFloors] = useState( [] );
  const [floor, setFloor] = useState( null );
  const [lines, setLines] = useState( [] );
  const [line, setLine] = useState( [] );
  // const [machineCount, setMachineCount] = useState(0);
  const [assignDate, setAssignDate] = useState( new Date() );
  const [zones, setZones] = useState( [] );
  const [zone, setZone] = useState( null );
  const [remarks, setRemarks] = useState( '' );
  //#endregion
  console.log( zoneDdlItemWithFloorAndProductionProcess, floors, zones );
  //#region  Effects
  useEffect( () => {
    dispatch( fillFloorDdl() );
  }, [dispatch] );

  useEffect( () => {
    if ( floorDdl.length > 0 ) {
      setFloors( floorDdl );
    }
  }, [floorDdl] );

  useEffect( () => {
    if ( lineDdlWithByZoneGroup.length > 0 ) {
      setLines( lineDdlWithByZoneGroup );
    }
  }, [lineDdlWithByZoneGroup] );


  useEffect( () => {
    if ( zoneDdlItemWithFloorAndProductionProcess.length > 0 ) {
      setZones( zoneDdlItemWithFloorAndProductionProcess );
    }
  }, [zoneDdlItemWithFloorAndProductionProcess] );
  //#region Events

  // onChnage for Floor
  const onFloorChange = data => {
    if ( data ) {
      setFloor( data );
      dispatch( fillZoneDdlByFloorIdAndProductionProcessId( data.id, currentProcessId ) );
    } else {
      setZone( null );
      setLine( null );
      setLines( [] );
      setFloor( null );
      setZones( [] );
      setZoneOwner( '' );
    }
  };
  // onChnage for Floor
  const onChangeZone = zone => {
    if ( zone ) {
      setZone( zone );
      setZoneOwner( zone?.ownerName );
      dispatch( fillLineDdlByZoneGroupId( zone.zoneGroupId ) );
    } else {
      setZone( null );
      setLine( null );
      setLines( [] );
      setZoneOwner( '' );
    }
  };
  // onChnage for line
  const onLineChange = data => {
    if ( data ) {
      setLine( data );
    } else {
      setLine( null );
    }
  };
  //For onAssignDate Change
  const onAssignDateChange = dates => {
    const date = dates[0];
    setAssignDate( date );
  };
  //For Data Submission
  const handleSubmit = async () => {
    const payload = {
      date: serverDate( assignDate ),
      floorId: floor?.value,
      zoneId: zone?.value,
      zoneGroupId: zone?.zoneGroupId,
      lineId: line?.value,
      ownerEmpCode: zone?.ownerEmpCode,
      ownerName: zoneOwner,
      machineCount: 0,
      // machineCount: Number(machineCount),
      remark: remarks,
      bundleIds: rowsId,
      isComplete: false
    };
    const isValid = payload.floorId && payload.zoneId && payload.lineId;
    if ( isValid ) {
      dispatch( dataSubmitProgressCM( true ) );
      try {
        const res = await baseAxios.post( ASSIGN_INPUT_TABLE_API.add, payload );

        notify( 'success', 'Item has been assign to assign input table' );

        dispatch( assignInputTablePendingModalOpen() );
        dispatch( fetchAssignInputForPending( selectedProductionProcess, lastPageInfo ) );
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
   * For Close Assign Input Modal
   */
  const handleMainModalToggleClose = () => {
    dispatch( assignInputTablePendingModalOpen() );
  };
  /**
   * For Submit Assign Input Modal
   */
  const handleModalSubmit = () => {
    dispatch( assignInputTablePendingModalOpen() );
  };

  //#endregion
  return (
    <div>
      <DualButtonModal
        modalTypeClass="vertically-centered-modal"
        className="modal-dialog-centered modal-lg"
        openModal={isOpenAssignInputPendingModal}
        setOpenModal={isOpenAssignInputPendingModal}
        handleMainModelSubmit={handleModalSubmit}
        handleMainModalToggleClose={handleMainModalToggleClose}
        title="Assign Input Table Info"
        submitText="Save"
        handleModalSubmit={handleSubmit}
      >
        <UILoader
          blocking={iSubmitProgressCM}
          loader={<ComponentSpinner />}>
          <Card outline>
            <CardBody className="card-body-override">
              <Col xs="12" sm="12" md="12" lg="12" xl="12">
                <Row className="rounded rounded-3">
                  <FormGroup tag={Col} xs={6} sm={6} md={6} lg={6} xl={6}>
                    <CustomDatePicker
                      minDate={moment( new Date() ).format( 'yyyy-MM-DD' )}
                      id="assignDate"
                      name="assignDate"
                      title="Assign Date"
                      value={assignDate}
                      onChange={onAssignDateChange}
                    />
                  </FormGroup>
                  <FormGroup tag={Col} xs={6} sm={6} md={6} lg={6} xl={6}>
                    <Label for="floor">Floor</Label>
                    <Select
                      id="floor"
                      isSearchable
                      isClearable
                      theme={selectThemeColors}
                      options={floors}
                      className="erp-dropdown-select"
                      classNamePrefix="dropdown"
                      value={floor}
                      onChange={data => onFloorChange( data )}
                    />
                    {errors && errors.zoneOwnerName && <FormFeedback>Zone Owner Name is Required!</FormFeedback>}
                  </FormGroup>
                  <FormGroup tag={Col} xs={6} sm={6} md={6} lg={6} xl={6}>
                    <Label for="zone">Zone </Label>
                    <Select
                      isSearchable
                      isClearable
                      id="zone"
                      theme={selectThemeColors}
                      options={zones}
                      className="erp-dropdown-select"
                      classNamePrefix="dropdown"
                      value={zone}
                      onChange={data => onChangeZone( data )}
                    />
                    {errors && errors.zoneOwnerName && <FormFeedback>Zone Owner Name is Required!</FormFeedback>}
                  </FormGroup>
                  <FormGroup tag={Col} xs={6} sm={6} md={6} lg={6} xl={6}>
                    <Label for="line">Line</Label>
                    <CreatableSelect
                      id="line"
                      isSearchable
                      isClearable
                      theme={selectThemeColors}
                      options={lines}
                      className="erp-dropdown-select"
                      classNamePrefix="dropdown"
                      value={line}
                      onChange={data => onLineChange( data )}
                    />
                    {errors && errors.line && <FormFeedback>Line is Required!</FormFeedback>}
                  </FormGroup>
                  <FormGroup tag={Col} xs={6} sm={6} md={6} lg={6} xl={6}>
                    <Label for="zoneOwnerName">Zone Owner</Label>
                    <Input readOnly name="zoneOwnerName" bsSize="sm" value={zoneOwner ? zoneOwner : ''} id="zoneOwnerName" placeholder="Zone owner name" />
                    {errors && errors.zoneOwnerName && <FormFeedback>Zone Owner Name is Required!</FormFeedback>}
                  </FormGroup>
                  <FormGroup tag={Col} xs={6} sm={6} md={6} lg={6} xl={6}>
                    <Label for="name">Remarks</Label>
                    <Input
                      name="remarks"
                      id="remarks"
                      bsSize="sm"
                      innerRef={register( { required: true } )}
                      invalid={errors.remarks && true}
                      value={remarks}
                      onChange={e => setRemarks( e.target.value )}
                      className={classnames( { 'is-invalid': errors['remarks'] } )}
                    />
                    {errors && errors.remarks && <FormFeedback>Remarks !</FormFeedback>}
                  </FormGroup>
                </Row>
              </Col>
            </CardBody>
          </Card>
        </UILoader>
      </DualButtonModal>
    </div>
  );
};

export default AssignInputTableInfo;

/** Change Log
 * 26-Jan-2022(Iqbal): Assign Input Table info modal create
 */
