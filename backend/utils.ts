export function updateStudentsOnQueuePosition(io, liveTickets) {
  const studentUsernames = liveTickets.map((ticket) => ticket.studentUsername);
  for (let username of studentUsernames) {
    io.to(username).emit(
      "updateTicketsRemaining",
      `${getStudentQueuePosition(username, liveTickets)}`
    );
  }
}

export function getStudentQueuePosition(username, liveTickets) {
  const ageSortedTickets = sortTicketsByAge(liveTickets).reverse();
  return ageSortedTickets
    .map((ticket) => ticket.studentUsername)
    .indexOf(username);
}

export function getAgeFromDateString(dateString: string) {
  const creation_date = Date.parse(dateString);
  const current_date = new Date();
  const ageInMili = current_date.getTime() - creation_date;
  const ageInMin = Math.floor(ageInMili / 60000);
  return ageInMin;
}

export function sortTicketsByAge(arrayOfTickets: any[]) {
  function compare(ticketA: any, ticketB: any) {
    if (
      new Date(ticketA.creation_timestamp).getTime() <
      new Date(ticketB.creation_timestamp).getTime()
    ) {
      return 1;
    }
    if (
      new Date(ticketA.creation_timestamp).getTime() >
      new Date(ticketB.creation_timestamp).getTime()
    ) {
      return -1;
    }

    return 0;
  }

  return arrayOfTickets.sort(compare);
}

export async function getAllDemonstratorsTickets(
  demonstratorUsername,
  liveTickets
) {
  return liveTickets.filter(
    (ticket) => ticket.demonstratorUsername === demonstratorUsername
  );
}

export async function getDemonstratorsAssociatedStudents(
  demonstratorUsername,
  liveTickets
) {
  const demonstratorsTickets = await getAllDemonstratorsTickets(
    demonstratorUsername,
    liveTickets
  );

  const associatedStudentUsernames = demonstratorsTickets.map(
    (ticket) => ticket.studentUsername
  );

  return associatedStudentUsernames;
}

export async function getDemonstratorChats(
  demonstratorUsername,
  liveTickets,
  chats
) {
  const demonstratorsStudents = await getDemonstratorsAssociatedStudents(
    demonstratorUsername,
    liveTickets
  );

  return {
    ...ObjectKeyFilter(chats, demonstratorsStudents, true),
    demonstratorChat: chats["demonstratorChat"],
  };
}

export function combineTicketTagsIntoArray(ticketArray) {
  //   var combinedArrayArray = [];
  //   for (let ticket of ticketArray) {
  //     if (
  //       combinedArrayArray.filter(
  //         (combinedTicketArray) =>
  //           combinedTicketArray.filter(
  //             (combinedTicket) => combinedTicket.id !== ticket.id
  //           ).length === 0
  //       ).length === 0
  //     ) {
  //       console.log(`${ticket.id}:`);
  //       const sameTickets = ticketArray.filter((t) => t.id === ticket.id);
  //       combinedArrayArray.push(sameTickets);
  //     }
  //   }

  //   console.log(combinedArrayArray);
  var tags = {};
  for (let ticket of ticketArray) {
    tags[ticket.id] = tags.hasOwnProperty(ticket.id)
      ? [...tags[ticket.id], ticket.tags]
      : [ticket.tags];
  }

  var combinedTickets = [];
  for (let id in tags) {
    combinedTickets.push(ticketArray.find((t) => t.id === id));
  }
  combinedTickets.map((t) => (t.tags = tags[t.id]));

  return combinedTickets;
}

export function ObjectFilter(obj, predicate) {
  let result = {},
    key;

  for (key in obj) {
    if (obj.hasOwnProperty(key) && !predicate(obj[key])) {
      result[key] = obj[key];
    }
  }

  return result;
}

export function ObjectKeyFilter(obj, keys, keepOrigKeys = false) {
  let result = {};

  for (let key of keys) {
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key];
    } else {
      if (keepOrigKeys) {
        result[key] = [];
      }
    }
  }

  return result;
}

export function getAssignedDemFromStudentUsername(
  studentUsername,
  liveTickets
) {
  const studentsTicket = liveTickets.filter(
    (ticket) => ticket.studentUsername === studentUsername
  );

  return studentsTicket[0].demonstratorUsername;
}

