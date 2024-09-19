/*
   Title: Sewing Out Assign To Passed
   Description: Sewing Out Assign To Passed
   Author: Alamgir Kabir
   Date: 05-March-2022
   Modified: 05-March-2022
*/

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import { Card, CardBody, Col, Form, FormFeedback, FormGroup, Input, Label, Row, Table } from 'reactstrap';
import DualButtonModal from 'utility/custom/DualButtonModal';
import { notify } from 'utility/custom/notifications';
import CustomDatePicker from 'utility/custom/production/CustomDatePicker';
import CustomTimePicker from 'utility/custom/production/CustomTimePicker';
import { selectThemeColors } from 'utility/Utils';

const processTypes = [
  { label: 'Stock', value: 'Stock' },
  { label: 'Passed', value: 'Passed' }
];

const FinishingAssignToPassed = props => {
  //Props
  const { openModal, setOpenModal, data } = props;

  //#region State
  const [processType, setProcessType] = useState( null );
  const [date, setDate] = useState( new Date() );
  const [time, setTime] = useState( '' );
  const [quantityChange, setQuentityChange] = useState( 0 );
  //#endregion

  //#region Events
  const { errors, handleSubmit } = useForm();

  //For Time Change
  const handleTimeChange = time => {
    setTime( time );
  };

  //On Complete Quantity Change
  const handleCompleteQtyChange = ( e, Idx ) => {
    const { value } = e.target;
    const _data = [...data];
    const clickItem = _data[Idx];
    clickItem.completeQty = +value;
    let _completeQty = clickItem.completeQty;
    if ( _completeQty > clickItem.receivedQty ) {
      notify( 'warning', `Can not given Large value from ${clickItem.receivedQty}` );
      _completeQty = 0;
    }
    clickItem.completeQty = _completeQty;
    setQuentityChange( _data );
  };

  // For Close Modal
  const handleMainModalToggleClose = () => {
    setOpenModal( !openModal );
  };
  // For Submit Modal
  const handleMainModelSubmit = () => {
    setOpenModal( !openModal );
  };
  //#endregion

  return (
    <div>
      <DualButtonModal
        modalTypeClass="vertically-centered-modal"
        className="modal-dialog-centered modal-lg"
        openModal={openModal}
        title="Finishing Assign To Passed"
        handleMainModalToggleClose={handleMainModalToggleClose}
        handleMainModelSubmit={handleMainModelSubmit}
      >
        <Card>
          <CardBody className="card-body-override">
            <Form onSubmit={handleSubmit( handleMainModelSubmit )}>
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <Row className="rounded rounded-3 mr-1">
                  <FormGroup tag={Col} xs={6} sm={6} md={4} lg={4} xl={4}>
                    <CustomDatePicker name="date" title="Date" value={date} onChange={date => setDate( date )} />
                    {errors && errors.date && <FormFeedback>Date is Required!</FormFeedback>}
                  </FormGroup>
                  <FormGroup tag={Col} xs={6} sm={6} md={4} lg={4} xl={4}>
                    <CustomTimePicker id="time" name="time" title=" Time" placeholder="Time" value={time} onChange={handleTimeChange} />
                  </FormGroup>
                  <FormGroup tag={Col} xs={6} sm={6} md={4} lg={4} xl={4}>
                    <Label for="action">Process Type</Label>
                    <Select
                      id="action"
                      isSearchable
                      isClearable
                      bsSize="sm"
                      theme={selectThemeColors}
                      options={processTypes}
                      classNamePrefix="select"
                      value={processType}
                      onChange={data => {
                        setProcessType( data );
                      }}
                    />
                    {errors && errors.action && <FormFeedback>Process Type is Required!</FormFeedback>}
                  </FormGroup>
                  <FormGroup tag={Col} xs={6} sm={6} md={12} lg={12} xl={12}>
                    <Label for="remarks">Remarks</Label>
                    <Input id="remarks" name="remarks" type="text" placeholder="Remarks" />
                    {errors && errors.remarks && <FormFeedback>Remarks is Required!</FormFeedback>}
                  </FormGroup>
                </Row>
                <Table size="sm" bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Color</th>
                      <th>Size</th>
                      <th>Received Quantity</th>
                      <th>Complete Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.map( ( item, Idx ) => (
                      <tr key={item.id}>
                        <td>{item.color}</td>
                        <td>{item.size}</td>
                        <td>
                          <Input readOnly className="text-center" type="number" name="receivedQty" bsSize="sm" value={item.receivedQty} />
                        </td>
                        <td>
                          <Input
                            className="text-center"
                            type="number"
                            name="completeQty"
                            bsSize="sm"
                            value={item.completeQty ? item.completeQty : quantityChange}
                            onChange={e => handleCompleteQtyChange( e, Idx )}
                          />
                        </td>
                      </tr>
                    ) )}
                  </tbody>
                </Table>
              </Col>
            </Form>
          </CardBody>
        </Card>
      </DualButtonModal>
    </div>
  );
};

export default FinishingAssignToPassed;
