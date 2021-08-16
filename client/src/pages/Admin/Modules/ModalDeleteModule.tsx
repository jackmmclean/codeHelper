import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { deleteModule } from "../../../api/modules";

export default function ModalDeleteModule({
  setShowModal,
  showModal,
  module,
  handleGetModules,
}: any) {
  const handleClose = () => setShowModal(false);

  const handleDeleteModule = () => {
    deleteModule(
      module.code,
      (respBody: any) => {
        //console.log(respBody.message);
        handleGetModules();
      },
      (respBody: any) => console.log(respBody)
    );
  };

  useEffect(() => {}, []);

  return (
    <>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Create New Module</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {`Are you sure you want to delete '${module && module.code} - ${
            module && module.name
          }'?`}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => {
              handleDeleteModule();
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
