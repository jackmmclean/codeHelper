import React, { useState, useEffect } from "react";
import socket from "../../api/socket";
import TicketQueue from "./TicketQueue";

export default function TicketPostdPage({ currentUser }: any) {
  const [ticketsRemaining, setTicketsRemaining] = useState(0);

  useEffect(() => {
    socket.emit("getQueuePosition");

    // when socket emits updateTicketsRemaining we update no. of tixs
    socket.on("updateTicketsRemaining", (ticketsRem: any) => {
      setTicketsRemaining(ticketsRem);
    });

    return () => {
      //console.log("Disconnecting queue position socket.");
      socket.off("message");
      socket.off("updateTicketsRemaining");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <TicketQueue ticketsRemaining={ticketsRemaining} />;
}
