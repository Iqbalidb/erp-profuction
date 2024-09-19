/*
     Title: Reject Info
     Description: Reject Info
     Author: Iqbal Hossain
     Date: 25-January-2022
     Modified: 25-January-2022
*/

import Repeater from '@core/components/repeater';
import React, { useState } from 'react';
import { MinusCircle, PlusCircle } from 'react-feather';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import { Button, Card, CardBody, Col, Form, FormFeedback, FormGroup, Input, Label, Row } from 'reactstrap';
import DualButtonModal from 'utility/custom/DualButtonModal';
import { selectThemeColors } from 'utility/Utils';

const serialData = [
  { label: 1, value: 1 },
  { label: 2, value: 2 },
  { label: 3, value: 3 },
  { label: 4, value: 4 },
  { label: 5, value: 5 },
  { label: 6, value: 6 },
  { label: 7, value: 7 },
  { label: 8, value: 8 }
];

const rejectTypeData = [
  { label: 'Reject', value: 'Reject' },
  { label: 'Replace', value: 'Replace' }
];

const ExternalProcessPendingRejectInfo = props => {
  const { openModal, setOpenModal } = props;

  const { errors, handleSubmit } = useForm();

  //#region State
  const [serials, setSerials] = useState( null );
  const [rejectType, setRejectType] = useState( null );
  const [count, setCount] = useState( 1 );
  //#endregion

  //#region  Events
  // add new row
  const handleAdd = () => {
    setCount( count + 1 );
  };

  // remove  row
  const handleDelete = () => {
    // e.preventDefault();
    // e.target.closest('form').remove();
    setCount( count - 1 );
  };

  // for rerial no change
  const handleRejectInfoChange = rejectInfo => {
    setRejectType( rejectInfo );
  };

  // for modal close
  const handleMainModalToggleClose = () => {
    setOpenModal( !openModal );
  };

  // for submit
  const handleModalSubmit = () => {
    setOpenModal( !openModal );
  };

  // for rerial no change
  const handleSerialChange = serial => {
    setSerials( serial );
  };

  //#endregion
  return (
    <div>
      <DualButtonModal
        modalTypeClass="vertically-centered-modal"
        className="modal-dialog-centered modal-lg custom-modal"
        openModal={openModal}
        setOpenModal={setOpenModal}
        handleMainModelSubmit={handleModalSubmit}
        handleMainModalToggleClose={handleMainModalToggleClose}
        title="External Process Reject Info"
      >
        <Card>
          <CardBody className="card-body-override">
            <Repeater count={count}>
              {( i, Idx ) => (
                <Form onSubmit={handleSubmit( handleModalSubmit )} key={i}>
                  <Col xs="12" sm="12" md="12" lg="12" xl="12">
                    <Row className="rounded rounded-3 mr-1">
                      <FormGroup tag={Col} xs={6} sm={6} md={3} lg={3} xl={3}>
                        <Label for="serialNo">Serial No</Label>
                        <Select
                          id="serialNo"
                          isSearchable
                          isClearable
                          bsSize="sm"
                          theme={selectThemeColors}
                          options={serialData}
                          classNamePrefix="select"
                          value={serials}
                          onChange={() => handleSerialChange( Idx )}
                        />
                        {errors && errors.serialNo && <FormFeedback>Serial No is Required!</FormFeedback>}
                      </FormGroup>
                      <FormGroup tag={Col} xs={6} sm={6} md={3} lg={3} xl={3}>
                        <Label for="rejectType">Reject Type</Label>
                        <Select
                          id="rejectType"
                          isSearchable
                          isClearable
                          bsSize="sm"
                          theme={selectThemeColors}
                          options={rejectTypeData}
                          classNamePrefix="select"
                          value={rejectType}
                          onChange={() => handleRejectInfoChange( Idx )}
                        />
                        {errors && errors.rejectType && <FormFeedback>Reject Type is Required!</FormFeedback>}
                      </FormGroup>
                      <FormGroup tag={Col} xs={12} sm={12} md={4} lg={4} xl={4}>
                        <Label for="name">Remarks</Label>
                        <Input name="remarks" id="remarks" placeholder="Remarks" />
                      </FormGroup>
                      <FormGroup tag={Col} xs={2}>
                        <Button color="danger" className="text-nowrap px-1 mt-2" disabled={count === 1} onClick={handleDelete} outline>
                          <MinusCircle size={16} className="me-50" />
                        </Button>
                      </FormGroup>
                    </Row>
                  </Col>
                </Form>
              )}
            </Repeater>
            <Button className="btn-icon ml-2" color="primary" onClick={handleAdd} outline>
              <PlusCircle size={16} className="me-50" />
            </Button>
          </CardBody>
        </Card>
      </DualButtonModal>
    </div>
  );
};

export default ExternalProcessPendingRejectInfo;

/** Change Log
 * 25-Jan-2022(Iqbal): Reject info modal create
 */
