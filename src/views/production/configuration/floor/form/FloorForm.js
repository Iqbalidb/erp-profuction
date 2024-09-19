/*
   Title:
   Description:
   Author: Alamgir Kabir
   Date: 14-February-2022
   Modified: 14-February-2022
*/
import Sidebar from '@core/components/sidebar';
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import classNames from 'classnames';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import { addFloor, toggleFloorSidebar, updateFloor } from '../store/actions';

const FloorForm = props => {
  const { lastPageInfo } = props;
  //#region Hooks
  const dispatch = useDispatch();
  const { selectedFloor, isOpenSidebar } = useSelector( ( { floorReducer } ) => floorReducer );
  const { iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );

  const { register, errors, handleSubmit } = useForm();
  //#endregion

  //#region Events
  /**
   * For Submission
   */
  const onSubmit = values => {
    const { name, details, status } = values;
    const payload = {
      name,
      details,
      status
    };
    if ( selectedFloor ) {
      dispatch( updateFloor( { ...payload, id: selectedFloor.id }, lastPageInfo ) );
    } else {
      dispatch( addFloor( payload, lastPageInfo ) );
    }

  };

  //#endregion
  return (
    <Sidebar
      size="lg"
      open={isOpenSidebar}
      title={selectedFloor ? 'Edit Floor' : 'New Floor'}
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={() => dispatch( toggleFloorSidebar( !isOpenSidebar ) )}
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
            placeholder="Name"
            bsSize="sm"
            defaultValue={selectedFloor ? selectedFloor.name : ''}
            innerRef={register( { required: true } )}
            invalid={errors.name && true}
            className={classNames( { 'is-invalid': errors['name'] } )}
          />
          {/* {errors && errors.name && <FormFeedback>Name is Required</FormFeedback>} */}
        </FormGroup>
        <FormGroup>
          <Label for="details">Details</Label>
          <Input
            name="details"
            id="details"
            type="text"
            bsSize="sm"
            placeholder="Details"
            defaultValue={selectedFloor ? selectedFloor.details : ''}
            innerRef={register( { required: true } )}
            invalid={errors.details && true}
            className={classNames( { 'is-invalid': errors['details'] } )}
          />
          {/* {errors && errors.details && <FormFeedback>Details is Required</FormFeedback>} */}
        </FormGroup>
        <FormGroup>
          <Label for="status">
            <Input
              name="status"
              id="status"
              type="checkbox"
              style={{ marginLeft: '5px' }}
              defaultChecked={selectedFloor ? selectedFloor.status : true}
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
              hidden={selectedFloor?.id}
            >
              Reset
            </Button>

            <Button
              color='danger ml-1'
              outline size='sm'
              onClick={() => dispatch( toggleFloorSidebar() )}
            >
              Cancel
            </Button>
          </div>
        </div>
      </UILoader>
    </Sidebar>
  );
};

export default FloorForm;
