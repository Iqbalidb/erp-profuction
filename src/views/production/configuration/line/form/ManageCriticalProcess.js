/*
     Title: Manage Critical Process
     Description: Manage Critical Process
     Author: Ashraful Islam
     Date: 24-October-2022
     Modified: 24-October-2022
*/

import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import React, { useEffect, useState } from 'react';
import { MinusCircle, PlusCircle } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button, Card, CardBody, Col, Form, FormFeedback, FormGroup, Input, Label, Row } from 'reactstrap';
import { dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { CRITICAL_PROCESS_LINES_API } from 'services/api-end-points/production/v1/criticalProcessInLines';
import { stringifyConsole } from 'utility/commonHelper';
import DualButtonModal from 'utility/custom/DualButtonModal';
import { notify } from 'utility/custom/notifications';
import { selectThemeColors } from 'utility/Utils';
import { v4 as uuid } from 'uuid';
import { resetCriticalProcessDdl } from '../../criticalProcess/store/actions';
import { closeCriticalProcessManageModal } from '../store/actions';

const ManageCriticalProcess = props => {
  const { openModal, setOpenModal } = props;
  //#region hooks
  const dispatch = useDispatch();
  const {
    criticalProcessReducer: { criticalProcessDdl },
    commonReducers: { iSubmitProgressCM },
    lineReducer: { loadCriticalProcessInLinesData, lineDataForManageCriticalProcess }
  } = useSelector( state => state );
  const { errors, handleSubmit } = useForm();
  //#endregion

  //#region States
  const initialState = {
    rowId: uuid(),
    groupId: '',
    criticalProcesses: criticalProcessDdl,
    criticalProcess: null,
    lineId: null,
    status: true,
    deletable: true,
    processType: ''
  };

  const [criticalProcessCombination, setCriticalProcessCombination] = useState( [initialState] );
  //#endregion
  //#region Effects
  useEffect( () => {
    if ( criticalProcessDdl && loadCriticalProcessInLinesData?.length === 0 ) {
      const updatedProcessCom = criticalProcessCombination?.map( item => ( {
        ...item, criticalProcesses: criticalProcessDdl
      } ) );

      setCriticalProcessCombination( updatedProcessCom );
      // setCriticalProcessCombination( prev => {
      //   prev.forEach( item => ( item.criticalProcesses = criticalProcessDdl ) );
      //   return prev;
      // } );
    } else if ( criticalProcessDdl && loadCriticalProcessInLinesData?.length > 0 ) {

      const updatedList = loadCriticalProcessInLinesData?.map( cpld => {
        const initialStateObj = {
          rowId: uuid(),
          groupId: cpld.id,
          criticalProcess: {
            id: cpld.criticalProcessId,
            processType: cpld.processType,
            name: cpld.criticalProcessName,
            label: cpld.criticalProcessName
          },
          criticalProcesses: criticalProcessDdl,
          lineId: cpld.lineId,
          status: cpld.status,
          deletable: false,
          processType: cpld.processType
        };
        return initialStateObj;
      } );

      setCriticalProcessCombination( updatedList );
    }
  }, [criticalProcessDdl, loadCriticalProcessInLinesData] );
  //#endregion

  //Handle Add Combination
  const onAddCombination = () => {
    setCriticalProcessCombination( prev => {
      const newInitialState = { ...initialState };
      const criticalProcessIds = prev.map( item => item?.criticalProcess?.id );
      const filteredCriticalProcesses = newInitialState.criticalProcesses.filter( item => !criticalProcessIds.includes( item.id ) );
      newInitialState.criticalProcesses = filteredCriticalProcesses;
      return [...prev, newInitialState];
    } );
  };

  //Handle Status Change
  const handleStatusChange = ( e, index ) => {
    const _combo = [...criticalProcessCombination];
    const targetItem = _combo[index];
    targetItem.status = e.target.checked;
    _combo[index] = targetItem;
    setCriticalProcessCombination( _combo );
  };

  //Handle Remove Item
  const handleRemoveItem = idx => {
    const combo = [...criticalProcessCombination];
    const { criticalProcesses } = initialState;
    combo.splice( idx, 1 );
    const criticalProcessIds = combo.map( item => item?.criticalProcess?.id );
    const filteredCriticalProcesses = criticalProcesses.filter( item => !criticalProcessIds.includes( item.id ) );
    combo[combo.length - 1].criticalProcesses = filteredCriticalProcesses;
    setCriticalProcessCombination( combo );
  };

  //On Change critical process
  const onChangeCriticalProcess = ( item, index ) => {
    const _combo = [...criticalProcessCombination];
    const targetItem = _combo[index];
    targetItem.criticalProcess = item;
    targetItem.processType = item?.processType;
    _combo[index] = targetItem;
    setCriticalProcessCombination( _combo );
  };

  // row valid check
  const isValid = criticalProcessCombination?.every( i => i?.criticalProcess );

  // duplicate critical process check

  const duplicateCriticalProcessCheck = criticalProcessArray => {
    const criticalProcessIds = criticalProcessArray.map( item => {
      return item.criticalProcessId;
    } );

    const isDuplicate = criticalProcessIds.some( ( item, idx ) => {
      return criticalProcessIds.indexOf( item ) !== idx;
    } );

    return isDuplicate;
  };

  //Handle Modal Submit
  const handleModalSubmit = async () => {
    if ( isValid ) {
      const payload = {
        newCriticalProcessInLines: criticalProcessCombination.map( cp => ( {
          groupId: cp.groupId,
          criticalProcessId: cp.criticalProcess.id,
          lineId: lineDataForManageCriticalProcess.id,
          processType: cp.criticalProcess.processType,
          status: cp.status
        } ) )
      };

      if ( duplicateCriticalProcessCheck( payload.newCriticalProcessInLines ) ) {
        notify( 'warning', 'Please remove duplicate critical process!!!' );
        return;
      }
      stringifyConsole( payload );
      dispatch( dataSubmitProgressCM( true ) );

      try {
        const res = await baseAxios.post( CRITICAL_PROCESS_LINES_API.add, payload );
        if ( res.data.succeeded ) {
          notify( 'success', 'Data Submitted Successfully' );
          dispatch( dataSubmitProgressCM( false ) );

          dispatch( closeCriticalProcessManageModal() );
        }
      } catch ( error ) {
        notify( 'error', 'Something went wrong!!! Please try again' );
        dispatch( dataSubmitProgressCM( false ) );

      }
    } else {
      notify( 'warning', 'Please fill all  fields!!!' );
    }
  };

  //for modal close
  const handleMainModelSubmit = () => {
    dispatch( closeCriticalProcessManageModal() );
    dispatch( resetCriticalProcessDdl() );
  };

  //Handle Modal Toggle Close
  const handleMainModalToggleClose = () => {
    dispatch( closeCriticalProcessManageModal() );
    dispatch( resetCriticalProcessDdl() );
  };
  //#endregion
  return (
    <div>
      <DualButtonModal
        modalTypeClass="vertically-centered-modal"
        className="modal-dialog-centered modal-lg custom-modal"
        openModal={openModal}
        setOpenModal={setOpenModal}
        handleModalSubmit={handleModalSubmit}
        handleMainModelSubmit={handleMainModelSubmit}
        handleMainModalToggleClose={handleMainModalToggleClose}
        title="Manage Critical Process"
        submitText="Save"
      >
        <UILoader
          blocking={iSubmitProgressCM}
          loader={<ComponentSpinner />}>
          <Card style={{ margin: '0.5rem' }}>
            <CardBody>
              <Form onSubmit={handleSubmit( handleModalSubmit )}>
                <Row>
                  <FormGroup tag={Col} xs={6} sm={6} md={4} lg={4} xl={4}>
                    <Label className="text-dark font-weight-bold mb-1 h5 text-nowrap" style={{ marginLeft: '1rem' }}>Line : {lineDataForManageCriticalProcess?.name}</Label>
                  </FormGroup>
                  <FormGroup tag={Col} xs={6} sm={6} md={4} lg={4} xl={4}>
                    <Label className="text-dark font-weight-bold mb-1 h5 text-nowrap">
                      Product Process : {lineDataForManageCriticalProcess?.productionProcessName}
                    </Label>
                  </FormGroup>
                  <FormGroup tag={Col} xs={6} sm={6} md={4} lg={4} xl={4}>
                    <Label className="text-nowrap text-dark font-weight-bold mb-1 h5" >Floor : {lineDataForManageCriticalProcess?.floorName}</Label>
                  </FormGroup>
                </Row>
                <Col xs="12" sm="12" md="12" lg="12" xl="12">
                  {criticalProcessCombination.map( ( cp, idx ) => (
                    <Row key={cp.rowId} className="rounded rounded-3 mr-1">
                      <FormGroup tag={Col} xs={6} sm={6} md={4} lg={4} xl={4}>
                        <Label for="serialNo">Critical Process</Label>
                        <Select
                          id={`criticalProcess${idx}`}
                          isSearchable
                          isClearable
                          name="criticalProcessId"
                          theme={selectThemeColors}
                          className="erp-dropdown-select"
                          classNamePrefix="dropdown"
                          options={cp?.criticalProcesses}
                          value={cp?.criticalProcess}
                          onChange={item => onChangeCriticalProcess( item, idx )}
                        />
                        {errors && errors.criticalProcessId && <FormFeedback>Critical Process is required!</FormFeedback>}
                      </FormGroup>
                      <FormGroup tag={Col} xs={6} sm={6} md={4} lg={4} xl={4}>
                        <Label for="serialNo">Process Type</Label>
                        <Input bsSize="sm" disabled type="text" value={cp?.processType ? cp?.processType : ''} />
                      </FormGroup>
                      <FormGroup tag={Col} xs={12} sm={12} md={2} lg={2} xl={2}>
                        <Label for="status" style={{ marginTop: '30px' }}>
                          <Input
                            name="status"
                            id={`status ${cp.rowId}`}
                            type="checkbox"
                            style={{ marginLeft: '5px', marginTop: '1px' }}
                            checked={cp.status}
                            onChange={e => handleStatusChange( e, idx )}
                          />
                          <span style={{ marginLeft: '25px' }}>Is Active</span>
                        </Label>
                      </FormGroup>
                      <FormGroup tag={Col} xs={2} className="d-flex">
                        <Button
                          color="danger"
                          className="text-nowrap px-1 mt-1"
                          disabled={criticalProcessCombination.length === 1 || !cp.deletable}
                          onClick={() => handleRemoveItem( idx )}
                          outline
                        >
                          <MinusCircle size={14} />
                        </Button>
                        {idx === criticalProcessCombination.length - 1 && (
                          <Button
                            className="btn-icon ml-2 mt-1 px-1"
                            color="primary"
                            onClick={onAddCombination}
                            disabled={cp.criticalProcess === null}
                            outline
                          >
                            <PlusCircle size={14} />
                          </Button>
                        )}
                      </FormGroup>
                    </Row>
                  ) )}
                </Col>
              </Form>
            </CardBody>
          </Card>
        </UILoader>
      </DualButtonModal>
    </div>
  );
};

export default ManageCriticalProcess;
