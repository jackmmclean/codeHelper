import React, { useEffect } from "react";
import Container from "react-bootstrap/Container";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Notification from "../../components/Notification";
import SingleChat from "./SingleChat";

export default function DemMessagePage({
  currentUser,
  demUnreadCounts,
  selectedChat,
  setSelectedChat,
  readCounts,
  setReadCounts,
  chats,
}: any) {
  function markConvAsRead(chatKey: string) {
    var newReadCounts = { ...readCounts };
    newReadCounts[chatKey] = chats[chatKey] && chats[chatKey].length;
    newReadCounts[selectedChat] = selectedChat && chats[selectedChat].length;
    setReadCounts(newReadCounts);
  }

  useEffect(() => {
    return () => {
      setSelectedChat(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container className="mt-2">
      <Tab.Container>
        <Row>
          <Col sm={2}>
            <Nav
              style={{
                fontSize: "1.3rem",
                textAlign: "center",
              }}
              variant="pills"
              className="flex-column"
            >
              {Object.keys(chats)
                //.filter((chat: any) => chat[0] !== "demonstratorChat")
                .map((chatKey: any) => (
                  <Nav.Item key={chatKey}>
                    <Nav.Link
                      eventKey={chatKey}
                      onClick={() => {
                        markConvAsRead(chatKey);
                        setSelectedChat(chatKey);
                      }}
                    >
                      {chatKey === "demonstratorChat"
                        ? "Demonstrators"
                        : chatKey}{" "}
                      {<Notification count={demUnreadCounts[chatKey]} />}
                    </Nav.Link>
                  </Nav.Item>
                ))}
            </Nav>
          </Col>
          <Col sm={10}>
            <Tab.Content>
              {Object.keys(chats).map((chatKey: any) => (
                <Tab.Pane unmountOnExit={true} eventKey={chatKey} key={chatKey}>
                  <SingleChat
                    currentUser={currentUser}
                    studentUsername={chatKey}
                    messages={chats[chatKey]}
                  />
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
}
