import Sidebar from '@core/components/sidebar';
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button, FormGroup, Label } from 'reactstrap';
import { dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios, merchandisingAxiosInstance } from 'services';
import { STYLES_API } from 'services/api-end-points/merchandising/v1';
import { STYLE_USE_INFO_API } from 'services/api-end-points/production/v1';
import { STYLE_WISE_PRODUCTION_PROCESS_GROUP_API } from 'services/api-end-points/production/v1/styleWiseProductionProcessGroup';
import { errorResponse, selectThemeColors } from 'utility/Utils';
import { mapArrayToDropdown } from 'utility/commonHelper';
import { notify } from 'utility/custom/notifications';
import { fillProductionProcessGroupDdl } from '../../productionProcessGroup/store/action';
import { fetchStyleWiseProductionProcessGroupByQuery, resetStyleWiseProductionProcessGroup } from '../store/actions';

const StyleWiseProductionProcessGroupAddForm = () => {
  //#region Hooks
  const dispatch = useDispatch();
  const {
    productionProcessGroupReducer: { dropDownItems },
    commonReducers: { iSubmitProgressCM },
    styleWiseProductionProcessGroupReducer: { isOpenSidebar, selectedItem }
  } = useSelector( store => store );
  const { handleSubmit } = useForm();
  //#endregion

  //#region States
  const [productionProcessGroup, setProductionProcessGroup] = useState( null );
  const [styles, setStyles] = useState( [] );
  const [style, setStyle] = useState( null );
  //#endregion

  //#region UDFs
  //For Style and Production Process Group DDL
  const fetchStyleDependency = async () => {
    const stylesRequest = await merchandisingAxiosInstance.get( STYLES_API.fetch_all );
    const styleUseRequest = await baseAxios.get( STYLE_USE_INFO_API.fetch_style_use_info_in_style_wise_production_process_group );
    try {
      const [styleResponse, styleUseResponse] = await axios.all( [stylesRequest, styleUseRequest] );
      const styleDdl = mapArrayToDropdown( styleResponse.data.data, 'styleNo', 'id' );
      const styleUseDdl = mapArrayToDropdown( styleUseResponse.data.data, 'styleNo', 'styleId' );
      const filteredStylesDdl = styleDdl.filter( sd => styleUseDdl.every( su => su.styleId !== sd.id ) );
      setStyles( filteredStylesDdl );
    } catch ( error ) {
      notify( 'warning', 'server side error!!!' );
    }
  };

  //#region Effects
  useEffect( () => {
    if ( !dropDownItems.length ) {
      dispatch( fillProductionProcessGroupDdl() );
    }
    fetchStyleDependency();
  }, [dispatch, dropDownItems.length] );

  //For  Selected Style and Production Process Group
  useEffect( () => {
    if ( selectedItem && dropDownItems.length ) {
      const selectedProductionProcessGroup = { value: selectedItem.productionProcessGroupId, label: selectedItem.productionProcessGroupName };
      const selectedStyle = { value: selectedItem.styleId, label: selectedItem.styleNo };
      setProductionProcessGroup( selectedProductionProcessGroup );
      setStyle( selectedStyle );
    }
  }, [dropDownItems, selectedItem] );
  //#endregion

  //#region Events

  // For On Production Process Group Change
  const onProductionProcessGroupChange = productionProcessGroup => {
    if ( productionProcessGroup ) {
      setProductionProcessGroup( productionProcessGroup );
    } else {
      setProductionProcessGroup( null );
    }
  };

  // For On Style Change
  const onStyleChange = style => {
    if ( style ) {
      setStyle( style );
    } else {
      setStyle( null );
    }
  };

  //For Data Submission
  const onSubmit = async () => {
    const payload = {
      productionProcessGroupId: productionProcessGroup?.id,
      styleId: style?.id,
      styleNo: style?.styleNo
    };

    const updatePayload = {
      productionProcessGroupId: productionProcessGroup?.value,
      styleId: style?.value,
      styleNo: style?.label
    };


    if ( selectedItem ) {
      dispatch( dataSubmitProgressCM( true ) );
      if ( updatePayload.productionProcessGroupId && updatePayload.styleId ) {
        try {
          const res = await baseAxios.put( STYLE_WISE_PRODUCTION_PROCESS_GROUP_API.update, updatePayload, { params: { id: selectedItem.id } } );

          notify( 'success', 'Style wise product part group updated Successfully' );
          dispatch( dataSubmitProgressCM( false ) );
          dispatch( resetStyleWiseProductionProcessGroup() );
          dispatch( fetchStyleWiseProductionProcessGroupByQuery() );
        } catch ( error ) {
          errorResponse( error );
          dispatch( dataSubmitProgressCM( false ) );

        }

      } else {
        notify( 'warning', 'Please provide all information!!!' );
      }
    } else {
      if ( payload.productionProcessGroupId && payload.styleId ) {
        dispatch( dataSubmitProgressCM( true ) );
        try {
          const res = await baseAxios.post( STYLE_WISE_PRODUCTION_PROCESS_GROUP_API.add, payload );

          notify( 'success', 'Style wise product part group added' );
          dispatch( dataSubmitProgressCM( false ) );
          dispatch( resetStyleWiseProductionProcessGroup() );
          dispatch( fetchStyleWiseProductionProcessGroupByQuery() );
        } catch ( error ) {
          errorResponse( error );
          dispatch( dataSubmitProgressCM( false ) );
        }

      } else {
        notify( 'warning', 'Please provide all information!!!' );
      }
    }

  };
  //#endregion
  return (
    <div>
      <Sidebar
        size="lg"
        title={selectedItem ? 'Edit Style Wise Production Process Group' : 'New Style Wise Production Process Group'}
        headerClassName="mb-1"
        contentClassName="pt-0"
        style={{ transition: '0.5s all ease' }}
        open={isOpenSidebar}
        toggleSidebar={() => dispatch( resetStyleWiseProductionProcessGroup() )}
      >
        <UILoader
          blocking={iSubmitProgressCM}
          loader={<ComponentSpinner />}>
          <FormGroup>
            <Label for="productionProcessGroup">Production Process Group</Label>
            <Select
              id="productionProcessGroup"
              isSearchable
              isClearable
              theme={selectThemeColors}
              options={dropDownItems}
              className="erp-dropdown-select"
              classNamePrefix="dropdown"
              style={{ zIndex: 22 }}
              value={productionProcessGroup}
              onChange={item => onProductionProcessGroupChange( item )}
            />
          </FormGroup>
          <FormGroup>
            <Label for="style">Style</Label>
            {selectedItem ? (
              <Select
                isDisabled
                id="style"
                isSearchable
                isClearable
                theme={selectThemeColors}
                options={styles}
                className="erp-dropdown-select"
                classNamePrefix="dropdown"
                style={{ zIndex: 22 }}
                value={style}
                onChange={item => onStyleChange( item )}
              />
            ) : (
              <Select
                id="style"
                isSearchable
                isClearable
                theme={selectThemeColors}
                options={styles}
                className="erp-dropdown-select"
                classNamePrefix="dropdown"
                style={{ zIndex: 22 }}
                value={style}
                onChange={item => onStyleChange( item )}
              />
            )}
          </FormGroup>
          <div className='d-flex align-items-center justify-content-between mt-2'>
            <Button type="submit" size="sm" className="mr-1" color="primary">
              Submit
            </Button>
            <Button type="cancel" size="sm" color="danger" outline onClick={() => dispatch( resetStyleWiseProductionProcessGroup() )}>
              Cancel
            </Button>
          </div>
        </UILoader>
      </Sidebar>
    </div>
  );
};

export default StyleWiseProductionProcessGroupAddForm;
