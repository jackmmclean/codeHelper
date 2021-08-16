import React, { useState, useEffect } from "react";
import "./typing.css";
import socket from "../../../api/socket";

export default function Typing({ chatKey, currentUser, messages }: any) {
  const [showTyping, setShowTyping] = useState(false);

  const typing = {
    timeout: null,
    go: function () {
      //@ts-ignore
      clearTimeout(this.timeout);
      setShowTyping(true);
      //@ts-ignore
      this.timeout = setTimeout(() => setShowTyping(false), 3000);
    },
    stop: function () {
      //@ts-ignore
      clearTimeout(this.timeout);
      setShowTyping(false);
    },
  };

  socket.on("typing", (key: any) => {
    (key === chatKey || key === currentUser) && typing.go();
  });

  useEffect(() => {
    typing.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  useEffect(() => {
    return () => {
      socket.off("typing");
    };
  }, []);

  if (showTyping)
    return (
      <div className="chat-bubble">
        <div className="typing">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    );
  else {
    return null;
  }
}
