import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function ModalLabClosed({ setShowModal, showModal }: any) {
  const handleClose = () => setShowModal(false);

  return (
    <>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Lab Closed</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          We are sorry but due to high demand we were unable to answer your
          ticket today. Please re-post your problem during the next lab session.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
