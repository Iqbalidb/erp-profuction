/**
 * Title: Product Part add form
 * shortCode: Product Part add form
 * Author: Nasir Ahmed
 * Date: 10-January-2022
 * Modified: 10-January-2022
 **/

import Sidebar from '@core/components/sidebar';
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import classnames from 'classnames';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import { isObjEmpty } from 'utility/Utils';
import { addProductPart, toggleProductPartSidebar } from '../store/actions';

const ProductPartAddForm = props => {
  const { open, lastPageInfo } = props;
  //#region Hooks
  const dispatch = useDispatch();
  const { isOpenSidebar } = useSelector( ( { productPartReducer } ) => productPartReducer );
  const { iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );

  const { register, errors, handleSubmit } = useForm();
  //#endregion
  //#region Events
  //Submit method for data save
  const onSubmit = values => {
    if ( isObjEmpty( errors ) ) {
      dispatch(
        addProductPart(
          {
            name: values.name,
            shortCode: values.shortCode,
            status: values.status
          },
          lastPageInfo
        )
      );
    }
  };
  //#endregion
  return (
    <Sidebar
      size="lg"
      open={open}
      title="New Product Parts"
      style={{ transition: '0.5s all ease' }}
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={() => dispatch( toggleProductPartSidebar( !isOpenSidebar ) )}
    >
      <UILoader
        blocking={iSubmitProgressCM}
        loader={<ComponentSpinner />}>
        <FormGroup>
          <Label for="name">Product Part Name</Label>
          <Input
            name="name"
            id="name"
            bsSize="sm"
            placeholder="Product Parts Name"
            innerRef={register( { required: true } )}
            invalid={errors.name && true}
            className={classnames( { 'is-invalid': errors['name'] } )}
          />
          {/* {errors && errors.name && <FormFeedback>Product Parts is Required!</FormFeedback>} */}
        </FormGroup>
        <FormGroup>
          <Label for="shortCode">Short Code</Label>
          <Input
            name="shortCode"
            id="shortCode"
            bsSize="sm"
            placeholder="Short Code"
            innerRef={register( { required: true } )}
            invalid={errors.shortCode && true}
            className={classnames( { 'is-invalid': errors['shortCode'] } )}
          />
          {/* {errors && errors.shortCode && <FormFeedback>Short Code is Required!</FormFeedback>} */}
        </FormGroup>
        <FormGroup>
          <Label for="status">
            <Input style={{ marginLeft: '5px' }} name="status" type="checkbox" innerRef={register( { required: false } )} />
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
              onClick={() => dispatch( toggleProductPartSidebar( !isOpenSidebar ) )}
            >
              Cancel
            </Button>
          </div>
        </div>
      </UILoader>
    </Sidebar>
  );
};

export default ProductPartAddForm;
