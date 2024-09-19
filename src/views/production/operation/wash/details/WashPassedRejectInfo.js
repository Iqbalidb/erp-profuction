/*
     Title: Wash Passed Reject Info
     Description:Wash Passed Reject Info
     Author: Iqbal Hossain
     Date: 12-February-2022
     Modified: 12-February-2022
*/

import React from 'react';
import { Card, CardBody, Label, Table } from 'reactstrap';
import DualButtonModal from 'utility/custom/DualButtonModal';

const WashPassedRejectInfo = props => {
  const { openModal, setOpenModal } = props;

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
        title="Wash Passed Reject Info"
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

export default WashPassedRejectInfo;

/** Change Log
 * 12-Feb-2022(Iqbal): Wash Passed Reject info modal create
 */
