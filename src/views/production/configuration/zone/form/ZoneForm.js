/*
   Title: Zone Add From
   floor: Zone Add From
   Author: Iqbal Hossain
   Date: 09-January-2022
   Modified: 09-January-2022
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
import { notify } from 'utility/custom/notifications';
import { fillFloorDdl } from '../../floor/store/actions';
import { fillProductionSubProcessDdl } from '../../productionSubProcess/store/actions';
import { addZone, toggleZoneSidebar, updateZone } from '../store/actions';

const ZoneForm = props => {
  const { lastPageInfo, selectedItem } = props;
  //#region Hooks
  const dispatch = useDispatch();
  const {
    zoneReducer: { isOpenSidebar },
    commonReducers: { iSubmitProgressCM },
    floorReducer: { dropDownItems: floorDropdown },
    productionSubProcessReducer: { dropDownItems: productionSubProcessDropdown }
  } = useSelector( state => state );
  const { register, errors, handleSubmit } = useForm();
  //#endregion

  //#region States
  const [floor, setFloor] = useState( null );
  const [productionSubProcess, setProductionSubProcess] = useState( null );
  const [loading, setLoading] = useState( false );
  //#endregion

  //#region Effects
  /**
   * For Production Sub Process Ddl
   */
  useEffect( () => {
    if ( !productionSubProcessDropdown.length ) {
      dispatch( fillProductionSubProcessDdl() );
    }
  }, [dispatch, productionSubProcessDropdown.length] );

  /**
   *
   * For Floor Ddl
   */
  useEffect( () => {
    if ( !floorDropdown.length ) {
      dispatch( fillFloorDdl() );
    }
  }, [dispatch, floorDropdown.length] );

  /**
   * For Data Set in Edit Modal
   */
  useEffect( () => {
    if ( selectedItem && productionSubProcessDropdown.length && floorDropdown.length ) {
      const selectedFloor = floorDropdown.find( item => item.value === selectedItem.floorId );
      setFloor( selectedFloor );
      const selectedProductionProcess = productionSubProcessDropdown.find( item => item.value === selectedItem.productionProcessId );
      setProductionSubProcess( selectedProductionProcess );
    } else {
      setFloor( null );
      setProductionSubProcess( null );
    }
  }, [selectedItem, productionSubProcessDropdown, floorDropdown] );
  //#endregion

  //#region Events

  /**
   * Instant Floor Create
   */
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

  /**
   * Instant Production Process Create
   */
  const onCreateProductionProcess = async newProductionProcess => {
    setLoading( true );
    try {
      const res = await baseAxios.post( PRODUCTION_PROCESS_API.add, {
        name: newProductionProcess,
        status: true
      } );
      setProductionSubProcess( { label: newProductionProcess, value: res.data.data } );
      dispatch( fillFloorDdl() );
      setLoading( false );
    } catch ( error ) {
      notify( 'error', 'Something went wrong!!! Please try again' );
    }
  };

  /**
   * For Form Data Submission
   */
  const onSubmit = values => {
    if ( isObjEmpty( errors ) && floor !== null && productionSubProcess !== null ) {
      const { name, details, status } = values;
      const payload = {
        name,
        floorId: floor?.value,
        productionProcessId: productionSubProcess?.value,
        details,
        status
      };
      if ( selectedItem ) {
        dispatch( updateZone( { ...payload, id: selectedItem.id }, lastPageInfo ) );
      } else {
        dispatch( addZone( payload, lastPageInfo ) );
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
      title={selectedItem ? 'Edit Zone ' : 'New Zone'}
      style={{ transition: '0.5s all ease' }}
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={() => dispatch( toggleZoneSidebar( !isOpenSidebar ) )}
    >
      <UILoader
        blocking={iSubmitProgressCM}
        loader={<ComponentSpinner />}>
        <FormGroup>
          <Label for="name">
            <span>Zone Name</span>
          </Label>
          <Input
            name="name"
            id="name"
            placeholder="Zone Name"
            bsSize="sm"
            defaultValue={selectedItem ? selectedItem.name : ''}
            innerRef={register( { required: true } )}
            invalid={errors.name && true}
            className={classnames( { 'is-invalid': errors['name'] } )}
          />
          {/* {errors && errors.name && <FormFeedback>Zone Name is Required!</FormFeedback>} */}
        </FormGroup>
        <FormGroup>
          <Label for="floor">
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
            invalid={errors.floor && true}
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
          {/* {errors && errors.details && <FormFeedback>Details is Required!</FormFeedback>} */}
        </FormGroup>
        <FormGroup>
          <Label for="status">
            <Input
              style={{ marginLeft: '5px' }}
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
              hidden={selectedItem?.id}
            // onClick={() => { handleReset(); }}
            >
              Reset
            </Button>

            <Button
              color='danger ml-1'
              outline size='sm'
              onClick={() => dispatch( toggleZoneSidebar() )}
            >
              Cancel
            </Button>
          </div>
        </div>
      </UILoader>
    </Sidebar>
  );
};

export default ZoneForm;
/** Change Log
 * 17-Feb-2022(Alamgir):Modify Form and OnSubmit functionality
 */
