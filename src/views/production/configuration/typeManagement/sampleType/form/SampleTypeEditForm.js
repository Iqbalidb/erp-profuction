/**
 * Title: SampleType Edit Form
 * Description: SampleType Edit Form
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
import { toggleSampleTypeSidebar, toggleSampleTypeStatus, updateSampleType } from '../store/actions';

const SampleTypeEditForm = props => {
  const { open, data, lastPageInfo } = props;
  const dispatch = useDispatch();

  //Reducer for Sidebar
  const { isOpenSidebar } = useSelector( ( { sampleTypeReducer } ) => sampleTypeReducer );

  const { register, errors, handleSubmit } = useForm();

  const onSubmit = values => {
    if ( isObjEmpty( errors ) ) {
      dispatch( toggleSampleTypeSidebar( !isOpenSidebar ) );
      dispatch(
        updateSampleType(
          {
            id: data.id,
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
      title="Edit Sample Type"
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
            placeholder=" Sample Type"
            defaultValue={data.sampleTypeName}
            innerRef={register( { required: true } )}
            invalid={errors.sampleTypeName && true}
            className={classnames( { 'is-invalid': errors['sampleTypeName'] } )}
          />
          {errors && errors.sampleTypeName && <FormFeedback>Sample Type is Required!</FormFeedback>}
        </FormGroup>
        <FormGroup>
          <Label for="description">
            <span>Description</span>
          </Label>
          <Input
            name="description"
            id="description"
            placeholder="Description"
            defaultValue={data.description}
            innerRef={register( { required: true } )}
            invalid={errors.description && true}
            className={classnames( { 'is-invalid': errors['description'] } )}
          />
          {errors && errors.description && <FormFeedback>Description is Required!</FormFeedback>}
        </FormGroup>
        <FormGroup>
          <Label for="description">
            <Input
              style={{ marginLeft: '5px' }}
              name="status"
              type="checkbox"
              innerRef={register( { required: false } )}
              checked={data.status === 'active'}
              onChange={e => dispatch( toggleSampleTypeStatus( e.target.checked ? 'active' : 'inactive' ) )}
            />
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

export default SampleTypeEditForm;
