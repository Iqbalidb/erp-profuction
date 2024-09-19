/* eslint-disable no-unreachable */
/* eslint-disable prettier/prettier */
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import axios from 'axios';
import classnames from 'classnames';
import ActionMenu from 'layouts/components/menu/action-menu';
import { useEffect, useState } from 'react';
import { PlusSquare, Trash2 } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Col, CustomInput, Form, FormFeedback, Label, NavItem, NavLink, Table } from 'reactstrap';
import { dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { PRODUCTION_PROCESS_API, PRODUCTION_SUB_PROCESS_API } from 'services/api-end-points/production/v1';
import { PRODUCTION_PROCESS_GROUP_API } from 'services/api-end-points/production/v1/productionProcessGroup';
import { errorResponse, selectThemeColors } from 'utility/Utils';
import { mapArrayToDropdown, stringifyConsole } from 'utility/commonHelper';
import { confirmDialog } from 'utility/custom/ConfirmDialog';
import IconButton from 'utility/custom/IconButton';
import { ErpInput } from 'utility/custom/customController/ErpInput';
import ErpSelect from 'utility/custom/customController/ErpSelect';
import FormContentLayout from 'utility/custom/customController/FormContentLayout';
import FormLayout from 'utility/custom/customController/FormLayout';
import { notify } from 'utility/custom/notifications';
import { confirmObj } from 'utility/enums';
import { v4 as uuid } from 'uuid';
import '../../../../../assets/scss/production/form-page-custom-table.scss';
import '../../../../../assets/scss/production/general.scss';
import { fetchProductionProcessGroupById } from '../store/action';
const ProductionProcessGroupEditForm = () => {
  //#region Hooks
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const productionProcessGroupId = location.state;
  const { selectedItem } = useSelector( ( { productionProcessGroupReducer } ) => productionProcessGroupReducer );
  const { iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
  //#endregion
  //#region state
  const [sortOrder, setSortOrder] = useState( '' );
  const [productionProcesses, setProductionProcesses] = useState( [] );
  const [productionProcess, setProductionProcess] = useState( null );
  const [productionSubProcesses, setProductionSubProcesses] = useState( [] );
  const [productionSubProcess, setProductionSubProcess] = useState( null );
  const [recordForEdit, setRecordForEdit] = useState( { ...selectedItem } );
  const { register, errors, handleSubmit } = useForm();
  //#endregion

  //#region UDF's
  /**
   * Get Production Sub Process by parent id
   */
  const fetchSubProcessByParentId = async parentId => {
    try {
      const res = await baseAxios.get( PRODUCTION_SUB_PROCESS_API.fetch_by_parent_id, {
        params: {
          parentId,
          status: true
        }
      } );
      const subProc = mapArrayToDropdown( res.data.data, 'name', 'id' );
      setProductionSubProcesses( subProc );
    } catch ( err ) {
      notify( 'warning', err );

    }
  };
  //#endregion

  //#region Effects
  useEffect( () => {
    if ( productionProcessGroupId ) {
      dispatch( fetchProductionProcessGroupById( productionProcessGroupId ) );
    }
  }, [dispatch, productionProcessGroupId] );

  useEffect( () => {
    // Production Process and sub process
    if ( selectedItem ) {
      const fetchDepedencies = async () => {
        const productionProcessReq = baseAxios.get( PRODUCTION_PROCESS_API.fetch_all_active );
        try {
          const [productionProcessResponse] = await axios.all( [productionProcessReq] );

          if ( productionProcessResponse.data.succeeded ) {
            const prodProc = mapArrayToDropdown( productionProcessResponse.data.data, 'name', 'id' );
            setProductionProcesses( prodProc );
          }
        } catch ( err ) {
          notify( 'warning', err );
        }
      };
      fetchDepedencies();
      setRecordForEdit( { ...selectedItem } );
    }
  }, [selectedItem] );
  //#endregion


  //#region Event's

  //For production process chnage
  const onChangeProductionProcess = ( item, callback ) => {
    if ( item ) {
      setProductionProcess( item );
      callback( item.value );
    }
  };

  //For New Item Add
  const onAddCombination = () => {
    const combo = [...recordForEdit?.list];
    const newItem = {
      rowId: uuid(),
      groupDetailsId: uuid(),
      sortOrder,
      productionProcessId: productionProcess ? productionProcess.value : '',
      processName: productionProcess ? productionProcess.label : '',
      productionSubProcessId: productionSubProcess ? productionSubProcess.value : '',
      subProcessName: productionSubProcess ? productionSubProcess.label : ''
    };

    combo.push( newItem );
    setRecordForEdit( { ...recordForEdit, list: combo } );
    setSortOrder( '' );
    setProductionProcess( null );
    setProductionSubProcess( null );
  };

  //For Remove List Item
  const handleRemoveItem = async ( item, itemIndex ) => {
    const combo = [...recordForEdit?.list];
    const isExistInDb = selectedItem?.list?.some( e => e.groupDetailsId === item.groupDetailsId );
    if ( item ) {
      const confirmStatus = await confirmDialog( confirmObj );
      if ( confirmStatus.isConfirmed ) {
        if ( item.groupDetailsId && isExistInDb ) {
          try {

            const payload = {
              groupName: recordForEdit?.groupName,
              status: recordForEdit?.status,
              listIdForRemove: item.groupDetailsId,
              list: recordForEdit?.list?.map( l => {
                const copiedItem = Object.assign( {}, l );
                copiedItem.id = l?.groupDetailsId;
                copiedItem.sortOrder = +l?.sortOrder;
                copiedItem.productionProcessId = l?.productionProcessId;
                copiedItem.productionSubProcessId = l?.productionSubProcessId;
                copiedItem.productionProcessGroupId = recordForEdit?.id;
                delete copiedItem.groupDetailsId;
                delete copiedItem.rowId;
                delete copiedItem.processName;
                delete copiedItem.subProcessName;
                return copiedItem;
              } )
            };
            const res = await baseAxios.put( PRODUCTION_PROCESS_GROUP_API.update, payload, {
              params: { id: selectedItem.id }
            } );
            if ( res.status === 200 ) {
              notify( 'success', 'Data Deleted Successfully!!!' );
              dispatch( fetchProductionProcessGroupById( productionProcessGroupId ) );
            }
          } catch ( err ) {
            notify( 'warning', err );
          }
        } else {
          combo.splice( itemIndex, 1 );
        }
        setRecordForEdit( { ...recordForEdit, list: combo } );
      }
    }

  };

  //For Cancel
  const handleCancel = () => {
    history.push( '/production-process-group' );
  };

  //For handle Submit Edit Data
  const onSubmit = async () => {
    const payload = {
      groupName: recordForEdit?.groupName,
      status: recordForEdit?.status,
      list: recordForEdit?.list?.map( l => {
        const copiedItem = Object.assign( {}, l );
        copiedItem.id = l?.groupDetailsId;
        copiedItem.sortOrder = +l?.sortOrder;
        copiedItem.productionProcessId = l?.productionProcessId;
        copiedItem.productionSubProcessId = l?.productionSubProcessId;
        copiedItem.productionProcessGroupId = recordForEdit?.id;
        delete copiedItem.groupDetailsId;
        delete copiedItem.rowId;
        delete copiedItem.processName;
        delete copiedItem.subProcessName;
        return copiedItem;
      } )
    };
    stringifyConsole( payload );
    dispatch( dataSubmitProgressCM( true ) );
    try {
      const res = await baseAxios.put( PRODUCTION_PROCESS_GROUP_API.update, payload, {
        params: { id: selectedItem.id }
      } );
      notify( 'success', 'Production process group has been updated Successfully!!!' );
      dispatch( dataSubmitProgressCM( false ) );
      handleCancel();

    } catch ( err ) {
      errorResponse( err );
      dispatch( dataSubmitProgressCM( false ) );
    }
  };
  //#endregion
  //#region Breadcrumb
  const breadcrumb = [
    {
      id: 'home',
      name: 'Home',
      link: "/",
      isActive: false,
      hidden: false
    },
    {
      id: 'production-process-group',
      name: 'Production Process Group',
      link: "/production-process-group",
      isActive: false,
      hidden: false
    },
    {
      id: 'production-process-group-edit',
      name: 'Edit Production Process Group ',
      link: "/production-process-group/edit",
      isActive: true,
      hidden: false
    },

  ];
  //#endregion

  return (
    <>

      <UILoader
        blocking={iSubmitProgressCM}
        loader={<ComponentSpinner />}>
        <ActionMenu breadcrumb={breadcrumb} title="Edit Production Process Group">
          <NavItem className="mr-1">
            <NavLink tag={Button} size="sm" color="primary" type="submit" onClick={onSubmit}>
              Save
            </NavLink>
          </NavItem>
          <NavItem className="mr-1">
            <NavLink tag={Button} size="sm" color="secondary" onClick={handleCancel}>
              Cancel
            </NavLink>
          </NavItem>
        </ActionMenu>
        <div className='general-form-container'>
          <Form autoComplete="off" onSubmit={handleSubmit( onSubmit )}>
            <FormLayout>
              <Col lg='12' className='mb-2 p-1'>
                <FormContentLayout title="Master Information">
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="Group Name"
                      id="groupName"
                      type="text"
                      name="groupName"
                      bsSize="sm"
                      defaultValue={recordForEdit?.groupName}
                      onChange={e => setRecordForEdit( { ...recordForEdit, groupName: e.target.value } )}
                      innerRef={register( { required: true } )}
                      invalid={errors.groupName && true}
                      className={classnames( { 'is-invalid': errors['groupName'] } )}
                    />
                    {errors && errors.groupName && <FormFeedback>Group name is required!</FormFeedback>}
                  </Col>

                  <Col lg='4' md='6' xl='8'>
                    <CustomInput
                      name="status"
                      id="status"
                      className='mt-1'
                      type="checkbox"
                      checked={recordForEdit?.status}
                      onChange={e => setRecordForEdit( { ...recordForEdit, status: e.target.checked } )}
                      inline
                    />
                    <Label>Is Active</Label>

                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="Sort Order"
                      id="sortOrder" type="number" value={sortOrder} onChange={e => setSortOrder( e.target.value )} name="sortOrder"
                    />
                    {errors && errors.groupName && <FormFeedback>Group name is required!</FormFeedback>}
                  </Col>
                  <Col lg='4' md='6' xl='3'>
                    <ErpSelect
                      label="Production Process"
                      classNames='mt-1'
                      menuPosition="fixed"
                      id="process"
                      isSearchable
                      theme={selectThemeColors}
                      isLoading={!productionProcesses.length}
                      options={productionProcesses}
                      className="erp-dropdown-select"
                      classNamePrefix="dropdown"
                      value={productionProcess}
                      onChange={item => onChangeProductionProcess( item, fetchSubProcessByParentId )}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='3' >
                    <ErpSelect
                      label="Production Sub Process"
                      menuPosition="fixed"
                      id="productionSubProcess"
                      isSearchable
                      classNames='mt-1'
                      theme={selectThemeColors}
                      isLoading={!productionSubProcesses.length}
                      options={productionSubProcesses}
                      className="erp-dropdown-select"
                      classNamePrefix="dropdown"
                      value={productionSubProcess}
                      onChange={psp => setProductionSubProcess( psp )}
                    />
                  </Col>
                  <Col lg='2' md='6' xl='2' style={{ marginTop: '0.8rem' }}>
                    <IconButton
                      id="btnAdd"
                      outline
                      onClick={onAddCombination}
                      icon={<PlusSquare size={14} />}
                      label='Add Details'
                      placement='bottom'
                      color={`${!productionProcess ? 'secondary' : 'primary'}`}
                      isBlock={true}
                      disabled={!productionProcess}
                    />

                  </Col>
                </FormContentLayout>
              </Col>
              <div className='p-1'>
                <FormContentLayout title="Details">
                  <div className='p-1'>
                    <Table size="sm" bordered className='table-container'>
                      <thead >
                        <tr>
                          <th className="text-nowrap sm-width"> SL</th>

                          <th>sort order</th>
                          <th>Production process</th>
                          <th>Production Sub Process</th>
                          <th className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recordForEdit.list?.map( ( item, itemIndex ) => {
                          return (
                            <tr key={itemIndex + 1}>
                              <td className='sm-width'>{itemIndex + 1}</td>

                              <td className='td-width'>{item.sortOrder}</td>
                              <td>{item.processName}</td>
                              <td>{item.subProcessName}</td>
                              <td className="text-center">
                                <Trash2 className="text-danger cursor-pointer" id="remove" size={18} onClick={() => handleRemoveItem( item, itemIndex )} />
                              </td>
                            </tr>
                          );
                        } )}
                      </tbody>
                    </Table>
                  </div>
                </FormContentLayout>
              </div>
            </FormLayout>
          </Form>
        </div>

      </UILoader>

    </>
  );
};

export default ProductionProcessGroupEditForm;
