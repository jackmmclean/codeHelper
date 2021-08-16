import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import socket from "../../../api/socket";

export default function ModalChatVideoConfirm({
  setShowModal,
  showModal,
  chatKey,
  onConfirm,
}: any) {
  const handleClose = () => setShowModal(false);

  function sendVideoInvite() {
    const message = {
      chat: chatKey,
      type: "videoInvite",
    };
    socket.emit("sendMessageToServer", message);
  }

  return (
    <>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Body>
          Are you sure you want to send a video chat invite?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              sendVideoInvite();
              handleClose();
              onConfirm();
            }}
          >
            Invite
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
