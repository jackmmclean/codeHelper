import React, { useEffect, useState } from "react";
import Chat from "../../components/Chat/Chat";
import socket from "../../api/socket";

export default function StudentMessagePage({ currentUser }: any) {
  const [messages, setMessages] = useState([]);

  socket.on("sendMessagesToClient", (messages: any) => {
    if (messages !== null) {
      setMessages(messages);
    }
  });

  function handleSendMessage(myMessageText: string) {
    const message = {
      text: myMessageText,
    };

    socket.emit("sendMessageToServer", message);
  }

  useEffect(() => {
    socket.emit("getMessages");
    return () => {
      //console.log("Disconnecting ticket chat listener.");
      socket.off("sendMessagesToClient");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Chat
        currentUser={currentUser}
        handleSendMessage={handleSendMessage}
        messages={messages}
        callButton={false}
        showCloseTicketButton
      />
    </>
  );
}
