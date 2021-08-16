import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Avatar from "react-avatar";
import ModalCloseTicket from "../../../../components/ModalCloseTicket";
import { dateStringToTime } from "../../../../clientUtils";
import { closeTicket } from "../../../../api/tickets";
import Tag from "../../../../components/Tag";
import { ITicket } from "../../../../tsInterfaces";
import ModalTags from "./ModalTags";

interface IDeskSelectedTicketProps {
  selectedTicket: ITicket;
  //emptyTicket: any;
  //resetSelectedTicket: any;
}

export default function SelectedTicketInfo({
  selectedTicket,
}: IDeskSelectedTicketProps) {
  const {
    studentUsername,
    creation_timestamp,
    issueDescription,
    moduleCode,
    practical,
    moduleName,
    id,
    tags,
  } = selectedTicket;

  const [showCloseTicketModal, setShowCloseTicketModal] = useState(false);
  const handleShowCloseTicket = () => setShowCloseTicketModal(true);

  const [showTagTicketsModal, setShowTagTicketsModal] = useState(false);
  const handleShowTagTickets = () => setShowTagTicketsModal(true);

  const [selectedTagName, setSelectedTagName] = useState<any>(null);

  const handleCloseTicket = (ticketId: string) => {
    closeTicket(
      ticketId,
      (responseBody: any) => {
        console.log(responseBody.message);
        //emptyTicket();
      },
      (responseBody: any) => {
        console.log(responseBody.message);
      }
    );
    //resetSelectedTicket();
  };

  return (
    <Container className="mt-3">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <Avatar name={studentUsername} round="100px" size="35px" />
          {dateStringToTime(creation_timestamp)}
        </Card.Header>

        <Card.Body>
          <Card.Title>{studentUsername}</Card.Title>
          <Card.Subtitle>
            {/*  eslint-disable-next-line react/jsx-no-comment-textnodes */}
            {moduleCode} - {moduleName} ({practical})
          </Card.Subtitle>
          <Card.Text>{issueDescription}</Card.Text>
          {tags[0] !== null &&
            tags.map((tag) => (
              <Tag
                name={tag}
                onClick={() => {
                  setSelectedTagName(tag);
                  handleShowTagTickets();
                }}
                chosen={true}
                key={tag}
              />
            ))}
        </Card.Body>
        <Card.Footer className="d-flex justify-content-end align-items-center">
          <Button
            onClick={handleShowCloseTicket}
            variant="primary"
            className="m-1 w-auto"
          >
            Mark as Resolved
          </Button>
        </Card.Footer>

        <ModalCloseTicket
          setShowModal={setShowCloseTicketModal}
          handleShow={handleShowCloseTicket}
          showModal={showCloseTicketModal}
          closeTicket={() => {
            handleCloseTicket(id);
          }}
        />

        <ModalTags
          setShowModal={setShowTagTicketsModal}
          handleShow={handleShowTagTickets}
          showModal={showTagTicketsModal}
          tagName={selectedTagName}
        />
      </Card>
    </Container>
  );
}