export function createAllChats(chats, liveTickets) {
  const liveStudents = liveTickets.map((ticket) => ticket.studentUsername);
  for (let student of liveStudents) {
    if (!chats.hasOwnProperty(student)) {
      chats[student] = [];
    }
  }
}

export function getDemonstratorChatKeys(liveTickets) {
  let demChatKeys = {};
  for (let ticket of liveTickets) {
    if (ticket.demonstratorUsername !== null) {
      if (demChatKeys.hasOwnProperty(ticket.demonstratorUsername)) {
        !demChatKeys[ticket.demonstratorUsername].includes(
          ticket.studentUsername
        ) &&
          demChatKeys[ticket.demonstratorUsername].push(ticket.studentUsername);
      } else
        demChatKeys[ticket.demonstratorUsername] = [ticket.studentUsername];
    }
  }
  for (let dem in demChatKeys) {
    demChatKeys[dem].push("demonstratorChat");
  }
  return demChatKeys;
}

export function getStudentPosition(studentsTicketOrStatus) {
  var position;

  if (typeof studentsTicketOrStatus === "string") {
    const statusString = studentsTicketOrStatus;
    if (statusString === "new") return "queue";
    else if (statusString === "inProgress") return "message";
    else if (statusString === "closed" || statusString === "missed")
      return "form";
    else return null;
  } else {
    const studentsTicket = studentsTicketOrStatus;
    if (!studentsTicket) {
      position = "form";
    } else if (studentsTicket.resolutionStatus === "new") {
      position = "queue";
    } else {
      position = "message";
    }
  }

  return position;
}

export function getTicketDates(tickets) {
  const allDates = tickets.map((ticket) =>
    ticket.creation_timestamp.slice(0, 10)
  );
  return Array.from(new Set(allDates));
}

function ticketDateFilter(tickets, date, to) {
  if (to === "null")
    return tickets.filter(
      (ticket) =>
        new Date(ticket.creation_timestamp).toDateString() ===
        new Date(date).toDateString()
    );
  else {
    return tickets.filter(
      (ticket) =>
        new Date(ticket.creation_timestamp) > new Date(date) &&
        new Date(ticket.creation_timestamp) <
          new Date(new Date(to).getTime() + 1000 * 60 * 60 * 24)
    );
  }
}

export function getTicketCount(tickets, date, to) {
  return ticketDateFilter(tickets, date, to).length;
}

export function getStudentCount(tickets, date, to) {
  const dateFilteredTickets = ticketDateFilter(tickets, date, to);
  const students = dateFilteredTickets.map((ticket) => ticket.studentUsername);
  return Array.from(new Set(students)).length;
}

export function getAverageResolutionTime(tickets, date, to) {
  const dateFilteredTickets = ticketDateFilter(tickets, date, to);
  const closedDateFilteredTickets = dateFilteredTickets.filter(
    (ticket) => ticket.resolutionStatus === "closed"
  );

  const ticketResolutionTimes = closedDateFilteredTickets.map(
    (ticket) =>
      //@ts-ignore
      (new Date(ticket.close_timestamp) - new Date(ticket.creation_timestamp)) /
      60000
  );

  const average =
    ticketResolutionTimes.length > 0
      ? ticketResolutionTimes.reduce((a, b) => a + b) /
        ticketResolutionTimes.length
      : null;

  return average < 1 ? Math.round(average * 100) / 100 : Math.round(average);
}

export function getMissedCount(tickets, date, to) {
  const dateFilteredTickets = ticketDateFilter(tickets, date, to);
  const missedTickets = dateFilteredTickets.filter(
    (ticket) => ticket.resolutionStatus === "missed"
  );
  return missedTickets.length;
}

function getObjectKeyValueAverageTimes(object, key) {
  var sumTimesAndCount = {};

  for (let obj of object) {
    if (sumTimesAndCount.hasOwnProperty(obj[key])) {
      sumTimesAndCount[obj[key]].count++;
      sumTimesAndCount[obj[key]].time += obj.time;
    } else {
      sumTimesAndCount[obj[key]] = {};
      sumTimesAndCount[obj[key]].count = 1;
      sumTimesAndCount[obj[key]].time = obj.time;
    }
  }

  for (let objKey in sumTimesAndCount) {
    sumTimesAndCount[objKey] =
      sumTimesAndCount[objKey].time / sumTimesAndCount[objKey].count;
  }

  return sumTimesAndCount;
}

