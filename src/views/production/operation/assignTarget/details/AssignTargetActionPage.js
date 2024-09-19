/*
     Title: Assign Target Action Info
     Description: Assign Target Action Info
     Author: Iqbal Hossain
     Date: 27-January-2022
     Modified: 27-January-2022
*/

import classnames from 'classnames';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Card, CardBody, Col, Form, FormFeedback, FormGroup, Input, Label, Row } from 'reactstrap';
import DualButtonModal from 'utility/custom/DualButtonModal';
import { setAssignTargetByRange } from '../store/actions';

const AssignTargetActionPage = props => {
  const dispatch = useDispatch();
  const { openModal, setOpenModal, selectedRowIds } = props;

  const { register, errors, handleSubmit } = useForm();

  //#region State
  const [state, setState] = useState( {
    workingMinute: 0,
    efficiency: 0,
    smv: 0,
    target: 0
  } );
  //#endregion

  //#region  Events
  const onChangeWorkingMinute = e => {
    const { name, value } = e.target;

    setState( {
      ...state,
      [name]: +value
    } );
  };

  const onChangeEfficiency = e => {
    const { name, value } = e.target;

    setState( {
      ...state,
      [name]: +value
    } );
  };

  const onChangeSMV = e => {
    const { name, value } = e.target;
    const updateState = { ...state };
    const target = ( updateState.workingMinute * updateState.efficiency ) / value;

    setState( {
      ...state,
      [name]: +value,
      target
    } );
  };

  const handleMainModalToggleClose = () => {
    setOpenModal( !openModal );
  };
  const handleMainModelSubmit = () => {
    setOpenModal( !openModal );
  };

  const onSubmit = () => {
    dispatch( setAssignTargetByRange( selectedRowIds, state.target ) );
    setOpenModal( !openModal );
  };

  //#endregion
  return (
    <div>
      <DualButtonModal
        modalTypeClass="vertically-centered-modal"
        className="modal-dialog-centered modal-lg"
        openModal={openModal}
        setOpenModal={setOpenModal}
        submitText="Save"
        handleModalSubmit={onSubmit}
        handleMainModelSubmit={handleMainModelSubmit}
        handleMainModalToggleClose={handleMainModalToggleClose}
        title="Assign Target Action"
      >
        <Card outline>
          <CardBody className="card-body-override">
            <Form onSubmit={handleSubmit( onSubmit )}>
              <Col xs="12" sm="12" md="12" lg="12" xl="12">
                <Row className="rounded rounded-3 mr-1">
                  <FormGroup tag={Col} xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Label for="date">Date</Label>
                    <Input
                      type="date"
                      name="date"
                      id="date"
                      innerRef={register( { required: false } )}
                      invalid={errors.date && true}
                      className={classnames( { 'is-invalid': errors['date'] } )}
                    />
                    {errors && errors.date && <FormFeedback>Date is Required!</FormFeedback>}
                  </FormGroup>
                  <FormGroup tag={Col} xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Label for="workingMinute">Working Minute</Label>
                    <Input
                      type="number"
                      name="workingMinute"
                      id="workingMinute"
                      placeholder="Working Minute"
                      value={state.workingMinute}
                      onChange={onChangeWorkingMinute}
                      innerRef={register( { required: false } )}
                      invalid={errors.workingMinute && true}
                      className={classnames( { 'is-invalid': errors['workingMinute'] } )}
                    />
                    {errors && errors.workingMinute && <FormFeedback>Working Minute is Required!</FormFeedback>}
                  </FormGroup>
                  <FormGroup tag={Col} xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Label for="efficiency">Efficiency</Label>
                    <Input
                      type="number"
                      name="efficiency"
                      id="efficiency"
                      placeholder="Efficiency"
                      value={state.efficiency}
                      onChange={onChangeEfficiency}
                      innerRef={register( { required: false } )}
                      invalid={errors.efficiency && true}
                      className={classnames( { 'is-invalid': errors['efficiency'] } )}
                    />
                    {errors && errors.efficiency && <FormFeedback>Efficiency is Required!</FormFeedback>}
                  </FormGroup>
                  <FormGroup tag={Col} xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Label for="smv">SMV</Label>
                    <Input
                      type="number"
                      name="smv"
                      id="smv"
                      placeholder="SMV"
                      value={state.smv}
                      onChange={onChangeSMV}
                      innerRef={register( { required: false } )}
                      invalid={errors.smv && true}
                      className={classnames( { 'is-invalid': errors['smv'] } )}
                    />
                    {errors && errors.smv && <FormFeedback>SMV is Required!</FormFeedback>}
                  </FormGroup>
                  <FormGroup tag={Col} xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Label for="target">Target</Label>
                    <Input
                      type="text"
                      className="text-center"
                      disabled
                      // readOnly
                      // placeholder="Target"
                      // innerRef={register({ required: false })}
                      value={state.target === 'Infinity' ? 0 : state.target}
                    // onChange={e => onSubmit(e)}
                    // invalid={errors.target && true}
                    // className={classnames({ 'is-invalid': errors['target'] })}
                    />
                    {/* {errors && errors.target && <FormFeedback>Target is Required!</FormFeedback>} */}
                  </FormGroup>
                  <FormGroup tag={Col} xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Label for="name">Remarks</Label>
                    <Input name="remarks" id="remarks" placeholder="Remarks" />
                  </FormGroup>
                </Row>
              </Col>
            </Form>
          </CardBody>
        </Card>
      </DualButtonModal>
    </div>
  );
};

export default AssignTargetActionPage;

/** Change Log
 * 27-Jan-2022(Iqbal): Assign Target Action info modal create
 */
