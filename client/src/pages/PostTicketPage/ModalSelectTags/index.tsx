import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import SelectTags from "./SelectTags";
import { getTags } from "../../../api/tickets";

export default function ModalSelectTags({
  setShowModal,
  showModal,
  postTicket,
  tags,
  setTags,
  chosenTags,
  setChosenTags,
}: any) {
  const handleClose = () => setShowModal(false);

  const handleGetTags = (cb = null) =>
    getTags(
      (responseBody: any) => {
        //console.log(responseBody.message);
        setTags(responseBody.tags);
        //@ts-ignore
        cb && cb(responseBody);
      },
      (responseBody: any) => {
        console.log(responseBody.message);
      }
    );

  useEffect(() => {
    handleGetTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Select Tags</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SelectTags
            tags={tags}
            setTags={setTags}
            chosenTags={chosenTags}
            setChosenTags={setChosenTags}
            getTags={handleGetTags}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              postTicket();
              handleClose();
            }}
          >
            Post
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
