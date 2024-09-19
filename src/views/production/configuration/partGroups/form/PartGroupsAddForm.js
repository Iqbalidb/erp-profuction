/*
   Title: Part Group Add Form
   Description: Part Group Add Form
   Author: Alamgir Kabir
   Date: 02-July-2022
   Modified: 02-July-2022
*/
import Sidebar from '@core/components/sidebar';
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import classnames from 'classnames';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import { dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { PART_GROUPS_API } from 'services/api-end-points/production/v1';
import { errorResponse, isObjEmpty } from 'utility/Utils';
import { notify } from 'utility/custom/notifications';
import { fetchPartGroupByQuery, togglePartGroupSidebar } from '../store/action';
const PartGroupsAddForm = props => {
  const { open, lastPageInfo } = props;
  //#region Hooks
  const dispatch = useDispatch();
  const { isOpenSidebar } = useSelector( ( { partGroupReducer } ) => partGroupReducer );
  const { iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
  const { register, errors, handleSubmit } = useForm();
  //#endregion

  //#region Events
  //Submit method for data save
  const onSubmit = async values => {
    if ( isObjEmpty( errors ) ) {
      const payload = {
        name: values.name,
        status: values.status
      };
      dispatch( dataSubmitProgressCM( true ) );
      try {
        const res = await baseAxios.post( PART_GROUPS_API.add, payload );
        notify( 'success', "Fabric Type has been added" );
        dispatch( dataSubmitProgressCM( false ) );
        dispatch( togglePartGroupSidebar( !isOpenSidebar ) );
        dispatch( fetchPartGroupByQuery( lastPageInfo ) );
      } catch ( error ) {
        errorResponse( error );
        dispatch( dataSubmitProgressCM( false ) );
      }
    }
  };
  //#endregion
  return (
    <Sidebar
      size="lg"
      open={open}
      title="New Fabric Type"
      style={{ transition: '0.5s all ease' }}
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={() => dispatch( togglePartGroupSidebar( !isOpenSidebar ) )}
    >
      <UILoader
        blocking={iSubmitProgressCM}
        loader={<ComponentSpinner />}>
        <FormGroup>
          <Label for="name">Part Group</Label>
          <Input
            name="name"
            id="name"
            bsSize="sm"
            placeholder="Part Group Name"
            innerRef={register( { required: true } )}
            invalid={errors.name && true}
            className={classnames( { 'is-invalid': errors['name'] } )}
          />
          {/* {errors && errors.name && <FormFeedback>Part Group Name is Required!</FormFeedback>} */}
        </FormGroup>
        <FormGroup>
          <Label for="status">
            <Input style={{ marginLeft: '5px' }} name="status" type="checkbox" defaultChecked={true} innerRef={register( { required: false } )} />
            <span style={{ marginLeft: '25px' }}> Is Active </span>
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
            >
              Reset
            </Button>

            <Button
              color='danger ml-1'
              outline size='sm'
              onClick={() => dispatch( togglePartGroupSidebar() )}
            >
              Cancel
            </Button>
          </div>
        </div>
      </UILoader>
    </Sidebar>
  );
};

export default PartGroupsAddForm;
