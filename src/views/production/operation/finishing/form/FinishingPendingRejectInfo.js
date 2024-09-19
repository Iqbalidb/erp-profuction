/*
     Title: Finishing Passed Reject Info
     Description: Finishing Passed Reject Info
     Author: Alamgir Kabir
     Date: 06-March-2022
     Modified: 06-March-2022
*/
import Repeater from '@core/components/repeater';
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
const FinishingPendingRejectInfo = props => {
  const { openModal, setOpenModal } = props;
  //#region State
  const [rejectType, setrejectType] = useState( null );
  const [count, setCount] = useState( 1 );
  //#endregion
  //#region Events
  const { errors, handleSubmit } = useForm();

  //For Add Row
  const handleAdd = () => {
    setCount( count + 1 );
  };
  //For Delete Row
  const handleDelete = () => {
    setCount( count - 1 );
  };
  // For Close Modal
  const handleMainModalToggleClose = () => {
    setOpenModal( !openModal );
  };
  // For Submit Modal
  const handleMainModelSubmit = () => {
    setOpenModal( !openModal );
  };

  const handleRejectChange = data => {
    setrejectType( data );
  };
  return (
    <div>
      <DualButtonModal
        openModal={openModal}
        modalTypeClass="vertically-centered-modal"
        className="modal-dialog-centered modal-lg"
        handleMainModalToggleClose={handleMainModalToggleClose}
        handleMainModelSubmit={handleMainModelSubmit}
        title="Finishing Pending Reject Info"
      >
        <Card>
          <CardBody className="card-body-override">
            <Repeater count={count}>
              {( i, idx ) => (
                <Form onSubmit={handleSubmit( handleMainModelSubmit )} key={i}>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Row className="rounded rounded-3 mr-1">
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
                          onChange={() => handleRejectChange( idx )}
                        />
                        {errors && errors.rejectType && <FormFeedback>Reject Type is Required!</FormFeedback>}
                      </FormGroup>
                      <FormGroup tag={Col} xs={6} sm={6} md={3} lg={3} xl={3}>
                        <Label for="quantity">Quantity</Label>
                        <Input id="quantity" name="quantity" type="text" placeholder="Quantity" />
                        {errors && errors.quantity && <FormFeedback>Quantity is Required!</FormFeedback>}
                      </FormGroup>
                      <FormGroup tag={Col} xs={6} sm={6} md={4} lg={4} xl={4}>
                        <Label for="remarks">Remarks</Label>
                        <Input id="remarks" name="remarks" type="text" placeholder="Remarks" />
                        {errors && errors.remarks && <FormFeedback>Remarks is Required!</FormFeedback>}
                      </FormGroup>
                      <FormGroup tag={Col} xs={2} className="d-flex">
                        <Button color="danger" className="text-nowrap px-1 mt-2" disabled={count === 1} outline onClick={handleDelete}>
                          <MinusCircle size={16} className="me-50" />
                        </Button>
                      </FormGroup>
                    </Row>
                  </Col>
                </Form>
              )}
            </Repeater>
            <Button className="btn-icon ml-2" color="primary" outline onClick={handleAdd}>
              <PlusCircle size={16} />
            </Button>
          </CardBody>
        </Card>
      </DualButtonModal>
    </div>
  );
};

export default FinishingPendingRejectInfo;
