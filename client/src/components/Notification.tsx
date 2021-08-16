import React from "react";
import Badge from "react-bootstrap/Badge";

export default function Notification({ count }: any) {
  if (count > 0) {
    return <Badge style={{ backgroundColor: "red" }}>{count}</Badge>;
  } else return null;
}
