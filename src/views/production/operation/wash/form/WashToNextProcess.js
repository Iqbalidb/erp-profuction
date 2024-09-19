/*
     Title: Wast to Next Process
     Description: Wast to Next Process
     Author: Iqbal Hossain
     Date: 12-February-2022
     Modified: 12-February-2022
*/

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import { Card, CardBody, Col, CustomInput, Form, FormFeedback, FormGroup, Input, Label, Row, Table } from 'reactstrap';
import DualButtonModal from 'utility/custom/DualButtonModal';
import CustomDatePicker from 'utility/custom/production/CustomDatePicker';
import { selectThemeColors } from 'utility/Utils';
import classes from '../style/WashList.module.scss';

const WashToNextProcess = props => {
  const { openModal, setOpenModal, data } = props;
  const { register, errors, handleSubmit } = useForm();
  //#region State
  const [processType, setProcessType] = useState( null );
  const [date, setDate] = useState( new Date() );
  const [partial, setPartial] = useState( null );
  //#endregion

  //#region  Events
  const onPartialCheckChange = e => {
    const { checked } = e.target;
    data.isPartial = checked;
    setPartial( data.isPartial );
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
        className="modal-dialog-centered modal-lg"
        openModal={openModal}
        setOpenModal={setOpenModal}
        handleMainModelSubmit={handleModalSubmit}
        handleMainModalToggleClose={handleMainModalToggleClose}
        title="Panel Check Wast to Next Process"
      >
        <Card>
          <CardBody className="card-body-override">
            <Form onSubmit={handleSubmit( handleModalSubmit )}>
              <Row className="rounded rounded-3 mr-1">
                <FormGroup tag={Col} xs={5}>
                  <Label for="time">Date</Label>
                  <CustomDatePicker name="date" value={date} onChange={date => setDate( date )} />
                  {errors && errors.date && <FormFeedback>Date is Required!</FormFeedback>}
                </FormGroup>
                <FormGroup tag={Col} xs={5}>
                  <Label for="processType">Process Type</Label>
                  <Select
                    id="processType"
                    isSearchable
                    isClearable
                    bsSize="sm"
                    theme={selectThemeColors}
                    options={[{ label: 'Shipment', value: 'Shipment' }]}
                    classNamePrefix="select"
                    value={processType}
                    onChange={data => {
                      setProcessType( data );
                    }}
                  />
                  {errors && errors.processType && <FormFeedback>Process Type is Required!</FormFeedback>}
                </FormGroup>
                <FormGroup tag={Col} xs={2}>
                  <CustomInput
                    inline
                    className={classes.customInput}
                    type="checkbox"
                    id="partial"
                    name="partial"
                    label="Partial"
                    onChange={onPartialCheckChange}
                    innerRef={register( { required: false } )}
                  />
                </FormGroup>
              </Row>
              <Table size="sm" bordered hover style={{ minWidth: 600 }}>
                <thead className="thead-dark">
                  <tr className="text-center">
                    <th className="text-nowrap">Color</th>
                    <th className="text-nowrap">Size</th>
                    <th className="text-nowrap">Quantity</th>
                    {partial && <th className="text-nowrap">Partial Qty</th>}
                  </tr>
                </thead>
                <tbody style={{ padding: '10px 0 !important' }}>
                  {data.details.map( item => (
                    <tr className="text-center" key={item.id}>
                      <td className="text-left">{item.color}</td>
                      <td className="text-left">{item.size}</td>
                      <td>
                        <Input id="totalCheck" className="w-100" type="number" readOnly defaultValue={item.receivedQty} />
                      </td>
                      {partial && (
                        <td>
                          <Input id="passQty" className="w-100" type="number" value={item.partialQty} onChange={() => { }} />
                        </td>
                      )}
                    </tr>
                  ) )}
                </tbody>
              </Table>
              <FormGroup tag={Col} xs={12}>
                <Label for="name">Remarks</Label>
                <Input name="remarks" id="remarks" placeholder="Remarks" />
              </FormGroup>
            </Form>
          </CardBody>
        </Card>
      </DualButtonModal>
    </div>
  );
};

export default WashToNextProcess;

/** Change Log
 * 12-Feb-2022(Iqbal): Wast to Next Process modal create
 */
