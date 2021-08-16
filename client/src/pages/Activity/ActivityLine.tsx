import React from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {
  FaUser,
  FaTicketAlt,
  FaLightbulb,
  FaRegLightbulb,
  FaUserCheck,
} from "react-icons/fa";

export default function ActivityLine({ activity }: any) {
  var text;
  var icon;

  switch (activity.type) {
    case "ticketCreation":
      text = `'${activity.username}' created a ticket`;
      icon = <FaTicketAlt className="text-success" />;
      break;

    case "ticketStatusChanged":
      text = `'${activity.username}' changed the status of a ticket from '${activity.resolutionStatusFrom}' to '${activity.resolutionStatusTo}'`;
      icon = (
        <FaTicketAlt
          className={
            activity.resolutionStatusTo === "closed"
              ? "text-success"
              : "text-warning"
          }
        />
      );
      break;

    case "demonstratorAssigned":
      text = `'${activity.username}' was assigned to a ticket`;
      icon = <FaUserCheck className="text-primary" />;
      break;

    case "solutionCreation":
      text = `'${activity.username}' created a solution`;
      icon = <FaLightbulb className="text-success" />;
      break;

    case "solutionEdited":
      text = `'${activity.username}' edited a solution`;
      icon = <FaRegLightbulb className="text-warning" />;
      break;

    case "studentRegister":
      text = `'${activity.username}' was registered as a student`;
      icon = <FaUser className="text-success" />;
      break;

    case "demonstratorRegister":
      text = `'${activity.username}' was registered as a demonstrator`;
      icon = <FaUser className="text-success" />;
      break;

    case "labLeadRegister":
      text = `'${activity.username}' was registered as a labLead`;
      icon = <FaUser className="text-success" />;
      break;
  }

  return (
    <Row>
      <Col xs="2"></Col>
      <Col xs="8">
        <Card className="card-stats mt">
          <Card.Body>
            <Row>
              <Col xs="1">
                <div className="icon-big">{icon}</div>
              </Col>
              <Col xs="11">
                <div className="numbers">
                  <p className="card-category">
                    {new Date(activity.creation_timestamp)
                      .toString()
                      .slice(0, 21)}
                  </p>
                  <Card.Title as="h5">{text}</Card.Title>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
      <Col xs="2"></Col>
    </Row>
  );
}
