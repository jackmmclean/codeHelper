import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function ModalSolution({
  setShowModal,
  showModal,
  solution,
}: any) {
  const handleClose = () => setShowModal(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (solution) {
    return (
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>
            {solution.title} - {solution.demonstratorUsername}
          </Modal.Title>
          <br />
          {solution.creation_timestamp.slice(0, 21)}
        </Modal.Header>
        <Modal.Body>
          {solution.solutionDescription}
          <div className="d-flex justify-content-end align-items-center">
            <Button size="sm" variant="danger" onClick={handleClose}>
              Close
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    );
  } else
    return (
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>No solution!</Modal.Title>
          <div className="d-flex justify-content-end align-items-center">
            <Button size="sm" variant="danger" onClick={handleClose}>
              Close
            </Button>
          </div>
        </Modal.Header>
      </Modal>
    );
}
