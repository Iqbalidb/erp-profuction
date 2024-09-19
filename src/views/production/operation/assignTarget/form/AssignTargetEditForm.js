/*
   Title: Assign Target Edit Form
   Description: Assign Target Edit Form
   Author: Alamgir Kabir
   Date: 18-October-2022
   Modified: 18-October-2022
*/
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import classNames from 'classnames';
import ActionMenu from 'layouts/components/menu/action-menu';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Col, NavItem, NavLink, Row } from 'reactstrap';
import { dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { ASSIGN_TARGET_API } from 'services/api-end-points/production/v1';
import { errorResponse } from 'utility/Utils';
import { stringifyConsole } from 'utility/commonHelper';
import FormContentLayout from 'utility/custom/FormContentLayout';
import FormLayout from 'utility/custom/FormLayout';
import { ErpInput } from 'utility/custom/customController/ErpInput';
import { notify } from 'utility/custom/notifications';
import { formattedDate } from 'utility/dateHelpers';
import '../../../../../assets/scss/production/form-page-custom-table.scss';
import '../../../../../assets/scss/production/general.scss';
import { fetchAssignTargetById } from '../store/actions';
const AssingTargetEditForm = () => {
  //#region Hooks
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const {
    assignTargetReducer: { selectedItem },
    commonReducers: { iSubmitProgressCM, isDataProgressCM },
  } = useSelector( state => state );
  const selectedRow = location.state;
  const [assignTargetEditValue, setAssignTargetEditValue] = useState( null );
  const { register, errors } = useForm();
  //#endregion

  //#region Effects
  useEffect( () => {
    if ( selectedRow ) {
      dispatch( fetchAssignTargetById( selectedRow.id ) );
    }
  }, [dispatch, selectedRow] );

  useEffect( () => {
    if ( selectedItem ) {
      setAssignTargetEditValue( selectedItem );
    }
  }, [dispatch, selectedItem] );
  //#endregion

  //#region Events
  /**
   * For Change Working Minute
   */
  const onWorkingminuteChange = e => {
    const workingMinute = Number( e.target.value );
    const _assigntargetEditValue = { ...assignTargetEditValue };
    const _efficiency = _assigntargetEditValue.efficiency;
    const _smv = _assigntargetEditValue.standardMinuteValue;
    let targetValue = Math.round( ( workingMinute * _efficiency ) / _smv );
    if ( _.isNaN( targetValue ) ) {
      targetValue = 0;
    }
    if ( !_.isFinite( targetValue ) ) {
      targetValue = 0;
    }
    setAssignTargetEditValue( { ...assignTargetEditValue, workingMinute, targetValue } );
  };
  /**
 * For Change Efficiency
 */
  const onEfficiencyChange = e => {
    const efficiency = Number( e.target.value );
    const _assigntargetEditValue = { ...assignTargetEditValue };
    const _workingMinute = _assigntargetEditValue.workingMinute;
    const _smv = _assigntargetEditValue.standardMinuteValue;
    let targetValue = Math.round( ( _workingMinute * efficiency ) / _smv );
    if ( !_.isFinite( targetValue ) ) {
      targetValue = 0;
    }
    setAssignTargetEditValue( { ...assignTargetEditValue, efficiency, targetValue } );
  };
  /**
 * For Change SMV
 */
  const onSMVChange = e => {
    const smvValue = Number( e.target.value );
    const _assigntargetEditValue = { ...assignTargetEditValue };
    const _workingMinute = _assigntargetEditValue.workingMinute;
    const _efficiency = _assigntargetEditValue.efficiency;
    let targetValue = Math.round( ( _workingMinute * _efficiency ) / smvValue );
    if ( !_.isFinite( targetValue ) ) {
      targetValue = 0;
    }
    setAssignTargetEditValue( { ...assignTargetEditValue, standardMinuteValue: smvValue, targetValue } );
  };
  /**
   * For Cancel Route
   */
  const handleCancel = () => {
    history.goBack();
  };
  /**
   * For Form Submission
   */
  const handleSave = async () => {
    const payload = {
      date: assignTargetEditValue.date,
      floorId: assignTargetEditValue.floorId,
      zoneId: assignTargetEditValue.zoneId,
      zoneGroupId: assignTargetEditValue.zoneGroupId,
      lineId: assignTargetEditValue.lineId,
      ownerEmpCode: assignTargetEditValue.ownerEmpCode,
      ownerName: assignTargetEditValue.ownerName,
      machineCount: assignTargetEditValue.machineCount,
      workingMinute: assignTargetEditValue.workingMinute,
      efficiency: assignTargetEditValue.efficiency,
      standardMinuteValue: assignTargetEditValue.standardMinuteValue,
      targetValue: assignTargetEditValue.targetValue,
      remark: assignTargetEditValue.remark
    };
    stringifyConsole( payload );
    const isValidPayload = payload.machineCount && payload.workingMinute && payload.standardMinuteValue && payload.targetValue;
    if ( isValidPayload ) {
      dispatch( dataSubmitProgressCM( true ) );

      try {
        const res = await baseAxios.put( ASSIGN_TARGET_API.put( selectedRow.id ), payload );
        notify( 'success', 'Target has been  updated Successfully' );
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
      id: 'assign-target-edit',
      name: 'Edit Assign Target',
      link: "/assign-target-edit",
      isActive: true,
      hidden: false
    }
  ];
  //#endregion

  return (
    <>

      <UILoader
        blocking={iSubmitProgressCM || isDataProgressCM}
        loader={<ComponentSpinner />}>
        <ActionMenu breadcrumb={breadcrumb} title="Edit Assign Target">
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
        <div className='general-form-container'>
          <FormLayout isNeedTopMargin={true}>
            <Row >
              <Col lg='12'>
                <FormContentLayout title="Master Information">
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="Assign Date"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={assignTargetEditValue && formattedDate( assignTargetEditValue.date )}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="Floor"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={assignTargetEditValue && assignTargetEditValue.floorName}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="Zone"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={assignTargetEditValue && assignTargetEditValue.zoneName}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="Line"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={assignTargetEditValue && assignTargetEditValue.lineName}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="Zone Owner"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={assignTargetEditValue && assignTargetEditValue.ownerName}
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
                      defaultValue={assignTargetEditValue && assignTargetEditValue.machineCount}
                      onSelect={e => e.target.select()}
                      onChange={e => setAssignTargetEditValue( { ...assignTargetEditValue, machineCount: Number( e.target.value ) } )}
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
                      defaultValue={assignTargetEditValue && assignTargetEditValue.workingMinute}
                      onSelect={e => e.target.select()}
                      onChange={onWorkingminuteChange}
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
                      bsSize="sm"
                      id="efficiency"
                      placeholder="Efficiency"
                      defaultValue={assignTargetEditValue && assignTargetEditValue.efficiency}
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
                      placeholder="SMV"
                      bsSize="sm"
                      defaultValue={assignTargetEditValue && assignTargetEditValue.standardMinuteValue}
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
                      bsSize="sm"
                      defaultValue={assignTargetEditValue && assignTargetEditValue.targetValue}
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
                      defaultValue={assignTargetEditValue && assignTargetEditValue.remark}
                      onChange={e => setAssignTargetEditValue( { ...assignTargetEditValue, remark: e.target.value } )}
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

export default AssingTargetEditForm;
