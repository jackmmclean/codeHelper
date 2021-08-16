import React, { useEffect, useState, useRef } from "react";
import socket from "../../api/socket";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import SocketIOFileUpload from "socketio-file-upload";

import Message from "./Message";
import LoadingMessage from "./LoadingMessage";
import FormInput from "../FormInput";
import FileInput from "./FileInput";
import VideoCallButton from "./Video/VideoCallButton";
import ModalChatVideoConfirm from "./Video/ChatVideoConfirmModal";
import VideoCall from "./Video/VideoCall";
import Typing from "./Typing/Typing";
import CloseTixButton from "./CloseTixButton";
import ModalCloseTicket from "../ModalCloseTicket";

import { closeTicket } from "../../api/tickets";

export default function Chat({
  currentUser,
  handleSendMessage,
  messages,
  studentUsername: chatKey,
  callButton,
  showCloseTicketButton,
}: any) {
  const [myMessageText, setMyMessageText] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const handleClose = () => setShowVideo(false);

  const [showCallButton, setShowCallButton] = useState(callButton);

  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const fileRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const handleShow = () => setShowModal(true);

  const [showCloseTicketModal, setShowCloseTicketModal] = useState(false);
  const handleShowCloseTicket = () => setShowCloseTicketModal(true);

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  const handleCloseTicket = () => {
    closeTicket(
      chatKey,
      (responseBody: any) => {
        //console.log(responseBody.message);
      },
      (responseBody: any) => {
        console.log(responseBody.message);
      }
    );
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const siofu = new SocketIOFileUpload(socket);
    siofu.listenOnInput(fileRef.current);

    siofu.addEventListener("start", function (event: any) {
      setIsLoading(true);
      if (chatKey !== undefined) {
        event.file.meta.chat = chatKey;
      }
    });

    siofu.addEventListener("progress", function (event: any) {
      var percent = (event.bytesLoaded / event.file.size) * 100;
      setProgress(percent);
    });

    // Do something when a file is uploaded:
    siofu.addEventListener("complete", function (event: any) {
      if (event.success) {
        console.log("File successfully uploaded!");
      } else {
        console.log("Failed to upload file");
      }
      setIsLoading(false);
      setProgress(0);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Container className="d-flex align-items-center justify-content-center">
        {showVideo && (
          <VideoCall
            studentUsername={chatKey}
            currentUser={currentUser}
            closeVideo={handleClose}
            reshowCallButton={() => setShowCallButton(callButton)}
          />
        )}
        <Card style={{ width: "800px", height: "630px" }}>
          <Card.Body style={{ overflowY: "scroll", position: "relative" }}>
            {messages &&
              messages.map((message: any, idx: any): any => {
                return (
                  <Message
                    message={message}
                    currentUser={currentUser}
                    handleAccept={setShowVideo}
                    key={idx}
                  />
                );
              })}
            {isLoading && (
              <LoadingMessage
                loadProgress={progress}
                currentUser={currentUser}
              />
            )}{" "}
            <Typing
              chatKey={chatKey}
              currentUser={currentUser}
              messages={messages}
            />
            <div
              style={{ float: "right", width: "100%", margin: "0.2em" }}
              ref={messagesEndRef}
            />
          </Card.Body>

          <Card.Footer>
            <Form
              style={{
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
              }}
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(myMessageText);
                document.querySelector("input")!.value = "";
              }}
            >
              <FormInput
                style={showVideo ? { width: "60%" } : { width: "75%" }}
                id={"messageText"}
                className={"m-1"}
                type={"text"}
                handleChange={(text) => {
                  socket.emit("typing", chatKey);
                  setMyMessageText(text);
                }}
              />
              <FileInput fileRef={fileRef} />
              {showCallButton && <VideoCallButton onClick={handleShow} />}
              {showCloseTicketButton && (
                <CloseTixButton onClick={handleShowCloseTicket} />
              )}
            </Form>
          </Card.Footer>
        </Card>
      </Container>
      <ModalCloseTicket
        setShowModal={setShowCloseTicketModal}
        handleShow={handleShowCloseTicket}
        showModal={showCloseTicketModal}
        closeTicket={handleCloseTicket}
      />
      <ModalChatVideoConfirm
        setShowModal={setShowModal}
        showModal={showModal}
        chatKey={chatKey}
        onConfirm={() => {
          setShowVideo(true);
          setShowCallButton(false);
        }}
      />
    </div>
  );
}
