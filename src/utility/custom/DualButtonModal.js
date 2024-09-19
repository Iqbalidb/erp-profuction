/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import Draggable from 'react-draggable';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
const DualButtonModal = ( {
  children,
  openModal,
  setOpenModal,
  modalTypeClass,
  className,
  title,
  handleMainModelSubmit,
  handleMainModalToggleClose,
  modalCloseText,
  handleModalSubmit,
  submitText
} ) => {
  useEffect( () => { }, [] );

  return (
    <div>
      <Draggable handle=".modal-header" >
        <div className={modalTypeClass}>
          <Modal
            id="myModal"
            onClose={() => {
              console.log( 'hell' );
            }}
            isOpen={openModal}
            className={className}
          >
            <ModalHeader
              toggle={() => {
                handleMainModalToggleClose();
              }}
            >
              {title}
            </ModalHeader>
            <ModalBody>{children}</ModalBody>
            <ModalFooter className="d-flex justify-content-between">
              <Button
                size="sm"
                color="primary"
                onClick={() => {
                  handleMainModelSubmit();
                }}
              >
                {modalCloseText || 'Close'}
              </Button>
              <Button
                size="sm"
                color="primary"
                onClick={e => {
                  handleModalSubmit( e );
                }}
              >
                {submitText || 'Ok'}
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </Draggable>
    </div>
  );
};

export default DualButtonModal;
// ** PropTypes
DualButtonModal.propTypes = {
  className: PropTypes.string,
  modalTypeClass: PropTypes.string,
  title: PropTypes.string.isRequired,
  openModal: PropTypes.bool.isRequired,
  handleMainModelSubmit: PropTypes.func.isRequired,
  handleMainModalToggleClose: PropTypes.func.isRequired
};
