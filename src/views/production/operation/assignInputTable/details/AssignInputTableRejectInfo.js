/*
     Title: Assign Input Table Reject Info
     Description: Assign Input Table Reject Info
     Author: Iqbal Hossain
     Date: 24-January-2022
     Modified: 24-January-2022
*/

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardBody, Label, Table } from 'reactstrap';
import DualButtonModal from 'utility/custom/DualButtonModal';
import { assignInputTablePendingModalOpen } from '../store/actions';

const AssignInputTableRejectInfo = () => {
  //#region Hooks
  const dispatch = useDispatch();
  const { isOpenAssignInputPendingModal } = useSelector( ( { assignInputTableReducer } ) => assignInputTableReducer );

  //#region  Events

  const handleMainModalToggleClose = () => {
    dispatch( assignInputTablePendingModalOpen() );
  };

  const handleModalSubmit = () => {
    dispatch( assignInputTablePendingModalOpen() );
  };

  //#endregion
  return (
    <div>
      <DualButtonModal
        modalTypeClass="vertically-centered-modal"
        className="modal-dialog-centered modal-lg"
        openModal={isOpenAssignInputPendingModal}
        setOpenModal={isOpenAssignInputPendingModal}
        handleMainModelSubmit={handleModalSubmit}
        handleMainModalToggleClose={handleMainModalToggleClose}
        title="Assign Input Table Reject Info"
      >
        <Card outline>
          <CardBody className="custom-table">
            <Table size="sm" bordered hover>
              <thead className="thead-dark">
                <tr className="text-center">
                  <th className="text-nowrap">Serial No</th>
                  <th className="text-nowrap">Reject Type</th>
                  <th className="text-nowrap">Remarks</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center">
                  <td>
                    <Label className="text-dark font-weight-bold">10</Label>
                  </td>
                  <td>
                    <Label className="text-dark font-weight-bold">Reject</Label>
                  </td>
                  <td>
                    <Label className="text-dark font-weight-bold">Dropped Stitch</Label>
                  </td>
                </tr>
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </DualButtonModal>
    </div>
  );
};

export default AssignInputTableRejectInfo;

/** Change Log
 * 24-Jan-2022(Iqbal): Assign Input Table Reject info modal create
 */
