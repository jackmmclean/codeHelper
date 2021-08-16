import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import ModalWriteSolution from "./ModalWriteSolution";
import ModalFindSolution from "./ModalFindSolution";
import { getSolutions } from "../../../../api/tickets";

export default function SolutionSelectedTicket({ ticketId }: any) {
  const [showWriteModal, setShowWriteModal] = useState(false);
  const handleShowWrite = () => setShowWriteModal(true);

  const [showFindModal, setShowFindModal] = useState(false);
  const handleShowFind = () => setShowFindModal(true);

  const [solution, setSolution] = useState({
    solutionDescription: "",
    title: "",
  });

  function handleGetSolution() {
    getSolutions((responseBody: any) => {
      setSolution(responseBody.solutions[0]);
    }, ticketId);
  }

  useEffect(() => {
    handleGetSolution();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId]);

  return (
    <Container className="mt-3">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          Solution
        </Card.Header>

        <Card.Body>
          <Card.Title>{solution && solution.title}</Card.Title>
          <Card.Subtitle></Card.Subtitle>
          <Card.Text>
            {solution ? solution.solutionDescription : "No solution!"}
          </Card.Text>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-end align-items-center">
          <Button
            onClick={handleShowWrite}
            variant="primary"
            className="m-1 w-auto"
          >
            {solution ? "Edit" : "Write"}
          </Button>
          <Button
            onClick={handleShowFind}
            variant="outline-primary"
            className="m-1 w-auto float-right"
          >
            Find
          </Button>
        </Card.Footer>

        <ModalWriteSolution
          setShowModal={setShowWriteModal}
          handleShow={handleShowWrite}
          showModal={showWriteModal}
          ticketId={ticketId}
          handleGetSolution={handleGetSolution}
          solution={solution}
        />

        <ModalFindSolution
          setShowModal={setShowFindModal}
          handleShow={handleShowFind}
          handleGetSolution={handleGetSolution}
          showModal={showFindModal}
          ticketId={ticketId}
        />
      </Card>
    </Container>
  );
}
