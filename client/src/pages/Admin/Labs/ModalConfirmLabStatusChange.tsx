import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function ModalConfirmLabStatusChange({
  setShowModal,
  showModal,
  handleOpenLab,
  handleCloseLab,
  status,
}: any) {
  const handleClose = () => setShowModal(false);

  return (
    <>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to change the lab status to '
          {status === "closed" ? "open" : "closed"}'?{" "}
          {status === "open" && "All live tickets will be marked as 'missed'."}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant={status === "open" ? "danger" : "success"}
            onClick={() => {
              status === "open" ? handleCloseLab() : handleOpenLab();
              handleClose();
            }}
          >
            {status === "open" ? "Close" : "Open"}
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
