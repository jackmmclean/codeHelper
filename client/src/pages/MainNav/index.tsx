import React, { useContext } from "react";
import { LinkContainer } from "react-router-bootstrap";
import LogoutButton from "./LogoutButton";
//importing bootstrap components separately prevents import of entire library
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import { AuthContext } from "../../Auth";
import codeHelper from "../../codeHelper.png";

function NavPage({ currentUser, setCurrentUser }: any) {
  const {
    //@ts-ignore
    isAuthenticated,
    //@ts-ignore
    hasDemPrivileges,
    //@ts-ignore
    hasLabLeadPrivileges,
  } = useContext(AuthContext);

  return (
    <Container>
      <Navbar expand="lg" className="p-2">
        <Navbar.Brand>
          <img
            src={codeHelper}
            width="160"
            //height="40"
            className="d-inline-block align-top"
            alt="codeHelper logo"
          />
          {/* {" "}codeHelper */}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        {isAuthenticated && (
          <Navbar.Collapse>
            <Nav className="mr-auto">
              {hasDemPrivileges && (
                <LinkContainer to="/labs/demonstrator/desk">
                  <Nav.Link>Help Desk</Nav.Link>
                </LinkContainer>
              )}
              {hasLabLeadPrivileges && (
                <LinkContainer to="/labs/users/admin">
                  <Nav.Link>Admin</Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        )}
        <Navbar.Collapse className="justify-content-end">
          <LinkContainer to="/labs#">
            <Nav.Link id={"currentUser"}>{currentUser}</Nav.Link>
          </LinkContainer>
          <LogoutButton setCurrentUser={setCurrentUser} />
        </Navbar.Collapse>
      </Navbar>
    </Container>
  );
}

export default NavPage;
