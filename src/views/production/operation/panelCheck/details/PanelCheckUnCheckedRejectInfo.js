/*
     Title: Reject Info
     Description: Reject Info
     Author: Iqbal Hossain
     Date: 25-January-2022
     Modified: 25-January-2022
*/

import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { MinusCircle, PlusCircle } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button, Card, CardBody, Col, Form, FormFeedback, FormGroup, Input, Label, Row, Table } from 'reactstrap';
import { dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { DAMAGE_INFO_API } from 'services/api-end-points/production/v1/damageInfo';
import DualButtonModal from 'utility/custom/DualButtonModal';
import { notify } from 'utility/custom/notifications';
import { rejectTypeData } from 'utility/enums';
import { errorResponse, selectThemeColors } from 'utility/Utils';
import { v4 as uuid } from 'uuid';
import { fetchUnchecked, setUnCheckedRejectBundle, toggleUncheckedRejectModalOpen } from '../store/actions';
import classess from '../styles/PanelCheckBundleDetails.module.scss';
const PanelCheckUnCheckedRejectInfo = props => {
  const { damageInfoList } = props;
  //#region Hooks
  const dispatch = useDispatch();
  const { selectedUnCheckedRejectBundle, isUnCheckedRejectModalOpen } = useSelector( ( { panelCheckReducer } ) => panelCheckReducer );
  const { iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
  const { errors, handleSubmit } = useForm();
  //#endregion

  //#region State
  const [damageInfo, setDamageInfo] = useState( [] );
  //#endregion

  //#region UDFS
  const _cloneDamageInfoList = [...damageInfoList];
  const damageInfoListSortBySerialNo = ( a, b ) => {
    return a['serialNo'] - b['serialNo'];
  };
  const damageData = _cloneDamageInfoList.sort( damageInfoListSortBySerialNo );
  //#endregion

  //#region Effects
  useEffect( () => {
    if ( selectedUnCheckedRejectBundle ) {
      let startSerial = selectedUnCheckedRejectBundle?.serialStart;
      const endSerial = selectedUnCheckedRejectBundle?.serialEnd;
      const serial = [];
      while ( startSerial <= endSerial ) {
        const serialObj = {
          label: startSerial,
          value: startSerial
        };
        serial.push( serialObj );
        startSerial++;
      }
      const filteredSerials = serial.filter( s => !selectedUnCheckedRejectBundle.rejectedSerials.includes( s.value ) );
      const damage = {
        rowId: uuid(),
        serials: filteredSerials,
        selectedSerial: null,
        damageTypes: rejectTypeData,
        selectedDamageType: null,
        remarks: '',
        bundleId: selectedUnCheckedRejectBundle?.id
      };
      setDamageInfo( prev => [...prev, damage] );
    }
  }, [selectedUnCheckedRejectBundle] );
  //#endregion

  //#region  Events

  // add new row
  const isValid = damageInfo.every( i => i.selectedDamageType && i.selectedSerial && i.remarks );
  const handleAdd = () => {
    if ( isValid ) {
      let startSerial = selectedUnCheckedRejectBundle.serialStart;
      const endSerial = selectedUnCheckedRejectBundle.serialEnd;
      const serial = [];
      while ( startSerial <= endSerial ) {
        const serialObj = {
          label: startSerial,
          value: startSerial
        };
        serial.push( serialObj );
        startSerial++;
      }
      const filteredRejectedSerials = serial.filter( s => !selectedUnCheckedRejectBundle.rejectedSerials.includes( s.value ) );
      const remainingSerials = filteredRejectedSerials.filter( item => !damageInfo.some( d => d.selectedSerial.value === item.value ) );
      const damage = {
        rowId: uuid(),
        serials: remainingSerials,
        selectedSerial: null,
        damageTypes: rejectTypeData,
        selectedDamageType: null,
        remarks: '',
        bundleId: selectedUnCheckedRejectBundle.id
      };
      setDamageInfo( prev => [...prev, damage] );
    } else {
      notify( 'warning', 'Please fill all  fields!!!' );
    }
  };

  // remove  row
  const handleDelete = ( idx, removeSerial ) => {
    const _damageInfo = [...damageInfo];
    _damageInfo.splice( idx, 1 );
    const updatedDamageInfo = _damageInfo.map( d => ( {
      ...d,
      serials: _.sortBy( [...d.serials, removeSerial], ['value'] )
    } ) );
    setDamageInfo( updatedDamageInfo );
  };

  // for rerial no change
  const handleRejectInfoChange = ( rejectInfo, rowId ) => {
    const _damageInfo = [...damageInfo];
    _damageInfo.map( item => {
      if ( item.rowId === rowId ) {
        item.selectedDamageType = rejectInfo;
      }
      return item;
    } );
    setDamageInfo( _damageInfo );
  };

  // for rerial no change
  const handleSerialChange = ( serial, rowId ) => {
    const _damageInfo = [...damageInfo];
    _damageInfo.map( item => {
      if ( item.rowId === rowId ) {
        item.selectedSerial = serial;
      }
      return item;
    } );
    setDamageInfo( _damageInfo );
  };
  const onRemarksChange = ( e, rowId ) => {
    const _damageInfo = [...damageInfo];
    _damageInfo.map( item => {
      if ( item.rowId === rowId ) {
        item.remarks = e.target.value;
      }
      return item;
    } );

    setDamageInfo( _damageInfo );
  };
  // for modal close
  const handleMainModalToggleClose = () => {
    dispatch( toggleUncheckedRejectModalOpen() );
    dispatch( setUnCheckedRejectBundle( null ) );
  };
  // for modal close
  const handleMainModelSubmit = () => {
    dispatch( toggleUncheckedRejectModalOpen() );
    dispatch( setUnCheckedRejectBundle( null ) );
  };

  // for submit
  const handleModalSubmit = async () => {
    if ( isValid ) {
      const payload = {
        damageInfos: damageInfo.map( d => ( {
          bundleId: d.bundleId,
          damageType: d.selectedDamageType.value,
          details: d.remarks,
          serialNo: d.selectedSerial.value
        } ) )
      };
      dispatch( dataSubmitProgressCM( true ) );
      try {
        const res = await baseAxios.post( DAMAGE_INFO_API.add, payload );
        if ( res.data.succeeded ) {
          notify( 'success', 'Data Submitted Successfully' );
          dispatch( toggleUncheckedRejectModalOpen() );
          dispatch( setUnCheckedRejectBundle( null ) );
          dispatch( fetchUnchecked() );
          dispatch( dataSubmitProgressCM( false ) );
        }
      } catch ( error ) {
        errorResponse( error );
        dispatch( dataSubmitProgressCM( false ) );
      }
    } else {
      notify( 'warning', 'Please fill all  fields!!!' );
    }
  };

  //#endregion
  return (
    <div>
      <DualButtonModal
        modalTypeClass="vertically-centered-modal"
        className="modal-dialog-centered modal-lg custom-modal"
        openModal={isUnCheckedRejectModalOpen}
        setOpenModal={!isUnCheckedRejectModalOpen}
        submitText="Save"
        handleMainModelSubmit={handleMainModelSubmit}
        handleModalSubmit={handleModalSubmit}
        handleMainModalToggleClose={handleMainModalToggleClose}
        title="Damage Info "

      >
        <UILoader
          blocking={iSubmitProgressCM}
          loader={<ComponentSpinner />}>
          <Card>
            <CardBody className="card-body-override">
              <Form onSubmit={handleSubmit( handleModalSubmit )}>
                <Col xs="12" sm="12" md="12" lg="12" xl="12">
                  {damageInfo.map( ( damage, idx ) => (
                    <Row key={damage.rowId} className="rounded rounded-3 mr-1">
                      <FormGroup tag={Col} xs={6} sm={6} md={3} lg={3} xl={3}>
                        <Label for="serialNo">Serial No</Label>
                        <Select
                          id={`serialNo-${damage.rowId}`}
                          isSearchable
                          bsSize="sm"
                          theme={selectThemeColors}
                          options={damage.serials}
                          className="erp-dropdown-select"
                          classNamePrefix="dropdown"
                          value={damage.selectedSerial}
                          onChange={item => handleSerialChange( item, damage.rowId )}
                        />
                        {errors && errors.serialNo && <FormFeedback>Serial No is Required!</FormFeedback>}
                      </FormGroup>
                      <FormGroup tag={Col} xs={6} sm={6} md={3} lg={3} xl={3}>
                        <Label for="rejectType">Reject Type</Label>
                        <Select
                          id={`rejectType${damage.rowId}`}
                          isSearchable
                          bsSize="sm"
                          theme={selectThemeColors}
                          options={damage.damageTypes}
                          className="erp-dropdown-select"
                          classNamePrefix="dropdown"
                          value={damage.selectedDamageType}
                          onChange={item => handleRejectInfoChange( item, damage.rowId )}
                        />
                        {errors && errors.rejectType && <FormFeedback>Reject Type is Required!</FormFeedback>}
                      </FormGroup>
                      <FormGroup tag={Col} xs={12} sm={12} md={4} lg={4} xl={4}>
                        <Label for="name">Remarks</Label>
                        <Input
                          name="remarks"
                          id="remarks"
                          bsSize="sm"
                          value={damage.remarks}
                          onChange={e => onRemarksChange( e, damage.rowId )}
                          placeholder="Remarks"
                        />
                      </FormGroup>
                      <FormGroup className="d-flex" tag={Col} xs={2}>
                        <Button
                          color="danger"
                          className="text-nowrap px-1 mt-2"
                          disabled={damageInfo.length === 1}
                          onClick={() => handleDelete( idx, damage.selectedSerial )}
                          outline
                        >
                          <MinusCircle size={14} />
                        </Button>
                        {idx === damageInfo.length - 1 && (
                          <Button className="btn-icon ml-2 px-1 mt-2" color="primary" onClick={() => handleAdd()} outline>
                            <PlusCircle size={14} />
                          </Button>
                        )}
                      </FormGroup>
                    </Row>
                  ) )}
                </Col>
              </Form>
              <Card className="mb-0">
                <Table className={classess.panelCheckDetailsTable} size="sm" bordered={true} striped={true}>
                  <thead className={` table-bordered `}>
                    <tr className="text-center">
                      <th>SL NO</th>
                      <th>Product Parts</th>
                      <th>Damage Type</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {damageData?.map( di => (
                      <tr key={di.id}>
                        <td>{di.serialNo}</td>
                        <td>{di.productPartsName}</td>
                        <td>{di.damageType}</td>
                      </tr>
                    ) )}
                  </tbody>
                </Table>
              </Card>
            </CardBody>
          </Card>
        </UILoader>
      </DualButtonModal>
    </div>
  );
};

export default PanelCheckUnCheckedRejectInfo;

/** Change Log
 * 25-Jan-2022(Iqbal): Reject info modal create
 */