export function getModuleResolutionTimes(tickets, date, to) {
  const dateFilteredTickets = ticketDateFilter(tickets, date, to);
  const closedDateFilteredTickets = dateFilteredTickets.filter(
    (ticket) => ticket.resolutionStatus === "closed"
  );

  const ticketResolutionTimes = closedDateFilteredTickets.map(
    (ticket) =>
      new Object({
        time:
          //@ts-ignore
          (new Date(ticket.close_timestamp) -
            //@ts-ignore
            new Date(ticket.creation_timestamp)) /
          60000,
        moduleCode: ticket.moduleCode,
      })
  );
  return getObjectKeyValueAverageTimes(ticketResolutionTimes, "moduleCode");
}

export function getDemonstratorResolutionTimes(tickets, date, to) {
  const dateFilteredTickets = ticketDateFilter(tickets, date, to);
  const closedDateFilteredTickets = dateFilteredTickets.filter(
    (ticket) => ticket.resolutionStatus === "closed"
  );

  const ticketResolutionTimes = closedDateFilteredTickets.map(
    (ticket) =>
      new Object({
        time:
          //@ts-ignore
          (new Date(ticket.close_timestamp) -
            //@ts-ignore
            new Date(ticket.creation_timestamp)) /
          60000,
        demonstratorUsername: ticket.demonstratorUsername,
      })
  );

  return getObjectKeyValueAverageTimes(
    ticketResolutionTimes,
    "demonstratorUsername"
  );
}

export function getStudentResolutionTimes(tickets, date, to) {
  const dateFilteredTickets = ticketDateFilter(tickets, date, to);
  const closedDateFilteredTickets = dateFilteredTickets.filter(
    (ticket) => ticket.resolutionStatus === "closed"
  );

  const ticketResolutionTimes = closedDateFilteredTickets.map(
    (ticket) =>
      new Object({
        time:
          //@ts-ignore
          (new Date(ticket.close_timestamp) -
            //@ts-ignore
            new Date(ticket.creation_timestamp)) /
          60000,
        studentUsername: ticket.studentUsername,
      })
  );

  return getObjectKeyValueAverageTimes(
    ticketResolutionTimes,
    "studentUsername"
  );
}

export function getStudentTicketCount(tickets, date, to) {
  const dateFilteredTickets = ticketDateFilter(tickets, date, to);

  var countTickets = {};

  for (let ticket of dateFilteredTickets) {
    if (countTickets.hasOwnProperty(ticket.studentUsername)) {
      countTickets[ticket.studentUsername]++;
    } else {
      countTickets[ticket.studentUsername] = 1;
    }
  }

  return countTickets;
}

export function getDemonstratorTicketCount(tickets, date, to) {
  const dateFilteredTickets = ticketDateFilter(tickets, date, to);
  const closedDateFilteredTickets = dateFilteredTickets.filter(
    (ticket) => ticket.resolutionStatus === "closed"
  );
  var countTickets = {};

  for (let ticket of closedDateFilteredTickets) {
    if (countTickets.hasOwnProperty(ticket.demonstratorUsername)) {
      countTickets[ticket.demonstratorUsername]++;
    } else {
      countTickets[ticket.demonstratorUsername] = 1;
    }
  }

  return countTickets;
}

//by freedman diaconis rule :

// time array is array of real numbers
// IQR is inter quartile range
function numBins(timeArray, defaultBins) {
  var h = binWidth(timeArray),
    ulim = Math.max.apply(Math, timeArray),
    llim = Math.min.apply(Math, timeArray);
  if (h <= (ulim - llim) / timeArray.length) {
    return defaultBins || 10; // Fix num bins if binWidth yields too small a value.
  }
  return Math.ceil((ulim - llim) / h);
}

function iqr(timeArray) {
  var sorted = timeArray.slice(0).sort(function (a, b) {
    return a - b;
  });
  var q1 = sorted[Math.floor(sorted.length / 4)];
  var q3 = sorted[Math.floor((sorted.length * 3) / 4)];
  return q3 - q1;
}

