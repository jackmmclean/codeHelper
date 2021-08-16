import React, { useEffect, useState } from "react";
import { getTicketsByStudent, getSolutions } from "../../../../api/tickets";
import TicketInfo from "../../../../components/TicketInfo";
import ModalSolution from "../../../../components/ModalSolution";

export default function StudentHistory({ studentUsername }: any) {
  const [studentsTickets, setStudentsTickets] = useState([]);

  const [solution, setSolution] = useState(null);
  const [selectedTicketId, setSelectedTicketId] = useState("");

  const [showSolutionModal, setShowSolutionModal] = useState(false);

  const handleShowSolution = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setShowSolutionModal(true);
  };

  useEffect(() => {
    getSolutions((res: any) => {
      setSolution(res.solutions[0]);
    }, selectedTicketId);
  }, [selectedTicketId]);

  useEffect(() => {
    getTicketsByStudent(
      studentUsername,
      (res: any) => {
        setStudentsTickets(res.tickets);
        // console.log(res.message);
      },
      (res: any) => console.log(res.message)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h6 className="m-3" style={{ color: "blue" }}>
        {studentUsername}'s Past Tickets
      </h6>
      {studentsTickets.map((ticket: any) => (
        <TicketInfo
          ticket={ticket}
          handleSeeSolution={handleShowSolution}
          key={ticket.id}
        />
      ))}
      <ModalSolution
        showModal={showSolutionModal}
        setShowModal={setShowSolutionModal}
        solution={solution}
      />
    </div>
  );
}
