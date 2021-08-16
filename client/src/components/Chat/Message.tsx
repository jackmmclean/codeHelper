import React from "react";
import Toast from "react-bootstrap/Toast";
import { dateStringToTime } from "../../clientUtils";
import { downloadFile } from "../../api/message";
import Button from "react-bootstrap/Button";

export default function Message({ message, currentUser, handleAccept }: any) {
  const { sender, text, creation_timestamp, imageSrc, fileName, type } =
    message;

  const rhsStyle = {
    //position: "absolute",
    float: "right",
  } as React.CSSProperties;

  const handleDownloadFile = () => {
    downloadFile(
      fileName,
      (e: any) => console.log(e),
      (e: any) => console.log(e)
    );
  };

  const img =
    type === "image" ? (
      <a download={fileName} href={imageSrc} title={fileName}>
        <img src={imageSrc} alt="" style={{ width: "100%" }} />
      </a>
    ) : undefined;

  const file =
    type === "file" ? (
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      <a
        href=""
        onClick={(e) => {
          e.preventDefault();
          handleDownloadFile();
        }}
      >
        {fileName}
      </a>
    ) : undefined;

  const videoInvite =
    type === "videoInvite" ? (
      <>
        {sender} has invited you to a call
        <br />
        <div style={{ textAlign: "center" }}>
          <Button
            onClick={handleAccept}
            disabled={currentUser === sender}
            size={"sm"}
            variant="success"
          >
            Accept
          </Button>
        </div>
      </>
    ) : undefined;

  return (
    <div style={{ float: "right", width: "100%", margin: "0.2em" }}>
      <Toast style={sender === currentUser ? rhsStyle : {}}>
        <Toast.Header className="justify-content-between" closeButton={false}>
          <strong>{sender}</strong>
          <small className="justify-content-end">
            {dateStringToTime(creation_timestamp).slice(0, 5)}
          </small>
        </Toast.Header>
        <Toast.Body>
          <div>
            {img}
            {text}
            {file}
            {videoInvite}
          </div>
        </Toast.Body>
      </Toast>
    </div>
  );
}
