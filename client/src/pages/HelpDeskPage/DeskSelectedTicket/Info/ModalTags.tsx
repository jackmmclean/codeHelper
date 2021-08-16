import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { getSolutions, getTicketsByTag } from "../../../../api/tickets";
import TicketInfo from "../../../../components/TicketInfo";
import ModalSolution from "../../../../components/ModalSolution";

export default function ModalTags({ setShowModal, showModal, tagName }: any) {
  const handleClose = () => setShowModal(false);

  const [tagTickets, setTagTickets] = useState([]);
  const [solution, setSolution] = useState(null);
  const [selectedTicketId, setSelectedTicketId] = useState("");

  const [showTagSolutionModal, setShowTagSolutionModal] = useState(false);
  const handleShowTagSolution = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setShowTagSolutionModal(true);
  };

  useEffect(() => {
    getSolutions((res: any) => {
      setSolution(res.solutions[0]);
    }, selectedTicketId);
  }, [selectedTicketId]);

  useEffect(() => {
    tagName &&
      getTicketsByTag(
        tagName,
        (res: any) => {
          console.log(res.message);
          setTagTickets(res.tickets);
        },
        (res: any) => console.log(res.message)
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal]);

  return (
    <>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{tagName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {tagTickets.map((ticket: any) => (
            <TicketInfo
              ticket={ticket}
              key={ticket.id}
              handleSeeSolution={handleShowTagSolution}
            />
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
        <ModalSolution
          showModal={showTagSolutionModal}
          setShowModal={setShowTagSolutionModal}
          solution={solution}
        />
      </Modal>
    </>
  );
}
