/*
     Title: Relaxation Requisition Modal
     Description: Relaxation Requisition Modal
     Author: Alamgir Kabir
     Date: 07-May-2023
     Modified: 07-May-2023
*/

import React, { useState } from 'react';
import { Card, Col, Form, FormGroup, Row } from 'reactstrap';
import DualButtonModal from 'utility/custom/DualButtonModal';
import CustomDatePicker from 'utility/custom/production/CustomDatePicker';

const RelaxationRequisitionModal = ( { isOpenRequisitionConfirmModal, setIsOpenRequisitionConfirmModal, selectedRow } ) => {
  const [date, setDate] = useState( new Date() );
  const handleMainModelSubmit = () => {
    setIsOpenRequisitionConfirmModal( !isOpenRequisitionConfirmModal );
  };
  const handleModalSubmit = () => {
    setIsOpenRequisitionConfirmModal( !isOpenRequisitionConfirmModal );
  };
  const handleMainModalToggleClose = () => {
    setIsOpenRequisitionConfirmModal( !isOpenRequisitionConfirmModal );
  };
  const onCheckDateChange = dates => {
    const date = dates[0];
    setDate( date );
  };
  return (
    <div>
      <DualButtonModal
        modalTypeClass="vertically-centered-modal"
        className="modal-dialog-centered modal-lg custom-modal"
        openModal={isOpenRequisitionConfirmModal}
        setOpenModal={setIsOpenRequisitionConfirmModal}
        handleMainModelSubmit={handleMainModelSubmit}
        handleModalSubmit={handleModalSubmit}
        handleMainModalToggleClose={handleMainModalToggleClose}
        submitText="Confirm"
        title="Requisition Confirm Modal"
      >
        <Card className="p-2">
          <Form>
            <Col xs="12" sm="12" md="12" lg="12" xl="12">
              <Row className="rounded rounded-3 mr-1">
                <FormGroup tag={Col} xs={12} sm={12} md={12} lg={12} xl={12}>
                  <CustomDatePicker name="date" title="Confirm Date" value={date} onChange={onCheckDateChange} />
                </FormGroup>
              </Row>
              <p className="text-dark font-weight-bold">{selectedRow?.length !== null ? `${selectedRow?.length}  item selected` : null}</p>
            </Col>
          </Form>
        </Card>
      </DualButtonModal>
    </div>
  );
};

export default RelaxationRequisitionModal;
