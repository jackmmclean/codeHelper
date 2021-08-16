import React from "react";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import TicketTableRow from "./TicketTableRow";

import { ITicket } from "../../../tsInterfaces";

interface IDeskAllTicketProps {
  allTickets: ITicket[];
  setSelectedTicket: any;
  selectedTicket: ITicket;
}

export default function DeskAllTickets({
  allTickets,
  setSelectedTicket,
  selectedTicket,
}: IDeskAllTicketProps) {
  return (
    <Container className="mt-3 d-flex align-items-center justify-content-center">
      {allTickets.length > 0 ? (
        <Table hover variant="dark">
          <thead>
            <tr>
              <th>Username</th>
              <th>Demonstrator</th>
              <th>Module</th>
              <th>Practical</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            {allTickets.map((ticket) => {
              return (
                <TicketTableRow
                  ticket={ticket}
                  setSelectedTicket={setSelectedTicket}
                  selectedTicket={selectedTicket}
                  key={ticket.id}
                />
              );
            })}
          </tbody>
        </Table>
      ) : (
        <h3>No tickets at the moment!</h3>
      )}
    </Container>
  );
}
