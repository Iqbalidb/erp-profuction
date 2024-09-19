/*
     Title: Bundle Assign Info
     Description: Bundle Assign Info
     Author: Iqbal Hossain
     Date: 23-January-2022
     Modified: 23-January-2022
*/

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import { Card, CardBody, Col, Form, FormFeedback, FormGroup, Input, Label, Row } from 'reactstrap';
import DualButtonModal from 'utility/custom/DualButtonModal';
import CustomDatePicker from 'utility/custom/production/CustomDatePicker';
import { selectThemeColors } from 'utility/Utils';

const productionProcessDDL = [
  { label: 'Sewing', value: 'Sewing' },
  { label: 'Print', value: 'Print' },
  { label: 'Embroidery', value: 'Embroidery' }
];
const actionDDL = [
  { label: 'Passed', value: 'Passed' },
  { label: 'Pending', value: 'Pending' }
];

const BundleAssignedSewing = props => {
  const { openModal, setOpenModal } = props;
  const { errors, handleSubmit } = useForm();

  //#region State
  const [productionProcess, setProductionProcess] = useState( null );
  const [action, setAction] = useState( null );
  const [date, setDate] = useState( new Date() );

  //#endregion
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
        className="modal-dialog-centered modal-lg"
        openModal={openModal}
        setOpenModal={setOpenModal}
        handleMainModelSubmit={handleModalSubmit}
        handleMainModalToggleClose={handleMainModalToggleClose}
        title="Panel Check Reject Info"
      >
        <Card>
          <CardBody className="card-body-override">
            <Form onSubmit={handleSubmit( handleModalSubmit )}>
              <Col xs="12" sm="12" md="12" lg="12" xl="12">
                <Row className="rounded rounded-3 mr-1">
                  <FormGroup tag={Col} xs={12} sm={6} md={6} lg={4} xl={4}>
                    <Label for="productionProcess">Process</Label>
                    <Select
                      id="productionProcess"
                      isSearchable
                      isClearable
                      theme={selectThemeColors}
                      options={productionProcessDDL}
                      classNamePrefix="select"
                      value={productionProcess}
                      onChange={data => {
                        setProductionProcess( data );
                      }}
                    />
                    {errors && errors.productionProcess && <FormFeedback>Production Process is Required!</FormFeedback>}
                  </FormGroup>
                  <FormGroup tag={Col} xs={12} sm={6} md={6} lg={4} xl={4}>
                    <Label for="action">Action</Label>
                    <Select
                      id="action"
                      isSearchable
                      isClearable
                      theme={selectThemeColors}
                      options={actionDDL}
                      classNamePrefix="select"
                      value={action}
                      onChange={data => {
                        setAction( data );
                      }}
                    />
                    {errors && errors.action && <FormFeedback>Action is Required!</FormFeedback>}
                  </FormGroup>
                  <FormGroup tag={Col} xs={12} sm={6} md={6} lg={4} xl={4}>
                    <CustomDatePicker name="date" title="Date" value={date} onChange={date => setDate( date )} />
                    {errors && errors.date && <FormFeedback>Date is Required!</FormFeedback>}
                  </FormGroup>
                  <FormGroup tag={Col} xs={12} sm={6} md={6} lg={12} xl={12}>
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

export default BundleAssignedSewing;

/** Change Log
 * 23-Jan-2022(Iqbal):Bundle Assigned info modal create
 * 06-Feb-2022(Iqbal): Modify Custom Date Picker
 */
