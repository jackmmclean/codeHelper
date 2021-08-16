import React from "react";
import { FaPaperclip } from "react-icons/fa";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

export default function FileInput({ fileRef }: any) {
  const labStyle = {
    width: "1.5rem",
    height: "1.5rem",
    cursor: "pointer",
    color: "blue",
  } as React.CSSProperties;

  return (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip id="tip">Send File</Tooltip>}
    >
      <Button
        style={{
          width: "50px",
          height: "40px",
          marginLeft: "5px",
          marginRight: "5px",
        }}
      >
        <Form.File.Label style={labStyle}>
          <FaPaperclip
            size={28}
            style={{
              width: "1.5rem",
              height: "1.5rem",
              color: "white",
            }}
          />
          <Form.File ref={fileRef} style={{ display: "none" }} />
        </Form.File.Label>
      </Button>
    </OverlayTrigger>
  );
}
