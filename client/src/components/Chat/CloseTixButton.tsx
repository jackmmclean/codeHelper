import React from "react";
import Button from "react-bootstrap/Button";
import { FaCheckSquare } from "react-icons/fa";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

export default function CloseTixButton({ onClick }: any) {
  return (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip id="tip">Mark Ticket as Resolved</Tooltip>}
    >
      <Button
        variant="success"
        style={{
          width: "50px",
          height: "40px",
          marginLeft: "5px",
          marginRight: "5px",
        }}
        onClick={onClick}
      >
        <FaCheckSquare
          size={28}
          style={{
            width: "1.5rem",
            height: "1.5rem",
            color: "light-green",
          }}
        />
      </Button>
    </OverlayTrigger>
  );
}