function binWidth(timeArray) {
  return 2 * iqr(timeArray) * Math.pow(timeArray.length, -1 / 3);
}

export function getResolutionTimeHistogramData(tickets, date, to) {
  const dateFilteredTickets = ticketDateFilter(tickets, date, to);
  const closedDateFilteredTickets = dateFilteredTickets.filter(
    (ticket) => ticket.resolutionStatus === "closed"
  );

  const ticketResolutionTimes = closedDateFilteredTickets.map(
    (ticket) =>
      //@ts-ignore
      (new Date(ticket.close_timestamp) -
        //@ts-ignore
        new Date(ticket.creation_timestamp)) /
      60000
  );

  const timesBinWidth = binWidth(ticketResolutionTimes);
  const timesNumBins = numBins(ticketResolutionTimes, 5);

  var data = {};

  for (
    let bin = Math.min.apply(Math, ticketResolutionTimes);
    bin <
    Math.min.apply(Math, ticketResolutionTimes) + timesNumBins * timesBinWidth;
    bin += timesBinWidth
  ) {
    data[bin] = [];
    for (let time of ticketResolutionTimes) {
      if (time >= bin && time < bin + timesBinWidth) {
        data[bin].push(time);
      }
    }
  }

  var tidyData = {};

  for (let binMin in data) {
    tidyData[
      `(${Math.round(+binMin * 100) / 100}-${
        Math.round((+binMin + timesBinWidth) * 10) / 10
      })`
    ] = data[binMin].length;
  }

  return tidyData;
}

// export function getMissedProportion(tickets, date, to) {
//   const dateFilteredTickets = ticketDateFilter(tickets, date, to);

//   const closedCount = dateFilteredTickets.filter(
//     (ticket) => ticket.resolutionStatus === "closed"
//   ).length;

//   const missedCount = dateFilteredTickets.filter(
//     (ticket) => ticket.resolutionStatus === "missed"
//   ).length;

//   const missedProportion = missedCount / (missedCount + closedCount);
//   const closedProportion = 1 - missedProportion;

//   return {
//     missed: missedProportion * 100,
//     closed: closedProportion * 100,
//   };
// }

export function sortDates(dates: any[]) {
  function compare(dateA: any, dateB: any) {
    if (new Date(dateA).getTime() > new Date(dateB).getTime()) {
      return 1;
    }
    if (new Date(dateA).getTime() < new Date(dateB).getTime()) {
      return -1;
    }

    return 0;
  }

  return dates.sort(compare);
}

export function getLabActivity(tickets, lab) {
  const ticketDates: any = sortDates(getTicketDates(tickets));
  const labTickets = tickets.filter((ticket) => ticket.labid === lab);

  var ticketCounts = [];

  var studentCounts = [];

  var missedCounts = [];

  for (let date of ticketDates) {
    ticketCounts.push(getTicketCount(labTickets, date, "null"));
    studentCounts.push(getStudentCount(labTickets, date, "null"));
    missedCounts.push(getMissedCount(labTickets, date, "null"));
  }

  return {
    labels: ticketDates,
    series: [ticketCounts, studentCounts, missedCounts],
  };
}

export function getModuleActivity(tickets, moduleCode) {
  const ticketDates: any = sortDates(getTicketDates(tickets));
  const moduleTickets = tickets.filter(
    (ticket) => ticket.moduleCode === moduleCode
  );

  var ticketCounts = [];

  var studentCounts = [];

  var missedCounts = [];

  for (let date of ticketDates) {
    ticketCounts.push(getTicketCount(moduleTickets, date, "null"));
    studentCounts.push(getStudentCount(moduleTickets, date, "null"));
    missedCounts.push(getMissedCount(moduleTickets, date, "null"));
  }

  return {
    labels: ticketDates,
    series: [ticketCounts, studentCounts, missedCounts],
  };
}

export function updateMissedStudentsPosition(tickets, io) {
  for (let missedTicket of tickets.filter((ticket) =>
    ["inProgress", "new"].includes(ticket.resolutionStatus)
  )) {
    io.to(missedTicket.studentUsername).emit(
      "studentPosition",
      getStudentPosition("closed")
    );
    io.to(missedTicket.studentUsername).emit("labHasClosed");
  }
}
