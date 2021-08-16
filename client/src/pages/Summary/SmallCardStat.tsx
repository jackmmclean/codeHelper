import React from "react";
import { Card, Row, Col } from "react-bootstrap";

export default function SmallCardStat({ icon, title, stat, foot }: any) {
  return (
    <Card className="card-stats">
      <Card.Body>
        <Row>
          <Col xs="5">
            <div className="icon-big text-center">{icon}</div>
          </Col>
          <Col xs="7">
            <div className="numbers">
              <p className="card-category">{title}</p>
              <Card.Title as="h4">{stat}</Card.Title>
            </div>
          </Col>
        </Row>
      </Card.Body>
      <Card.Footer>
        <hr></hr>
        <div className="stats">{foot}</div>
      </Card.Footer>
    </Card>
  );
}
