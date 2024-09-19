/*
     Title: Size Ratio Modal
     Description:Size Ratio Modal
     Author: Iqbal Hossain
     Date: 24-January-2022
     Modified: 24-January-2022
*/

import React from 'react';
import { Card, CardBody, Table } from 'reactstrap';
import DualButtonModal from 'utility/custom/DualButtonModal';

const SizeRatioDetails = props => {
  const { openModal, setOpenModal, ratioQty } = props;

  //#region  Events

  const handleMainModalToggleClose = () => {
    setOpenModal( !openModal );
  };

  const handleModalSubmit = () => {
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
        setOpenModal={setOpenModal}
        handleModalSubmit={handleModalSubmit}
        handleMainModelSubmit={handleMainModelSubmit}
        handleMainModalToggleClose={handleMainModalToggleClose}
        title="Size Ratio Information"
      >
        <Card outline>
          <CardBody className="custom-table">
            <Table size="sm" bordered hover className="tableThTd">
              <thead >
                <tr className="text-center">
                  <th className="text-nowrap">Size</th>
                  <th className="text-nowrap">Ratio</th>
                  <th className="text-nowrap">Quantity</th>
                </tr>
              </thead>
              <tbody style={{ padding: '10px 0 !important' }}>
                {ratioQty?.map( sr => (
                  <tr className="text-center" key={sr.sizeId}>
                    <td>{sr.size}</td>
                    <td>{sr.ratio}</td>
                    <td>{sr.quantity}</td>
                  </tr>
                ) )}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </DualButtonModal>
    </div>
  );
};

export default SizeRatioDetails;

/** Change Log
 * 24-Jan-2022(Iqbal): Size Ratio Modal modal create
 */
