import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { postSolution, editSolution } from "../../../../api/tickets";

export default function ModalWriteSolution({
  setShowModal,
  showModal,
  ticketId,
  handleGetSolution,
  solution,
}: any) {
  const handleClose = () => setShowModal(false);
  const [solutionDescription, setSolutionDescription] = useState("");
  const [solutionTitle, setSolutionTitle] = useState("");

  async function handlePostSolution() {
    postSolution(
      solutionDescription,
      solutionTitle,
      (res: any) => {
        handleGetSolution();
        console.log(res.message);
      },
      (err: any) => console.log(err.message),
      ticketId
    );
  }

  function handleEditSolution() {
    const updatedSolution = { ...solution, solutionDescription, solutionTitle };
    editSolution(updatedSolution, (e: any) => {
      console.log(e.message);
      handleGetSolution();
    });
  }

  useEffect(() => {
    solution && setSolutionTitle(solution.title);
    solution && setSolutionDescription(solution.solutionDescription);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal]);

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>Write Solution</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Control
            type={"text"}
            placeholder={"Title"}
            onChange={(e) => setSolutionTitle(e.target.value)}
            defaultValue={solution && solution.title}
            required
          ></Form.Control>
          <Form.Control
            type={"text"}
            as={"textarea"}
            placeholder={"Solution Description..."}
            defaultValue={solution && solution.solutionDescription}
            onChange={(e) => setSolutionDescription(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={() => {
            solution ? handleEditSolution() : handlePostSolution();
            handleClose();
          }}
        >
          Submit
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
