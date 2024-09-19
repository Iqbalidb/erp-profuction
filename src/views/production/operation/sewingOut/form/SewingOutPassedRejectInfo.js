/*
     Title: Sewing Out Passed Reject Info
     Description: Sewing Out Passed Reject Info
     Author: Alamgir Kabir
     Date: 05-March-2022
     Modified: 05-March-2022
*/
import React from 'react';
import { Card, CardBody, Label, Table } from 'reactstrap';
import DualButtonModal from 'utility/custom/DualButtonModal';

const SewingOutPassedRejectInfo = props => {
  const { openModal, setOpenModal } = props;

  //#region Events
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
        handleMainModalToggleClose={handleMainModalToggleClose}
        handleMainModelSubmit={handleMainModelSubmit}
        title="Sewing Out Passed Reject Info"
      >
        <Card outline>
          <CardBody>
            <Table size="sm" bordered hover>
              <thead className="thead-dark">
                <tr className="text-center text-nowrap">
                  <th>Serial No</th>
                  <th>Reject Type</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center">
                  <td>
                    <Label className="text-dark font-weight-bold">10</Label>
                  </td>
                  <td>
                    {' '}
                    <Label className="text-dark font-weight-bold">Reject</Label>
                  </td>
                  <td>
                    {' '}
                    <Label className="text-dark font-weight-bold">Remarks</Label>
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

export default SewingOutPassedRejectInfo;
/** Change Log
 * 05-March-2022 (Alamgir Kabir): Create Sewing Out Passed Reject Info Modal
 */
