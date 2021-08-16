import React, { useState, useEffect, useContext } from "react";
import { LinkContainer } from "react-router-bootstrap";
//importing bootstrap components separately prevents import of entire library
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Notification from "../../components/Notification";
import { AuthContext } from "../../Auth";

function DemonstratorNav({ demUnreadCounts }: any) {
  const [totalUnread, setTotalUnread] = useState(0);

  const {
    //@ts-ignore
    hasLabLeadPrivileges,
  } = useContext(AuthContext);

  useEffect(() => {
    const newTotalUnread: any =
      demUnreadCounts &&
      Object.values(demUnreadCounts).reduce((a: any, b: any) => a + b, 0);
    setTotalUnread(newTotalUnread);
  }, [demUnreadCounts]);

  return (
    <Container>
      <Navbar
        id={"demonstratorNav"}
        style={{
          borderRadius: "25px",
          paddingLeft: "20px",
          paddingRight: "20px",
        }}
        bg="secondary"
        variant="dark"
        expand="lg"
      >
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <LinkContainer to="/labs/demonstrator/messages">
              <Nav.Link>
                Messages <Notification count={totalUnread} />
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/labs/demonstrator/desk">
              <Nav.Link>Help Desk</Nav.Link>
            </LinkContainer>
            {hasLabLeadPrivileges && (
              <LinkContainer to="/labs/demonstrator/summary">
                <Nav.Link>Summary</Nav.Link>
              </LinkContainer>
            )}
            {hasLabLeadPrivileges && (
              <LinkContainer to="/labs/demonstrator/activity">
                <Nav.Link>Activity</Nav.Link>
              </LinkContainer>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </Container>
  );
}

export default DemonstratorNav;
