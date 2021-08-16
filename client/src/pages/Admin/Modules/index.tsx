import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { getModules } from "../../../api/modules";
import { getUsers } from "../../../api/users";
import ModalNewModule from "./ModalNewModule";

import { FaWindowClose } from "react-icons/fa";
import ModalDeleteModule from "./ModalDeleteModule";

export default function Modules() {
  const [modules, setModules] = useState([
    { code: "", name: "", labLeadUsername: "" },
  ]);
  const [labLeads, setLabLeads] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const handleShowCreateModal = () => setShowCreateModal(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleShowDeleteModal = () => setShowDeleteModal(true);

  const handleGetModules = () =>
    getModules(
      (responseBody: any) => {
        setModules(responseBody.modules);
        //console.log(responseBody.message);
      },
      (responseBody: any) => {
        console.log(responseBody.message);
      }
    );

  const handleGetLabLeads = () => {
    getUsers(
      (responseBody: any) => {
        setLabLeads(
          responseBody.users.filter((user: any) => user.role === "labLead")
        );
        //console.log(responseBody.message);
      },
      (responseBody: any) => {
        console.log(responseBody.message);
      }
    );
  };

  const handleSetLabLead = (code: string, labLeadUsername: string) => {};

  useEffect(() => {
    handleGetLabLeads();
    handleGetModules();
  }, []);

  return (
    <>
      <Container>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Lab Lead</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {modules.map((module: any) => (
              <tr key={module.code}>
                <td>{module.code}</td>
                <td>{module.name}</td>
                <td>
                  <Form.Control
                    as="select"
                    size="sm"
                    onChange={(e) =>
                      handleSetLabLead(module.code, e.target.value)
                    }
                    defaultValue={module.labLeadUsername}
                  >
                    {labLeads.map((labLead: any) => (
                      <option key={labLead.username}>{labLead.username}</option>
                    ))}
                  </Form.Control>
                </td>
                <td
                  style={{
                    textAlign: "center",
                  }}
                >
                  <FaWindowClose
                    style={{ color: "red", cursor: "pointer" }}
                    onClick={() => {
                      setSelectedModule(module);
                      handleShowDeleteModal();
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>{" "}
        <Button variant="success" onClick={handleShowCreateModal}>
          Add Module
        </Button>
      </Container>
      <ModalNewModule
        setShowModal={setShowCreateModal}
        showModal={showCreateModal}
        labLeads={labLeads}
        handleGetModules={handleGetModules}
      />
      <ModalDeleteModule
        setShowModal={setShowDeleteModal}
        showModal={showDeleteModal}
        module={selectedModule}
        handleGetModules={handleGetModules}
      />
    </>
  );
}
