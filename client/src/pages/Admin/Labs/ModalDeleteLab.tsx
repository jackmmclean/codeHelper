import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { deleteLab } from "../../../api/labs";

export default function ModalDeleteLab({
  setShowModal,
  showModal,
  lab,
  handleGetLabs,
}: any) {
  const handleClose = () => setShowModal(false);

  const handleDeleteLab = () => {
    deleteLab(
      lab.id,
      (respBody: any) => {
        // console.log(respBody.message);
        handleGetLabs();
      },
      (respBody: any) => console.log(respBody)
    );
  };

  useEffect(() => {}, []);

  return (
    <>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Body>
          {`Are you sure you want to delete '${lab.title}'?`}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => {
              handleDeleteLab();
              handleClose();
            }}
          >
            Delete
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
