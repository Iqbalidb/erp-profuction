/*
   Title: Sewing Out Assign To Passed
   Description: Sewing Out Assign To Passed
   Author: Alamgir Kabir
   Date: 05-March-2022
   Modified: 05-March-2022
*/
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';
import { Card, CardBody, Col, Form, FormFeedback, FormGroup, Input, Label, Row, Table } from 'reactstrap';
import DualButtonModal from 'utility/custom/DualButtonModal';
import CustomDatePicker from 'utility/custom/production/CustomDatePicker';
import { selectThemeColors } from 'utility/Utils';

const processTyps = [
  { label: 'Stock', value: 'Stock' },
  { label: 'Passed', value: 'Passed' }
];

const SewingOutAssignToPassed = props => {
  const { openModal, setOpenModal, data } = props;

  //#region State
  const [processType, setprocessType] = useState( null );
  const [date, setDate] = useState( new Date() );
  //#endregion

  //#region Events
  const { errors, handleSubmit } = useForm();

  const handleMainModalToggleClose = () => {
    setOpenModal( !openModal );
  };

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
        title="Sewing Out Assign To Passed"
        handleMainModalToggleClose={handleMainModalToggleClose}
        handleMainModelSubmit={handleMainModelSubmit}
      >
        <Card>
          <CardBody className="card-body-override">
            <Form onSubmit={handleSubmit( handleMainModelSubmit )}>
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <Row className="rounded rounded-3 mr-1">
                  <FormGroup tag={Col} xs={6} sm={6} md={6} lg={6} xl={6}>
                    <Label for="processTyps">Process Type</Label>
                    <CreatableSelect
                      id="processTyps"
                      isSearchable
                      isClearable
                      theme={selectThemeColors}
                      options={processTyps}
                      classNamePrefix="select"
                      value={processType}
                      onChange={data => setprocessType( data )}
                    />
                    {errors && errors.processTyps && <FormFeedback>Process Type is Required!</FormFeedback>}
                  </FormGroup>

                  <FormGroup tag={Col} xs={6} sm={6} md={6} lg={6} xl={6}>
                    <CustomDatePicker name="date" title="Date" value={date} onChange={date => setDate( date )} />
                    {errors && errors.date && <FormFeedback>Date is Required!</FormFeedback>}
                  </FormGroup>
                  <FormGroup tag={Col} xs={6} sm={6} md={12} lg={12} xl={12}>
                    <Label for="remarks">Remarks</Label>
                    <Input id="remarks" name="remarks" type="text" placeholder="Remarks" />
                    {errors && errors.remarks && <FormFeedback>Remarks Type is Required!</FormFeedback>}
                  </FormGroup>
                </Row>
                <Table size="sm" bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Size</th>
                      <th>Check Quantity</th>
                      <th>Defect Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.map( item => (
                      <tr key={item.id}>
                        <td>{item.date}</td>
                        <td>{item.size}</td>
                        <td>
                          <Input readOnly className="text-center bg-white" type="number" name="checkQty" bsSize="sm" value={item.checkQty} />
                        </td>
                        <td>
                          <Input readOnly className="text-center bg-white" type="number" name="defectQty" bsSize="sm" value={item.defectQty} />
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

export default SewingOutAssignToPassed;
