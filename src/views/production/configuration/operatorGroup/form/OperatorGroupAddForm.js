/*
   Title: Operator Group Add form
   Description: Operator Group Add form
   Author: Alamgir Kabir
   Date: 18-December-2022
   Modified: 18-December-2022
*/
import Sidebar from '@core/components/sidebar';
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { useEffect, useState } from 'react';
import { PlusCircle, Trash2 } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button, Col, FormGroup, Label, Row, Table } from 'reactstrap';
import { dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { OPERATOR_GROUP_API } from 'services/api-end-points/production/v1/operatorGroup';
import { errorResponse, selectThemeColors } from 'utility/Utils';
import { stringifyConsole } from 'utility/commonHelper';
import { notify } from 'utility/custom/notifications';
import { fetchProductionSubProcessByStatus } from 'views/production/operation/bundle/store/actions';
import { fetchOperatorForOperatorGroup } from '../../operator/store/actions';
import { fetchActiveOperatorGroup, toggleOperatorGroupSidebar } from '../store/actions';
const OperatorGroupAddForm = () => {
  //#region Hooks
  const dispatch = useDispatch();
  const {
    bundleReducer: { productionSubProcessDropdownItems },
    OperatorReducer: { operatorDdl },
    commonReducers: { iSubmitProgressCM },
    OperatorGroupReducer: { isOpenSidebar }
  } = useSelector( state => state );
  //#endregion

  //#region State
  const [productionProcessName, setProductionProcessName] = useState( null );
  const [operatorDropdownItems, setoperatorDropdownItems] = useState( [] );
  const [productionSubProcessDdl, setProductionSubProcessDdl] = useState( [] );
  const [operator, setOperator] = useState( null );
  const [operators, setOperators] = useState( [] );
  //#endregion

  //#region Effect
  useEffect( () => {
    dispatch( fetchProductionSubProcessByStatus( 'complete' ) );
  }, [dispatch] );

  useEffect( () => {
    if ( productionSubProcessDropdownItems.length > 0 ) {
      setProductionSubProcessDdl( productionSubProcessDropdownItems );
    }
  }, [dispatch, productionSubProcessDropdownItems] );

  useEffect( () => {
    if ( operatorDdl.length > 0 ) {
      setoperatorDropdownItems( operatorDdl );
    }
  }, [dispatch, operatorDdl] );
  //#endregion

  //#region Events
  /**
   * For Change Production Process
   */
  const handleChangeProductionProcessName = item => {
    if ( item ) {
      const isChange = item?.label !== productionProcessName?.label;
      if ( isChange ) {
        setoperatorDropdownItems( [] );
        setProductionProcessName( null );
        setOperator( null );
        setOperators( [] );
      }
      setProductionProcessName( item );
      dispatch( fetchOperatorForOperatorGroup( item.id ) );
    } else {
      setoperatorDropdownItems( [] );
      setProductionProcessName( null );
      setOperator( null );
      setOperators( [] );
    }
  };
  /**
 * For Change Operator
 */
  const handleChangeOperator = item => {
    if ( item ) {
      setOperator( item );
    }
  };
  /**
   * For Add Operator to List
   */
  const handleAddOperator = () => {
    const payload = {
      id: operator?.value,
      name: operator?.label
    };
    if ( payload.id ) {
      setOperators( [...operators, payload] );
      const remainingDdlOperator = operatorDropdownItems.filter( f => f.id !== payload.id );
      setoperatorDropdownItems( remainingDdlOperator );
      setOperator( null );
    }
  };
  /**
 * For Delete Operator From list
 */
  const handleDeleteOperator = index => {
    const _operators = [...operators];
    const _operatorDropdownItems = [...operatorDropdownItems];
    const selectedOperator = _operators[index];
    _operators.splice( index, 1 );
    setOperators( _operators );
    _operatorDropdownItems.push( { id: selectedOperator.id, label: selectedOperator.name, value: selectedOperator.id } );
    setoperatorDropdownItems( _operatorDropdownItems );
  };
  /**
 * Back to prev route
 */
  const handleCancel = () => {
    dispatch( toggleOperatorGroupSidebar() );
  };
  //For Submission
  const handleSubmit = async () => {
    const payload = {
      productionProcessId: productionProcessName?.value,
      productionProcessName: productionProcessName?.label,
      operators: operators?.map( opt => ( {
        operatorId: opt.id,
        operatorName: opt.name
      } ) )
    };
    stringifyConsole( payload );
    if ( payload.productionProcessId && payload.operators.some( i => i.operatorId ) ) {
      dispatch( dataSubmitProgressCM( true ) );
      try {
        const res = await baseAxios.post( OPERATOR_GROUP_API.add, payload );
        if ( res.data.succeeded ) {
          notify( 'success', 'Operator group has been added' );
          dispatch( dataSubmitProgressCM( false ) );
          handleCancel();
          dispatch( fetchActiveOperatorGroup() );
        }
      } catch ( error ) {
        errorResponse( error );
        dispatch( dataSubmitProgressCM( false ) );
      }
    } else {
      notify( 'warning', 'Please Provide all information!!!' );
    }
  };
  //#endregion
  return (
    <Sidebar
      open={isOpenSidebar}
      title={'New Operator Group'}
      size="lg"
      style={{ transition: '0.5s all ease' }}
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={handleCancel}
    >
      <UILoader
        blocking={iSubmitProgressCM}
        loader={<ComponentSpinner />}>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12} xl={12}>
            <FormGroup>
              <Label for="productionProcess">Process Name</Label>
              <Select
                id="productionProcess"
                isClearable
                isSearchable
                theme={selectThemeColors}
                className="erp-dropdown-select"
                classNamePrefix="dropdown"
                options={productionSubProcessDdl}
                value={productionProcessName}
                onChange={data => handleChangeProductionProcessName( data )}
              />
            </FormGroup>
          </Col>
          <Col xs={10} sm={10} md={10} lg={10} xl={10}>
            <FormGroup>
              <Label for="operator">Operator Name</Label>
              <Select
                id="operator"
                isClearable
                isSearchable
                theme={selectThemeColors}
                className="erp-dropdown-select"
                classNamePrefix="dropdown"
                options={operatorDropdownItems}
                value={operator}
                onChange={data => handleChangeOperator( data )}
              />
            </FormGroup>
          </Col>
          <Col xs={2} sm={2} md={2} lg={2} xl={2}>
            <FormGroup style={{ marginTop: '1.5rem' }}>
              <Button style={{ padding: '10px' }} color="primary" size="sm" id="btnAdd" type="button" outline onClick={handleAddOperator}>
                <PlusCircle id="btnAdd" size={14} />
              </Button>
            </FormGroup>
          </Col>
        </Row>
        {operators.length > 0 && (
          <Table responsive={true} bordered size="sm" >
            <thead  >
              <tr>
                <th>Operator Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {operators?.map( ( op, index ) => (
                <tr key={op.id}>
                  <td style={{ width: '300px' }}>{op?.name}</td>
                  <td style={{ width: '50px' }}>

                    <Trash2 className="text-danger cursor-pointer" onClick={() => handleDeleteOperator( index )} size={20} color="red" id="btnDisable" />
                  </td>
                </tr>
              ) )}
            </tbody>
          </Table>
        )}
        <div className='d-flex align-items-center justify-content-between mt-2'>
          <Button
            color='primary '
            size='sm'
            onClick={handleSubmit}
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
              onClick={() => handleCancel()}
            >
              Cancel
            </Button>
          </div>
        </div>
      </UILoader>
    </Sidebar>
  );
};

export default OperatorGroupAddForm;
