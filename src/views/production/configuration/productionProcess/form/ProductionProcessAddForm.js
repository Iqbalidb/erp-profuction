/*
   Title: Process Form
   Description: Form page for Process
   Author: Iqbal Hossain
   Date: 21-November-2021
   Modified: 07-February-2021
*/

import Sidebar from '@core/components/sidebar';
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import classnames from 'classnames';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button, CustomInput, FormGroup, Input, Label } from 'reactstrap';
import { isObjEmpty, selectThemeColors } from 'utility/Utils';
import { notify } from 'utility/custom/notifications';
import { ProcessTypes } from 'utility/enums';
import { addProductionProcess, toggleProductionProcessSidebar } from '../store/actions';

const ProductionProcessAddForm = props => {
  const { open, lastPageInfo } = props;
  const dispatch = useDispatch();

  const { isOpenSidebar } = useSelector( ( { productionProcessReducer } ) => productionProcessReducer );
  const { iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
  const { register, errors, handleSubmit } = useForm();
  const [processType, setProcessType] = useState( null );

  //Submit method for data save
  const onSubmit = values => {
    if ( isObjEmpty( errors ) && processType !== null ) {
      const { name, shortCode, details, status } = values;
      const data = {
        name,
        shortCode,
        processType: processType.value,
        details,
        status
      };
      dispatch( addProductionProcess( data, lastPageInfo ) );
    } else {
      notify( 'success', 'Please provide all information' );
    }
  };

  return (
    <Sidebar
      size="lg"
      open={open}
      title="New Production Process"
      style={{ transition: '0.5s all ease' }}
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={() => dispatch( toggleProductionProcessSidebar( !isOpenSidebar ) )}
    >
      <UILoader
        blocking={iSubmitProgressCM}
        loader={<ComponentSpinner />}>
        <FormGroup>
          <Label for="name">Process Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            bsSize="sm"
            placeholder="Enter process name"
            innerRef={register( { required: true } )}
            invalid={errors.name && true}
          />
          {/* {errors && errors.name && <FormFeedback>Process Name is required</FormFeedback>} */}
        </FormGroup>

        <FormGroup>
          <Label for="shortCode">Short Code</Label>
          <Input
            id="shortCode"
            name="shortCode"
            type="text"
            bsSize="sm"
            placeholder="Enter short code"
            innerRef={register( { required: true } )}
            invalid={errors.shortCode && true}
          />
          {/* {errors && errors.shortCode && <FormFeedback>Short code is required!!</FormFeedback>} */}
        </FormGroup>

        <FormGroup>
          <Label for="processType">Process Type</Label>
          <Select
            id="processType"
            isSearchable
            isClearable
            theme={selectThemeColors}
            options={ProcessTypes}
            className="erp-dropdown-select"
            classNamePrefix="dropdown"
            innerRef={register( { required: true } )}
            value={processType}
            onChange={data => setProcessType( data )}
          />
          {/* {errors && errors.processType && <FormFeedback>Product type is Required!</FormFeedback>} */}
        </FormGroup>
        <FormGroup>
          <Label for="details">
            <span>Description</span>
          </Label>
          <Input
            name="details"
            id="details"
            bsSize="sm"
            placeholder="Description"
            innerRef={register( { required: false } )}
            invalid={errors.details && true}
            className={classnames( { 'is-invalid': errors['details'] } )}
          />
          {/* {errors && errors.description && <FormFeedback>Description is Required!</FormFeedback>} */}
        </FormGroup>

        <FormGroup>
          <CustomInput inline type="checkbox" id="status" name="status" label="Is Active" innerRef={register( { required: false } )} defaultChecked />
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
              onClick={() => dispatch( toggleProductionProcessSidebar() )}
            >
              Cancel
            </Button>
          </div>
        </div>
      </UILoader>
    </Sidebar>
  );
};

export default ProductionProcessAddForm;
