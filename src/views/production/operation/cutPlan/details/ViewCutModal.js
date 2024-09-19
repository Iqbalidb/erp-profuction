/*
     Title: View Cut Modal
     Description: View Cut Modal
     Author: Alamgir Kabir
     Date: 24-April-2022
     Modified: 24-April-2022
*/

import React from 'react';
import { Card, CardBody, Table } from 'reactstrap';
import DualButtonModal from 'utility/custom/DualButtonModal';

const ViewCutModal = props => {
  const { openModal, setOpenModal, cutDetails } = props;
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
        title="Cut Info"
      >
        <Card outline>
          <CardBody className="custom-table">
            <Table size="sm" bordered hover className="tableThTd">
              <thead className="thead-dark">
                <tr className="text-center">
                  <th className="text-nowrap">Lay Per Cut</th>
                  <th className="text-nowrap">Color name</th>
                  <th className="text-nowrap">Color Wise Cut</th>
                </tr>
              </thead>
              <tbody style={{ padding: '10px 0 !important' }}>
                {cutDetails?.map( cd => cd.cuttingDetails?.map( item => (
                  <tr key={item.colorId}>
                    <td>{cd.step}</td>
                    <td>{item.colorName}</td>
                    <td>{item.layPerCut}</td>
                  </tr>
                ) )
                )}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </DualButtonModal>
    </div>
  );
};

export default ViewCutModal;
