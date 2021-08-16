import React from "react";
import Nav from "react-bootstrap/Nav";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

export default function NavItemIcon({ icon, eventKey, toolTipText }: any) {
  return (
    <OverlayTrigger
      placement="right"
      overlay={<Tooltip id="tip">{toolTipText}</Tooltip>}
    >
      <Nav.Item>
        <Nav.Link eventKey={eventKey}>{icon}</Nav.Link>
      </Nav.Item>
    </OverlayTrigger>
  );
}
