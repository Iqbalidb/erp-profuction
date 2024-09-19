/* eslint-disable eqeqeq */
/*
   Title: Zone Group Add Form
   Description: Zone Group Add Form
   Author: Alamgir Kabir
   Date: 29-March-2022
   Modified: 29-March-2022
*/
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import classnames from 'classnames';
import ActionMenu from 'layouts/components/menu/action-menu';
import { useEffect, useState } from 'react';
import { MinusCircle, PlusCircle } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { Button, Col, FormFeedback, Input, Label, NavItem, NavLink, Row, Table } from 'reactstrap';
import { dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { LINE_API } from 'services/api-end-points/production/v1';
import { ZONE_GROUP_API } from 'services/api-end-points/production/v1/zoneGroup';
import { errorResponse, selectThemeColors } from 'utility/Utils';
import { mapArrayToDropdown, stringifyConsole } from 'utility/commonHelper';
import FormContentLayout from 'utility/custom/FormContentLayout';
import FormLayout from 'utility/custom/FormLayout';
import { ErpInput } from 'utility/custom/customController/ErpInput';
import ErpSelect from 'utility/custom/customController/ErpSelect';
import { notify } from 'utility/custom/notifications';
import { v4 as uuid } from 'uuid';
import { fillZoneDdl } from '../../zone/store/actions';
import classes from '../styles/ZoneGroupAddForm.module.scss';

const ZoneGroupAddFormModified = () => {
  //#region Hooks
  const dispatch = useDispatch();
  const history = useHistory();
  const { dropDownItems: ddlZone } = useSelector( ( { zoneReducer } ) => zoneReducer );
  const { iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );

  const { register, errors, handleSubmit } = useForm();
  //#endregion

  //#region State
  const [lineData, setLineData] = useState( [] );
  const initialState = {
    rowId: uuid(),
    lines: lineData,
    line: null,
    status: false
  };
  const [zone, setZone] = useState( null );
  const [zoneGroupCombination, setZoneGroupCombination] = useState( [initialState] );
  const [isPageLoaded, setIsPageLoaded] = useState( false );
  //#endregion

  //#region Effects
  useEffect( () => {
    dispatch( fillZoneDdl() );
  }, [dispatch] );

  useEffect( () => {
    if ( lineData ) {
      setZoneGroupCombination( prev => {
        prev.forEach( item => ( item.lines = lineData ) );
        setIsPageLoaded( true );
        return prev;
      } );
    }
  }, [lineData] );

  // For adding new row
  const onAddCombination = () => {
    setZoneGroupCombination( prev => {
      const newState = { ...initialState };
      const lineIds = prev.map( item => item?.line?.id );
      const filteredLines = newState.lines.filter( item => !lineIds.includes( item.id ) );
      newState.lines = filteredLines;
      return [...prev, newState];
    } );
  };

  //For removing row
  const handleRemoveItem = idx => {
    const combo = [...zoneGroupCombination];
    const { lines } = initialState;
    combo.splice( idx, 1 );
    const lineIds = combo.map( item => item?.line?.id );
    const filteredLines = lines.filter( item => !lineIds.includes( item.id ) );

    combo[combo.length - 1].lines = filteredLines;
    setZoneGroupCombination( combo );
  };

  //For Zone Change
  const onChangeZone = async item => {
    if ( item === null ) {
      setZone( [] );
      setZoneGroupCombination( [initialState] );
    } else if ( item ) {
      const res = await baseAxios.get( LINE_API.fetch_line_by_floor_and_production_process_id( item?.floorId, item?.productionProcessId ) );
      const ddlArray = mapArrayToDropdown( res.data.data, 'name', 'id' );
      setLineData( ddlArray );
      setZoneGroupCombination( [initialState] );
      setZone( item );
    }
  };

  //For Line Change
  const onChangeLine = ( item, index ) => {
    const _combo = [...zoneGroupCombination];
    const targetItem = _combo[index];
    targetItem.line = item;
    _combo[index] = targetItem;
    setZoneGroupCombination( _combo );
  };

  //For Status Chante
  const handleStatusChange = ( e, index ) => {
    const _combo = [...zoneGroupCombination];
    const targetItem = _combo[index];
    targetItem.status = e.target.checked;
    _combo[index] = targetItem;
    setZoneGroupCombination( _combo );
  };

  //duplicate line check
  const duplicateLineCheck = lineArray => {
    const lineIds = lineArray.map( item => {
      return item.lineId;
    } );

    const isDuplicate = lineIds.some( ( item, idx ) => {
      return lineIds.indexOf( item ) != idx;
    } );
    return isDuplicate;
  };
  //For Cancel
  const handleCancel = () => {
    history.goBack();
  };
  //For Submit Data
  const onSubmit = async values => {
    const { empName, empCode } = values;
    const payload = {
      zoneId: zone?.value,
      zoneName: zone?.label,
      ownerEmpCode: empCode,
      ownerName: empName,
      status: true,
      list: zoneGroupCombination?.map( comb => ( {
        lineId: comb?.line?.value,
        lineName: comb?.line?.label,
        status: comb?.status
      } ) )
    };
    stringifyConsole( payload );

    if ( duplicateLineCheck( payload.list ) ) {
      notify( 'warning', 'Please remove duplicate line!!!' );
      return;
    }
    const isValid = payload.list.every( e => e.lineName );
    if ( isValid && zone?.value ) {
      dispatch( dataSubmitProgressCM( true ) );
      try {
        const res = await baseAxios.post( ZONE_GROUP_API.add, payload );

        notify( 'success', 'Zone group has been added' );
        dispatch( dataSubmitProgressCM( false ) );
        handleCancel();

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
      id: 'zone-group',
      name: 'Zone Group',
      link: "/zone-group",
      isActive: false,
      hidden: false
    },
    {
      id: 'zone-group-create',
      name: 'New Zone Group',
      link: "/zone-group-create",
      isActive: true,
      hidden: false
    },
  ];
  //#endregion
  /**
 * Loader
 */
  if ( !isPageLoaded ) {
    return <div>Loading....</div>;
  }
  return (
    <>
      <UILoader
        blocking={iSubmitProgressCM}
        loader={<ComponentSpinner />}>
        <ActionMenu
          breadcrumb={breadcrumb}
          title="New Zone Group">
          <NavItem className="mr-1">
            <NavLink tag={Button} size="sm" color="primary" type="submit">
              Save
            </NavLink>
          </NavItem>
          <NavItem className="mr-1">
            <NavLink tag={Button} size="sm" color="secondary" onClick={handleCancel}>
              Cancel
            </NavLink>
          </NavItem>
        </ActionMenu>
        <FormLayout isNeedTopMargin={true}>
          <FormContentLayout title="Master Information">

            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <Row>
                <Col xs={12} sm={12} md={12} lg={4} xl={4}>
                  <ErpSelect
                    id="zone"
                    label='Zone'
                    isSearchable
                    isClearable
                    className={`${!zone ? 'bg-red' : 'bg-dark'} erp-dropdown-select`}
                    isSelected={true}
                    theme={selectThemeColors}
                    classNamePrefix="dropdown"
                    options={ddlZone}
                    value={zone}
                    onChange={data => onChangeZone( data )}
                  />
                </Col>
                <Col xs={12} sm={12} md={12} lg={4} xl={4}>
                  <ErpInput
                    id="empCode"
                    name="empCode"
                    type="text"
                    bsSize="sm"
                    innerRef={register( { required: true } )}
                    invalid={errors.empCode && true}
                    className={classnames( { 'is-invalid': errors['empCode'] } )}
                    label='Employee Code'
                  />
                </Col>
                <Col xs={12} sm={12} md={12} lg={4} xl={4}>
                  <ErpInput
                    id="empName"
                    type="text"
                    name="empName"
                    bsSize="sm"
                    innerRef={register( { required: true } )}
                    invalid={errors.empName && true}
                    className={classnames( { 'is-invalid': errors['empName'] } )}
                    label='Employee Name'
                  />
                </Col>
              </Row>
            </Col>
          </FormContentLayout>
          <FormContentLayout title="Details" marginTop  >
            <Table size="sm" className={classes.zoneGroupTable}>
              <thead className={`table-bordered ${classes.stickyTableHead}`}>
                <tr>
                  <th>Line</th>
                  <th>Status</th>
                  <th style={{ width: '200px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {zoneGroupCombination?.map( ( zg, idx ) => (
                  <tr key={zg.rowId}>
                    <td style={{ width: '50%' }}>
                      <Select
                        id={`line${idx}`}
                        isSearchable
                        isClearable
                        name="line"
                        theme={selectThemeColors}
                        className="erp-dropdown-select"
                        classNamePrefix="dropdown"
                        options={zg.lines}
                        value={zg.line}
                        onChange={item => onChangeLine( item, idx )}
                      />
                      {errors && errors.line && <FormFeedback>Line is required!</FormFeedback>}
                    </td>
                    <td>
                      {' '}
                      <Label for="status">
                        <Input
                          name="status"
                          id={`status ${zg.rowId}`}
                          type="checkbox"
                          style={{ marginLeft: '5px', marginTop: '1px' }}
                          checked={zg.status}
                          onChange={e => handleStatusChange( e, idx )}
                        />
                        <span style={{ marginLeft: '25px' }}>Is Active</span>
                      </Label>
                    </td>
                    <td style={{ width: '200px' }}>
                      <div className="d-flex justify-content-start ml-5">
                        <Button
                          size="sm"
                          id="btnRemove"
                          type="button"
                          outline
                          disabled={zoneGroupCombination.length === 1}
                          color={`${zoneGroupCombination.length > 1 ? 'danger' : 'secondary'}`}
                          onClick={() => handleRemoveItem( idx )}
                        >
                          <MinusCircle id="btnRemove" size={14} />
                        </Button>
                        {idx === zoneGroupCombination.length - 1 && (
                          <Button
                            className="ml-1"
                            color="primary"
                            size="sm"
                            id="btnAdd"
                            type="button"
                            outline
                            // zg.lines.length===0 &&
                            disabled={zg.line === null}
                            onClick={onAddCombination}
                          >
                            <PlusCircle id="btnAdd" size={14} />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) )}
              </tbody>
            </Table>
          </FormContentLayout>
        </FormLayout>
      </UILoader>
    </>
  );
};

export default ZoneGroupAddFormModified;
