import React from "react";
import Toast from "react-bootstrap/Toast";
import ProgressBar from "react-bootstrap/ProgressBar";

export default function LoadingMessage({ currentUser, loadProgress }: any) {
  const rhsStyle = {
    //position: "absolute",
    float: "right",
  } as React.CSSProperties;

  return (
    <div style={{ float: "right", width: "100%", margin: "0.2em" }}>
      <Toast style={rhsStyle}>
        <Toast.Header className="justify-content-between" closeButton={false}>
          <strong>{currentUser}</strong>
          <small className="justify-content-end">
            {new Date().toISOString().slice(11, 16)}
          </small>
        </Toast.Header>
        <Toast.Body>
          <ProgressBar animated now={loadProgress} />
        </Toast.Body>
      </Toast>
    </div>
  );
}
