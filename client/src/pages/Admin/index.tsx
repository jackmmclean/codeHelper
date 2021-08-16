import React from "react";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import RolePage from "./Roles";
import Modules from "./Modules/index";
import Labs from "./Labs";

export default function AdminPage() {
  return (
    <Container className="mt-2">
      <Tab.Container defaultActiveKey="roles">
        <Row>
          <Col sm={1}>
            <Nav
              style={{ fontSize: "1.3rem", textAlign: "center" }}
              variant="pills"
              className="flex-column"
            >
              <Nav.Item>
                <Nav.Link eventKey="roles">Roles</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="modules">Modules</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="labs">Labs</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={11}>
            <Tab.Content>
              <Tab.Pane eventKey="roles">
                <RolePage />
              </Tab.Pane>
              <Tab.Pane eventKey="modules">
                <Modules />
              </Tab.Pane>
              <Tab.Pane eventKey="labs">
                <Labs />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
}
