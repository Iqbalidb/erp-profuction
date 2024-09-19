/*
     Title: Operator Add form
     Description: Operator Add form
     Author: Alamgir Kabir
     Date: 12-December-2022
     Modified: 12-December-2022
*/
import Sidebar from '@core/components/sidebar';
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import { dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { OPERATOR_API } from 'services/api-end-points/production/v1/operator';
import { errorResponse } from 'utility/Utils';
import { stringifyConsole } from 'utility/commonHelper';
import { notify } from 'utility/custom/notifications';
import CustomDatePicker from 'utility/custom/production/CustomDatePicker';
import { serverDate } from 'utility/dateHelpers';
import { bloodGroupList } from 'utility/enums';
import { fetchAllOperator, resetOperatorState, toggleOperatorSidebar } from '../store/actions';
const OperatorAddForm = ( { lastPageInfo } ) => {
  //#region Hooks
  const dispatch = useDispatch();
  const { isOpenSidebar, selectedItem } = useSelector( ( { OperatorReducer } ) => OperatorReducer );
  const { iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
  const { operatorInfo } = useSelector( ( { operatorsReducer } ) => operatorsReducer );

  //#endregion

  //#region State
  const { errors, register, handleSubmit, reset } = useForm();
  const [joiningDate, setJoiningDate] = useState( new Date() );
  const [bloodGroupName, setBloodGroupName] = useState( null );
  const [genderName, setGenderName] = useState( '' );
  const [isActive, setIsActive] = useState( true );
  //#endregion

  //#region Effects
  /**
   * For Selected Operator In Edit Mode
   */
  useEffect( () => {
    if ( selectedItem ) {
      const selectedBloodGroup = bloodGroupList.find( bg => bg.label === selectedItem.bloodGroup );
      setBloodGroupName( selectedBloodGroup );
      setJoiningDate( selectedItem.joiningDate );
      setGenderName( selectedItem.gender );
      setIsActive( selectedItem.status );
    }
  }, [selectedItem] );

  /**
   * For Joining Date Change
   */
  const handleChangeJoiningDate = date => {
    setJoiningDate( date[0] );
  };

  /**
   * For Blood Group Change
   */
  const handleChangeBloodGroup = data => {
    setBloodGroupName( data );
  };

  /**
 * For Gender Group Change
 */
  const handleChangeGender = e => {
    const { value } = e.target;
    setGenderName( value );
  };

  /**
 * For Back To Previous Route
 */
  const handleCancel = () => {
    dispatch( toggleOperatorSidebar() );
    dispatch( resetOperatorState() );
  };

  /**
 * For Form Submission
 */
  const onSubmit = async values => {
    const { name, empCode, phoneNo, email, nid, address } = values;
    const payload = {
      name,
      employeeCode: empCode,
      phoneNumber: phoneNo,
      gender: genderName,
      bloodGroup: bloodGroupName.label,
      nationalID: nid,
      email,
      address,
      joiningDate: serverDate( joiningDate ),
      status: isActive
    };
    stringifyConsole( payload );
    if ( payload.name !== '' && payload.employeeCode !== '' && payload.phoneNumber !== '' ) {
      /**
       * Edit
       */
      if ( selectedItem ) {
        dispatch( dataSubmitProgressCM( true ) );
        try {
          const res = await baseAxios.put( OPERATOR_API.update, payload, { params: { id: selectedItem.id } } );
          if ( res.status === 200 ) {
            notify( 'success', 'Operator has been updated Successfully!!!' );
            dispatch( dataSubmitProgressCM( false ) );
            handleCancel();
            dispatch( fetchAllOperator(
              lastPageInfo
            ) );
          }
        } catch ( error ) {
          errorResponse( error );
          dispatch( dataSubmitProgressCM( false ) );
        }

      } else {
        /**
         * Add
         */
        dispatch( dataSubmitProgressCM( true ) );
        try {
          const res = await baseAxios.post( OPERATOR_API.add, payload );
          if ( res.data.succeeded ) {
            notify( 'success', 'Operator has been added' );
            dispatch( dataSubmitProgressCM( false ) );
            handleCancel();
            dispatch( fetchAllOperator( lastPageInfo ) );
          }
        } catch ( error ) {
          errorResponse( error );
          dispatch( dataSubmitProgressCM( false ) );
        }

      }
    } else {
      notify( 'warning', 'Please provide all information!!!' );
    }
  };

  const handleReset = () => {
    reset();
  };
  //#endregion
  return (
    <Sidebar
      open={isOpenSidebar}
      title={selectedItem ? 'Edit Operator' : 'New Operator'}
      size="lg"
      style={{ transition: '0.5s all ease' }}
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={handleCancel}
    >
      <UILoader
        blocking={iSubmitProgressCM}
        loader={<ComponentSpinner />}>

        <FormGroup>
          <Label for="name">Operator Name</Label>
          <Input
            name="name"
            id="name"
            bsSize="sm"
            defaultValue={selectedItem ? selectedItem.name : ''}
            placeholder="Operator Name"
            innerRef={register( { required: true } )}
            invalid={errors.name && true}
            className={classNames( { 'is-invalid': errors['name'] } )}
          />
          {/* {errors && errors.name && <FormFeedback>Operator Name is Required!</FormFeedback>} */}
        </FormGroup>
        <FormGroup>
          <Label for="empCode">Employee Code</Label>
          <Input
            name="empCode"
            id="empCode"
            bsSize="sm"
            placeholder="Employee Code"
            defaultValue={selectedItem ? selectedItem.employeeCode : ''}
            innerRef={register( { required: true } )}
            invalid={errors.empCode && true}
            className={classNames( { 'is-invalid': errors['empCode'] } )}
          />
          {/* {errors && errors.empCode && <FormFeedback>Employee Code is Required!</FormFeedback>} */}
        </FormGroup>
        <FormGroup>
          <Label for="phoneNo">Phone No</Label>
          <Input
            name="phoneNo"
            id="phoneNo"
            placeholder="Phone No"
            bsSize="sm"
            defaultValue={selectedItem ? selectedItem.phoneNumber : ''}
            innerRef={register( { required: true } )}
            invalid={errors.phoneNo && true}
            className={classNames( { 'is-invalid': errors['phoneNo'] } )}
          />
          {/* {errors && errors.phoneNo && <FormFeedback>Phone No is Required!</FormFeedback>} */}
        </FormGroup>
        <FormGroup>
          <Label for="gender">Gender</Label>
          <div className="demo-inline-spacing" style={{ marginBottom: '0px', marginTop: '0px' }}>
            <div className="form-check" style={{ marginBottom: '0px', marginTop: '0px' }}>
              <Input type="radio" name="gender" id="male" value="Male" checked={genderName === 'Male'} onChange={handleChangeGender} />
              <Label className="form-check-label" style={{ marginTop: '0.3rem' }} for="male">
                Male
              </Label>
            </div>
            <div className="form-check" style={{ marginBottom: '0px', marginTop: '0px' }}>
              <Input type="radio" name="gender" id="female" value="Female" checked={genderName === 'Female'} onChange={handleChangeGender} />
              <Label className="form-check-label" style={{ marginTop: '0.3rem' }} for="female">
                Female
              </Label>
            </div>
            <div className="form-check" style={{ marginBottom: '0px', marginTop: '0px' }}>
              <Input type="radio" name="gender" id="others" value="Others" checked={genderName === 'Others'} onChange={handleChangeGender} />
              <Label className="form-check-label" style={{ marginTop: '0.3rem' }} for="others">
                Others
              </Label>
            </div>
          </div>
        </FormGroup>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="Email "
            bsSize="sm"
            defaultValue={selectedItem ? selectedItem.email : ''}
            innerRef={register( { required: true } )}
            invalid={errors.email && true}
            className={classNames( { 'is-invalid': errors['email'] } )}
          />
          {/* {errors && errors.email && <FormFeedback>Email is Required!</FormFeedback>} */}
        </FormGroup>
        <FormGroup>
          <CustomDatePicker name="date" title="Joining Date" value={joiningDate} onChange={date => handleChangeJoiningDate( date )} />
        </FormGroup>
        <FormGroup>
          <Label for="bloodGroup">Blood Group</Label>
          <Select name="bloodGroup" id="bloodGroup" className="erp-dropdown-select"
            classNamePrefix="dropdown" options={bloodGroupList} value={bloodGroupName} onChange={handleChangeBloodGroup} />
          {/* {errors && errors.bloodGroup && <FormFeedback>Blood Group is Required!</FormFeedback>} */}
        </FormGroup>
        <FormGroup>
          <Label for="nid">NID</Label>
          <Input
            type="number"
            name="nid"
            id="nid"
            placeholder="NID"
            bsSize="sm"
            defaultValue={selectedItem ? selectedItem.nationalID : ''}
            innerRef={register( { required: true } )}
            invalid={errors.nid && true}
            className={classNames( { 'is-invalid': errors['nid'] } )}
          />
          {/* {errors && errors.nid && <FormFeedback>NID is Required!</FormFeedback>} */}
        </FormGroup>
        <FormGroup>
          <Label for="address">Address</Label>
          <Input
            type="textarea"
            name="address"
            id="address"
            placeholder="Address"
            bsSize="sm"
            defaultValue={selectedItem ? selectedItem.address : ''}
            innerRef={register( { required: true } )}
            invalid={errors.address && true}
            className={classNames( { 'is-invalid': errors['address'] } )}
          />
          {/* {errors && errors.address && <FormFeedback>Address is Required!</FormFeedback>} */}
        </FormGroup>
        {selectedItem && (
          <FormGroup>
            <Label for="isActive">
              <Input
                style={{ marginLeft: '5px' }}
                name="isActive"
                type="checkbox"
                id="isActive"
                innerRef={register( { required: false } )}
                checked={isActive}
                onChange={e => setIsActive( e.target.checked )}
              />
              <span style={{ marginLeft: '25px' }}> Is Active </span>
            </Label>
          </FormGroup>
        )}
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
            >
              Reset
            </Button>

            <Button
              color='danger ml-1'
              outline size='sm'
              onClick={() => handleCancel()}
            >
              Cancel
            </Button>
          </div>
        </div>
      </UILoader>
    </Sidebar>
  );
};

export default OperatorAddForm;
