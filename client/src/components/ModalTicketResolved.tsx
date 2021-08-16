import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function ModalTicketResolved({ setShowModal, showModal }: any) {
  const handleClose = () => setShowModal(false);

  return (
    <>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Ticket Resolved</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          The demonstrator has marked your ticket as resolved!
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
