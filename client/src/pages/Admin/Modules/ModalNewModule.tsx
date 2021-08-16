import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import FormInput from "../../../components/FormInput";
import Form from "react-bootstrap/Form";
import { insertModule } from "../../../api/modules";

export default function ModalNewModule({
  setShowModal,
  showModal,
  labLeads,
  handleGetModules,
}: any) {
  const handleClose = () => setShowModal(false);

  const [moduleCode, setModuleCode] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [labLeadUsername, setLabLeadUsername] = useState("");

  const handleInsertModule = () => {
    insertModule(
      moduleCode,
      moduleName,
      labLeadUsername,
      (respBody: any) => {
        // console.log(respBody.message);
        handleGetModules();
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
          <Modal.Title>Create New Module</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FormInput
              id={"moduleCode"}
              name={"Module Code"}
              type={"text"}
              handleChange={setModuleCode}
            />{" "}
            <FormInput
              id={"moduleName"}
              name={"Module Name"}
              type={"text"}
              handleChange={setModuleName}
            />
            <FormInput
              id={"labLeadUsername"}
              name={"Lab Lead"}
              type={"select"}
              as={"select"}
              handleChange={setLabLeadUsername}
              options={
                labLeads &&
                labLeads.map((labLead: any) => {
                  let option: any = {};
                  option["optionText"] = labLead.username;
                  option["optionValue"] = labLead.username;
                  return option;
                })
              }
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={() => {
              handleInsertModule();
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
