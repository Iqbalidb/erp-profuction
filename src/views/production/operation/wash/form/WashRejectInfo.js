/*
     Title: Reject Info
     Description: Reject Info
     Author: Iqbal Hossain
     Date: 12-February-2022
     Modified: 12-February-2022
*/

import Repeater from '@core/components/repeater';
import classnames from 'classnames';
import React, { useState } from 'react';
import { MinusCircle, PlusCircle } from 'react-feather';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import { Button, Card, CardBody, Col, Form, FormFeedback, FormGroup, Input, Label, Row } from 'reactstrap';
import DualButtonModal from 'utility/custom/DualButtonModal';
import { selectThemeColors } from 'utility/Utils';

const rejectTypeData = [
  { label: 'Reject', value: 'Reject' },
  { label: 'Replace', value: 'Replace' }
];

const WashRejectInfo = props => {
  const { openModal, setOpenModal } = props;
  const { register, errors, handleSubmit } = useForm();

  //#region State
  const [rejectType, setRejectType] = useState( null );
  const [count, setCount] = useState( 1 );
  //#endregion

  //#region  Events
  const handleAdd = () => {
    setCount( count + 1 );
  };
  const handleDelete = () => {
    // e.preventDefault();
    // e.target.closest('form').remove();
    setCount( count - 1 );
  };

  const handleMainModalToggleClose = () => {
    setOpenModal( !openModal );
  };

  const handleModalSubmit = () => {
    setOpenModal( !openModal );
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
        title="Panel Check Reject Info"
      >
        <Card>
          <CardBody className="card-body-override">
            <Repeater count={count}>
              {( i, index ) => (
                <Form onSubmit={handleSubmit( handleModalSubmit )} key={i}>
                  <Col xs="12" sm="12" md="12" lg="12" xl="12" key={index + 1}>
                    <Row className="rounded rounded-3 ">
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
                          onChange={data => {
                            setRejectType( data );
                          }}
                        />
                        {errors && errors.rejectType && <FormFeedback>Reject Type is Required!</FormFeedback>}
                      </FormGroup>
                      <FormGroup tag={Col} xs={6} sm={6} md={3} lg={3} xl={3}>
                        <Label for="quantity">Quantity</Label>
                        <Input
                          name="quantity"
                          id="quantity"
                          placeholder="Quantity"
                          innerRef={register( { required: true } )}
                          invalid={errors.quantity && true}
                          className={classnames( { 'is-invalid': errors['quantity'] } )}
                        />
                        {errors && errors.quantity && <FormFeedback>Quantity is Required!</FormFeedback>}
                      </FormGroup>

                      <FormGroup tag={Col} xs={6} sm={6} md={3} lg={3} xl={3}>
                        <Label for="name">Remarks</Label>
                        <Input
                          name="remarks"
                          id="remarks"
                          placeholder="Remarks"
                          innerRef={register( { required: true } )}
                          invalid={errors.remarks && true}
                          className={classnames( { 'is-invalid': errors['remarks'] } )}
                        />
                      </FormGroup>
                      <FormGroup tag={Col} xs={6} sm={6} md={2} lg={2} xl={2} className="d-flex justify-content-between">
                        {count !== 1 && (
                          <Button color="danger" className="text-nowrap px-1 mt-2" onClick={handleDelete} outline>
                            <MinusCircle size={16} className="me-50" />
                          </Button>
                        )}

                        {count === count && (
                          <Button color="primary" className="text-nowrap px-1 mt-2" onClick={handleAdd} outline>
                            <PlusCircle size={16} className="me-50" />
                          </Button>
                        )}
                      </FormGroup>
                    </Row>
                  </Col>
                </Form>
              )}
            </Repeater>
          </CardBody>
        </Card>
      </DualButtonModal>
    </div>
  );
};

export default WashRejectInfo;

/** Change Log
 * 12-Feb-2022(Iqbal): Reject info modal create
 */
