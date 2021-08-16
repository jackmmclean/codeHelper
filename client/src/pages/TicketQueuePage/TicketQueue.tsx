import React from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

export default function TicketQueue({ ticketsRemaining }: any) {
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Card>
          <Card.Body>
            <Card.Title>Your ticket has been posted!</Card.Title>
            <Card.Text>
              Please wait here until a class demonstrator responds to your
              request.
            </Card.Text>
          </Card.Body>
          <Card.Footer className="text-muted">
            There are{" "}
            <span>
              <Button variant="primary" disabled>
                {ticketsRemaining}{" "}
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              </Button>
            </span>{" "}
            tickets ahead of you in the queue.
          </Card.Footer>
        </Card>
      </div>
    </Container>
  );
}
