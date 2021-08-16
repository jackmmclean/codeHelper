import React, { useEffect } from "react";
import Chat from "../../../../components/Chat/Chat";
import socket from "../../../../api/socket";

export default function SelectedTicketChat({
  studentUsername,
  currentUser,
  setSelectedChat,
  chat,
}: any) {
  function handleSendMessage(myMessageText: string) {
    const message = {
      chat: studentUsername,
      text: myMessageText,
    };
    socket.emit("sendMessageToServer", message);
  }

  useEffect(() => {
    setSelectedChat(studentUsername);
    return () => {
      setSelectedChat(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Chat
      currentUser={currentUser}
      handleSendMessage={handleSendMessage}
      messages={chat}
      studentUsername={studentUsername}
      callButton={true}
      showCloseTicketButton
    />
  );
}
