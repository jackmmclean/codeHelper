import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";

import Button from "react-bootstrap/Button";

import { getLabs } from "../../../api/labs";
import ModalNewLab from "./ModalNewLab";

import { FaWindowClose } from "react-icons/fa";
import ModalDeleteLab from "./ModalDeleteLab";
import OpenCloseButton from "./OpenCloseButton";

export default function Labs() {
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState([]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const handleShowCreateModal = () => setShowCreateModal(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleShowDeleteModal = () => setShowDeleteModal(true);

  const handleGetLabs = () => {
    getLabs(
      (responseBody: any) => {
        setLabs(responseBody.labs);
        //console.log(responseBody.message);
      },
      (responseBody: any) => {
        console.log(responseBody.message);
      }
    );
  };

  useEffect(() => {
    handleGetLabs();
  }, []);

  return (
    <>
      <Container>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Title</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {labs.map((lab: any) => (
              <tr key={lab.title}>
                <td>{lab.title}</td>
                <td
                  style={{
                    textAlign: "center",
                  }}
                >
                  <OpenCloseButton lab={lab} handleGetLabs={handleGetLabs} />
                </td>
                <td
                  style={{
                    textAlign: "center",
                  }}
                >
                  <FaWindowClose
                    style={{ color: "red", cursor: "pointer" }}
                    onClick={() => {
                      setSelectedLab(lab);
                      handleShowDeleteModal();
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>{" "}
        <Button variant="success" onClick={handleShowCreateModal}>
          Add Lab
        </Button>
      </Container>
      <ModalNewLab
        setShowModal={setShowCreateModal}
        showModal={showCreateModal}
        handleGetLabs={handleGetLabs}
      />
      <ModalDeleteLab
        setShowModal={setShowDeleteModal}
        showModal={showDeleteModal}
        lab={selectedLab}
        handleGetLabs={handleGetLabs}
      />
    </>
  );
}
