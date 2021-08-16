import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import FormInput from "../../../components/FormInput";
import Form from "react-bootstrap/Form";

import { insertLab } from "../../../api/labs";

export default function ModalNewLab({
  setShowModal,
  showModal,
  handleGetLabs,
}: any) {
  const handleClose = () => setShowModal(false);

  const [labTitle, setLabTitle] = useState("");

  const handleInsertLab = () => {
    insertLab(
      labTitle,
      (respBody: any) => {
        //console.log(respBody.message);
        handleGetLabs();
      },
      (respBody: any) => {
        console.log(respBody.message);
      }
    );
  };

  useEffect(() => {}, []);

  return (
    <>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Create New Lab</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FormInput
              id={"labTitle"}
              name={"Lab Title"}
              type={"text"}
              handleChange={setLabTitle}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={() => {
              handleInsertLab();
              handleClose();
            }}
          >
            Add
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
