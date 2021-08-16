import React from "react";
import Chat from "../../components/Chat/Chat";
import socket from "../../api/socket";

export default function SingleChat({
  currentUser,
  studentUsername,
  messages,
}: any) {
  function handleSendMessage(myMessageText: string) {
    const message = {
      chat: studentUsername,
      text: myMessageText,
    };
    socket.emit("sendMessageToServer", message);
  }

  return (
    <Chat
      currentUser={currentUser}
      handleSendMessage={handleSendMessage}
      messages={messages}
      studentUsername={studentUsername}
      callButton={!(studentUsername === "demonstratorChat")}
      showCloseTicketButton={!(studentUsername === "demonstratorChat")}
    />
  );
}
