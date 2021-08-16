import React, { useEffect, useState } from "react";
import { getAgeFromDateString } from "../../../clientUtils";
import AssignDemButton from "./AssignDemButton";

import { ITicket } from "../../../tsInterfaces";

interface ITicketTableProps {
  ticket: ITicket;
  setSelectedTicket: any;
  selectedTicket: ITicket;
}

export default function TicketTableRow({
  ticket,
  setSelectedTicket,
  selectedTicket,
}: ITicketTableProps) {
  const {
    id,
    studentUsername,
    demonstratorUsername,
    moduleCode,
    practical,
    creation_timestamp,
  } = ticket;

  const [age, setAge] = useState("");
  const [thresholdColor, setThresholdColor] = useState("");

  function getThresholdColour(ageInMin: number) {
    const colorThresholds = { yellow: 15, red: 30 };
    if (ageInMin < colorThresholds.yellow) return "lawngreen";
    if (ageInMin < colorThresholds.red) return "yellow";
    else return "red";
  }

  function setAgeAndColour() {
    const age = getAgeFromDateString(creation_timestamp);
    const ageString = `${age === 0 ? "<1" : age}m`;
    setAge(ageString);
    setThresholdColor(getThresholdColour(age));
  }

  useEffect(() => {
    setAgeAndColour();
    var updatingInterval = setInterval(setAgeAndColour, 3000);
    return () => {
      clearInterval(updatingInterval);
      //console.log("Timer interval stopped!");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //used dynamic styling on tds instead of tr because bootstrap was overriding.
  return (
    <tr style={{ cursor: "pointer" }} onClick={() => setSelectedTicket(ticket)}>
      <td style={ticket === selectedTicket ? { backgroundColor: "blue" } : {}}>
        {studentUsername}
      </td>
      <td style={ticket === selectedTicket ? { backgroundColor: "blue" } : {}}>
        <AssignDemButton
          demonstratorUsername={demonstratorUsername}
          ticketId={id}
        />
      </td>
      <td style={ticket === selectedTicket ? { backgroundColor: "blue" } : {}}>
        {moduleCode}
      </td>
      <td style={ticket === selectedTicket ? { backgroundColor: "blue" } : {}}>
        {practical}
      </td>
      <td
        style={
          ticket === selectedTicket
            ? { backgroundColor: "blue", color: thresholdColor }
            : { color: thresholdColor }
        }
      >
        {age}
      </td>
    </tr>
  );
}
