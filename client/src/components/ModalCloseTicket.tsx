import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function ModalCloseTicket({
  setShowModal,
  handleShow,
  showModal,
  closeTicket,
}: any) {
  const handleClose = () => setShowModal(false);

  return (
    <>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Resolve Ticket</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          If you resolve this ticket, its status will be changed to 'closed'.
          You should only do this if the issue is resolved or the student is
          working on the problem. Are you sure you want to change the ticket
          status to closed?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              closeTicket();
              handleClose();
            }}
          >
            Resolve Ticket
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
