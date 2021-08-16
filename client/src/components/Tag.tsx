import React from "react";
import Button from "react-bootstrap/Button";

export default function Tag({ onClick, name, chosen }: any) {
  return (
    <Button
      variant={chosen ? "success" : "primary"}
      onClick={onClick}
      className="m-1"
    >
      {name}
    </Button>
  );
}
