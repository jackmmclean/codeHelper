import React, { useEffect, useState, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Jumbotron from "react-bootstrap/Jumbotron";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import { getSolutions } from "../../../../api/tickets";
import { assignSolution } from "../../../../api/tickets";

export default function ModalFindSolution({
  setShowModal,
  showModal,
  ticketId,
  handleGetSolution,
}: any) {
  const handleClose = () => setShowModal(false);

  const [solutions, setSolutions] = useState<any>([]);
  const [selectedSolution, setSelectedSolution] = useState<any>({
    title: "",
    solutionDescription: "",
    demonstratorUsername: "",
  });
  const [searchText, setSearchText] = useState<any>("");
  const selectedSolutionRender = useRef<null | HTMLDivElement>(null);
  const modalRender = useRef<null | HTMLDivElement>(null);

  const scrollToTop = () => {
    selectedSolutionRender.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  function handleGetSolutions() {
    getSolutions((respBody: any) => {
      setSolutions(respBody.solutions);
    });
  }

  function handleAssign() {
    assignSolution(selectedSolution.id, ticketId, (respBody: any) => {
      console.log(respBody.message);
      handleGetSolution();
      handleClose();
    });
  }

  useEffect(() => {
    handleGetSolutions();
  }, [showModal]);

  return (
    <>
      <Modal show={showModal} onHide={handleClose} ref={modalRender}>
        <Modal.Header>
          <Modal.Title>Find an Existing Solution</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "600px", overflowY: "scroll" }}>
          <Jumbotron ref={selectedSolutionRender}>
            <h1>{selectedSolution.title}</h1>
            <h6>{selectedSolution.demonstratorUsername}</h6>
            <p>{selectedSolution.solutionDescription}</p>
            <p>
              {selectedSolution.id && (
                <Button onClick={handleAssign} variant="primary">
                  Assign Solution
                </Button>
              )}
            </p>
          </Jumbotron>
          <Form.Control
            type={"text"}
            placeholder={"Search..."}
            onChange={(e) => setSearchText(e.target.value)}
          ></Form.Control>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Author</th>
                <th>Title</th>
              </tr>
            </thead>
            <tbody>
              {solutions
                .filter((solution: any) =>
                  (
                    solution.solutionDescription +
                    solution.title +
                    solution.demonstratorUsername
                  ).includes(searchText)
                )
                .map((solution: any) => (
                  <tr
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setSelectedSolution(solution);
                      scrollToTop();
                    }}
                    key={solution.id}
                  >
                    <th>{solution.demonstratorUsername}</th>
                    <th>{solution.title}</th>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
