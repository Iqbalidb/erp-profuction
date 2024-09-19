/*
   Title: Time Slot Form
   Description: Time Slot Form
   Author: Alamgir Kabir
   Date: 13-February-2022
   Modified: 15-February-2022
*/
import Sidebar from '@core/components/sidebar';
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import { isObjEmpty } from 'utility/Utils';
import CustomTimePicker from 'utility/custom/production/CustomTimePicker';
import { formattedTime, timeDiff } from 'utility/dateHelpers';
import { addTimeSlot, toggleTimeSlotSidebar, updateTimeSlot } from '../store/actions';
const TimeSlotForm = props => {
  const { lastPageInfo } = props;
  //#region Hooks
  const dispatch = useDispatch();
  const { isOpenSidebar, selectedTimeSlot } = useSelector( ( { timeSlotReducer } ) => timeSlotReducer );
  const { iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
  const { register, errors, handleSubmit } = useForm();
  //#endregion

  //#region  States
  const [fromTime, setFromTime] = useState( '' );
  const [toTime, setToTime] = useState( '' );
  const [duration, setDuration] = useState( 0 );
  //#endregion

  //#region Effects
  /**
   * For Time slot data selection in edit Modal
   */
  useEffect( () => {
    if ( selectedTimeSlot ) {
      setFromTime( selectedTimeSlot.fromTime );
      setToTime( selectedTimeSlot.toTime );
      setDuration( selectedTimeSlot.duration );
    }
  }, [selectedTimeSlot] );

  /**
  *For Time Duration Calculation
  */
  const timeDurationInMinute = useCallback( () => {
    const durationInMinute = timeDiff( toTime, fromTime );
    setDuration( durationInMinute );
  }, [fromTime, toTime] );

  useEffect( () => {
    timeDurationInMinute();
  }, [timeDurationInMinute] );
  //#endregion

  //#region Events

  /**
   * For Change From Time
   */
  const onFromTimeChange = times => {
    const time = times[0];
    const momentfromtime = formattedTime( time, 'HH:mm:ss' );
    setFromTime( momentfromtime );
  };

  /**
 * For Change To Time
 */
  const onToTimeChange = times => {
    const time = times[0];
    const momenttotime = formattedTime( time, 'HH:mm:ss' );
    setToTime( momenttotime );
  };

  /**
   * For Form Submission
   */
  const onSubmit = values => {
    if ( isObjEmpty( errors ) ) {
      const { name, status } = values;
      const payload = {
        name,
        fromTime,
        toTime,
        duration,
        status
      };
      if ( selectedTimeSlot ) {
        dispatch( updateTimeSlot( { ...payload, id: selectedTimeSlot.id }, lastPageInfo ) );
      } else {
        dispatch( addTimeSlot( payload, lastPageInfo ) );
      }
    }
  };
  //#endregion
  return (
    <Sidebar
      size="lg"
      open={isOpenSidebar}
      title={selectedTimeSlot ? 'Edit Time Slot' : 'New Time Slot'}
      style={{ transition: '0.5s all ease' }}
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={() => dispatch( toggleTimeSlotSidebar( !isOpenSidebar ) )}
    >
      <UILoader
        blocking={iSubmitProgressCM}
        loader={<ComponentSpinner />}>
        <FormGroup>
          <Label for="name">Name</Label>
          <Input
            name="name"
            id="name"
            type="text"
            bsSize="sm"
            placeholder="Name"
            defaultValue={selectedTimeSlot ? selectedTimeSlot.name : ''}
            innerRef={register( { required: true } )}
            invalid={errors.name && true}
          />
          {/* {errors && errors.name && <FormFeedback>Name is Required</FormFeedback>} */}
        </FormGroup>
        <FormGroup>
          <CustomTimePicker
            id="fromTime"
            name="fromTime"
            title="From Time"
            bsSize="sm"
            placeholder="From Time"
            value={fromTime}
            onChange={onFromTimeChange}
            innerRef={register( { required: true } )}
            invalid={errors.fromTime && true}
            className={classNames( { 'is-invalid': errors['fromTime'] } )}
          />
          {/* {errors && errors.fromTime && <FormFeedback>From Time is Required</FormFeedback>} */}
        </FormGroup>
        <FormGroup>
          <CustomTimePicker id="toTime" name="toTime" title="To Time" placeholder="To Time" value={toTime} onChange={onToTimeChange} />
        </FormGroup>
        <FormGroup>
          <Label for="duration">Duration</Label>
          <Input
            name="duration"
            id="duration"
            type="number"
            bsSize="sm"
            disabled
            placeholder="Duration"
            value={duration}
            innerRef={register( { required: true } )}
            invalid={errors.duration && true}
            className={classNames( { 'is-invalid': errors['duration'] } )}
          />
          {/* {errors && errors.duration && <FormFeedback>Duration is Required</FormFeedback>} */}
        </FormGroup>
        <FormGroup>
          <Label for="status">
            <Input
              name="status"
              id="status"
              type="checkbox"
              style={{ marginLeft: '5px' }}
              defaultChecked={selectedTimeSlot ? selectedTimeSlot.status : true}
              innerRef={register( { required: false } )}
            />
            <span style={{ marginLeft: '25px' }}>Is Active</span>
          </Label>
        </FormGroup>
        <div className='d-flex align-items-center justify-content-between mt-2'>
          <Button
            color='primary '
            size='sm'
            onClick={handleSubmit( onSubmit )}
          >
            Save
          </Button>

          <div className='d-flex '>
            <Button
              color='success '
              outline
              size='sm'
              // onClick={() => { handleReset(); }}
              hidden={selectedTimeSlot?.id}
            >
              Reset
            </Button>

            <Button
              color='danger ml-1'
              outline size='sm'
              onClick={() => dispatch( toggleTimeSlotSidebar() )}
            >
              Cancel
            </Button>
          </div>
        </div>
      </UILoader>
    </Sidebar>
  );
};

export default TimeSlotForm;

/**
 * 15-Feb-2022 (nasir): duration calculation modify
 **/
