import React from "react";
import Button from "react-bootstrap/Button";
import { assignDemonstrator } from "../../../api/tickets";

export default function AssignDemButton({
  demonstratorUsername,
  ticketId,
}: any) {
  const handleAssignDemonstrator = () =>
    assignDemonstrator(ticketId, (responseBody: any) => {
      //console.log(responseBody.message);
    });

  if (demonstratorUsername === null) {
    return <Button onClick={handleAssignDemonstrator}>Assign Yourself</Button>;
  }

  return <p>{demonstratorUsername}</p>;
}
