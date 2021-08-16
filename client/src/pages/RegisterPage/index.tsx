import React from "react";
import Register from "./Register";
//importing bootstrap components separately prevents import of entire library
import Container from "react-bootstrap/Container";

function RegisterPage() {
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Register />
      </div>
    </Container>
  );
}

export default RegisterPage;
