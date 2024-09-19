/**
 * Title: SampleType Add Form
 * Description: SampleType Add Form
 * Author: Iqbal Hossain
 * Date: 05-January-2022
 * Modified: 09-January-2022
 */

import Sidebar from '@core/components/sidebar';
import classnames from 'classnames';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import FormFeedback from 'reactstrap/lib/FormFeedback';
import { isObjEmpty } from 'utility/Utils';
import { addSampleType, toggleSampleTypeSidebar } from '../store/actions';

const SampleTypeAddForm = props => {
  const { open, lastPageInfo } = props;
  const dispatch = useDispatch();

  //Reducer for Sidebar
  const { isOpenSidebar } = useSelector( ( { sampleTypeReducer } ) => sampleTypeReducer );

  const { register, errors, handleSubmit } = useForm();

  //Submit method for data save
  const onSubmit = values => {
    if ( isObjEmpty( errors ) ) {
      dispatch( toggleSampleTypeSidebar( !isOpenSidebar ) );
      dispatch(
        addSampleType(
          {
            sampleTypeName: values.sampleTypeName,
            description: values.description,
            status: values.status ? 'active' : 'inactive'
          },
          lastPageInfo
        )
      );
    }
  };

  return (
    <Sidebar
      size="lg"
      open={open}
      title="New Sample Type"
      style={{ transition: '0.5s all ease' }}
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={() => dispatch( toggleSampleTypeSidebar( !isOpenSidebar ) )}
    >
      <Form onSubmit={handleSubmit( onSubmit )}>
        <FormGroup>
          <Label for="sampleTypeName">
            <span>Sample Type</span>
          </Label>
          <Input
            name="sampleTypeName"
            id="sampleTypeName"
            placeholder="Sample Type"
            innerRef={register( { required: true } )}
            invalid={errors.sampleTypeName && true}
            className={classnames( { 'is-invalid': errors['sampleTypeName'] } )}
          />
          {errors && errors.sampleTypeName && <FormFeedback>Sample Type is Required!</FormFeedback>}
        </FormGroup>
        <FormGroup>
          <Label for="description">
            Description <span></span>
          </Label>
          <Input
            name="description"
            id="description"
            placeholder="Description"
            innerRef={register( { required: true } )}
            invalid={errors.description && true}
            className={classnames( { 'is-invalid': errors['description'] } )}
          />
          {errors && errors.description && <FormFeedback>Description is Required!</FormFeedback>}
        </FormGroup>
        <FormGroup>
          <Label for="status">
            <Input style={{ marginLeft: '5px' }} name="status" type="checkbox" innerRef={register( { required: false } )} />
            <span style={{ marginLeft: '25px' }}> Is Active </span>
          </Label>
        </FormGroup>

        <Button type="submit" className="mr-1" color="primary">
          Submit
        </Button>
        <Button type="reset" className="mr-1" outline color="secondary">
          Reset
        </Button>
        <Button type="cancel" color="danger" outline onClick={() => dispatch( toggleSampleTypeSidebar( !isOpenSidebar ) )}>
          Cancel
        </Button>
      </Form>
    </Sidebar>
  );
};

export default SampleTypeAddForm;
