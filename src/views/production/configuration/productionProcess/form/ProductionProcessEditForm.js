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
import { toggleProductionProcessSidebar, updateProductionProcess } from '../store/actions';

const ProductionProcessEditForm = props => {
  const { open, data, lastPageInfo } = props;

  const dispatch = useDispatch();
  const { isOpenSidebar } = useSelector( ( { productionProcessReducer } ) => productionProcessReducer );
  const { iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );

  const [processType, setProcessType] = useState( data.processType );

  const { register, errors, handleSubmit } = useForm();

  const onSubmit = values => {
    if ( isObjEmpty( errors ) ) {
      const { name, shortCode, details, status } = values;

      const payload = {
        id: data.id,
        name,
        shortCode,
        processType: processType.value,
        details,
        status
      };
      dispatch( updateProductionProcess( payload, lastPageInfo ) );
    } else {
      notify( 'success', 'Please provide all information' );
    }
  };

  return (
    <Sidebar
      size="lg"
      open={open}
      title="Edit Production Process"
      style={{ transition: '0.5s all ease' }}
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={() => dispatch( toggleProductionProcessSidebar( !isOpenSidebar ) )}
    >
      <UILoader
        blocking={iSubmitProgressCM}
        loader={<ComponentSpinner />}>
        <FormGroup>
          <Label for="name">
            <span>Production Process Name</span>
          </Label>
          <Input
            name="name"
            id="name"
            bsSize="sm"
            placeholder="Production Process"
            defaultValue={data.name}
            innerRef={register( { required: true } )}
            invalid={errors.name && true}
            className={classnames( { 'is-invalid': errors['name'] } )}
          />
          {/* {errors && errors.name && <FormFeedback>Production Process is Required!</FormFeedback>} */}
        </FormGroup>

        <FormGroup>
          <Label for="shortCode">Short Code</Label>
          <Input
            id="shortCode"
            name="shortCode"
            type="text"
            bsSize="sm"
            placeholder="Enter short code"
            defaultValue={data.shortCode}
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
            defaultValue={data.details}
            innerRef={register( { required: false } )}
            invalid={errors.details && true}
            className={classnames( { 'is-invalid': errors['details'] } )}
          />
          {/* {errors && errors.description && <FormFeedback>Description is Required!</FormFeedback>} */}
        </FormGroup>

        <FormGroup>
          <CustomInput
            inline
            type="checkbox"
            id="status"
            name="status"
            label="Is Active"
            defaultChecked={data.status}
            innerRef={register( { required: false } )}
          />
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

export default ProductionProcessEditForm;
