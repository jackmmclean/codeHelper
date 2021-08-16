import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import {
  FaInfoCircle,
  FaComment,
  FaUserCircle,
  FaRegLightbulb,
} from "react-icons/fa";

import SelectedTicketInfo from "./Info/";
import SelectedTicketChat from "./Chat/";
import SolutionSelectedTicket from "./Solution";
import StudentHistory from "./StudentHistory";
import NavItemIcon from "./NavItemIcon";

export default function DeskSelectedTicket({
  selectedTicket,
  //emptyTicket,
  currentUser,
  setSelectedChat,
  chats,
}: //resetSelectedTicket,
any) {
  return (
    <Container className="mt-2">
      <Tab.Container defaultActiveKey="info">
        <Row>
          <Col sm={1}>
            <Nav
              style={{ fontSize: "1.7rem", textAlign: "center" }}
              variant="pills"
              className="flex-column"
            >
              <NavItemIcon
                eventKey={"info"}
                toolTipText={"Ticket Information"}
                icon={<FaInfoCircle />}
              />
              <NavItemIcon
                eventKey={"message"}
                toolTipText={"Live Chat"}
                icon={<FaComment />}
              />
              <NavItemIcon
                eventKey={"studentHistory"}
                toolTipText={"Student's Past Tickets"}
                icon={<FaUserCircle />}
              />
              <NavItemIcon
                eventKey={"solution"}
                toolTipText={"Issue Solution"}
                icon={<FaRegLightbulb />}
              />
            </Nav>
          </Col>
          <Col sm={11}>
            <Tab.Content>
              <Tab.Pane unmountOnExit eventKey="info">
                <SelectedTicketInfo
                  selectedTicket={selectedTicket}
                  //emptyTicket={emptyTicket}
                  //resetSelectedTicket={resetSelectedTicket}
                />
              </Tab.Pane>
              <Tab.Pane unmountOnExit eventKey="message">
                <SelectedTicketChat
                  chat={chats[selectedTicket.studentUsername]}
                  setSelectedChat={setSelectedChat}
                  currentUser={currentUser}
                  studentUsername={selectedTicket.studentUsername}
                />
              </Tab.Pane>
              <Tab.Pane unmountOnExit eventKey="studentHistory">
                <StudentHistory
                  studentUsername={selectedTicket.studentUsername}
                />
              </Tab.Pane>
              <Tab.Pane unmountOnExit eventKey="solution">
                <SolutionSelectedTicket
                  unmountOnExit
                  ticketId={selectedTicket.id}
                />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
}
