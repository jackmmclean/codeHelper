import React from "react";
import { FaVideo } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

export default function VideoCallButton({ onClick }: any) {
  return (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip id="tip">Invite to Video Call</Tooltip>}
    >
      <Button
        style={{
          width: "50px",
          height: "40px",
          marginLeft: "5px",
          marginRight: "5px",
        }}
        onClick={onClick}
      >
        <FaVideo
          size={28}
          style={{
            width: "1.5rem",
            height: "1.5rem",
            color: "white",
          }}
        />
      </Button>
    </OverlayTrigger>
  );
}
