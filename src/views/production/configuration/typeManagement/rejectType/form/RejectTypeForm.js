/**
 * Title: RejectType Add Form
 * Description: RejectType Add Form
 * Author: Iqbal Hossain
 * Date: 05-January-2022
 * Modified: 10-February-2022
 */

import Sidebar from '@core/components/sidebar';
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import classnames from 'classnames';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import { baseAxios } from 'services';
import { PRODUCTION_PROCESS_API } from 'services/api-end-points/production/v1';
import { isObjEmpty, selectThemeColors } from 'utility/Utils';
import { notify } from 'utility/custom/notifications';
import { fillProductionProcessDdl } from 'views/production/configuration/productionProcess/store/actions';
import { addRejectType, toggleRejectTypeSidebar, updateRejectType } from '../store/actions';

const RejectTypeAddForm = props => {
  const { selectedItem, lastPageInfo } = props;
  //#region Hooks
  const dispatch = useDispatch();
  const { register, errors, handleSubmit } = useForm();
  const {
    productionProcessReducer: { dropDownItems },
    commonReducers: { iSubmitProgressCM },
    rejectTypeReducer: { isOpenSidebar }
  } = useSelector( state => state );
  //#endregion

  //#region State
  const [productionProcess, setProductionProcess] = useState( null );
  const [loading, setLoading] = useState( false );
  //#endregion

  //#region Effects
  useEffect( () => {
    if ( !dropDownItems.length ) {
      dispatch( fillProductionProcessDdl() );
    }
  }, [dispatch, dropDownItems.length] );

  useEffect( () => {
    if ( selectedItem && dropDownItems.length ) {
      const selectedProductionProcess = dropDownItems.find( item => item.value === selectedItem.productionProcessId );
      setProductionProcess( selectedProductionProcess );
    }
  }, [dropDownItems, selectedItem] );
  //#endregion

  //#region UDF's
  const onCreateProductionProcess = async newItem => {
    setLoading( true );
    try {
      const res = await baseAxios.post( PRODUCTION_PROCESS_API.add, { name: newItem, status: true } );
      setProductionProcess( { label: newItem, value: res.data.data } );
      dispatch( fillProductionProcessDdl() );
      setLoading( false );
    } catch ( err ) {
      notify( 'error', 'Something went wrong!!! Please try again' );
    }
  };
  //#endregion

  //#region  Events
  //Submit method for data save
  const onSubmit = values => {
    if ( isObjEmpty( errors ) && productionProcess !== null ) {
      const { name, status } = values;
      const data = {
        name,
        productionProcessId: productionProcess.value,
        status
      };
      if ( selectedItem ) {
        dispatch( updateRejectType( selectedItem.id, data, lastPageInfo ) );
      } else {
        dispatch( addRejectType( data, lastPageInfo ) );
      }
    }
  };

  //#endregion
  return (
    <Sidebar
      size="lg"
      open={isOpenSidebar}
      title={selectedItem ? 'Edit Reject Type Form' : 'Reject Type Form'}
      style={{ transition: '0.5s all ease' }}
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={() => dispatch( toggleRejectTypeSidebar( !isOpenSidebar ) )}
    >
      <UILoader
        blocking={iSubmitProgressCM}
        loader={<ComponentSpinner />}>
        <FormGroup>
          <Label for="name">
            <span>Reject Type Name</span>
          </Label>
          <Input
            name="name"
            id="name"
            bsSize="sm"
            placeholder="Reject Type"
            innerRef={register( { required: true } )}
            defaultValue={selectedItem ? selectedItem.name : ''}
            invalid={errors.name && true}
            className={classnames( { 'is-invalid': errors['name'] } )}
          />
          {/* {errors && errors.name && <FormFeedback>Reject Type is Required!</FormFeedback>} */}
        </FormGroup>
        <FormGroup>
          <Label for="productionProcess">Production Process</Label>
          <Select
            id="productionProcess"
            isSearchable
            isClearable
            isLoading={loading}
            theme={selectThemeColors}
            options={dropDownItems}
            className="erp-dropdown-select"
            classNamePrefix="dropdown"
            innerRef={register( { required: true } )}
            value={productionProcess}
            onChange={data => {
              setProductionProcess( data );
            }}
            onCreateOption={onCreateProductionProcess}
          />
        </FormGroup>
        <FormGroup>
          <Label for="status">
            <Input
              style={{ marginLeft: '5px' }}
              id="status"
              name="status"
              type="checkbox"
              defaultChecked={selectedItem ? selectedItem.status : true}
              innerRef={register( { required: false } )}
            />
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
              onClick={() => dispatch( toggleRejectTypeSidebar() )}
            >
              Cancel
            </Button>
          </div>
        </div>
      </UILoader>
    </Sidebar>
  );
};

export default RejectTypeAddForm;

/** Change Log
 *  10-January-2022(Iqbal): Create Reject Type Add Form
 *  10-February-2022(Iqbal): Post Data with API Integration
 */
