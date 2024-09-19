/* eslint-disable no-unreachable */
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import classnames from 'classnames';
import ActionMenu from 'layouts/components/menu/action-menu';
import { useEffect, useState } from 'react';
import { PlusSquare, Trash2 } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Col, CustomInput, FormFeedback, Label, NavItem, NavLink, Table } from 'reactstrap';
import { dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { PRODUCTION_PROCESS_GROUP_API } from 'services/api-end-points/production/v1/productionProcessGroup';
import { errorResponse, selectThemeColors } from 'utility/Utils';
import IconButton from 'utility/custom/IconButton';
import { ErpInput } from 'utility/custom/customController/ErpInput';
import ErpSelect from 'utility/custom/customController/ErpSelect';
import FormContentLayout from 'utility/custom/customController/FormContentLayout';
import FormLayout from 'utility/custom/customController/FormLayout';
import { notify } from 'utility/custom/notifications';
import { v4 as uuid } from 'uuid';
import '../../../../../assets/scss/production/form-page-custom-table.scss';
import '../../../../../assets/scss/production/general.scss';
import { fillProductionProcessDdl } from '../../productionProcess/store/actions';
import { fillProductionSubProcessDdl } from '../../productionSubProcess/store/actions';
const ProductionProcessGroupForm = () => {
  //#region Hooks
  const history = useHistory();
  const dispatch = useDispatch();
  const { dropDownItems } = useSelector( ( { productionSubProcessReducer } ) => productionSubProcessReducer );
  const { dropDownItems: productionProcessddl } = useSelector( ( { productionProcessReducer } ) => productionProcessReducer );
  const { iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );

  const { register, errors, handleSubmit } = useForm();
  //#endregion

  //#region State
  const [groupName, setGroupName] = useState( '' );
  const [status, setStatus] = useState( false );
  const [productionProcess, setProductionProcess] = useState( null );
  const [productionSubProcess, setProductionSubProcess] = useState( null );
  const [pspddl, setPspddl] = useState( [] );
  const [sortOrder, setSortOrder] = useState( '' );
  const [processSubProcessCombination, setProcessSubProcessCombination] = useState( [] );
  //#endregion

  //#region Effect
  useEffect( () => {
    dispatch( fillProductionSubProcessDdl() );
    dispatch( fillProductionProcessDdl() );
  }, [dispatch] );
  //#endregion

  //#region Events
  /**
   * For Change Production Process
   */
  const onChangeProductionProcess = item => {
    if ( item ) {
      const filteredProdSub = dropDownItems.filter( subProc => subProc.parentProcessId === item.id );
      setPspddl( filteredProdSub );
    }
    setProductionProcess( item );
  };
  /**
 * For Change Production Sub Process
 */
  const onChangeProductionSubProcess = item => {
    setProductionSubProcess( item );
  };
  /**
   * For Add Item to list
   */
  const onAddCombination = () => {
    const combo = [...processSubProcessCombination];
    const newItem = {
      rowId: uuid(),
      sortOrder,
      status,
      productionProcessId: productionProcess ? productionProcess?.value : '',
      productionProcessName: productionProcess ? productionProcess?.label : '',
      productionSubProcessId: productionSubProcess ? productionSubProcess?.value : '',
      productionSubProcessName: productionSubProcess ? productionSubProcess?.label : ''
    };
    combo.push( newItem );
    setProcessSubProcessCombination( combo );
    setSortOrder( '' );
    setProductionProcess( null );
    setProductionSubProcess( null );
  };
  /**
   * For Delete Item to list
   */
  const handleRemoveItem = ( rowId, combIdx ) => {
    const combo = [...processSubProcessCombination];
    combo.splice( combIdx, 1 );
    setProcessSubProcessCombination( combo );
  };
  /**
   * Back to prev route
   */
  const handleCancel = () => {
    history.goBack();
  };
  /**
 * For Submission
 */
  const onSubmit = async () => {
    const payload = {
      groupName,
      status,
      list: processSubProcessCombination?.map( comb => ( {
        sortOrder: Number( comb?.sortOrder ),
        productionProcessId: comb?.productionProcessId,
        productionSubProcessId: comb?.productionSubProcessId
      } ) )
    };
    const isValid = payload.list.every( e => e.productionProcessId && e.productionSubProcessId && e.sortOrder );
    if ( isValid ) {
      dispatch( dataSubmitProgressCM( true ) );
      try {
        const res = await baseAxios.post( PRODUCTION_PROCESS_GROUP_API.add, payload );

        notify( 'success', 'Production process has been added' );
        dispatch( dataSubmitProgressCM( false ) );
        handleCancel();
        console.log( 'payload', JSON.stringify( payload, null, 2 ) );

      } catch ( error ) {
        errorResponse( error );
        dispatch( dataSubmitProgressCM( false ) );
      }
    } else {
      notify( 'warning', 'Please provide all information!!!' );
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
      id: 'production-process-group-new',
      name: 'New Production Process Group ',
      link: "/production-process-group/create",
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
        <ActionMenu breadcrumb={breadcrumb} title="New Production Process Group">
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
          <FormLayout>

            <Col lg='12' className='mb-1 p-1 pt-0'>
              <FormContentLayout title="Master Information">
                <Col lg='4' md='6' xl='4'>
                  <ErpInput
                    classNames='mt-1'
                    label="Group Name"
                    name="groupName"
                    bsSize="sm"
                    onChange={e => setGroupName( e.target.value )}
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
                    type="checkbox"
                    className='mt-1'
                    checked={status}
                    onChange={e => setStatus( e.target.checked )}
                    inline
                  />
                  <Label>Is Active</Label>

                </Col>

                <Col lg='4' md='6' xl='4'>
                  <ErpInput
                    classNames='mt-1'
                    label="Sort Order"
                    id="sortOrder"
                    type="number"
                    bsSize="sm"
                    value={sortOrder}
                    onChange={e => setSortOrder( e.target.value )}
                    name="sortOrder"
                  />
                  {errors && errors.groupName && <FormFeedback>Group name is required!</FormFeedback>}
                </Col>
                <Col lg='4' md='6' xl='3' style={{ marginTop: '1.3rem' }}>
                  <ErpSelect
                    label="Production Process"
                    menuPosition="fixed"
                    id="process"
                    isSearchable
                    theme={selectThemeColors}
                    isLoading={!productionProcessddl.length}
                    options={productionProcessddl}
                    className="erp-dropdown-select"
                    classNamePrefix="dropdown"
                    value={productionProcess}
                    onChange={onChangeProductionProcess}
                  />
                </Col>
                <Col lg='4' md='6' xl='3'>
                  <ErpSelect
                    label="Production Sub Process"
                    classNames='mt-1'
                    menuPosition="fixed"
                    id="productionSubProcess"
                    isSearchable
                    theme={selectThemeColors}
                    isLoading={!pspddl.length}
                    options={pspddl}
                    className="erp-dropdown-select"
                    classNamePrefix="dropdown"
                    isDisabled={!productionProcess}
                    value={productionSubProcess}
                    onChange={onChangeProductionSubProcess}
                  />
                </Col>
                <Col lg='2' md='6' xl='1' style={{ marginTop: '0.8rem' }}>

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
                      {processSubProcessCombination.map( ( comb, combIdx ) => {
                        return (
                          <tr key={comb.rowId}>
                            <td className='sm-width'>{combIdx + 1}</td>

                            <td className='td-width'>{comb.sortOrder}</td>
                            <td>{comb.productionProcessName}</td>
                            <td>{comb.productionSubProcessName}</td>
                            <td className="text-center">
                              <Trash2
                                className="text-danger cursor-pointer"
                                id="remove"
                                size={18}
                                onClick={() => handleRemoveItem( comb.rowId, combIdx )}
                              />
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
        </div>

      </UILoader>

    </>
  );
};

export default ProductionProcessGroupForm;
