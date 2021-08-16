import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
//importing bootstrap components separately prevents import of entire library
import DeskSelectedTicket from "./DeskSelectedTicket";
import DeskAllTickets from "./DeskAllTickets";
import socket from "../../api/socket";
import { sortByAgeFromString } from "../../clientUtils";

const HelpDeskPage = withRouter((props: any) => {
  const emptyTicket = {
    close_timestamp: "",
    creation_timestamp: "",
    demAssigned_timestamp: "",
    demonstratorUsername: "",
    id: "",
    issueDescription: "",
    labid: "",
    moduleCode: "",
    practical: "",
    resolutionStatus: "",
    studentUsername: "",
    moduleName: "",
    tags: [],
  };
  const [selectedTicket, setSelectedTicket] = useState(emptyTicket);
  const [allTickets, setAllTickets] = useState<any[]>([]);

  //   function resetSelectedTicket() {
  //     setSelectedTicket(allTickets[0]);
  //   }

  useEffect(() => {
    socket.emit("getTickets");

    socket.on("sendTicketsToClients", (tickets: any) => {
      setAllTickets(sortByAgeFromString(tickets));
    });

    return () => {
      socket.off("sendTicketsToClients");
      // console.log("Disconnecting helpdesk tickets listener.");
    };
  }, []);

  useEffect(() => {
    if (!allTickets.map((ticket) => ticket.id).includes(selectedTicket.id)) {
      allTickets.length > 0
        ? setSelectedTicket(allTickets[0])
        : setSelectedTicket(emptyTicket);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allTickets]);

  return (
    <>
      {selectedTicket.id !== "" && (
        <DeskSelectedTicket
          currentUser={props.currentUser}
          selectedTicket={selectedTicket}
          setSelectedChat={props.setSelectedChat}
          chats={props.chats}
          //emptyTicket={() => setSelectedTicket(emptyTicket)}
          // resetSelectedTicket={resetSelectedTicket}
        />
      )}
      <DeskAllTickets
        allTickets={allTickets}
        setSelectedTicket={setSelectedTicket}
        selectedTicket={selectedTicket}
      />
    </>
  );
});

export default HelpDeskPage;
