/* eslint-disable semi */
/**
 * Title: Line Form
 * details: Form page for Line
 * Author: Nasir Ahmed
 * Date: 21-November-2021
 * Modified: 21-November-2021
 */

import Sidebar from '@core/components/sidebar';
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import classnames from 'classnames';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import CreateableSelect from 'react-select/creatable';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import { baseAxios } from 'services';
import { PRODUCTION_PROCESS_API } from 'services/api-end-points/production/v1';
import { FLOOR_API } from 'services/api-end-points/production/v1/floor';
import { isObjEmpty, selectThemeColors } from 'utility/Utils';
import { stringifyConsole } from 'utility/commonHelper';
import { notify } from 'utility/custom/notifications';
import { fillFloorDdl } from '../../floor/store/actions';
import { fillProductionProcessDdl } from '../../productionProcess/store/actions';
import { fillProductionSubProcessDdl } from '../../productionSubProcess/store/actions';
import { addLine, toggleLineSidebar, updateLine } from '../store/actions';

const LineForm = props => {
  //#region Props
  const { lastPageInfo, selectedItem } = props;
  //#endregion

  //#region Hooks
  const dispatch = useDispatch();
  const {
    productionSubProcessReducer: { dropDownItems: productionSubProcessDropdown },
    floorReducer: { dropDownItems: floorDropdown },
    commonReducers: { iSubmitProgressCM },
    lineReducer: { isOpenSidebar }
  } = useSelector( state => state );
  const { register, errors, handleSubmit } = useForm();
  //#endregion

  //#region States
  const [floor, setFloor] = useState( null );
  const [productionSubProcess, setProductionSubProcess] = useState( null );
  const [loading, setLoading] = useState( false );
  //#endregion

  //#region Effects
  useEffect( () => {
    if ( !productionSubProcessDropdown.length ) {
      dispatch( fillProductionSubProcessDdl() );
    }
  }, [dispatch, productionSubProcessDropdown.length] );

  useEffect( () => {
    if ( !floorDropdown.length ) {
      dispatch( fillFloorDdl() );
    }
  }, [dispatch, floorDropdown.length] );

  useEffect( () => {
    if ( selectedItem && floorDropdown.length && productionSubProcessDropdown.length ) {
      const selectedProductionProcess = productionSubProcessDropdown.find( item => item.value === selectedItem.productionProcessId );
      const selectedDdlFloor = floorDropdown.find( item => item.value === selectedItem.floorId );
      setFloor( selectedDdlFloor );
      setProductionSubProcess( selectedProductionProcess );
    } else {
      setFloor( null );
      setProductionSubProcess( null );
    }
  }, [selectedItem, floorDropdown, productionSubProcessDropdown] );
  //#endregion

  //#region Events

  //Instant Floor Create
  const onCreateFloor = async newFloor => {
    setLoading( true );
    try {
      const res = await baseAxios.post( FLOOR_API.add, {
        name: newFloor,
        status: true
      } );
      setFloor( { label: newFloor, value: res.data.data } );
      dispatch( fillFloorDdl() );
      setLoading( false );
    } catch ( error ) {
      notify( 'error', 'Something went wrong!!! Please try again' );
    }
  };
  //Instant Production Process Create
  const onCreateProductionProcess = async newProductionProcess => {
    setLoading( true );
    try {
      const res = await baseAxios.post( PRODUCTION_PROCESS_API.add, {
        name: newProductionProcess,
        status: true
      } );
      setProductionSubProcess( { label: newProductionProcess, value: res.data.data } );
      dispatch( fillProductionProcessDdl() );
      setLoading( false );
    } catch ( error ) {
      notify( 'error', 'Something went wrong!!! Please try again' );
    }
  };
  /**
   * For Submission
   */
  const onSubmit = values => {
    if ( isObjEmpty( errors ) && floor !== null && productionSubProcess !== null ) {
      const { name, details, status } = values;
      const payload = {
        name,
        productionProcessId: productionSubProcess?.value,
        floorId: floor?.value,
        details,
        status
      };
      stringifyConsole( payload );

      if ( selectedItem ) {
        dispatch( updateLine( { ...payload, id: selectedItem.id }, lastPageInfo ) );
      } else {
        dispatch( addLine( payload, lastPageInfo ) );
      }

    } else {
      notify( 'warning', 'Please provide all informations!!!' );

    }
  };
  //#endregion

  return (
    <Sidebar
      size="lg"
      open={isOpenSidebar}
      title={selectedItem ? 'Edit Line' : 'New Line'}
      style={{ transition: '0.5s all ease' }}
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={() => dispatch( toggleLineSidebar( !isOpenSidebar ) )}
    >
      <UILoader
        blocking={iSubmitProgressCM}
        loader={<ComponentSpinner />}>
        <FormGroup>
          <Label for="name">
            <span>Line Name</span>
          </Label>
          <Input
            name="name"
            id="name"
            bsSize="sm"
            placeholder="Line Name"
            defaultValue={selectedItem ? selectedItem.name : ''}
            innerRef={register( { required: true } )}
            invalid={errors.name && true}
            className={classnames( { 'is-invalid': errors['name'] } )}
          />
          {/* {errors && errors.name && <FormFeedback>Line Number is Required!</FormFeedback>} */}
        </FormGroup>
        <FormGroup>
          <Label for="productionProcess">
            <span>Production Process Name</span>
          </Label>
          <CreateableSelect
            name="productionProcess"
            id="productionProcess"
            isSearchable
            isClearable
            isLoading={loading}
            theme={selectThemeColors}
            className="erp-dropdown-select"
            classNamePrefix="dropdown"
            options={productionSubProcessDropdown}
            value={productionSubProcess}
            onChange={data => setProductionSubProcess( data )}
            onCreateOption={onCreateProductionProcess}
            innerRef={register( { required: true } )}
            invalid={errors.productionProcess && true}
          />
          {/* {errors && errors.productionProcess && <FormFeedback>Production Process Name is Required!</FormFeedback>} */}
        </FormGroup>
        <FormGroup>
          <Label for="floor">
            <span>Floor Name</span>
          </Label>
          <CreateableSelect
            name="floor"
            id="floor"
            isSearchable
            isClearable
            isLoading={loading}
            theme={selectThemeColors}
            className="erp-dropdown-select"
            classNamePrefix="dropdown"
            options={floorDropdown}
            value={floor}
            onChange={data => setFloor( data )}
            onCreateOption={onCreateFloor}
            innerRef={register( { required: true } )}
            invalid={errors.floor && true}
          />
          {/* {errors && errors.floor && <FormFeedback>Floor Name is Required!</FormFeedback>} */}
        </FormGroup>
        <FormGroup>
          <Label for="details">
            <span>Details</span>
          </Label>
          <Input
            name="details"
            id="details"
            placeholder="Details"
            bsSize="sm"
            defaultValue={selectedItem ? selectedItem.details : ''}
            innerRef={register( { required: true } )}
            invalid={errors.details && true}
            className={classnames( { 'is-invalid': errors['details'] } )}
          />
          {/* {errors && errors.details && <FormFeedback>details is Required!</FormFeedback>} */}
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
              hidden={selectedItem?.id}
            >
              Reset
            </Button>

            <Button
              color='danger ml-1'
              outline size='sm'
              onClick={() => dispatch( toggleLineSidebar() )}
            >
              Cancel
            </Button>
          </div>
        </div>
      </UILoader>
    </Sidebar>
  );
};

export default LineForm;
/** Change Log
 * 16-Feb-2022(Alamgir): API Integration and modify form and functionality
 */
