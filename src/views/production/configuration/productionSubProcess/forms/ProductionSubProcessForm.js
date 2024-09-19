/**
 * Title: Production Process Form
 * Description: Production Process Form
 * Author: Nasir Ahmed
 * Date: 08-February-2022
 * Modified: 08-February-2022
 **/

import Sidebar from '@core/components/sidebar';
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import CreateableSelect from 'react-select/creatable';
import { Button, CustomInput, Form, FormGroup, Input, Label } from 'reactstrap';
import { baseAxios } from 'services';
import { PRODUCTION_PROCESS_API } from 'services/api-end-points/production/v1';
import { isObjEmpty, selectThemeColors } from 'utility/Utils';
import { stringifyConsole } from 'utility/commonHelper';
import { notify } from 'utility/custom/notifications';
import { ProcessTypes } from 'utility/enums';
import { fillProductionProcessDdl } from '../../productionProcess/store/actions';
import { addProductionSubProcess, toggleProductionSubProcessSidebar, updateProductionSubProcess } from '../store/actions';

const ProductionSubProcessForm = props => {
  const { lastPageInfo, selectedItem } = props;
  //#region Hooks
  const dispatch = useDispatch();
  const { register, errors, handleSubmit } = useForm();
  const {
    productionProcessReducer: { dropDownItems },
    commonReducers: { iSubmitProgressCM },
    productionSubProcessReducer: { isOpenSidebar }
  } = useSelector( store => store );
  //#endregion
  //#region States
  const [processType, setProcessType] = useState( null );
  const [productionProcess, setProductionProcess] = useState( null );
  const [loading, setLoading] = useState( false );
  const [checkBoxValue, setCheckBoxValue] = useState( {
    status: true,
    isOutSourced: false,
    isSewing: false
  } );
  //#endregion

  //#region Effects
  useEffect( () => {
    if ( !dropDownItems.length ) {
      dispatch( fillProductionProcessDdl() );
    }
  }, [dispatch, dropDownItems.length] );

  useEffect( () => {
    if ( selectedItem && dropDownItems.length ) {
      const selectedProductionProcess = dropDownItems.find( item => item.value === selectedItem.parentProcessId );
      setProductionProcess( selectedProductionProcess );
      setProcessType( selectedItem.processType );
    }
  }, [dropDownItems, selectedItem] );

  //#endregion

  //#region Events
  /**
   * For Change Production Process
   */
  const onProductionProcessChange = item => {
    setProductionProcess( item );
  };
  /**
   * For Change Status
   */
  const onCheckboxStatusChange = e => {
    const { name, checked } = e.target;
    setCheckBoxValue( {
      ...checkBoxValue,
      [name]: checked
    } );
  };
  /**
 * For Instant Create Production Process
 */
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
  /**
 * For Submission
 */
  const onSubmit = values => {
    if ( isObjEmpty( errors ) && productionProcess !== null && processType !== null ) {
      const { name, shortCode, details } = values;
      const data = {
        parentProcessId: productionProcess?.value,
        name,
        shortCode,
        processType: processType?.value,
        details,
        status: checkBoxValue.status,
        isOutSourced: checkBoxValue.isOutSourced,
        isSewing: checkBoxValue.isSewing
      };
      stringifyConsole( data );
      if ( selectedItem ) {
        dispatch( updateProductionSubProcess( { ...data, id: selectedItem.id }, lastPageInfo ) );
      } else {
        dispatch( addProductionSubProcess( data, lastPageInfo ) );
      }
    }
  };
  //#endregion

  return (
    <Sidebar
      size="lg"
      title={selectedItem ? 'Edit Production Sub Process' : 'New Production Sub Process'}
      headerClassName="mb-1"
      contentClassName="pt-0"
      style={{ transition: '0.5s all ease' }}
      open={isOpenSidebar}
      toggleSidebar={() => dispatch( toggleProductionSubProcessSidebar( !isOpenSidebar ) )}
    >
      <UILoader
        blocking={iSubmitProgressCM}
        loader={<ComponentSpinner />}>
        <Form autoComplete="off" onSubmit={handleSubmit( onSubmit )}>
          <FormGroup>
            <Label for="productionProcess">Production Process</Label>
            <CreateableSelect
              id="productionProcess"
              isSearchable
              isClearable
              isLoading={loading}
              theme={selectThemeColors}
              options={dropDownItems}
              className="erp-dropdown-select"
              classNamePrefix="dropdown"
              value={productionProcess}
              onChange={onProductionProcessChange}
              onCreateOption={onCreateProductionProcess}
            />
          </FormGroup>
          <FormGroup>
            <Label for="name">Process Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              bsSize="sm"
              placeholder="Enter process name"
              defaultValue={selectedItem ? selectedItem.name : ''}
              innerRef={register( { required: true } )}
            />
          </FormGroup>
          <FormGroup>
            <Label for="shortCode">Short Code</Label>
            <Input
              id="shortCode"
              name="shortCode"
              type="text"
              bsSize="sm"
              placeholder="Enter short code"
              defaultValue={selectedItem ? selectedItem.shortCode : ''}
              innerRef={register( { required: true } )}
            />
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
              style={{ zIndex: 22 }}
              value={processType}
              onChange={data => setProcessType( data )}
            />
          </FormGroup>
          <FormGroup>
            <Label for="details">
              <span>Description</span>
            </Label>
            <Input
              name="details"
              id="details"
              bsSize="sm"
              placeholder="Details"
              defaultValue={selectedItem ? selectedItem.details : ''}
              innerRef={register( { required: false } )}
            />
          </FormGroup>
          <div className="row">
            <FormGroup className="col-md-4 col-sm-4 col-lg-4 col-sx-4 text-nowrap">
              <CustomInput
                type="checkbox"
                className="custom-control-primary"
                label="Is Active"
                id="status"
                name="status"
                defaultChecked={selectedItem ? selectedItem.status : checkBoxValue?.status}
                inline
                onChange={e => onCheckboxStatusChange( e )}
              />
            </FormGroup>
            <FormGroup className="col-md-4 col-sm-4 col-lg-4 col-sx-4 text-nowrap">
              <CustomInput
                type="checkbox"
                className="custom-control-primary"
                label="Is Out Source"
                id="isOutSourced"
                name="isOutSourced"
                defaultChecked={selectedItem ? selectedItem.isOutSourced : checkBoxValue?.isOutSourced}
                inline
                onChange={e => onCheckboxStatusChange( e )}
              />
            </FormGroup>
            <FormGroup className="col-md-4 col-sm-4 col-lg-4 col-sx-4 text-nowrap">
              <CustomInput
                type="checkbox"
                className="custom-control-primary"
                label="Is Sewing"
                id="isSewing"
                name="isSewing"
                defaultChecked={selectedItem ? selectedItem.isSewing : checkBoxValue?.isSewing}
                inline
                onChange={e => onCheckboxStatusChange( e )}
              />
            </FormGroup>
          </div>
          <div className='d-flex align-items-center justify-content-between mt-2'>
            <Button type="submit" size="sm" className="mr-1" color="primary">
              Submit
            </Button>
            <Button type="cancel" size="sm" color="danger" outline onClick={() => dispatch( toggleProductionSubProcessSidebar( !isOpenSidebar ) )}>
              Cancel
            </Button>
          </div>

        </Form>
      </UILoader>
    </Sidebar>
  );
};

export default ProductionSubProcessForm;
