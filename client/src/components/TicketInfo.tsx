import React from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Avatar from "react-avatar";

export default function TicketInfo({ ticket, handleSeeSolution }: any) {
  const {
    studentUsername,
    creation_timestamp,
    issueDescription,
    moduleCode,
    practical,
    moduleName,
    resolutionStatus,
    solutionId,
  } = ticket;

  return (
    <Container className="mt-3">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <Avatar name={studentUsername} round="100px" size="35px" />
          {creation_timestamp.slice(0, 16)}
        </Card.Header>
        <Card.Body>
          <Card.Title>
            {studentUsername} - '{resolutionStatus}'
          </Card.Title>
          <Card.Subtitle>
            {/*  eslint-disable-next-line react/jsx-no-comment-textnodes */}
            {moduleCode} - {moduleName} ({practical})
          </Card.Subtitle>
          <Card.Text>{issueDescription}</Card.Text>
          <div className="d-flex justify-content-end align-items-center">
            {solutionId !== null && (
              <Button
                onClick={() => handleSeeSolution(ticket.id)}
                variant="secondary"
                size="sm"
              >
                See Solution
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
