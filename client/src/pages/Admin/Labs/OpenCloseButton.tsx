import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { openLab, closeLab } from "../../../api/labs";
import ModalConfirmOpen from "./ModalConfirmLabStatusChange";

export default function OpenCloseButton({ lab, handleGetLabs }: any) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const handleShowConfirmModal = () => setShowConfirmModal(true);

  function handleOpenLab() {
    openLab(
      lab.id,
      (respBody: any) => {
        handleGetLabs();
        //console.log(respBody.message);
      },
      (respBody: any) => console.log(respBody.message)
    );
  }

  function handleCloseLab() {
    closeLab(
      lab.id,
      (respBody: any) => {
        handleGetLabs();
        //console.log(respBody.message);
        alert(respBody.message);
      },
      (respBody: any) => console.log(respBody.message)
    );
  }

  return (
    <>
      <Button
        variant={lab.status === "open" ? "success" : "danger"}
        onClick={handleShowConfirmModal}
      >
        {lab.status}
      </Button>
      <ModalConfirmOpen
        setShowModal={setShowConfirmModal}
        showModal={showConfirmModal}
        handleOpenLab={handleOpenLab}
        handleCloseLab={handleCloseLab}
        status={lab.status}
      />
    </>
  );
}
