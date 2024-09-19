/**
 * Title: AssingTarget Add Form
 * Description: AssingTarget Add Form
 * Author: Iqbal Hossain
 * Date: 05-January-2022
 * Modified: 05-January-2022
 */

import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import classNames from 'classnames';
import ActionMenu from 'layouts/components/menu/action-menu';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Col, NavItem, NavLink, Row } from 'reactstrap';
import { dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { ASSIGN_TARGET_API } from 'services/api-end-points/production/v1';
import { errorResponse, selectThemeColors } from 'utility/Utils';
import { stringifyConsole } from 'utility/commonHelper';
import ErpDateInput from 'utility/custom/customController/ErpDateInput';
import { ErpInput } from 'utility/custom/customController/ErpInput';
import ErpSelect from 'utility/custom/customController/ErpSelect';

import FormContentLayout from 'utility/custom/FormContentLayout';
import FormLayout from 'utility/custom/FormLayout';
import { notify } from 'utility/custom/notifications';
import { serverDate } from 'utility/dateHelpers';
import { fillFloorDdl } from 'views/production/configuration/floor/store/actions';
import { fillLineDdlByZoneGroupId } from 'views/production/configuration/line/store/actions';
import { fillZoneDdlByFloorIdAndProductionProcessId } from 'views/production/configuration/zone/store/actions';
import '../../../../../assets/scss/production/form-page-custom-table.scss';
import '../../../../../assets/scss/production/general.scss';
const AssingTargetAddForm = () => {
  //#region Hooks
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    floorReducer: { dropDownItems: floorDdl },
    commonReducers: { iSubmitProgressCM },
    zoneReducer: { zoneDdlItemWithFloorAndProductionProcess },
    lineReducer: { lineDdlWithByZoneGroup }
  } = useSelector( state => state );
  const { register, errors } = useForm();
  //#endregion

  //#region  State
  const productionProcessId = '059eb699-2bf4-47b5-73e6-08da8100e2ef';
  const [assignDate, setAssignDate] = useState( new Date() );
  const [floor, setFloor] = useState( null );
  const [workingMinute, setWorkingMinute] = useState( 0 );
  const [efficiency, setEfficiency] = useState( 0 );
  const [smv, setSmv] = useState( 0 );
  const [target, setTarget] = useState( 0 );
  const [zones, setZones] = useState( [] );
  const [zone, setZone] = useState( null );
  const [lines, setLines] = useState( [] );
  const [line, setLine] = useState( null );
  const [zoneOwner, setZoneOwner] = useState( null );
  const [remarks, setRemarks] = useState( '' );
  const [machineCount, setMachineCount] = useState( 0 );
  //#endregion

  //#region Effects
  useEffect( () => {
    dispatch( fillFloorDdl() );
  }, [dispatch] );

  useEffect( () => {
    if ( zoneDdlItemWithFloorAndProductionProcess.length ) {
      setZones( zoneDdlItemWithFloorAndProductionProcess );
    }
  }, [dispatch, zoneDdlItemWithFloorAndProductionProcess] );

  useEffect( () => {
    if ( lineDdlWithByZoneGroup.length ) {
      setLines( lineDdlWithByZoneGroup );
    }
  }, [dispatch, lineDdlWithByZoneGroup] );
  //#endregion

  //#region Events
  //For onFloorChange
  const onFloorChange = floor => {
    if ( floor ) {
      setFloor( floor );
      dispatch( fillZoneDdlByFloorIdAndProductionProcessId( floor.id, productionProcessId ) );
    } else {
      setZone( null );
      setLine( null );
      setFloor( null );
      setZoneOwner( '' );
      setZones( [] );
      setLines( [] );
    }
  };

  //For onChange Zone
  const onChangeZone = zone => {
    if ( zone ) {
      setZone( zone );
      setZoneOwner( zone?.ownerName );
      dispatch( fillLineDdlByZoneGroupId( zone.zoneGroupId ) );
    } else {
      setZone( null );
      setLine( null );
      setZoneOwner( '' );
      setLines( [] );
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

  //For Working Minute Change
  const onChangeWorkingMinute = e => {
    const workingMinuteValue = Number( e.target.value );
    let target = Math.floor( ( workingMinuteValue * efficiency ) / smv );
    if ( _.isNaN( target ) ) {
      target = 0;
    }
    if ( !_.isFinite( target ) ) {
      target = 0;
    }
    setTarget( target );
    setWorkingMinute( workingMinuteValue );
  };

  //For Efficiency Change
  const onEfficiencyChange = e => {
    const efficiencyValue = Number( e.target.value );
    let target = Math.round( ( workingMinute * efficiencyValue ) / smv );
    if ( !_.isFinite( target ) ) {
      target = 0;
    }
    setTarget( target );
    setEfficiency( efficiencyValue );
  };

  //For SMV Change
  const onSMVChange = e => {
    const smvValue = Number( e.target.value );
    let target = Math.round( ( workingMinute * efficiency ) / smvValue );
    if ( !_.isFinite( target ) ) {
      target = 0;
    }
    setTarget( target );
    setTarget( target );
    setSmv( smvValue );
  };
  //For Cancel
  const handleCancel = () => {
    history.goBack();
  };
  //For Assign Target Submission
  const handleSave = async () => {
    const payload = {
      date: serverDate( assignDate ),
      floorId: floor?.value,
      zoneId: zone?.value,
      zoneGroupId: zone?.zoneGroupId,
      lineId: line?.value,
      ownerEmpCode: zone?.ownerEmpCode,
      ownerName: zoneOwner,
      machineCount,
      workingMinute,
      efficiency,
      standardMinuteValue: smv,
      targetValue: target,
      remark: remarks
    };
    stringifyConsole( payload );
    const isValidPayload = payload.floorId && payload.zoneId && payload.standardMinuteValue;
    if ( isValidPayload ) {
      dispatch( dataSubmitProgressCM( true ) );
      try {
        const res = await baseAxios.post( ASSIGN_TARGET_API.post, payload );
        notify( 'success', 'Target has been added' );
        dispatch( dataSubmitProgressCM( false ) );
        handleCancel();

      } catch ( error ) {
        errorResponse( error );
        dispatch( dataSubmitProgressCM( false ) );
      }
    } else {
      notify( 'warning', 'please provide all information!!!' );
    }
  };
  //#endregion
  //#region Breadcrumb
  const breadcrumb = [
    {
      id: 'home',
      name: 'Home',
      link: "/",
      isActive: false,
      hidden: false
    },

    {
      id: 'assign-target',
      name: 'Assign Target',
      link: "/assign-target",
      isActive: false,
      hidden: false
    },

    {
      id: 'assign-target-new',
      name: 'New Assign Target',
      link: "/assign-target-new",
      isActive: true,
      hidden: false
    }
  ];
  //#endregion
  return (
    <>


      <ActionMenu breadcrumb={breadcrumb} title="New Assign Target">
        <NavItem className="mr-1">
          <NavLink tag={Button} size="sm" color="primary" type="submit" onClick={handleSave}>
            Save
          </NavLink>
        </NavItem>
        <NavItem className="mr-1">
          <NavLink tag={Button} size="sm" color="secondary" onClick={handleCancel}>
            Cancel
          </NavLink>
        </NavItem>
      </ActionMenu>
      <UILoader
        blocking={iSubmitProgressCM}
        loader={<ComponentSpinner />}>
        <div className='general-form-container'>
          <FormLayout isNeedTopMargin={true}>
            <Row>
              <Col lg='12'>
                <FormContentLayout title="Master Information">
                  <Col lg='4' md='6' xl='4'>
                    <ErpDateInput
                      label="Assign Date"
                      id="assignDate"
                      type="date"
                      maxDate={new Date()}
                      value={assignDate} onChange={onAssignDateChange}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpSelect
                      label="Floor"
                      id="floor"
                      isSearchable
                      isClearable
                      theme={selectThemeColors}
                      options={floorDdl}
                      className="erp-dropdown-select"
                      classNamePrefix="dropdown"
                      value={floor}
                      onChange={data => onFloorChange( data )}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpSelect
                      label="Zone"
                      bsSize="sm"
                      // isClearable
                      isSearchable
                      id="zone"
                      theme={selectThemeColors}
                      options={zones}
                      className="erp-dropdown-select"
                      classNamePrefix="dropdown"
                      value={zone}
                      onChange={data => onChangeZone( data )}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpSelect
                      label="Line"
                      classNames='mt-1'
                      bsSize="sm"
                      id="line"
                      isSearchable
                      theme={selectThemeColors}
                      options={lines}
                      className="erp-dropdown-select"
                      classNamePrefix="dropdown"
                      value={line}
                      onChange={data => onLineChange( data )}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="Zone Owner"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={zoneOwner ? zoneOwner : ''}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="Machine No"
                      type="number"
                      name="machineCount"
                      id="machineCount"
                      bsSize="sm"
                      placeholder="Machine No"
                      value={machineCount}
                      onSelect={e => e.target.select()}
                      onChange={e => setMachineCount( Number( e.target.value ) )}
                      innerRef={register( { required: false } )}
                      invalid={errors.machineCount && true}
                      className={classNames( { 'is-invalid': errors['machineCount'] } )}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="Working Minute"
                      type="number"
                      name="workingMinute"
                      id="workingMinute"
                      bsSize="sm"
                      placeholder="Working Minute"
                      value={workingMinute}
                      onSelect={e => e.target.select()}
                      onChange={onChangeWorkingMinute}
                      innerRef={register( { required: false } )}
                      invalid={errors.workingMinute && true}
                      className={classNames( { 'is-invalid': errors['workingMinute'] } )}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="Efficiency"
                      type="number"
                      name="efficiency"
                      id="efficiency"
                      bsSize="sm"
                      placeholder="Efficiency"
                      value={efficiency}
                      onChange={onEfficiencyChange}
                      onSelect={e => e.target.select()}
                      innerRef={register( { required: false } )}
                      invalid={errors.efficiency && true}
                      className={classNames( { 'is-invalid': errors['efficiency'] } )}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="SMV"
                      type="number"
                      name="smv"
                      id="smv"
                      bsSize="sm"
                      placeholder="SMV"
                      value={smv}
                      onChange={onSMVChange}
                      onSelect={e => e.target.select()}
                      innerRef={register( { required: false } )}
                      invalid={errors.smv && true}
                      className={classNames( { 'is-invalid': errors['smv'] } )}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="Target"
                      disabled={true}
                      value={target}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="Remarks"
                      name="remarks"
                      id="remarks"
                      bsSize="sm"
                      innerRef={register( { required: true } )}
                      invalid={errors.remarks && true}
                      value={remarks}
                      onChange={e => setRemarks( e.target.value )}
                      className={classNames( { 'is-invalid': errors['remarks'] } )}
                    />
                  </Col>
                </FormContentLayout>
              </Col>
            </Row>
          </FormLayout>
        </div>

      </UILoader>

    </>
  );
};

export default AssingTargetAddForm;
