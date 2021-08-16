import React from "react";
//importing bootstrap components separately prevents import of entire library
import Login from "./Login";
import { Container } from "react-bootstrap";

function LoginPage({ setCurrentUser, setStudentPosition }: any) {
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Login
          setCurrentUser={setCurrentUser}
          setStudentPosition={setStudentPosition}
        />
      </div>
    </Container>
  );
}

export default LoginPage;
