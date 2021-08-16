import React from "react";
//importing bootstrap components separately prevents import of entire library
import TicketForm from "./TicketForm";
import Container from "react-bootstrap/Container";

function PostTicketPage() {
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <TicketForm />
      </div>
    </Container>
  );
}

export default PostTicketPage;
