/*
     Title: Sewing Inspection Critical Process Modal
     Description:Sewing Inspection Critical Process Modal
     Author: Iqbal Hossain
     Date: 30-January-2022
     Modified: 30-January-2022
*/

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import { Card, CardBody, Col, Form, FormFeedback, FormGroup, Input, Label, Row, Table } from 'reactstrap';
import DualButtonModal from 'utility/custom/DualButtonModal';
import { randomIdGenerator, selectThemeColors } from 'utility/Utils';

const timeData = [
  { label: '08:50', value: '08:50' },
  { label: '09:40', value: '09:40' },
  { label: '10:30', value: '10:30' },
  { label: '11:20', value: '11:20' },
  { label: '12:10', value: '12:10' }
];

const SewingInspectionCriticalProcess = props => {
  const { openModal, setOpenModal, data } = props;
  const { errors, handleSubmit } = useForm();

  const [masterInfo] = useState( {
    id: randomIdGenerator(),
    buyer: 'Kuper',
    style: 'AV56567',
    po: 'PO 01',
    styleCategory: 'T-Shirt',
    color: 'Red',
    sizeRange: 'S-XL'
  } );

  const [time, setTime] = useState( null );
  //#region  Events

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
        title="Sewing Inspection Critical Process Info"
      >
        <Card>
          <CardBody>
            <Col xs={12} className="text-nowrap text-center">
              <Label className="h2 font-weight-bold">Master Information</Label>
            </Col>

            <div className="rounded rounded-3 p-2">
              <Row className="mb-1">
                <Col xs={12} sm={6} md={6} lg={4} xl={4} className="text-nowrap text-left">
                  <strong>Buyer : </strong>
                  <Label className="h5 font-weight-bold" for="buyer">
                    {' '}
                    {masterInfo.buyer}
                  </Label>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4} xl={4} className="text-nowrap text-left">
                  <strong>PO : </strong>
                  <Label className="h5 font-weight-bold" for="po">
                    {' '}
                    {masterInfo.po}
                  </Label>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4} xl={4} className="text-nowrap text-left">
                  <strong>Color : </strong>
                  <Label className="h5 font-weight-bold" for="color">
                    {' '}
                    {masterInfo.color}
                  </Label>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4} xl={4} className="text-nowrap text-left">
                  <strong>Style : </strong>
                  <Label className="h5 font-weight-bold" for="style">
                    {' '}
                    {masterInfo.style}
                  </Label>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4} xl={4} className="text-nowrap text-left">
                  <strong> Style Category : </strong>
                  <Label className="h5 font-weight-bold" for="styleCategory">
                    {' '}
                    {masterInfo.styleCategory}
                  </Label>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4} xl={4} className="text-nowrap text-left">
                  <strong> Size Range : </strong>
                  <Label className="h5 font-weight-bold" for="sizeRange">
                    {' '}
                    {masterInfo.sizeRange}
                  </Label>
                </Col>
              </Row>
              <p
                style={{
                  width: '100%',
                  borderBottom: '1px solid black',
                  color: '#7367F0'
                }}
              ></p>
            </div>

            <Form onSubmit={handleSubmit( handleModalSubmit )}>
              <Row className="rounded rounded-3 mr-1">
                <FormGroup tag={Col} xs={6} sm={6} md={4} lg={4} xl={4}>
                  <Label for="serialNo">Date</Label>
                  <Input id="date" className="w-100" type="date" onChange={() => { }} />
                  {errors && errors.date && <FormFeedback>Date is Required!</FormFeedback>}
                </FormGroup>
                <FormGroup tag={Col} xs={6} sm={6} md={4} lg={4} xl={4}>
                  <Label for="time">Time</Label>
                  <Select
                    id="time"
                    isSearchable
                    isClearable
                    bsSize="sm"
                    theme={selectThemeColors}
                    options={timeData}
                    classNamePrefix="select"
                    value={time}
                    onChange={data => {
                      setTime( data );
                    }}
                  />
                  {errors && errors.time && <FormFeedback>Time is Required!</FormFeedback>}
                </FormGroup>
                <FormGroup tag={Col} xs={12} sm={12} md={4} lg={4} xl={4}>
                  <Label for="target">Target Qty</Label>
                  <Input name="targetQty" id="targetQty" value={data.targetQty} onChange={() => { }} />
                  {errors && errors.targetQty && <FormFeedback>Target Qty is Required!</FormFeedback>}
                </FormGroup>
              </Row>
              <Table size="sm" bordered hover style={{ minWidth: 600 }}>
                <thead className="thead-dark">
                  <tr className="text-center">
                    <th className="text-nowrap">Critical Process</th>
                    <th className="text-nowrap">Total Check</th>
                    <th className="text-nowrap">Pass Qty</th>
                    <th className="text-nowrap">Defect Qty</th>
                  </tr>
                </thead>
                <tbody style={{ padding: '10px 0 !important' }}>
                  {data?.details?.map( item => (
                    <tr className="text-center" key={item.id}>
                      <td className="text-left">{item.criticalProcess}</td>
                      <td>
                        <Input id="totalCheck" className="w-100" type="number" value={item.totalCheck} onChange={() => { }} />
                      </td>
                      <td>
                        <Input id="passQty" className="w-100" type="number" value={item.passQty} onChange={() => { }} />
                      </td>
                      <td>
                        <Input id="defectQty" className="w-100" type="number" value={item.defectQty} onChange={() => { }} />
                      </td>
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

export default SewingInspectionCriticalProcess;

/** Change Log
 * 30-Jan-2022(Iqbal): Sewing Inspection Critical Process Modal modal create
 */
